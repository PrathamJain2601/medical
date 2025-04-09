import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
    {
      emit: 'event',
      level: 'error',
    },
  ],
});

// Listen for query events
prisma.$on('query', (e: any) => {
  console.log('Duration: ' + e.duration + 'ms');
});

// Listen for info events
prisma.$on('info', (e: any) => {
  console.log('Info: ' + e.message);
});

// Listen for warning events
prisma.$on('warn', (e: any) => {
  console.warn('Warning: ' + e.message);
});

// Listen for error events
prisma.$on('error', (e: any) => {
  console.error('Error: ' + e.message);
});
