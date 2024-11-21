import axios, { Axios, AxiosResponse } from "axios";
import { Either, left, right } from "../utils/either";
import { Agent } from "node:https";

export const DEFAULT_HTTP_TIMEOUT_IN_SECONDS: number = 20;

export type HttpRequestOptions = {
    url: string;
    headers?: any;
    params?: {
        [key: string]: string;
    };
    body?: Object;
    timeoutInSeconds?: number;
};

export interface HttpResponse<DataType> {
    statusCode: number;
    data: DataType;
}

export class HttpTimeoutException extends Error {
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class HttpRestClient {
    static instance: HttpRestClient;
    private readonly client: Axios;

    private constructor() {
        this.client = new Axios({
            httpsAgent: new Agent({
                keepAlive: true,
            }),
            timeout: secondsToMilliseconds(DEFAULT_HTTP_TIMEOUT_IN_SECONDS),
            validateStatus(status) {
                return true;
            },
        });
    }

    async get<GetResponse>(options: HttpRequestOptions): Promise<Either<Error, HttpResponse<GetResponse>>> {
        const { url, headers, params, timeoutInSeconds }: HttpRequestOptions = options;
        const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";

        const response: AxiosResponse<GetResponse, null> = await this.client.get<GetResponse>(`${url}${queryString}`, {
            headers,
            timeout: secondsToMilliseconds(timeoutInSeconds),
        });

        return right({
            statusCode: response.status,
            data: this.getResponseBody(response),
        });
    }

    async post<PostResponse>(options: HttpRequestOptions): Promise<Either<Error, HttpResponse<PostResponse>>> {
        const { url, headers, body, timeoutInSeconds }: HttpRequestOptions = options;

        const response: AxiosResponse<PostResponse, null> = await this.client.post<PostResponse>(url, {
            headers,
            body,
            timeout: secondsToMilliseconds(timeoutInSeconds),
        });

        return right({
            statusCode: response.status,
            data: this.getResponseBody(response),
        });
    }

    async put<PutResponse>(options: HttpRequestOptions): Promise<Either<Error, HttpResponse<PutResponse>>> {
        const { url, headers, body, timeoutInSeconds }: HttpRequestOptions = options;

        const response: AxiosResponse<PutResponse, null> = await this.client.put<PutResponse>(url, {
            headers,
            body,
            timeout: secondsToMilliseconds(timeoutInSeconds),
        });

        return right({
            statusCode: response.status,
            data: this.getResponseBody(response),
        });
    }

    async patch<PatchResponse>(options: HttpRequestOptions): Promise<Either<Error, HttpResponse<PatchResponse>>> {
        const { url, headers, body, timeoutInSeconds }: HttpRequestOptions = options;

        const response: AxiosResponse<PatchResponse, null> = await this.client.patch<PatchResponse>(url, {
            headers,
            body,
            timeout: secondsToMilliseconds(timeoutInSeconds),
        });

        return right({
            statusCode: response.status,
            data: this.getResponseBody(response),
        });
    }

    async delete<DeleteResponse>(options: HttpRequestOptions): Promise<Either<Error, HttpResponse<DeleteResponse>>> {
        const { url, headers, timeoutInSeconds }: HttpRequestOptions = options;

        const response: AxiosResponse<DeleteResponse, null> = await this.client.delete<DeleteResponse>(url, {
            headers,
            timeout: secondsToMilliseconds(timeoutInSeconds),
        });

        return right({
            statusCode: response.status,
            data: this.getResponseBody(response),
        });
    }

    private getResponseBody(response: AxiosResponse) {
        try {
            return JSON.parse(response.data);
        } catch (error) {
            return response.data;
        }
    }

    static getInstance(): HttpRestClient {
        if (!HttpRestClient.instance) {
            HttpRestClient.instance = new HttpRestClient();
        }

        return HttpRestClient.instance;
    }
}

function secondsToMilliseconds(seconds: number) {
    return seconds * 1_000;
}

export const httpRestClient: HttpRestClient = HttpRestClient.getInstance();
