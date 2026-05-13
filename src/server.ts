import dotenv from "dotenv";
import path from "path";
import express from "express";
import cors from "cors";
import { router } from "./routes";

dotenv.config({
  quiet: true,
  path: path.resolve(__dirname, "..", ".env"),
});

const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", router);

app.listen(Number(PORT), HOST, function () {
  console.log(`Rodando em http://${HOST}:${PORT}`);
});