import { HttpResponse, httpRestClient } from "../adapters/http-rest-client";
import { HttpStatusCode } from "../server";
import { Bank } from "../structures/bank";
import { Either } from "../utils/either";
import { logger } from "../utils/logger";
import { properties } from "../utils/properties";

export type FindOneInput = {
    ispb?: string;
    code?: string;
};

const {
    BRASIL_API: { URL: brasilApiUrl },
    BANKS: { TIMEOUT_IN_SECONDS: banksTimeoutInSeconds },
} = properties;

type BanksHttpResponse = BankHttpResponse[];

type BankHttpResponse = {
    ispb: string;
    name: string;
    code: string;
    fullName: string;
};

export class BankService {
    static instance: BankService;

    private constructor() {}

    async findOne(input: FindOneInput): Promise<Bank> {
        if (input.code) {
            return await this.findByCode(input.code);
        }

        return await this.findbyIspb(input.ispb);
    }

    async findAll(): Promise<Bank[]> {
        logger.info({ event: "findAll" });

        const banks: BanksHttpResponse = await this.findAllBanks();

        return (
            banks?.map((bank: BankHttpResponse) => {
                return {
                    ispb: bank.ispb,
                    name: bank.name,
                    code: bank.code,
                };
            }) || []
        );
    }

    private async findByCode(code: string): Promise<Bank> {
        logger.info({ event: "findByCode", code });

        const response: Either<Error, HttpResponse<BankHttpResponse>> = await httpRestClient.get<BankHttpResponse>({
            url: `${brasilApiUrl}/banks/v1/${code}`,
            timeoutInSeconds: banksTimeoutInSeconds,
        });

        if (response.isLeft()) {
            return null;
        }

        const { statusCode, data: bank } = response.success;
        if (statusCode !== HttpStatusCode.OK) {
            return null;
        }

        return bank;
    }

    private async findbyIspb(ispb: string): Promise<Bank> {
        logger.info({ event: "findbyIspb", ispb });

        const banks: BanksHttpResponse = await this.findAllBanks();

        return banks?.find((bank: BankHttpResponse) => bank.ispb === ispb);
    }

    private async findAllBanks(): Promise<BanksHttpResponse> {
        const response: Either<Error, HttpResponse<BanksHttpResponse>> = await httpRestClient.get<BanksHttpResponse>({
            url: `${brasilApiUrl}/banks/v1`,
            timeoutInSeconds: banksTimeoutInSeconds,
        });

        if (response.isLeft()) {
            return null;
        }

        const { statusCode, data: banks } = response.success;
        if (statusCode !== HttpStatusCode.OK) {
            return null;
        }

        return banks;
    }

    static getInstance() {
        if (!BankService.instance) {
            BankService.instance = new BankService();
        }

        return BankService.instance;
    }
}

export const bankService: BankService = BankService.getInstance();
