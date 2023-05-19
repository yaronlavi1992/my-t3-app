import { observer } from "mobx-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useStore } from "~/stores/building.store";
import { api } from "~/utils/api";
// import { useForm } from "react-hook-form";

const NewBuilding = observer(({ onChange }: any) => {
  const [editedIndex, setEditedIndex] = useState(-1);
  const [value, setValue]: any = useState([]);
  const router = useRouter();
  const { buildingStore } = useStore();
  const { setIsEditingBuilding, setShowModal } = buildingStore;
  const defaultApartments = [...Array.from({ length: 8 }, (_, i) => ({apartmentIndex: i, documentUrl: '', isSelected: false, type:''}))];
  const [formValues, setFormValues]: any = useState({
    name: '',
    startFloor: 0,
    endFloor: 1,
    apartmentsCount: 8,
    apartments: defaultApartments,
    description: 'offices'
  });
  const createBuilding = api.building.createBuilding.useMutation();

  useEffect(() => {
    if (value.length) {
      setEditedIndex(value.length - 1);
    }

    // return () => {}
  }, [value])



  const handleFieldChange = (fieldName: string, fieldValue: any) => {

    setFormValues({
      ...formValues,
      [fieldName]: fieldValue,
      ...(fieldName === 'apartmentsCount' ? {['apartments']: [...Array.from({ length: fieldValue }, (_, i) => ({apartmentIndex: i, documentUrl: '', isSelected: false, type:''}))]} : {})
    });

  }

  

  // console.log({...value});
  // const { register, handleSubmit, watch, formState: { errors } } = useForm();
  // const onSubmit = (data: any) => {
  //   console.log(data);
  // };


  const handleSave = async () => {
    // console.log({...value});
    const updatedValue = value.map((floorCluster: any, index: number) => index === editedIndex ? formValues : floorCluster);

    const normalizedValue: any[] = [];

    updatedValue.forEach((floorCluster: any, index: number) => {
      if (floorCluster.startFloor + 1 !== floorCluster.endFloor) {
        const { startFloor, endFloor, ...cleanedFloorCluster } = floorCluster;
        for (let i = startFloor; i < endFloor; i++) {
          normalizedValue.push(cleanedFloorCluster);
        }
      } else {
        normalizedValue.push(floorCluster);
      }
    });

    // onChange(updatedValue);
    // console.log(formValues);

    // setValue(updatedValue);
    const newBuilding = await createBuilding.mutateAsync({
      name: formValues.name,
      sections: { ...normalizedValue },
      // sections: { ...updatedValue },
    })
    setShowModal(false);
    router.push(`/${newBuilding.id}`)
  }

  const handleAddRow = () => {
    let newRow = { startFloor: 0, endFloor: 1, apartmentsCount: 8, apartments: defaultApartments, description: 'offices', name: formValues.name };
    if (value?.length > 0) {
      newRow = { startFloor: +formValues.endFloor + 1, endFloor: +formValues.endFloor + 2, apartmentsCount: 8, apartments: defaultApartments, description: 'offices', name: formValues.name };
      const updatedValue = [...value, newRow];
      updatedValue[editedIndex] = formValues;
      // console.log(updatedValue);


      setValue(updatedValue);
    } else {
      setValue([...value, newRow]);
    }
    setFormValues(newRow);
  }

  const handleDeleteRow = (rowIndex: number) => {
    setValue(value.filter((row: any, index: number) => rowIndex !== index))
    // onChange(value.filter((row: any, index: number) => rowIndex !== index));
  }

  return (
    <>
      <div className="mb-6 p-4">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Building name</label>
        <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="e.g. Toha tower" required value={formValues['name']} onChange={(e) => { handleFieldChange('name', e.target.value) }}></input>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-4">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 min-w-1/6">
                Floor Number
              </th>
              <th scope="col" className="px-6 py-3">
                Apartments per floor
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Edit/save</span>
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Delete</span>
              </th>
            </tr>
          </thead>
          <tbody className="rounded-lg">

            {value.map((floorCluster: any, index: number) => (
              editedIndex === index ?

                //   <form onSubmit={handleSubmit(onSubmit)}>
                //   {/* register your input into the hook by invoking the "register" function */}
                //   <input defaultValue="test" {...register("example")} />

                //   {/* include validation with required or other standard HTML validation rules */}
                //   <input {...register("exampleRequired", { required: true })} />
                //   {/* errors will return when field validation fails  */}
                //   {errors.exampleRequired && <span>This field is required</span>}

                //   <input type="submit" />
                // </form>

                // <form>
                <tr key={index} className="rounded-lg bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <input className="w-6 text-black" value={formValues['startFloor']} onChange={(e) => { handleFieldChange('startFloor', e.target.value) }} /> - <input className="w-6 text-black" onChange={(e) => { handleFieldChange('endFloor', e.target.value) }} value={formValues['endFloor']} />
                  </th>
                  <td className="px-6 py-4">
                    <input className="w-20 text-black" value={formValues['apartmentsCount']} onChange={(e) => { handleFieldChange('apartmentsCount', e.target.value) }} />
                  </td>
                  <td className="px-6 py-4">
                    <input className="w-20 text-black" value={formValues['description']} onChange={(e) => { handleFieldChange('description', e.target.value) }} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a href="#" onClick={handleSave} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Save</a>
                  </td>
                  <td className="px-6 py-4 text-right"></td>
                </tr>
                // </form>
                // <tr>{errors.exampleRequired && <span>This field is required</span>}</tr>

                :

                <tr key={index} className="rounded-lg bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {floorCluster.startFloor} - {floorCluster.endFloor}
                  </th>
                  <td className="px-6 py-4">
                    {floorCluster.apartmentsCount}
                  </td>
                  <td className="px-6 py-4">
                    {floorCluster.description}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a href="#" onClick={() => { setEditedIndex(index); setFormValues(value[index]); }} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a href="#" onClick={() => { handleDeleteRow(index); }} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</a>
                  </td>
                </tr>

            ))}

          </tbody>
          <tfoot>
            <tr>
              <td>
                <button onClick={handleAddRow} type="button" className="py-2.5 px-5 m-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                  <div className='flex justify-center items-center gap-1'>
                    <svg className='w-4 h-4' fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
                    </svg>
                    <div>Add</div>
                  </div>
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  )
})

export default NewBuilding