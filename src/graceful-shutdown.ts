import { ExpressServer } from "./server";

export function handleExpressServerGracefulShutdown(server: ExpressServer) {
    let isTerminated = false;

    function shutdownServer() {
        if (isTerminated) {
            return;
        }

        server.stop();
        isTerminated = true;
    }

    handleShutdown(shutdownServer);
}

function handleShutdown(fn) {
    process.on("SIGINT", fn);
    process.on("SIGTERM", fn);
}
