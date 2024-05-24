import app from './app';

async function main() {
  await app.start();
}

main().catch(console.error);
