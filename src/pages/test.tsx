import { Canvas } from '@react-three/fiber'
import { NextPage } from 'next'
import Box from '~/components/Box'
import Floor from '~/components/Floor'
import LightBulb from '~/components/LightBulb'
import { OrbitControls } from '@react-three/drei'

const Test: NextPage = () => {
  return (
    <Canvas
      shadows
      className='w-screen h-screen bg-black'
      camera={{
        position: [-6, 7, 7],
      }}
    >
      <ambientLight color='white' intensity={0.2}/>
      <LightBulb position={[0, 3, 0]} />
      <Box rotateX={3} rotateY={0.2} />
      <Floor position={[0, -1, 0]} />
      <OrbitControls />
    </Canvas>
  )
}

export default Test;