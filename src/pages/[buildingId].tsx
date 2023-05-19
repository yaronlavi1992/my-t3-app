import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { observer } from 'mobx-react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import * as THREE from 'three';
import Ground from '~/components/Ground';
import StaticModal from '~/components/StaticModal';
import Table from '~/components/Table';
import { Toast } from '~/components/Toast';
import { useStore } from '~/stores/building.store';
import { api } from '~/utils/api';

const Test2: NextPage = observer(() => {
  const { buildingStore } = useStore();

  const {
    floors,
    isEditingBuilding,
    selectedApartments,
    setFloors,
    setIsEditingBuilding,
    clearSelection
  } = buildingStore;

  const router = useRouter();
  const { buildingId } = router.query;
  const buildingSections = api.building.getUserBuildingById.useQuery({
    buildingId: buildingId as string
  }, {
    enabled: !!buildingId
  }
  )

  useEffect(() => {
    if (buildingSections.data?.sections) {
      const { sections } = buildingSections.data;
      const normalizedSections = Object.values(sections);
      setFloors(normalizedSections);
    }
  }, [buildingSections.data, setFloors]);

  if (!buildingSections.data?.sections) {
    return <>Something went wrong...</>;
  }

  return (
    <>
      {/* <Toast text={'hey'} /> */}

      <Canvas
        shadows
        className='w-screen h-screen bg-blue-200'
        camera={{
          position: [-26, 17, 25],
        }}
      >

        <ambientLight color='white' intensity={0.2} />


        {/* {normalizedSections.map?.((br: any, buildingRowIndex: number) => (
          <FloorCluster startFloor={br.startFloor} endFloor={br.endFloor} apartments={br.apartments} floorHeight={5} buildingRowIndex={buildingRowIndex} />
        ))} */}
        {floors.map((section: any, i: number) => {
          const floorHeight = 5;
          return (
            <Floor
              key={i}
              index={i}
              position={[0, i > 0 ? i * floorHeight : 0 * floorHeight, 0]}
              apartments={section.apartments}
              floorHeight={floorHeight}
            />
          )
        })}


        {/* <lineSegments args={[edges, new THREE.LineBasicMaterial({ color: '#000' })]} /> */}
        <Ground position={[0, -3, 0]} />
        <pointLight color={'#fff'} intensity={1} distance={100} position={[0, 10, 0]} />

        <OrbitControls target={[0, 20, 0]} />
      </Canvas>

      {/* Edit table for building */}
      <StaticModal position={'top-20 left-80'}>
        {!isEditingBuilding ?
          <button onClick={() => { setIsEditingBuilding(true) }} type="button" className={`text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500`}>
            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            <span className="sr-only">Icon description</span>
          </button>
          :
          <Table value={floors} onChange={(rows: any) => { setFloors(rows) }} setIsEditingBuilding={setIsEditingBuilding} />}
      </StaticModal>

      <StaticModal position={'bottom-20 left-80'}>
        {Object.keys?.(selectedApartments)?.map((floorIndex: string, index: number) => (
          <div key={index} className='flex gap-2 p-2'>
            <div className='flex items-center text-blue-300'>floor {floorIndex}</div>
            <div className='text-white p-8 flex gap-2'>
              apartments
              {Object.keys(selectedApartments[floorIndex]).map((apartmentIndex: string, index: number) => (
                <div key={index}>{`${apartmentIndex},`}</div>
              ))}
            </div>
          </div>
        ))}
      </StaticModal>

      {Object.keys(selectedApartments).length > 0 ? <StaticModal position={'bottom-6 left-80'}>
        <button onClick={clearSelection} type="button" className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">Clear selection</button>
      </StaticModal> : null}


    </>
  );
})

// const FloorCluster = ({ startFloor, endFloor, apartments, floorHeight, buildingRowIndex }: any) => {
//   const floorsCount = endFloor - startFloor;

//   return (
//     <>
//       {Array.from({ length: floorsCount }, (_, i) => (
//         <>
//           <Floor
//             key={i}
//             index={i}
//             position={[0, i > 0 ? (i + startFloor - buildingRowIndex) * floorHeight : 0 + (startFloor - buildingRowIndex) * floorHeight, 0]}
//             apartments={apartments}
//             floorHeight={floorHeight}
//           />
//         </>
//       ))}
//     </>
//   )
// }

const Floor = ({ apartments, index: floorIndex, floorHeight, ...rest }: any) => {

  return (
    <>
      {Array.from({ length: apartments.length }, (_, j) => (
        <Apartment
          key={j}
          index={j}
          apartments={apartments}
          floorHeight={floorHeight}
          floorIndex={floorIndex}
          {...rest}
        />
      ))}
    </>
  )
}

const Apartment = observer(({ apartments, index: apartmentIndex, floorHeight, floorIndex, ...rest }: any) => {
  const { buildingStore } = useStore();
  const { floors, setFloors } = buildingStore;
  // const { selectedParts, setSelectedParts } = buildingStore;
  const relevantApartment = floors[floorIndex].apartments[apartmentIndex];

  const segmentWidth = 2 * Math.PI / apartments.length;
  const cylinderArgs: any = [5, 5, floorHeight, 1, 1, false, segmentWidth * apartmentIndex, segmentWidth]
  const geometry = new THREE.CylinderGeometry(...cylinderArgs);
  const edges = new THREE.EdgesGeometry(geometry);

  // const aa = new THREE.CylinderGeometry(1,1,1,1,1,false,)

  const handleApartmentClick = () => {
    const updatedFloors = [...floors];
    const updatedApartment = updatedFloors[floorIndex].apartments[apartmentIndex];
    updatedApartment.isSelected = !updatedApartment.isSelected;
    setFloors(updatedFloors);
  };

  return (
    <>
      <mesh
        {...rest}
        onClick={(e) => { e.stopPropagation(); handleApartmentClick(); }}>
        <cylinderGeometry args={cylinderArgs} />
        <meshPhongMaterial color={relevantApartment.isSelected ? '#FF7F7F' : '#90EE90'} />
        <lineSegments args={[edges, new THREE.LineBasicMaterial({ color: '#000' })]} />
      </mesh>
    </>
  )
})

export default Test2;
