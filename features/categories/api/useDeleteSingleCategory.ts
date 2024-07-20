import { client } from '@/lib/hono';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

type RequestType = InferRequestType<typeof client.api.categories.delete[':id']['$delete']>;
type ResponseType = InferResponseType<(typeof client.api.categories.delete)[':id']['$delete']>

const useDeleteSingleCategory = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (id: RequestType) => {
            const response = await client.api.categories.delete[':id'].$delete(id);
            return await response.json();
        },
        onSuccess: () => {
            toast.success('Category deleted Successfully');
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
        onError: () => {
            toast.error('Failed to Delete Category, Please try again.');
        }
    });

    return mutation;
};

export default useDeleteSingleCategory;
