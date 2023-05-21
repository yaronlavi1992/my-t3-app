import { useSupabaseClient } from '@supabase/auth-helpers-react'
import React, { useEffect, useState } from 'react'
import { useStore } from '~/stores/building.store';
import { api } from '~/utils/api';
import { DocumentList } from './DocumentList';

export const BASE_SUPABASE_URL = 'https://uejijaxvhczitaoqzhef.supabase.co/storage/v1/object/public/documents'

const DocumentUpload = ({ url, buildingId, buildingName }: any) => {
  const supabase = useSupabaseClient();
  // const [documentUrl, setDocumentUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState('');
  const { buildingStore } = useStore();
  const { floors,
    setFloors,
    //  setSelectedApartmentsDocumentUrl
  } = buildingStore;
  const updateBuilding = api.building.updateUserBuildingById.useMutation();

  useEffect(() => {
    if (url) downloadDocument(url);

    return () => {
    }
  }, [url])

  const downloadDocument = async (path: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(path)
      if (error) {
        throw error;
      }
      // const url = 
      URL.createObjectURL(data);
      // setDocumentUrl(url);
    } catch (error) {
      console.log('Error downloading document: ', error);
    }
  }

  const uploadDocument = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      /* eslint no-use-before-define: 0 */  // --> OFF
      const files = event.target.files;
      if (!files || files.length === 0) {
        throw new Error('You must select a document to upload.');
      }

      const file: any = files[0];

      const fileExt = file.name.split('.').pop();
      const fileName = `${file.name.split('.')[0]}.${fileExt}`;
      const filePath = `${fileName}`;

      // console.log({ fileExt, fileName, filePath });


      let { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // setSelectedApartmentsDocumentUrl(fileName);
      const updatedFloors = floors.map((floor: any) => ({
        ...floor,
        apartments: floor.apartments.map((apartment: any) =>
        apartment.isSelected ?
        {
          ...apartment,
          documentUrl: fileName
        } :
        apartment
        )
      }));
      setFloors(updatedFloors);

      await updateBuilding.mutateAsync({
        buildingId,
        name: buildingName,
        sections: updatedFloors
      })

      // onUpload(file);
    } catch (error) {
      alert('Error uploading document!');
      console.log(error);
    } finally {
      setUploading(false);
    }
  }

  const handleOnFileChange = (filename: string) => {
    setSelectedFile(filename);
  }

  return (
    <div className='h-full w-full'>
      <div className='max-w-md'>
        {/* <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="file_input">Upload file</label>
        <input disabled={uploading} onChange={uploadDocument} className="mb-8 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file"></input> */}
        <input disabled={uploading} onChange={uploadDocument} type="file"></input>
      </div>
      {/* <DocumentList onFileChange={handleOnFileChange} />
      <iframe className='w-3/4 h-3/4' src={`${BASE_SUPABASE_URL}/${selectedFile}`} /> */}
    </div>
  )
}

export default DocumentUpload;