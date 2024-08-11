import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner";

const useGetTransactions = () => {
    const params = useSearchParams();
    const from = params.get("from") || "";
    const to = params.get("to") || "";
    const accountId = params.get("accountId") || "";

    const query = useQuery({
        queryKey: ['transactions'],
        queryFn: async () => {
            const response = await client.api.transactions.$get({
                query: {
                    from,
                    to,
                    accountId
                }
            });
            if (!response.ok) {
                toast("Failed to Fetch Transactins");
                throw new Error("Failed to Fetch Transactins");
            }
            const { data } = await response.json();
            return data;
        },

    });

    return query;
};


export default useGetTransactions;