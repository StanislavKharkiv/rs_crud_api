import cluster from "node:cluster";
import { cpus } from "node:os";
import process from "node:process";
import { server } from "./server";

const numCPUs = cpus().length;

export function worker(port: number) {
  if (cluster.isPrimary) {
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on("exit", (worker) => {
      console.log(`worker ${worker.process.pid} died`);
    });
  } else {
    server(port);
    console.log(`Worker ${process.pid} started`);
  }
}
