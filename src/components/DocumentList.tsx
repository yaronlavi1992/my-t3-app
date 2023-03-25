import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';

export const DocumentList = (props: any) => {
  const { onFileChange } = props;
  const supabase = useSupabaseClient();
  const [data, setData] = useState<any>();
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    fetchDocuments();
  }, [])

  const fetchDocuments = async () => {
    setLoading(true)
    const { data, error }: any = await supabase
      .storage
      .from('documents')
      .list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      })
    setData(data);
    onFileChange && onFileChange(data[0].name);
    // console.log(data);

    setLoading(false);
  }

  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No documents</p>

  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-900">Select an option</label>
      <select id="documents" defaultValue={data[0].name} onChange={(e) => { onFileChange && onFileChange(e.target.value) }}
        className="mb-8 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 max-w-md">
        {data?.map((obj: any, index: number) => (<option value={obj.name} key={obj.id}>{obj.name}</option>))}
      </select>

    </div>
  )
}