import { calculatePercentageChange } from "@/lib/utils";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { PrismaClient } from "@prisma/client";
import { subDays, parse, differenceInDays, eachDayOfInterval, isSameDay } from "date-fns";
import { Hono } from "hono";
import { z } from "zod";

const prisma = new PrismaClient();

type ActiveDays = { date: string, income: string, expenses: string }[];

const getSummary = async ({ userId, startDate, endDate }: any): Promise<{ income: string, expenses: string, remaining: string }[]> => {
    return await prisma.$queryRaw`
        SELECT 
          COALESCE (
            (
              SELECT SUM(CAST(amount AS DECIMAL))
              FROM "Transactions" t
              INNER JOIN "Accounts" a ON t."accountId" = a.id
              WHERE CAST(amount AS DECIMAL) > 0
              AND a."userId" = ${userId}
              AND t."date" >= ${startDate}
              AND t."date" <= ${endDate}
            ), 0
          ) AS income,
          COALESCE (
            (
              SELECT SUM(CAST(amount AS DECIMAL))
              FROM "Transactions" t
              INNER JOIN "Accounts" a ON t."accountId" = a.id
              WHERE CAST(amount AS DECIMAL) < 0
              AND a."userId" = ${userId}
              AND t."date" >= ${startDate}
              AND t."date" <= ${endDate}
            ), 0
          ) AS expenses,
          COALESCE (
            (
              SELECT SUM(CAST(amount AS DECIMAL))
              FROM "Transactions" t
              INNER JOIN "Accounts" a ON t."accountId" = a.id
              WHERE a."userId" = ${userId}
              AND t."date" >= ${startDate}
              AND t."date" <= ${endDate}
            ), 0
          ) AS remaining
      `;
}

const fillMissingDays = (activeDays: ActiveDays, startDate: Date, endDate: Date) => {
    if (!activeDays.length) {
        return [];
    }
    const allDays = eachDayOfInterval({
        start: startDate,
        end: endDate
    });

    const transactionsByDay = allDays.map((day) => {
        const transaction = activeDays.find((d) => isSameDay(d.date, day));

        if (transaction) return {
            ...transaction,
            income: Number(transaction.income),
            expenses: Number(transaction.expenses)
        };
        return {
            date: day,
            income: 0,
            expenses: 0
        }
    });

    return transactionsByDay;
}

const app = new Hono()
    .get('/', clerkMiddleware(), zValidator("query", z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional()
    }).optional()), async (c) => {

        const auth = getAuth(c);

        if (!auth?.userId) {
            return c.json({ message: 'Unauthorized' }, 401);
        }

        const { accountId, from, to } = c.req.valid("query") || {};

        const defaultTo = new Date();
        const defaultFrom = subDays(defaultTo, 30);

        const startDate = from ? parse(from, 'yyyy-MM-dd', new Date()) : defaultFrom;
        const endDate = to ? parse(to, 'yyyy-MM-dd', new Date()) : defaultTo;

        const periodLength = differenceInDays(endDate, startDate) + 1;
        const lastPeriodStart = subDays(startDate, periodLength);
        const lastPeriodEnd = subDays(endDate, periodLength);

        const currentPeriod = await getSummary({
            userId: auth.userId,
            startDate,
            endDate,
        });

        const lastPeriod = await getSummary({
            userId: auth.userId,
            startDate: lastPeriodStart,
            endDate: lastPeriodEnd,
        });

        const incomesChange = calculatePercentageChange(Number(currentPeriod[0].income), Number(lastPeriod[0].income)).toFixed(2);
        const expensesChange = calculatePercentageChange(Number(currentPeriod[0].expenses), Number(lastPeriod[0].expenses)).toFixed(2);
        const remainingChange = calculatePercentageChange(Number(currentPeriod[0].remaining), Number(lastPeriod[0].remaining)).toFixed(2);

        const categories: Array<{ name: string, total: string }> = await prisma.$queryRaw`
            SELECT c."name", CAST(SUM(ABS(CAST(t.amount as DECIMAL))) as FLOAT) AS total 
            FROM "Categories" c
            INNER JOIN "Transactions" t on c.id = t."categoryId"
            WHERE c."userId" = ${auth.userId}
            AND t.date >= ${startDate}
            AND t.date <= ${endDate}
            GROUP BY c."name"
            HAVING SUM(ABS(CAST(t.amount as DECIMAL))) IS NOT NULL
            ORDER BY total DESC
        `;

        const topCategories = categories.slice(0, 3);
        const otherCategories = categories.slice(3);

        if (otherCategories.length) {
            const otherTotal = otherCategories.reduce((acc, next) => {
                return acc + parseFloat(next.total)
            }, 0);

            topCategories.push({
                name: "Others",
                total: otherTotal.toString()
            })
        }

        const activeDays: ActiveDays = await prisma.$queryRaw`
            SELECT
                t.date,
                SUM(CASE WHEN CAST(t.amount as DECIMAL) >= 0 THEN CAST(t.amount as DECIMAL) ELSE 0 END) AS income,
                SUM(CASE WHEN CAST(t.amount as DECIMAL) < 0 THEN CAST(t.amount as DECIMAL) ELSE 0 END) AS expenses
            FROM "Transactions" t
            INNER JOIN "Accounts" a on a.id = t."accountId"
            WHERE a."userId" = ${auth.userId}
            AND t.date >= ${startDate}
            AND t.date <= ${endDate}
            GROUP BY t.date
            ORDER BY t.date
        `;

        const days = fillMissingDays(
            activeDays,
            startDate,
            endDate
        );


        return c.json({
            data: {
                remainingAmount: Number(currentPeriod[0].remaining),
                remainingChange: Number(remainingChange),
                incomeAmount: Number(currentPeriod[0].income),
                incomesChange: Number(incomesChange),
                expensesAmount: Number(currentPeriod[0].expenses),
                expensesChange: Number(expensesChange),
                topCategories,
                days,
                lastPeriod: lastPeriod[0],
            },
        });


    });

export default app;