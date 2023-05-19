import Link from 'next/link'
import { useRouter } from 'next/router';
import React from 'react'
import { api } from '~/utils/api'

const Card = ({ content, buildingId }: any) => {
  const deleteBuilding = api.building.deleteUserBuildingById.useMutation();
  const router = useRouter();

  const handleDeleteBuilding = async () => {
    await deleteBuilding.mutateAsync({buildingId});
    router.reload();
  }

  return (
    <div className='flex items-center'>
      <Link href={`/${buildingId}`} className="flex justify-center items-center max-w-xs p-2 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{content}</h5>
        {/* <p className="font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p> */}
        <div className='ml-auto pr-4'>
        </div>

      </Link>

      <div onClick={handleDeleteBuilding} className='ml-1 flex justify-center items-center cursor-pointer max-w-xs p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'>
        <svg className='w-6' fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path stroke='red' strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path>
        </svg>
      </div>
    </div>
  )
}

export default Card