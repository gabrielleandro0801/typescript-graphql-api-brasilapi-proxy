import { GraphQLObjectType, GraphQLString } from "graphql";

export const CnpjType = new GraphQLObjectType({
    name: "cnpj",
    fields: {
        name: { type: GraphQLString },
        zipCode: { type: GraphQLString },
        foundationDate: { type: GraphQLString },
        phoneNumber: { type: GraphQLString },
    },
});
