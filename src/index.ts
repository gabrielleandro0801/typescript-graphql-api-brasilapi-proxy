import { GraphQLSchema } from "graphql";
import { ExpressServer, IRouteGroup } from "./server";
import { createGraphQlSchemas } from "./server/graphql/schema";
import { createRestRoutes } from "./server/rest/routes";
import { properties } from "./utils/properties";

const {
    HTTP: { PORT: httpPort },
} = properties;

async function main() {
    const server: ExpressServer = new ExpressServer();
    const restRoutes: IRouteGroup[] = createRestRoutes();
    const graphQlSchema: GraphQLSchema = createGraphQlSchemas();

    server.addRestRoutes(restRoutes);
    server.addGraphQlRoutes(graphQlSchema);
    server.listen(httpPort);
}

main();
