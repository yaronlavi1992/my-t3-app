import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { NextPage } from 'next';
import * as THREE from 'three';

import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import Floor from '~/components/Floor';

const sizeMap: any = {
  3: Math.PI / 2,
  6: Math.PI,
  9: Math.PI * 1.5,
  12: Math.PI * 2
}

function Cylinder() {
  const meshRef: any = useRef();
  const { scene } = useThree();
  const cylinderSize = 3;

  useEffect(() => {
    const geometry = new THREE.CylinderGeometry(5,5,5, cylinderSize * 3, 1, false, 0, sizeMap[cylinderSize * 3]);
    const material = new THREE.MeshBasicMaterial({ color: 0x0000ff, 
      wireframe: true
     });
    const cylinder = new THREE.Mesh(geometry, material);
    meshRef.current = cylinder;
    scene.add(meshRef.current);

    return () => {
      scene.remove(meshRef.current);
    };
  }, [scene]);

  return null;
}

const Test2: NextPage = () => {

  return (
    <>
      <Canvas
            shadows
            className='w-screen h-screen bg-black'
            camera={{
              position: [-26, 17, 25],
            }}
      >
        
        <ambientLight color='white' intensity={0.2} />
        {/* <ambientLight color='white' intensity={0.5}/>
        <Cylinder geometry={new THREE.CylinderGeometry(10,10,15, 8, 1, false, 0, Math.PI / 2)} 
        // material-wireframe={true}
         args={[10, 10, 20, 32]} material-color="red" /> args = [radiusTop, radiusBottom, height, radialSegments] */}
         <Cylinder />
      <Floor position={[0, -3, 0]} />

        <OrbitControls />

      </Canvas>
    </>
  );
}

export default Test2;
