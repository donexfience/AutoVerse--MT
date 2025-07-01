import dotnev from "dotenv";
import Server from "./server";
dotnev.config();

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
new Server(port);
