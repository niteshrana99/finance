import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useCSVReader } from 'react-papaparse';

const UploadButton = ({ onUpload } : {onUpload:  (results: any) =>void } ) => {
    const { CSVReader } = useCSVReader();

    return (
        <CSVReader onUploadAccepted={(results: any) => onUpload(results)}>
            {({ getRootProps }: any) => (
                <Button {...getRootProps()} size="sm" className='w-full lg:w-auto mt-2 lg:m-0'>
                    <Upload className='size-4 mr-2' /> Import
                </Button>
            )}
        </CSVReader>
    )
}

export default UploadButton;