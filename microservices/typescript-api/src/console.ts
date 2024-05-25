import app from './app';

async function main() {
  await app.startCli();
}

main().catch((e) => {
  console.error('Failed:', e);
  process.exit(1);
});
