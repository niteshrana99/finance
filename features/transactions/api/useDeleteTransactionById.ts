import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type RequestType = InferRequestType<typeof client.api.transactions.delete[":id"]["$delete"]>

const useDeleteTransactionById = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationKey: ['deleteTransactionById'],
        mutationFn: async (param: RequestType) => {
            const response = await client.api.transactions.delete[":id"].$delete(param);
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Transaction Deleted Successfully");
            queryClient.invalidateQueries({ queryKey: ["transactions"] })
        },
        onError: () => {
            toast.success("Unable to delete Transaction. Please try again.");
        },
    });

    return mutation;
};

export default useDeleteTransactionById;