import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType } from "hono";
import { toast } from "sonner";

type RequestType = InferRequestType<typeof client.api.transactions["bulk-create"]["$post"]>

const useBulkCreateTransactions = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['transactionsBulkCreate'],
        mutationFn: async (json: RequestType) => {
            const response = await client.api.transactions["bulk-create"].$post({
                ...json
            });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Transactions created successfully");
            queryClient.invalidateQueries({ queryKey: ["transactions"] })
        }
    })
}

export default useBulkCreateTransactions;