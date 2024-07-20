import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner"

type ResponseType = InferResponseType<typeof client.api.categories.$post>;
type RequestType = InferRequestType<typeof client.api.categories.$post>["json"];

const useCreateCategory = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (json: RequestType) => {
            const response = await client.api.categories.$post({ json });
            return await response.json();
        },
        onSuccess: () => {
            toast("Category created Successfully");
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
        onError: () => {
            toast("Category creation Failed. Please try again");
        }
    })

    return mutation;
};

export default useCreateCategory;