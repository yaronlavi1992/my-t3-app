import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { observer } from 'mobx-react';
import { NextPage } from 'next';
import { useState } from 'react';
import * as THREE from 'three';
import Ground from '~/components/Ground';
import StaticModal from '~/components/StaticModal';
import Table from '~/components/Table';
import { Toast } from '~/components/Toast';
import { useStore } from '~/stores/stores';

const Test2: NextPage = observer(() => {
  const { buildingStore } = useStore();
  const { floorClusters, isEditingBuilding, selectedParts,
    setFloorClusters, setIsEditingBuilding, clearSelection } = buildingStore;
    

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
        {/* {Array.from({ length: 12 }, (_, i) => (
          <Cylinder
            key={i}
            index={i}
            position={[0, 0, 0]}
            segments={12}
          />
        ))} */}
        {floorClusters.map?.((br: any, buildingRowIndex: number) => (
          <FloorCluster startFloor={br.startFloor} endFloor={br.endFloor} apartments={br.apartments} floorHeight={5} buildingRowIndex={buildingRowIndex} />
        ))}
        {/* {Array.from({ length: 6 }, (_, i) => (
          <Cylinder
            key={i}
            index={i}
            position={[0, 5, 0]}
            segments={6}
          />
        ))} */}
        {/* <lineSegments args={[edges, new THREE.LineBasicMaterial({ color: '#000' })]} /> */}
        <Ground position={[0, -3, 0]} />
        <pointLight color={'#fff'} intensity={1} distance={100} position={[0, 10, 0]} />

        <OrbitControls />
      </Canvas>
      <StaticModal>
        {!isEditingBuilding ?
          <button onClick={() => { setIsEditingBuilding(true) }} type="button" className={`text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500`}>
            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            <span className="sr-only">Icon description</span>
          </button>
          :
          <Table value={floorClusters} onChange={(rows: any) => { setFloorClusters(rows) }} setIsEditingBuilding={setIsEditingBuilding} />}
      </StaticModal>
      <StaticModal position={'bottom-20 left-80'}>
        {Object.keys?.(selectedParts)?.map((part: any, index: number) => (
          <div key={index} className='flex gap-4 p-2'>
            <div className='flex items-center text-blue-300'>floor {part}</div>
            <div key={index} className='text-white p-8'>apartments {selectedParts[part].map((apartment: any) => `${apartment},`)}</div>
          </div>
        ))}
      </StaticModal>
      {Object.keys(selectedParts).length > 0 ? <StaticModal position={'bottom-6 left-80'}>
        <button onClick={clearSelection} type="button" className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">Clear selection</button>
      </StaticModal> : null}


    </>
  );
})

const FloorCluster = ({ startFloor, endFloor, apartments, floorHeight, buildingRowIndex }: any) => {
  const floorsCount = endFloor - startFloor;

  return (
    <>
      {Array.from({ length: floorsCount }, (_, i) => (
        <>
          <Floor
            key={i}
            index={i}
            position={[0, i > 0 ? (i + startFloor - buildingRowIndex) * floorHeight : 0 + (startFloor - buildingRowIndex) * floorHeight, 0]}
            apartments={apartments}
            floorHeight={floorHeight}
          />
        </>
      ))}
    </>
  )
}

const Floor = ({ apartments, index: floorIndex, floorHeight, ...rest }: any) => {

  return (
    <>
      {Array.from({ length: apartments }, (_, j) => (
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
  const { selectedParts, setSelectedParts } = buildingStore;

  const segmentWidth = 2 * Math.PI / apartments;
  const cylinderArgs: any = [5, 5, floorHeight, 1, 1, false, segmentWidth * apartmentIndex, segmentWidth]
  const geometry = new THREE.CylinderGeometry(...cylinderArgs);
  const edges = new THREE.EdgesGeometry(geometry);
  const [clicked, setClicked] = useState(false);

  // const aa = new THREE.CylinderGeometry(1,1,1,1,1,false,)

  const handlePartClick = (floorIndex: number, partIndex: number) => {
    const floorSelectedParts = selectedParts[floorIndex] || [];
    const newFloorSelectedParts = floorSelectedParts.includes(partIndex)
      ? floorSelectedParts.filter((index: number) => index !== partIndex)
      : [...floorSelectedParts, partIndex];

    if (newFloorSelectedParts.length === 0) {
      const newSelectedParts = { ...selectedParts };
      delete newSelectedParts[floorIndex];
      return setSelectedParts(newSelectedParts);
    }

    setSelectedParts({ ...selectedParts, [floorIndex]: newFloorSelectedParts });
  };

  return (
    <>
      <mesh
        {...rest}
        onClick={(e) => { e.stopPropagation(); setClicked(!clicked); handlePartClick(floorIndex, apartmentIndex) }}>
        <cylinderGeometry args={cylinderArgs} />
        <meshPhongMaterial color={clicked ? '#FF7F7F' : '#90EE90'} />
        <lineSegments args={[edges, new THREE.LineBasicMaterial({ color: '#000' })]} />
      </mesh>
    </>
  )
})

export default Test2;
