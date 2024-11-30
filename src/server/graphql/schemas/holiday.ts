import { GraphQLObjectType, GraphQLString } from "graphql";

export const HolidayType = new GraphQLObjectType({
    name: "holiday",
    fields: {
        date: { type: GraphQLString },
        name: { type: GraphQLString },
    },
});
