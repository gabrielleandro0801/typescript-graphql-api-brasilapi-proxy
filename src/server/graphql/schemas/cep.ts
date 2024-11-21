import { GraphQLObjectType, GraphQLString } from "graphql";

export const CepType = new GraphQLObjectType({
    name: "cep",
    fields: () => ({
        state: { type: GraphQLString },
        city: { type: GraphQLString },
        neighborhood: { type: GraphQLString },
        street: { type: GraphQLString },
    }),
});
