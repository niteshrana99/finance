import { client } from '@/lib/hono';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

type RequestType = InferRequestType<(typeof client.api.categories)['bulk-delete']['$post']>['json'];
type ResponseType = InferResponseType<(typeof client.api.categories)['bulk-delete']['$post']>;

const useDeleteCategories = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json: RequestType) => {
            const response = await client.api.categories['bulk-delete']['$post']({ json });
            return await response.json();
        },
        onSuccess: () => {
            toast.success('Categories deleted Successfully');
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
        onError: () => {
            toast.error('Failed to Delete Categories, Please try again.');
        }
    });

    return mutation;
};

export default useDeleteCategories;
