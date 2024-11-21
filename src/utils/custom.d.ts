declare global {
    namespace NodeJS {
        interface ProcessEnv {
            [key: string]: string | undefined;
            BANKS_TIMEOUT_IN_SECONDS: string;
            BRASIL_API_URL: string;
            CEP_TIMEOUT_IN_SECONDS: string;
            CNPJ_TIMEOUT_IN_SECONDS: string;
            HTTP_PORT: string;
            HOLIDAYS_TIMEOUT_IN_SECONDS: string;
        }
    }
}

export {};
