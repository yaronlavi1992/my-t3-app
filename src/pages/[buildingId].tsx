import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { observer } from 'mobx-react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import * as THREE from 'three';
import DocumentUpload, { BASE_SUPABASE_URL } from '~/components/DocumentUpload';
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
        {Object.keys?.(selectedApartments)?.map((floorIndex: string, index: number) => {
          const { description: floorDescription } = floors[floorIndex];
          return (
            <div key={index} className='flex gap-2 p-2'>
              <div className='flex items-center text-blue-300'>floor {floorIndex}</div>
              <div className='text-white p-8 flex gap-2'>
                {floorDescription}
                {Object.keys(selectedApartments[floorIndex]).map((apartmentIndex: string, index: number) => {
                  const { documentUrl } = floors[floorIndex].apartments[apartmentIndex];
                  return (
                    <div className='flex gap-1 items-center' key={index}>{apartmentIndex}{documentUrl !== '' ?
                      <Link href={`${BASE_SUPABASE_URL}/${documentUrl}`} target={'_blank'}>
                        <svg className='w-4 h-4' fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"></path>
                        </svg>
                      </Link>
                      : <DocumentUpload buildingId={buildingSections.data?.id} buildingName={buildingSections.data?.name} >
                        <svg className='w-4 h-4' fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"></path>
                        </svg>
                      </DocumentUpload>},</div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </StaticModal>

      {Object.keys(selectedApartments).length > 0 ? <StaticModal position={'bottom-6 left-80'}>
        <button onClick={clearSelection} type="button" className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">Clear selection</button>
      </StaticModal> : null}


    </>
  );
})

// const FloorCluster = ({ startFloor, endFloor, apartments, floorHeight, buildingRowIndex }: any) => {
//   const floorsCount = endFloor - startFloor;

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
  // const cylinderArgs: any = [
  //   5, // radiusTop
  //   5, // radiusBottm
  //   floorHeight, // height
  //   1, // radialSegments
  //   1, // heightSegments
  //   false, // openEnded
  //   segmentWidth * apartmentIndex, // thetaStart
  //   segmentWidth // 2*Math.PI, // thetaLength
  // ]
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
