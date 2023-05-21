import React, { useRef, useState } from 'react';
import {Canvas,extend,useThree,useFrame} from 'react-three-fiber'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'


extend({OrbitControls})

function Mode() {
    const meshRef = useRef();
    const [isHighlighted, setHighlighted] = useState(false);


    const Controls = () => {
        const controls = useRef()
        const {camera,gl} = useThree()
        useFrame(() => controls.current.update());
        return (
            <orbitControls autoRotate args={[camera,gl.domElement]}></orbitControls>
        )

    }
    const handleMouseEnter = () => {
        setHighlighted(true);
      };
    
      const handleMouseLeave = () => {
        setHighlighted(false);
      };

  return (
    <div>
        <Canvas>
            <mesh
                      ref={meshRef}
                      onPointerEnter={handleMouseEnter}
                      onPointerLeave={handleMouseLeave}
            >
                <Controls />
                <boxBufferGeometry attach="geometry" args ={[1,1,1]}></boxBufferGeometry>
                <meshBasicMaterial  wireframe={isHighlighted} // Toggle wireframe based on highlighting state
                 attach= "material" color={isHighlighted ? 'yellow' : 'white'}></meshBasicMaterial>
            </mesh>
        </Canvas>
    </div>
  )
}

export default Mode