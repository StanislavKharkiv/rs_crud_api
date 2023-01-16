import process from "node:process";
import * as dotenv from "dotenv";
import { server } from "./server";
import { worker } from "./worker";

dotenv.config();
const PORT = Number(process.env.PORT) || 4000;

console.log("run script");
if (process.argv[2] === "--multi") {
  worker(PORT);
} else {
  server(PORT);
}
