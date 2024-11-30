import { contextWrapper } from "./context-wrapper";

export class LogFormatter {
    private static instance: LogFormatter;

    private constructor() {}

    format(info): string {
        const message = info.message;
        const timestamp: string = info.message?.originalTimestamp ?? info?.timestamp;

        delete message.originalTimestamp;

        const log = {
            severityText: info.level.toUpperCase(),
            correlationId: contextWrapper.correlationId,
            executionId: contextWrapper.executionId,
            timestamp,
            serviceName: contextWrapper.serviceName,
            message,
        };

        return JSON.stringify(log);
    }

    static getInstance(): LogFormatter {
        if (!this.instance) {
            this.instance = new LogFormatter();
        }

        return this.instance;
    }
}

const logFormatter: LogFormatter = LogFormatter.getInstance();

export { logFormatter };
