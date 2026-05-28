import { Request } from 'express';


export  type ChunkRow = {
    id: string;
    vectorId: string;
};



export interface SourceDocument {
    id: string;
    content: string;
    filename: string;
    score: number;
    metadata?: Record<string, any>;
}

