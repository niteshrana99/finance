import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
const prisma = new PrismaClient();

const schema = z.object({
  name: z.string()
});

const app = new Hono()
  .get('/', clerkMiddleware(), async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) {
      return c.json({ message: 'Unauthorized' }, 401);
    }
    const accounts = await prisma.accounts.findMany({
      where: {
        userId: {
          equals: auth.userId
        }
      },
      select: {
        id: true,
        name: true
      }
    });
    return c.json({
      accounts
    });
  })
  .post('/', clerkMiddleware(), zValidator('json', schema), async (c) => {
    const auth = getAuth(c);
    const values = c.req.valid('json');
    if (!auth?.userId) {
      return c.json({ message: 'Unauthorized' }, 401);
    }

    const data = await prisma.accounts.create({
      data: {
        name: values.name,
        userId: auth.userId,
      }
    });
    return c.json({ data });
  })
  .post('/bulk-delete', clerkMiddleware(), zValidator('json', z.object({ ids: z.array(z.number()) })), async (c) => {
    const auth = getAuth(c);
    const values = c.req.valid('json');
    console.log(values);
    if (!auth?.userId) {
      return c.json({ message: 'Unauthorized' }, 401)
    }
    const data = await prisma.accounts.deleteMany({
      where: {
        userId: auth.userId,
        id: { in: values.ids }
      }
    });
    return c.json({ data });
  })
export default app;
