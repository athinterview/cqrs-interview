import { config } from "dotenv";
import { createApp } from './app';
import { getConfig } from './config';


export async function main() {
  config();

  const appConfig = getConfig(process.env);
  const app = await createApp(appConfig.port, appConfig.dbPath);
  app.listen(appConfig.port, () => {
    console.log(`Server is running on http://localhost:${appConfig.port}`);
  });
}

main().catch((error) => {
  console.error('An error occurred:', error);
  process.exit(1);
});
