import { client } from '@/lib/hono';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

type RequestType = InferRequestType<typeof client.api.accounts.delete[':id']['$delete']>;
type ResponseType = InferResponseType<(typeof client.api.accounts.delete)[':id']['$delete']>

const useDeleteSingleAccount = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (id: RequestType) => {
            const response = await client.api.accounts.delete[':id'].$delete(id);
            return await response.json();
        },
        onSuccess: () => {
            toast.success('Account deleted Successfully');
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
        onError: () => {
            toast.error('Failed to Delete Account, Please try again.');
        }
    });

    return mutation;
};

export default useDeleteSingleAccount;
