import React, { useRef, useState, useEffect } from 'react';
import { Canvas, extend, useThree, useFrame } from 'react-three-fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

extend({ OrbitControls });

function Mode() {
  const meshRef = useRef();
  const [highlightedSurfaces, setHighlightedSurfaces] = useState([]);
  const [isDragging, setDragging] = useState(false);

  const Controls = () => {
    const controls = useRef();
    const { camera, gl } = useThree();
    useFrame(() => controls.current.update());
    return <orbitControls ref={controls} args={[camera, gl.domElement]} />;
  };

  const handleMouseDown = (event) => {
    const intersection = event.intersections[0];
    if (intersection) {
      const { object } = intersection;
      setDragging(true);
      setHighlightedSurfaces((prevSurfaces) => {
        const { width, height, depth } = object.geometry.parameters;
        return [...prevSurfaces, { object, width, height, depth }];
      });
    }
  };
  
  const handleMouseMove = (event) => {
    if (isDragging) {
      const intersection = event.intersections[0];
      if (intersection) {
        const { object } = intersection;
        const currentSurfaceIndex = highlightedSurfaces.length - 1;
        if (object !== highlightedSurfaces[currentSurfaceIndex].object) {
          setHighlightedSurfaces((prevSurfaces) => {
            const updatedSurfaces = [...prevSurfaces];
            updatedSurfaces[currentSurfaceIndex].object = object;
            return updatedSurfaces;
          });
        }
      }
    }
  };
  
  
  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.code) {
        case 'ArrowUp':
          meshRef.current.rotation.x -= 0.1;
          break;
        case 'ArrowDown':
          meshRef.current.rotation.x += 0.1;
          break;
        case 'ArrowLeft':
          meshRef.current.rotation.y -= 0.1;
          break;
        case 'ArrowRight':
          meshRef.current.rotation.y += 0.1;
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div>
      <Canvas>
        <mesh
          ref={meshRef}
          onPointerDown={handleMouseDown}
          onPointerMove={handleMouseMove}
          onPointerUp={handleMouseUp}
        >
          <Controls />
          <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
          <meshBasicMaterial attach="material" color="white" />
        </mesh>
        {highlightedSurfaces.map((surface, index) => {
  const { object, width, height, depth } = surface;
  return (
    <mesh key={index} position={object.position}>
      <boxBufferGeometry attach="geometry" args={[width, height, depth]} />
      <meshBasicMaterial attach="material" color="yellow" transparent opacity={0.5} />
    </mesh>
  );
})}
      </Canvas>
    </div>
  );
}

export default Mode;
