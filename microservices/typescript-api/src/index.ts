import app from './app';

async function main() {
  await app.start();
}

main().catch((e) => {
  console.error('Appilaction failed:', e);
  process.exit(1);
});
