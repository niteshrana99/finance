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
        const categories = await prisma.categories.findMany({
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
            categories
        });
    })
    .get('/:id', clerkMiddleware(), zValidator('param', z.object({ id: z.string().optional() })), async (c) => {
        const auth = getAuth(c);
        if (!auth?.userId) {
            return c.json({ message: 'Unauthorized' }, 401);
        };
        const { id } = c.req.valid('param');
        if (!id) {
            return c.json({ error: 'Bad Request!! Missing Id' }, 400);
        }
        const data = await prisma.categories.findUnique({
            where: {
                userId: auth?.userId,
                id: Number(id)
            },
            select: {
                name: true,
                id: true,
            }
        });
        if (!data) {
            return c.json({ error: 'Not Found' }, 400);
        }
        return c.json({ category: data }, 200);
    })
    .post('/', clerkMiddleware(), zValidator('json', schema), async (c) => {
        const auth = getAuth(c);
        const values = c.req.valid('json');
        if (!auth?.userId) {
            return c.json({ message: 'Unauthorized' }, 401);
        }

        const data = await prisma.categories.create({
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
        const data = await prisma.categories.deleteMany({
            where: {
                userId: auth.userId,
                id: { in: values.ids }
            }
        });
        return c.json({ data });
    })
    .post('')
    .patch('edit/:id',
        clerkMiddleware(),
        zValidator('param', z.object({ id: z.string().optional() })),
        zValidator('json', schema),
        async (c) => {
            const auth = getAuth(c);

            if (!auth?.userId) {
                return c.json({ message: 'Unauthorized' }, 401);
            }

            const { id } = c.req.valid('param');
            const values = c.req.valid('json');

            if (!id) {
                return c.json({ error: 'Not Found' }, 400);
            };

            const response = await prisma.categories.update({
                where: {
                    userId: auth.userId,
                    id: Number(id)
                },
                data: {
                    name: values.name
                }
            });

            return c.json({ response });

        })
    .delete('delete/:id',
        clerkMiddleware(),
        zValidator('param', z.object({ id: z.string().optional() })),
        async (c) => {
            const auth = getAuth(c);

            if (!auth?.userId) {
                return c.json({ message: 'Unauthorized' }, 401);
            }

            const { id } = c.req.valid('param');

            if (!id) {
                return c.json({ error: 'Not Found' }, 400);
            };

            const response = await prisma.categories.delete({
                where: {
                    userId: auth.userId,
                    id: Number(id)
                }
            });

            return c.json({ response });

        });
export default app;
