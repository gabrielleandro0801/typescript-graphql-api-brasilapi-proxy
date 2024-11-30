import {
    GraphQLFieldConfig,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
} from "graphql";
import { bankService } from "../../services/bank-service";
import { cepService } from "../../services/cep-service";
import { cnpjService } from "../../services/cnpj-service";
import { holidayService } from "../../services/holiday-service";
import { BankType } from "./schemas/bank";
import { CepType } from "./schemas/cep";
import { CnpjType } from "./schemas/cnpj";
import { HolidayType } from "./schemas/holiday";

export function createGraphQlSchemas(): GraphQLSchema {
    return new GraphQLSchema({
        query: createQueries(),
    });
}

function createQueries() {
    return new GraphQLObjectType({
        name: "RootQueryType",
        fields: {
            cnpj: {
                args: {
                    cnpj: {
                        type: new GraphQLNonNull(GraphQLString),
                    },
                },
                type: CnpjType,
                resolve: async (source, args) => {
                    return await cnpjService.findOne(args.cnpj);
                },
            },
            cep: {
                args: {
                    cep: {
                        type: new GraphQLNonNull(GraphQLString),
                    },
                },
                type: CepType,
                resolve: async (source, args) => {
                    return await cepService.findOne(args.cep);
                },
            },
            holidays: {
                args: {
                    year: {
                        type: new GraphQLNonNull(GraphQLString),
                    },
                },
                type: new GraphQLList(HolidayType),
                resolve: async (source, args) => {
                    return await holidayService.findAll(args.year);
                },
            },
            holiday: {
                args: {
                    year: {
                        type: new GraphQLNonNull(GraphQLString),
                    },
                    month: {
                        type: new GraphQLNonNull(GraphQLString),
                    },
                    day: {
                        type: new GraphQLNonNull(GraphQLString),
                    },
                },
                type: HolidayType,
                resolve: async (source, args) => {
                    return await holidayService.findOne(args.year, args.month, args.day);
                },
            },
            banks: {
                type: new GraphQLList(BankType),
                resolve: async (source, args) => {
                    return await bankService.findAll();
                },
            },
            bank: {
                args: {
                    code: {
                        type: GraphQLString,
                    },
                    ispb: {
                        type: GraphQLString,
                    },
                },
                type: BankType,
                resolve: async (source, args) => {
                    return await bankService.findOne({
                        code: args?.code,
                        ispb: args?.ispb,
                    });
                },
            },
        },
    });
}

const a: GraphQLFieldConfig<string, string> = {
    args: {
        cnpj: {
            type: new GraphQLNonNull(GraphQLString),
        },
    },
    type: CnpjType,
    resolve: async (source, args) => {
        return await cnpjService.findOne(args.cnpj);
    },
};
