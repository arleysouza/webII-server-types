import dotenv from "dotenv";
import path from "path";
import express from "express";
import { router } from "./routes";

dotenv.config({
  quiet: true,
  path: path.resolve(__dirname, "..", ".env"),
});

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.use("/api", router);

app.listen(PORT, function () {
  console.log(`Rodando em http://localhost:${PORT}`);
});
