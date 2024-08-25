import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { zValidator } from '@hono/zod-validator';
import { PrismaClient } from '@prisma/client';
import { format, parse, startOfDay, subDays } from 'date-fns';
import { Hono } from 'hono';
import { z } from 'zod';

const prisma = new PrismaClient();

const objectSchema = z.object({
    label: z.string(),
    value: z.number()
});

const schema = z.object({
    date: z.string().date(),
    account: objectSchema,
    category: objectSchema.optional(),
    payee: z.string(),
    amount: z.string(),
    notes: z.string().optional()
});


const bulkTransactionSchema = z.object({
    account: objectSchema,
    transactions: z.array(z.object({
        date: z.string().date(),
        payee: z.string(),
        amount: z.string(),
        notes: z.string().optional(),
    }))
})

const app = new Hono()
    .post('/createTransaction', clerkMiddleware(), zValidator('json', schema), async (c) => {
        const auth = getAuth(c);
        if (!auth?.userId) {
            return c.json({ message: 'Unauthorized' }, 401);
        }

        const json = c.req.valid('json');

        const transactions = await prisma.transactions.create({
            data: {
                ...json,
                account: {
                    connect: { id: json.account.value }
                },
                category: {
                    connect: json?.category ? { id: json.category.value } : undefined
                },
                date: new Date(json.date)
            }
        });
        return c.json({ response: transactions });
    })
    .get(
        '/',
        clerkMiddleware(),
        zValidator(
            'query',
            z.object({
                from: z.string().optional(),
                to: z.string().optional(),
                accountId: z.string().optional()
            })
        ),
        async (c) => {
            const auth = getAuth(c);
            if (!auth?.userId) {
                return c.json({ message: 'Unauthorized' }, 401);
            }

            const { accountId, from, to } = c.req.valid('query');

            const defaultTo = new Date();
            const defaultFrom = subDays(defaultTo, 30);

            const startDate = from ? parse(from, 'yyyy-MM-dd', new Date()) : defaultFrom;
            const endDate = to ? parse(to, 'yyyy-MM-dd', new Date()) : defaultTo;

            const transactions = await prisma.transactions.findMany({
                where: {
                    account: {
                        userId: auth.userId
                    },
                    date: {
                        gte: startDate,
                        lte: endDate
                    },
                    accountId: accountId ? parseInt(accountId, 10) : undefined
                },
                include: {
                    account: true,
                    category: true
                }
            });

            return c.json({
                data: transactions
            });
        }
    )
    .get(
        '/:id',
        clerkMiddleware(),
        zValidator(
            'param',
            z.object({
                id: z.string()
            })
        ),
        async (c) => {
            const auth = getAuth(c);
            if (!auth?.userId) {
                return c.json({ message: 'Unauthorized' }, 401);
            }

            const { id } = c.req.valid('param');

            if (!id) {
                return c.json({ message: 'Transaction Id not found' }, 404);
            }

            const transactions = await prisma.transactions.findUnique({
                where: {
                    account: {
                        userId: auth.userId
                    },
                    id: Number(id)
                },
                include: {
                    account: true,
                    category: true
                }
            });

            return c.json({
                data: transactions
            });
        }
    )
    .patch(
        'edit/:id',
        clerkMiddleware(),
        zValidator('json', schema),
        zValidator(
            'param',
            z.object({
                id: z.string()
            })
        ),
        async (c) => {
            const auth = getAuth(c);
            if (!auth?.userId) {
                return c.json({ message: 'Unauthorized' }, 401);
            }

            const { id } = c.req.valid('param');
            const json = c.req.valid('json');

            if (!id) {
                return c.json({ message: 'Transaction Id not found' }, 404);
            }

            const transaction = await prisma.transactions.update({
                data: {
                    ...json,
                    account: {
                        connect: { id: json.account.value }
                    },
                    category: {
                        connect: json.category ? { id: json.category.value } : undefined
                    },
                    date: new Date(json.date)
                },
                where: {
                    id: Number(id),
                }
            });

            return c.json({ transaction }, 200)
        }
    )
    .delete(
        'delete/:id',
        clerkMiddleware(),
        zValidator(
            'param',
            z.object({
                id: z.string()
            })
        ),
        async (c) => {
            const auth = getAuth(c);
            if (!auth?.userId) {
                return c.json({ message: 'Unauthorized' }, 401);
            }

            const { id } = c.req.valid('param');

            if (!id) {
                return c.json({ message: 'Transaction Id not found' }, 404);
            }

            const transaction = await prisma.transactions.delete({
                where: {
                    id: Number(id)
                }
            })

            return c.json({ transaction }, 200)
        }
    )
    .post(
        'bulk-delete',
        clerkMiddleware(),
        zValidator("json", z.object({
            ids: z.number().array()
        })),
        async (c) => {
            const auth = getAuth(c);
            if (!auth?.userId) {
                return c.json({ message: 'Unauthorized' }, 401);
            }

            const { ids } = c.req.valid('json');

            if (!ids.length) {
                return c.json({ message: 'Transaction Id not found' }, 404);
            }

            const transaction = await prisma.transactions.deleteMany({
                where: {
                    id: {
                        in: ids
                    }
                }
            })

            return c.json({ transaction }, 200)
        }
    )
    .post(
        'bulk-create',
        clerkMiddleware(),
        zValidator("json", bulkTransactionSchema),
        async (c) => {
            const auth = getAuth(c);
            if (!auth?.userId) {
                return c.json({ message: 'Unauthorized' }, 401);
            }

            const json = c.req.valid('json');
            const { account, transactions } = json;
            const isValidAccount = await prisma.accounts.findFirst({
                where: {
                    id: account.value,
                    userId: auth.userId
                }
            });

            if (!isValidAccount) {
                return c.json({ message: 'Invalid account or unauthorized access' }, 403);
            };

            const createdTransactions = await prisma.transactions.createMany({
                data: transactions.map((transaction: any) => ({
                    ...transaction,
                    accountId: account.value,
                    date: new Date(transaction.date)
                }))
            });
            return c.json({ count: createdTransactions.count }, 200)

        }
    );

export default app;
