import cron from "node-cron";
import prisma from "./config/database.config";

export const startDocumentCleanupJob = () => {
    cron.schedule("0 0 */7 * *", async () => {
        console.log("[CRON] Running document cleanup job...");

        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - 5);

            const deleted = await prisma.document.deleteMany({
                where: {
                    status: "DELETED",
                    updatedAt: {
                        lte: cutoffDate,
                    },
                },
            });

            console.log(
                `[CRON] Deleted ${deleted.count} documents older than 5 days`
            );
        } catch (err) {
            console.error("[CRON] Cleanup failed:", err);
        }
    });
};