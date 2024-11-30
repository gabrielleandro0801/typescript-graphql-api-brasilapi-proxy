import { IRouteGroup } from "..";
import { HealthCheckController } from "../../controllers/rest/health-check-controller";

export function createRestRoutes(): IRouteGroup[] {
    const defaultRoutes: IRouteGroup = {
        basePath: "",
        routes: [
            {
                method: "get",
                path: "/health",
                controller: new HealthCheckController(),
            },
        ],
    };

    return [defaultRoutes];
}
