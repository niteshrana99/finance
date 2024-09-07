import { client } from "@/lib/hono"
import { useQuery } from "@tanstack/react-query"

const useGetSummary = () => {
    return useQuery({
        queryKey: ['summary'],
        queryFn: async () => {
            const response = await client.api.summary.$get();

            if (!response.ok) {
                throw new Error('Failed to fetch Summary Data');
            }
            const { data } = await response.json();

            return data;
        }
    })
};

export default useGetSummary;