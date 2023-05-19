import { observer } from "mobx-react";
import { useState } from "react";
import { useStore } from "~/stores/building.store";
// import { useForm } from "react-hook-form";

const Table = observer(({ value, onChange }: any) => {
  const [editedIndex, setEditedIndex] = useState(-1);
  const { buildingStore } = useStore();
  const { setIsEditingBuilding } = buildingStore;
  const [formValues, setFormValues]: any = useState({
    floorNumber: 0,
    apartments: 8,
    description: 'offices'
  });

  const handleFieldChange = (fieldName: string, fieldValue: any) => {
    // console.log({fieldName, fieldValue});

    setFormValues({
      ...formValues,
      [fieldName]: fieldValue
    })
  }

  // console.log({...value});
  // const { register, handleSubmit, watch, formState: { errors } } = useForm();
  // const onSubmit = (data: any) => {
  //   console.log(data);
  //   setEditedIndex(-1);
  // };

  const handleSave = () => {
    // console.log({...value});
    const updatedValue = value.map((floorCluster: any, index: number) => index === editedIndex ? formValues : floorCluster);
    onChange(updatedValue);
    setEditedIndex(-1);
  }

  const handleAddRow = () => {
    let newRow = { startFloor: 0, endFloor: 1, apartments: 8, description: 'offices' };
    if (value?.length > 0) {
      const lastRow = value[value.length - 1];
      newRow = { startFloor: +lastRow.endFloor + 1, endFloor: +lastRow.endFloor + 2, apartments: 8, description: 'offices' };
    }
    // console.log(newRow);

    onChange([...value, newRow]);
    setEditedIndex(value.length);
    setFormValues(newRow);
  }

  const handleDeleteRow = (rowIndex: number) => {
    onChange(value.filter((row: any, index: number) => rowIndex !== index));
    setEditedIndex(-1);
  }

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Floor Number
              </th>
              <th scope="col" className="px-6 py-3">
                Apartments per floor
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
              <th scope="col" className="px-6 py-3">
                <button onClick={() => { setIsEditingBuilding?.(false) }} type="button" className={`text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500 rotate-180`}>
                  <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                  <span className="sr-only">Icon description</span>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>

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
                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <input disabled className="w-6 text-black" value={formValues['floorNumber']} onChange={(e) => { handleFieldChange('floorNumber', e.target.value) }} />
                  </th>
                  <td className="px-6 py-4">
                    <input className="w-20 text-black" value={formValues['apartments']} onChange={(e) => { handleFieldChange('apartments', e.target.value) }} />
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

                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {index}
                  </th>
                  <td className="px-6 py-4">
                    {floorCluster.apartments}
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

            {/* <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                0-4
              </th>
              <td className="px-6 py-4">
                8
              </td>
              <td className="px-6 py-4">
                residence
              </td>
              <td className="px-6 py-4 text-right">
                <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
              </td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                5-12
              </th>
              <td className="px-6 py-4">
                5
              </td>
              <td className="px-6 py-4">
                offices
              </td>
              <td className="px-6 py-4 text-right">
                <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
              </td>
            </tr> */}



          </tbody>
          <tfoot>
            <tr>
              <td>
                <button onClick={handleAddRow} type="button" className="py-2.5 px-5 m-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Add</button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  )
})

export default Table