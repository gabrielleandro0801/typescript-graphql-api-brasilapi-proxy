import { HttpResponse, httpRestClient } from "../adapters/http-rest-client";
import { HttpStatusCode } from "../server";
import { Either } from "../utils/either";
import { logger } from "../utils/logger";
import { properties } from "../utils/properties";
import { Cep } from "../structures/cep";

const {
    BRASIL_API: { URL: brasilApiUrl },
    CEP: { TIMEOUT_IN_SECONDS: cepTimeoutInSeconds },
} = properties;

type CepHttpResponse = {
    cep: string;
    state: string;
    city: string;
    neighborhood: string;
    street: string;
    service: string;
    location: {
        type: string;
        coordinates: {
            longitude: string;
            latitude: string;
        };
    };
};

export class CepService {
    static instance: CepService;

    private constructor() {}

    async findOne(cep: string): Promise<Cep> {
        logger.info({ event: "findOne", cep });

        const response: Either<Error, HttpResponse<CepHttpResponse>> = await httpRestClient.get<CepHttpResponse>({
            url: `${brasilApiUrl}/cep/v2/${cep}`,
            timeoutInSeconds: cepTimeoutInSeconds,
        });

        if (response.isLeft()) {
            return null;
        }

        const { statusCode, data } = response.success;
        if (statusCode !== HttpStatusCode.OK) {
            return null;
        }

        return {
            state: data.state,
            city: data.city,
            neighborhood: data.neighborhood,
            street: data.street,
        };
    }

    static getInstance() {
        if (!CepService.instance) {
            CepService.instance = new CepService();
        }

        return CepService.instance;
    }
}

export const cepService: CepService = CepService.getInstance();
