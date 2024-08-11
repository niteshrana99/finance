import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType } from "hono";
import { toast } from "sonner";

type RequestType = InferRequestType<typeof client.api.transactions['bulk-delete']['$post']>;

const useBulkDeleteTransactions = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationKey: ["bulkDeleteTransactions"],
        mutationFn: async (json: RequestType) => {
            const response = await client.api.transactions["bulk-delete"].$post(json);
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Transactions deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["transactions"] })
        }
    });

    return mutation;
};

export default useBulkDeleteTransactions;