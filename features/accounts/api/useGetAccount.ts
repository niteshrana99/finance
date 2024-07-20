import { client } from "@/lib/hono"
import { useQuery } from "@tanstack/react-query"

export const useGetAccount = (id: number) => {
    const query = useQuery({
        enabled: !!id,
        queryKey: ['account', { id }],
        queryFn: async () => {
            const response = await client.api.accounts[':id'].$get({
                param: {
                    id: id.toString()
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch accounts');
            }

            const { account } = await response.json();
            return account;
        }
    });
    return query;
}