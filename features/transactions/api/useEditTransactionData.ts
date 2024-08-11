import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType } from "hono";
import { toast } from "sonner";

type RequestType = InferRequestType<typeof client.api.transactions.edit[":id"]["$patch"]>["json"]
const useEditTransactionData = (id: number) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationKey: ['editTransaction', { id }],
        mutationFn: async (json: RequestType) => {
            const response = client.api.transactions.edit[":id"].$patch({
                param: { id: id.toString() },
                json
            });

            return response;
        },
        onSuccess: () => {
            toast.success("Transaction Updated successfully");
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
        },
        onError: () => {
            toast.error('Failed to Edit Trnsaction, Please try again.');
        }
    });

    return mutation;
};

export default useEditTransactionData;