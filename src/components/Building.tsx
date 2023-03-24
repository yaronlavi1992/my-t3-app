import { useEffect, useState } from 'react'
import { Canvas, useLoader, Vector3 } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { DoubleSide } from "three";

const NUMBER_OF_APARTMENTS_PER_FLOOR = 9
const NUMBER_OF_FLOORS = 9

type Floor = {
  position: [column: number, floor: number, row: number], selected: boolean, files: [File]
}


const Building = () => {
  const [floors, setFloors] = useState<any>(() => {
    // retrieve the state from localStorage, or return a default value
    return typeof window !== "undefined" ? JSON.parse(localStorage.getItem('floors') as string) : [];
  });

  const [selectedMaterial, setSelectedMaterial] = useState('PavingStones092_1K_Color');

  useEffect(() => {
    if (!localStorage.getItem('floors') || floors.length === 0) {
      setFloors(buildFloors());
    }
    return () => {
      setFloors([]);
    }
  }, [])

  useEffect(() => {
    // save the state to localStorage whenever it changes
    localStorage.setItem('floors', JSON.stringify(floors));
  }, [floors]);

  const handleClearSelectionOnClick = () => {
    const selectClearedFloors = floors.map((floor: Floor) => ({ ...floor, selected: false }))
    setFloors(selectClearedFloors);
  }

  const handleBoxOnClick = (e: any, boxIndex: number) => {
    e.stopPropagation();
    const updatedSelectionFloors = floors.map((floor: Floor, index: number) => index === boxIndex ? { ...floor, selected: !floor.selected } : floor)
    setFloors(updatedSelectionFloors);
  }

  const handleRemoveAttachedFile = () => {
    alert('remove me')
  }

  return (
    <div className='appWrapper'>

      <div className='controls'>
        <button onClick={handleClearSelectionOnClick}>clear selection</button>

        <select value={selectedMaterial} onChange={(e) => setSelectedMaterial(e.target.value)}>
          <option value="PavingStones092_1K_Color">Facade</option>
          <option value="Bamboo001C_1K_Color">Bamboo</option>
          <option value="Bricks066_1K_Color">Bricks</option>
          <option value="Facade006_1K_Color">Diamond</option>
          <option value="WoodFloor051_1K_Color">Wood</option>
        </select>

        <div className='associatedFiles'>
          {floors?.filter((floor: Floor) => floor.selected && floor?.files[0].hasOwnProperty('name'))
            ?.map((floor: Floor) => floor.files
              ?.map((file, index) => <div className='fileRow'

                onClick={() => {
                  const url = URL.createObjectURL(new Blob([file]));
                  const link = document.createElement('a');
                  link.download = file.name;
                  link.href = url;
                  link.click();
                }}

                key={index}><div className='fileRowDetails'>{file.name}</div> <div className='removeSelectedButton' onClick={handleRemoveAttachedFile}>X</div> </div>))}
        </div>
      </div>

      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        {floors?.map((apartment: Floor, index: number) => (
          <Html key={index}>
            <Box
              position={apartment.position}
              selected={apartment.selected}
              hasFilesAttached={apartment.files[0].hasOwnProperty('name')}
              onBoxClick={(e: any) => handleBoxOnClick(e, index)}
              materialName={selectedMaterial}
            />
            {index % 8 === 0 ?
              <mesh position={apartment.position.map((pos, index) => index === 1 ? pos - 0.5 : pos + 1) as Vector3} scale={[3.05, 3.05, 3.05]} rotation={[Math.PI / 2, 0, 0]} >
                <planeBufferGeometry />
                <meshBasicMaterial color="black" side={DoubleSide} />
              </mesh> : null}
          </Html>
        ))}
        <OrbitControls />
      </Canvas>
    </div>
  )
}

function Box(props: any) {
  const { selected, hasFilesAttached, onBoxClick, materialName } = props;
  const colorMap = useLoader(TextureLoader, `${materialName}.jpg`)

  return (
    <mesh {...props} scale={1} onClick={onBoxClick}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={selected ? 'hotpink' : hasFilesAttached ? 'green' : 'grey'} map={colorMap} />
      {/* '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0') */}
    </mesh>
  )
}

function buildFloors() {
  const floors = []

  let row = 0;
  let column = 0;
  let floor = 0
  let file = {};

  for (let index = 0; index < NUMBER_OF_FLOORS * NUMBER_OF_APARTMENTS_PER_FLOOR; index++) {
    if (index % NUMBER_OF_FLOORS === 0) {
      floor++
      column = 0
      row = 0
      file = { text: 'test' }
    }
    if (index % Math.sqrt(NUMBER_OF_APARTMENTS_PER_FLOOR) === 0) {
      row++
      column = 0
    } else {
      column++
    }
    if (column === 1 && row === 2) {
      continue
    }
    floors.push({ position: [column, floor, row], selected: false, files: [file] }) // x, y, z
    file = {};
  }

  return floors
}

export default Building;