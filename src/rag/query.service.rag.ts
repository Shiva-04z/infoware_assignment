import {Prisma} from "../generated/prisma/client";
import prisma from '../config/database.config';
import qdrantClient from '../config/qdrant.config';
import embeddingService from './embedding.service';
import llmService from './llm.service';
import redisClient from '../config/redis.config';
import {
    QueryRequestBody,
    QueryResponse,
    SourceDocument,
} from '../models/types';

class QueryService {
    private defaultTopK = 5;
    private minConfidence = 0.7;
    private cacheTTL = 3600; // 1 hour

    async query(tenantId: string, request: QueryRequestBody): Promise<QueryResponse> {
        const startTime = Date.now();
        let guardrailTriggered = false;

        // Check cache first
        const cacheKey = `query:${tenantId}:${request.query}`;
        const cachedResult = await redisClient.get(cacheKey);
        if (cachedResult) {
            return JSON.parse(cachedResult);
        }


        const isInjection = await llmService.detectPromptInjection(request.query);
        if (isInjection) {
            const response: QueryResponse = {
                answer: "I cannot process this request as it appears to contain instructions that could compromise system security.",
                sources: [],
                confidence: 0,
                guardrailTriggered: true,
            };

            await this.logQuery(tenantId, request.query, response, startTime, true);
            return response;
        }


        const queryEmbedding = await embeddingService.generateEmbedding(request.query);


        const searchResult = await qdrantClient.search('document_chunks', {
            vector: queryEmbedding,
            limit: request.topK || this.defaultTopK,
            filter: {
                must: [
                    {
                        key: 'tenant_id',
                        match: {value: tenantId},
                    },
                ],
            },
            score_threshold: request.minConfidence || this.minConfidence,
        });

        if (!searchResult || searchResult.length === 0) {
            const response: QueryResponse = {
                answer: "I couldn't find relevant information in your knowledge base to answer this question. Please ensure your documents have been uploaded and processed.",
                sources: [],
                confidence: 0,
                guardrailTriggered: false,
            };

            await this.logQuery(tenantId, request.query, response, startTime, false);
            return response;
        }

        let avgScore: number;
        avgScore = searchResult.reduce((sum, p) => sum + (p.score || 0), 0) / searchResult.length;
        const confidence = avgScore;


        if (confidence < (request.minConfidence || this.minConfidence)) {
            const response: QueryResponse = {
                answer: "The system found some potentially relevant information, but confidence is too low to provide a reliable answer. Please try rephrasing your question or upload more relevant documents.",
                sources: this.mapSearchResultsToSources(searchResult),
                confidence,
                guardrailTriggered: false,
            };

            await this.logQuery(tenantId, request.query, response, startTime, false);
            return response;
        }


        const context = searchResult
            .map(p => p.payload?.content)
            .filter(Boolean)
            .join('\n\n');


        const answer = await llmService.generateResponse(context, request.query, tenantId);


        const outOfScopeIndicators = [
            "cannot answer",
            "based on the available documents",
            "does not contain",
        ];

        const isOutOfScope = outOfScopeIndicators.some(indicator =>
            answer.toLowerCase().includes(indicator.toLowerCase())
        );

        const finalAnswer = isOutOfScope
            ? "I cannot answer this question based on the documents in your knowledge base. Please ensure the information is available in uploaded documents or contact your administrator for assistance."
            : answer;

        const response: QueryResponse = {
            answer: finalAnswer,
            sources: this.mapSearchResultsToSources(searchResult),
            confidence,
            guardrailTriggered: isOutOfScope,
        };

        if (!guardrailTriggered && confidence > 0.8) {
            await redisClient.setEx(cacheKey, this.cacheTTL, JSON.stringify(response));
        }


        await this.logQuery(tenantId, request.query, response, startTime, guardrailTriggered);

        return response;
    }

    private mapSearchResultsToSources(points: any[]): SourceDocument[] {
        return points.map(point => ({
            id: point.payload?.chunk_id,
            content: point.payload?.content,
            filename: point.payload?.filename,
            score: point.score || 0,
            metadata: point.payload?.metadata ? JSON.parse(point.payload.metadata) : {},
        }));
    }

    private async logQuery(
        tenantId: string,
        query: string,
        response: QueryResponse,
        startTime: number,
        guardrailTriggered: boolean
    ) {
        const latency = Date.now() - startTime;

        await prisma.queryLog.create({
            data: {
                tenantId,
                query,
                response: response.answer,
                sources:
                    response.sources as unknown as Prisma.InputJsonValue,
                confidence: response.confidence,
                latency,
                guardrailTriggered,
            },
        });
    }
}

export default new QueryService();