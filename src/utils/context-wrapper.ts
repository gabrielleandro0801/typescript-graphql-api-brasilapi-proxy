import { AsyncLocalStorage } from "node:async_hooks";

const context: AsyncLocalStorage<IContextStorage> = new AsyncLocalStorage();

type IContextStorage = Map<keyof IContext, IContext[keyof IContext]> | undefined;

const DEFAULT_VALUE: string = "-";

enum IServiceNames {
    API = "api",
}

enum IRequestTypes {
    HTTP = "HTTP",
}

interface IContext {
    serviceName: IServiceNames;
    requestType: IRequestTypes;
    executionId: string;
    correlationId: string;
}

export class ContextWrapper {
    get serviceName(): IContext["serviceName"] {
        const store: IContextStorage = context.getStore();

        return (store?.get("serviceName") ?? DEFAULT_VALUE) as IContext["serviceName"];
    }

    set serviceName(serviceName: string) {
        const store: IContextStorage = context.getStore();

        store?.set("serviceName", serviceName);
    }

    get requestType(): IContext["requestType"] {
        const store: IContextStorage = context.getStore();

        return (store?.get("requestType") ?? DEFAULT_VALUE) as IContext["requestType"];
    }

    set requestType(requestType: string) {
        const store: IContextStorage = context.getStore();

        store?.set("requestType", requestType);
    }

    get executionId(): IContext["executionId"] {
        const store: IContextStorage = context.getStore();

        return store?.get("executionId") ?? DEFAULT_VALUE;
    }

    set executionId(executionId: string) {
        const store: IContextStorage = context.getStore();
        const MAX_LENGTH: number = 36;

        store?.set("executionId", executionId.substring(0, MAX_LENGTH));
    }

    get correlationId(): IContext["correlationId"] {
        const store: IContextStorage = context.getStore();

        return store?.get("correlationId") ?? DEFAULT_VALUE;
    }

    set correlationId(correlationId: string) {
        const store: IContextStorage = context.getStore();
        const MAX_LENGTH: number = 36;

        store?.set("correlationId", correlationId.substring(0, MAX_LENGTH));
    }

    cleanVariables(): void {
        const store: IContextStorage = context.getStore();

        if (store) {
            store.set("correlationId", DEFAULT_VALUE);
            store.set("executionId", DEFAULT_VALUE);
        }
    }

    async run(fn: any): Promise<void> {
        await context.run(new Map(), fn);
    }
}

const contextWrapper: ContextWrapper = new ContextWrapper();

export { contextWrapper, DEFAULT_VALUE, IServiceNames, IRequestTypes };
