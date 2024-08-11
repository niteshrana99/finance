import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type RequestType = InferRequestType<typeof client.api.transactions.createTransaction.$post>["json"];

const useCreateNewTransaction = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (json: RequestType) => {
            const response = await client.api.transactions.createTransaction.$post({ json });
        },
        onSuccess: () => {
            toast('Transaction created Successfully');
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
        },
        onError: () => {
            toast("Transaction creation Failed. Please try again");
        }
    });

    return mutation;
};

export default useCreateNewTransaction;