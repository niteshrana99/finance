import { client } from '@/lib/hono';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

type RequestType = InferRequestType<(typeof client.api.accounts)['bulk-delete']['$post']>['json'];
type ResponseType = InferResponseType<(typeof client.api.accounts)['bulk-delete']['$post']>;

const useDeleteAccounts = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json: RequestType) => {
            const response = await client.api.accounts['bulk-delete']['$post']({ json });
            return await response.json();
        },
        onSuccess: () => {
            toast.success('Accounts deleted Successfully');
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
        onError: () => {
            toast.error('Failed to Delete Accounts, Please try again.');
        }
    });

    return mutation;
};

export default useDeleteAccounts;
