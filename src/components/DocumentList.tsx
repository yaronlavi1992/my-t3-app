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
    // console.log(data);

    setLoading(false);
  }

  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No documents</p>

  return (
    <div>
      {data?.map((obj: any) => (<div onClick={()=>{onFileChange && onFileChange(obj.name)}} key={obj.id}>{obj.name}</div>))}
    </div>
  )
}