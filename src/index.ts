import process from "node:process";
import * as dotenv from "dotenv";
import { server } from "./server";

dotenv.config();
const PORT = Number(process.env.PORT) || 4000;

server(PORT);
