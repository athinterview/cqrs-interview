
export type KnownEnv = {
  PORT?: string;
  LOWDB_FILE_PATH?: string;
}

export type EnvType = KnownEnv & { [key: string]: string | undefined };

export type AppConfig = {
  port: number;
  dbPath: string;
}

export function getConfig(env: EnvType) {
  const port = env.PORT ? parseInt(env.PORT) : 5080;
  const dbPath = env.LOWDB_FILE_PATH ?? 'db.json';

  return {
    port,
    dbPath,
  };
}