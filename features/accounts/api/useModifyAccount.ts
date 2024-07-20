import { client } from "@/lib/hono"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type RequestType = InferRequestType<typeof client.api.accounts.edit[':id']['$patch']>['json'];
type ResponseType = InferResponseType<typeof client.api.accounts.edit[':id']['$patch']>;

const useModifyAccount = ({ id }: { id: string }) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json: RequestType) => {
            const response = await client.api.accounts.edit[":id"].$patch({
                param: {
                    id
                },
                json
            });

            return response.json();
        },
        onSuccess: () => {
            toast.success('Account Edited Successfully');
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
        onError: () => {
            toast.error('Failed to Edit Account, Please try again.');
        }
    });

    return mutation;
};

export default useModifyAccount;