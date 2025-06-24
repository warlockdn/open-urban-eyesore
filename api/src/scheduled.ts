import { issueConsolidationJob } from "./cron-jobs/issue-consolidation";

export default {
    async scheduled() {
        await issueConsolidationJob();
    }
}; 