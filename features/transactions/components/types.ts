export interface Transaction {
    id: number;
    amount: string;
    payee: string;
    notes: null | string;
    date: string;
    categoryId: number | null;
    accountId: number;
    account: {
        id: number;
        plaidId: null | string;
        name: string;
        userId: string;
    };
    category?: {
        id: number;
        plaidId: null | string;
        name: string;
        userId: string;
    } | null;
}