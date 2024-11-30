import { GraphQLObjectType, GraphQLString } from "graphql";

export const BankType = new GraphQLObjectType({
    name: "bank",
    fields: {
        code: { type: GraphQLString },
        ispb: { type: GraphQLString },
        name: { type: GraphQLString },
    },
});
