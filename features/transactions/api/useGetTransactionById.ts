import { client } from "@/lib/hono"
import { useQuery } from "@tanstack/react-query"

const useGetTransactionById = (id: number) => {
    const query = useQuery({
        queryKey: ["transactionById", { id }],
        enabled: !!id,
        queryFn: async () => {
            const response = await client.api.transactions[":id"].$get({
                param: {
                    id: id.toString()
                }
            });
            if (!response.ok) {
                throw new Error("Faild to fetch Transactions")
            };
            const { data } = await response.json();

            return data;
        }
    });

    return query;
};

export default useGetTransactionById;