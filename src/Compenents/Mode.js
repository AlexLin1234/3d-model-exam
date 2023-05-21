import React, { useRef, useState } from 'react';
import { Canvas, extend, useThree } from 'react-three-fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

extend({ OrbitControls });

function Mode() {
  const meshRef = useRef();
  const [highlightedSurface, setHighlightedSurface] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const Controls = () => {
    const controls = useRef();
    const { camera, gl } = useThree();
    return <orbitControls ref={controls} args={[camera, gl.domElement]} />;
  };

  const handleMouseDown = (event) => {
    const intersection = event.intersections[0];
    if (intersection) {
      const { object } = intersection;
      setHighlightedSurface(object);
    } else {
      setHighlightedSurface(null);
    }
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = () => {
    if (comment.trim() !== '') {
      const newComment = {
        id: comments.length + 1,
        text: comment
      };
      setComments((prevComments) => [...prevComments, newComment]);
      setComment('');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <input type="text" value={comment} onChange={handleCommentChange} />
        <button onClick={handleSubmit}>Submit</button>
      </div>
      <div>
        <Canvas>
          <mesh ref={meshRef} onClick={handleMouseDown}>
            <Controls />
            <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
            <meshBasicMaterial attach="material" color="white" />
          </mesh>
          {highlightedSurface && (
            <mesh position={highlightedSurface.position}>
              <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
              <meshBasicMaterial attach="material" color="yellow" transparent opacity={0.5} />
            </mesh>
          )}
        </Canvas>
      </div>
      <div>
        <strong>Comments:</strong>
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>{comment.text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Mode;
