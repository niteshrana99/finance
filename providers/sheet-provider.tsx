"use client";

import EditAccountSheet from "@/features/accounts/components/editAccountSheet";
import NewAccountSheet from "@/features/accounts/components/newaccountsheet";
import EditCategorySheet from "@/features/categories/components/editCategorySheet";
import NewCategorySheet from "@/features/categories/components/newCategorySheet";
import EditTransactionSheet from "@/features/transactions/components/editTransactionSheet";
import NewTransactionSheet from "@/features/transactions/components/newTransactionSheet";
import { useMountedState } from "react-use";

export const SheetProvider = () => {
    const isMounted = useMountedState();
    if(!isMounted) return null;
    return (
        <>
            <EditAccountSheet />
            <NewAccountSheet />
            
            <NewCategorySheet />
            <EditCategorySheet />

            <NewTransactionSheet />
            <EditTransactionSheet />
        </>
    );
};
