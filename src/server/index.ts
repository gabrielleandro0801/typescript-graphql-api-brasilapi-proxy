import cors from "cors";
import express, { Express, NextFunction, Request, Response, Router, urlencoded } from "express";
import { GraphQLSchema } from "graphql";
import { createHandler } from "graphql-http/lib/use/express";
import { randomUUID } from "node:crypto";
import { contextWrapper, IRequestTypes, IServiceNames } from "../utils/context-wrapper";
import { logger } from "../utils/logger";
import { handleExpressServerGracefulShutdown } from "../graceful-shutdown";
import { Server } from "node:http";

export enum HttpStatusCode {
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    UNPROCESSABLE_ENTITY = 422,
    TOO_MANY_REQUESTS = 429,
    INTERNAL_SERVER_ERROR = 500,
    SERVICE_UNAVAILABLE = 503,
}

export type Methods = "get" | "post" | "delete" | "put" | "patch";

export type Route = {
    method: Methods;
    path: string;
    controller: any;
    validator?: any;
};

export type IRouteGroup = {
    basePath: string;
    routes: Array<Route>;
};

export class ExpressServer {
    private readonly server: Express;
    private closeableServer: Server;

    constructor() {
        this.server = express();
        this.configureMiddleware();
        this.configureBodyParser();
    }

    addRestRoutes(routeGroups: Array<IRouteGroup>): void {
        const router: Router = Router();

        for (const group of routeGroups) {
            group.routes.forEach((route) => {
                const controller = route.controller.process.bind(route.controller);
                const path = `${group.basePath}${route.path}`;

                route.validator
                    ? router[route.method](path, route?.validator?.validate.bind(route?.validator), controller)
                    : router[route.method](path, controller);
            });

            this.server.use(group.basePath, router);
        }
    }

    addGraphQlRoutes(schema: GraphQLSchema): void {
        this.server.all("/graphql", createHandler({ schema }));
    }

    listen(port: number): void {
        this.closeableServer = this.server.listen(port, () => {
            logger.info({ event: "listen", details: `API running on [http://localhost:${port}]` });
        });

        handleExpressServerGracefulShutdown(this);
    }

    stop() {
        this.closeableServer.close((error?: Error) => {
            logger.info({ event: "stop", details: "Server closed" });

            process.exit(0);
        });
    }

    private configureMiddleware(): void {
        this.server.use(cors());
        this.server.use(this.configureContext());
        this.server.use(this.cleanContext());
    }

    private configureContext() {
        return (request: Request, response: Response, next: NextFunction) => {
            contextWrapper.run(() => {
                contextWrapper.requestType = IRequestTypes.HTTP;
                contextWrapper.serviceName = IServiceNames.API;

                contextWrapper.executionId = randomUUID();
                contextWrapper.correlationId = request.headers["correlation-id"]
                    ? request.headers["correlation-id"].toString()
                    : randomUUID();

                logger.createStream();

                next();
            });
        };
    }

    private cleanContext() {
        return (req: Request, res: Response, done: (err?: Error) => void) => {
            res.on("finish", () => {
                contextWrapper.cleanVariables();
                logger.finishStream();
            });
            done();
        };
    }

    private configureBodyParser(): void {
        this.server.use(express.json());
    }
}
