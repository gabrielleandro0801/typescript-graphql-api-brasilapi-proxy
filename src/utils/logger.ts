import { TransformableInfo } from "logform";
import { PassThrough } from "node:stream";
import winston, { Logger as WinstonLogger, format, transports } from "winston";
import { contextWrapper } from "./context-wrapper";
import { logFormatter } from "./log-formatter";

export type LogExhibitionLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

export class Logger {
    private static instance: Logger;
    private static readonly SEPARATOR = "<LOGEND>";
    private readonly logger: WinstonLogger;
    private readonly streams = new Map<string, PassThrough>();

    private constructor() {
        this.logger = winston.createLogger({
            level: "info",
            format: format.combine(
                format.timestamp(),
                format.json(),
                format.printf((info: TransformableInfo) => {
                    return logFormatter.format(info);
                }),
            ),
            transports: [new transports.Console()],
        });
    }

    createStream(): void {
        if (this.streams.has(contextWrapper.executionId)) {
            return;
        }

        this.streams.set(contextWrapper.executionId, new PassThrough());
    }

    finishStream(): void {
        this.streams.delete(contextWrapper.executionId);
    }

    debug(content: any): void {
        if (this.logger.level === "debug") {
            this.logger.debug(content);
            return;
        }

        const originalTimestamp: string = new Date().toISOString();

        this.createStream();
        const stream: PassThrough = this.streams.get(contextWrapper.executionId);

        if (this.hasStreamedLogs()) {
            stream?.write(Logger.SEPARATOR);
        }

        stream?.write(JSON.stringify({ ...content, originalTimestamp }));
    }

    info(content: any): void {
        this.logger.info(content);
    }

    warn(content: any): void {
        this.logger.warn(content);
    }

    error(content: any): void {
        if (this.hasStreamedLogs()) {
            this.flushStreamedLogs()
                .split(Logger.SEPARATOR)
                .forEach((streamedLog: string) => {
                    this.logger.info(JSON.parse(streamedLog));
                });

            this.finishStream();
        }

        this.logger.error(content);
    }

    getLogger() {
        return this.logger;
    }

    setLevel(level: LogExhibitionLevel): void {
        this.logger.level = level.toLowerCase();
    }

    private hasStreamedLogs(): boolean {
        const logStream: PassThrough = this.streams.get(contextWrapper.executionId);
        return !!(logStream?.readable && logStream?.readableLength);
    }

    private flushStreamedLogs(): string {
        return String(this.streams.get(contextWrapper.executionId)?.read() ?? "");
    }

    static getInstance(): Logger {
        if (!this.instance) {
            this.instance = new Logger();
        }

        return this.instance;
    }
}

const logger: Logger = Logger.getInstance();

export { logger };
