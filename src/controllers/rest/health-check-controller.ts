import { Request, Response } from "express";
import { HttpStatusCode } from "../../server";

export class HealthCheckController {
    async process(request: Request, response: Response) {
        return response.status(HttpStatusCode.OK).json({
            message: "OK",
            date: new Date().toISOString(),
        });
    }
}
