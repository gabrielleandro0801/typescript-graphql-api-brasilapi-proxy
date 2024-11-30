import { HttpResponse, httpRestClient } from "../adapters/http-rest-client";
import { HttpStatusCode } from "../server";
import { Either } from "../utils/either";
import { logger } from "../utils/logger";
import { properties } from "../utils/properties";
import { Holiday } from "../structures/holiday";

const {
    BRASIL_API: { URL: brasilApiUrl },
    HOLIDAYS: { TIMEOUT_IN_SECONDS: holidaysTimeoutInSeconds },
} = properties;

type HolidaysHttpResponse = HolidayHttpResponse[];

type HolidayHttpResponse = {
    date: string;
    name: string;
    type: string;
};

export class HolidayService {
    static instance: HolidayService;

    private constructor() {}

    async findOne(year: string, month: string, day: string): Promise<Holiday> {
        logger.info({ event: "findOne", year, month, day });

        const response: Either<
            Error,
            HttpResponse<HolidaysHttpResponse>
        > = await httpRestClient.get<HolidaysHttpResponse>({
            url: `${brasilApiUrl}/feriados/v1/${year}`,
            timeoutInSeconds: holidaysTimeoutInSeconds,
        });

        if (response.isLeft()) {
            return null;
        }

        const { statusCode, data: holidays } = response.success;
        if (statusCode !== HttpStatusCode.OK) {
            return null;
        }

        return (
            holidays.find((holiday: HolidayHttpResponse) => {
                return holiday.date === `${year}-${month}-${day}`;
            }) || null
        );
    }

    async findAll(year: string): Promise<Holiday[]> {
        logger.info({ event: "findAll", year });

        const response: Either<
            Error,
            HttpResponse<HolidaysHttpResponse>
        > = await httpRestClient.get<HolidaysHttpResponse>({
            url: `${brasilApiUrl}/feriados/v1/${year}`,
            timeoutInSeconds: holidaysTimeoutInSeconds,
        });

        if (response.isLeft()) {
            return null;
        }

        const { statusCode, data: holidays } = response.success;
        if (statusCode !== HttpStatusCode.OK) {
            return null;
        }

        return holidays.map((holiday: HolidayHttpResponse) => {
            return {
                date: holiday.date,
                name: holiday.name,
            };
        });
    }

    static getInstance() {
        if (!HolidayService.instance) {
            HolidayService.instance = new HolidayService();
        }

        return HolidayService.instance;
    }
}

export const holidayService: HolidayService = HolidayService.getInstance();
