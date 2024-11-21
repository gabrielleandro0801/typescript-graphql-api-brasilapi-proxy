const {
    BANKS_TIMEOUT_IN_SECONDS,
    BRASIL_API_URL,
    CEP_TIMEOUT_IN_SECONDS,
    CNPJ_TIMEOUT_IN_SECONDS,
    HOLIDAYS_TIMEOUT_IN_SECONDS,
    HTTP_PORT,
} = process.env;

export type Properties = {
    BANKS: {
        TIMEOUT_IN_SECONDS: number;
    };
    BRASIL_API: {
        URL: string;
    };
    CEP: {
        TIMEOUT_IN_SECONDS: number;
    };
    CNPJ: {
        TIMEOUT_IN_SECONDS: number;
    };
    HOLIDAYS: {
        TIMEOUT_IN_SECONDS: number;
    };
    HTTP: {
        PORT: number;
    };
};

export const properties: Properties = {
    BANKS: {
        TIMEOUT_IN_SECONDS: Number(BANKS_TIMEOUT_IN_SECONDS),
    },
    BRASIL_API: {
        URL: BRASIL_API_URL,
    },
    CEP: {
        TIMEOUT_IN_SECONDS: Number(CEP_TIMEOUT_IN_SECONDS),
    },
    CNPJ: {
        TIMEOUT_IN_SECONDS: Number(CNPJ_TIMEOUT_IN_SECONDS),
    },
    HTTP: {
        PORT: Number(HTTP_PORT),
    },
    HOLIDAYS: {
        TIMEOUT_IN_SECONDS: Number(HOLIDAYS_TIMEOUT_IN_SECONDS),
    },
};
