import { client } from "@/lib/hono"
import { useQuery } from "@tanstack/react-query"

export const useGetCategory = (id: number) => {
    const query = useQuery({
        enabled: !!id,
        queryKey: ['catrgories', { id }],
        staleTime: 0,
        queryFn: async () => {
            const response = await client.api.categories[':id'].$get({
                param: {
                    id: id.toString()
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch Category');
            }

            const { category } = await response.json();
            return category;
        }
    });
    return query;
}