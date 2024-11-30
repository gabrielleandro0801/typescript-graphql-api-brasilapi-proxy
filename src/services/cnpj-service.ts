import { HttpResponse, httpRestClient, HttpRestClient } from "../adapters/http-rest-client";
import { HttpStatusCode } from "../server";
import { Either } from "../utils/either";
import { logger } from "../utils/logger";
import { properties } from "../utils/properties";
import { Cnpj } from "../structures/cnpj";

const {
    BRASIL_API: { URL: brasilApiUrl },
    CNPJ: { TIMEOUT_IN_SECONDS: cnpjTimeoutInSeconds },
} = properties;

type CnpjHttpResponse = {
    uf: string;
    cep: string;
    qsa: any[];
    cnpj: string;
    pais: any;
    email: any;
    porte: string;
    bairro: string;
    numero: string;
    ddd_fax: string;
    municipio: string;
    logradouro: string;
    cnae_fiscal: number;
    codigo_pais: any;
    complemento: string;
    codigo_porte: number;
    razao_social: string;
    nome_fantasia: string;
    capital_social: number;
    ddd_telefone_1: string;
    ddd_telefone_2: string;
    opcao_pelo_mei: boolean;
    descricao_porte: string;
    codigo_municipio: number;
    cnaes_secundarios: {
        codigo: number;
        descricao: string;
    }[];
    natureza_juridica: string;
    situacao_especial: string;
    opcao_pelo_simples: boolean;
    situacao_cadastral: number;
    data_opcao_pelo_mei: string;
    data_exclusao_do_mei: any;
    cnae_fiscal_descricao: string;
    codigo_municipio_ibge: number;
    data_inicio_atividade: string;
    data_situacao_especial: any;
    data_opcao_pelo_simples: string;
    data_situacao_cadastral: string;
    nome_cidade_no_exterior: string;
    codigo_natureza_juridica: number;
    data_exclusao_do_simples: any;
    motivo_situacao_cadastral: number;
    ente_federativo_responsavel: string;
    identificador_matriz_filial: number;
    qualificacao_do_responsavel: number;
    descricao_situacao_cadastral: string;
    descricao_tipo_de_logradouro: string;
    descricao_motivo_situacao_cadastral: string;
    descricao_identificador_matriz_filial: string;
};

export class CnpjService {
    static instance: CnpjService;

    private constructor() {}

    async findOne(cnpj: string): Promise<Cnpj> {
        logger.info({ event: "findOne", cnpj });

        const response: Either<Error, HttpResponse<CnpjHttpResponse>> = await httpRestClient.get<CnpjHttpResponse>({
            url: `${brasilApiUrl}/cnpj/v1/${cnpj}`,
            timeoutInSeconds: cnpjTimeoutInSeconds,
        });

        if (response.isLeft()) {
            return null;
        }

        const { statusCode, data } = response.success;
        if (statusCode !== HttpStatusCode.OK) {
            return null;
        }

        return {
            name: data.razao_social,
            phoneNumber: data.ddd_telefone_1,
            zipCode: data.cep,
            foundationDate: data.data_inicio_atividade,
        };
    }

    static getInstance() {
        if (!CnpjService.instance) {
            CnpjService.instance = new CnpjService();
        }

        return CnpjService.instance;
    }
}

export const cnpjService: CnpjService = CnpjService.getInstance();
