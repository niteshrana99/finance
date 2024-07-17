import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner"

type ResponseType = InferResponseType<typeof client.api.accounts.$post>;
type RequestType = InferRequestType<typeof client.api.accounts.$post>["json"];

const useCreateAccount = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (json: RequestType) => {
           const response = await client.api.accounts.$post({json});
           return await response.json();
        },
        onSuccess: () => {
            toast("Account created Successfully");
            queryClient.invalidateQueries({queryKey: ['accounts']});
        },
        onError: () => {
            toast("Account creation Failed. Please try again");
        }
    })

    return mutation;
};

export default useCreateAccount;