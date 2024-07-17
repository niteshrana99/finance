"use client"

import DataTable from "@/components/dataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useOpenNewAccount from "@/features/accounts/hooks/useOpenNewAccount";
import { Plus } from "lucide-react";
import { columns, Payment } from "./columns";

const data: Payment[] =  [
      {
        id: "728ed52f",
        amount: 100,
        status: "pending",
        email: "m@example.com",
      },
    ]

const AccountsPage = () => {
    const { openSheet } = useOpenNewAccount();
    return (
        <Card className="max-w-screen-2xl mx-auto pb-10 w-full -mt-28">
            <CardHeader className="gap-y-2 lg:flex lg:flex-row lg:justify-between lg:items-center">
                <CardTitle className="text-xl">
                    Accounts Page
                </CardTitle>
                <Button onClick={openSheet}>
                    <Plus /> Add New
                </Button>
            </CardHeader>
            <CardContent>'
                <DataTable filterKey="email" columns={columns} data={data} />
            </CardContent>
        </Card>
    )
};

export default AccountsPage;