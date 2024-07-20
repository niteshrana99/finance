import { client } from "@/lib/hono"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type RequestType = InferRequestType<typeof client.api.categories.edit[':id']['$patch']>['json'];
type ResponseType = InferResponseType<typeof client.api.categories.edit[':id']['$patch']>;

const useModifyCategories = ({ id }: { id: string }) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json: RequestType) => {
            const response = await client.api.categories.edit[":id"].$patch({
                param: {
                    id
                },
                json
            });

            return response.json();
        },
        onSuccess: () => {
            toast.success('Category Edited Successfully');
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
        onError: () => {
            toast.error('Failed to Edit Category, Please try again.');
        }
    });

    return mutation;
};

export default useModifyCategories;