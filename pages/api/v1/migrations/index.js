import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";
import { json } from "node:stream/consumers";

export default async function migrations(request, response) {
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(request.method)) {
    return response.status(405).json({
      error: `Method ${request.method} not allowed`,
    });
    }
  console.log("O método é o " + request.method);
  
  let dbClient;
  try {
  dbClient = await database.getNewClient();

  const defaultMigrationOptions = {
    dbClient: dbClient,
    databaseUrl: process.env.DATABASE_URL,
    dryRun: false,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",  
  }

  
  if(request.method === 'GET') {
    const pendingMigrations = await migrationRunner(defaultMigrationOptions)
    response.status(200).json(pendingMigrations);
  } 
  
  if(request.method === 'POST') {
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: false,
    });


    if (migratedMigrations.length > 0) {
      response.status(201).json(migratedMigrations);
      }
    response.status(200).json(migratedMigrations);
  }
} catch (error) {
  console.error(error)
  throw error;
} finally {
  await dbClient.end();
}
}
