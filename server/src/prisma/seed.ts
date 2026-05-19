import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: { email: 'admin@mail.com', passwordHash: hash, name: 'Админ', role: 'ADMIN' },
  });

  const users = await Promise.all([
    prisma.user.create({ data: { email: 'barber@mail.com', passwordHash: hash, name: 'Иван Барбер', role: 'SPECIALIST' } }),
    prisma.user.create({ data: { email: 'trainer@mail.com', passwordHash: hash, name: 'Мария Тренер', role: 'SPECIALIST' } }),
    prisma.user.create({ data: { email: 'client@mail.com', passwordHash: hash, name: 'Влад Клиент', role: 'CLIENT' } }),
  ]);

  const spec1 = await prisma.specialist.create({
    data: { userId: users[0].id, specialization: 'Барбер', bio: 'Стрижки и укладки. 5 лет опыта.', isVerified: true },
  });
  const spec2 = await prisma.specialist.create({
    data: { userId: users[1].id, specialization: 'Тренер', bio: 'Персональные тренировки, похудение и набор массы.', isVerified: true },
  });

  await prisma.service.createMany({
    data: [
      { specialistId: spec1.id, name: 'Мужская стрижка', price: 350, durationMinutes: 45 },
      { specialistId: spec1.id, name: 'Стрижка + борода', price: 500, durationMinutes: 60 },
      { specialistId: spec2.id, name: 'Персональная тренировка', price: 800, durationMinutes: 60 },
      { specialistId: spec2.id, name: 'Онлайн-план питания', price: 1200, durationMinutes: 30 },
    ],
  });

  console.log('Seed completed!');
  console.log('admin@mail.com / password123');
  console.log('barber@mail.com / password123');
  console.log('client@mail.com / password123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
