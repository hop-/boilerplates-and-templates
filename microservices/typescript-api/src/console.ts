import app from './app';

async function main() {
  await app.startCli();
}

main().catch(console.error);
