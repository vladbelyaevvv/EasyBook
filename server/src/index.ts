import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import app from './app.js';

const PORT = process.env.PORT ?? 5000;
const prisma = new PrismaClient();

async function seedIfEmpty() {
  const count = await prisma.user.count();
  if (count > 0) return;

  console.log('Database is empty — running seed...');
  const { execSync } = await import('child_process');
  execSync('node --loader ts-node/esm src/prisma/seed.ts', { stdio: 'inherit', cwd: process.cwd() });
  console.log('Seed complete.');
}

app.listen(PORT, async () => {
  await seedIfEmpty().catch(e => console.error('Seed error:', e.message));
  console.log(`Server running on port ${PORT}`);
});