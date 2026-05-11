import pool from "../database/db";
import path from "path";
import fs from "fs/promises";

const projectRoot = path.resolve(__dirname, "..", "..");
const sqlDir = path.resolve(projectRoot, "src", "infra", "init");
const seedDataDir = path.resolve(sqlDir, "seed-data");

// A ordem importa: esse array define a sequência exata de execução dos scripts.
const sqlFiles: string[] = [
  "schema-sql.sql",
  "seed-data.sql"
];

async function runSqlFiles(): Promise<void> {
  const files = sqlFiles.map((fileName) => path.join(sqlDir, fileName));

  if (files.length === 0) {
    throw new Error(`Nenhum arquivo .sql encontrado em ${sqlDir}`);
  }

  try {
    // Lê cada arquivo, ajusta caminhos locais e executa o SQL no banco configurado.
    for (const file of files) {
      let sql = await fs.readFile(file, "utf8");
      const relativeFile = path.relative(projectRoot, file).replace(/\\/g, "/");

      sql = prepareSql(sql);

      process.stdout.write(`Executando ${relativeFile}... `);
      await pool.query(sql);
      console.log("ok");
    }
  } finally {
    await pool.end();
  }

  console.log(`${files.length} arquivo(s) SQL executado(s).`);
}

function prepareSql(sql: string): string {
  // O PostgreSQL espera caminhos com "/" no COPY, inclusive no Windows.
  const postgresPath = seedDataDir.replace(/\\/g, "/");

  // Substitui o placeholder usado nos .sql pelo caminho real dos arquivos CSV.
  return sql.replace(/__SEED_DATA_DIR__/g, postgresPath);
}

runSqlFiles().catch((error: unknown) => {
  console.error("Erro ao executar arquivos SQL:");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
