import React, { useRef, useState, useEffect } from 'react';
import { extend, useThree } from 'react-three-fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

extend({ OrbitControls });

function Mode() {
  const meshRef = useRef();
  const [highlightedSurface, setHighlightedSurface] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const startX = useRef(null);
  const startY = useRef(null);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);

  const canvasOffSetX = useRef(null);
  const canvasOffSetY = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 500;
    canvas.height = 500;

    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 5;
    contextRef.current = context;

    const canvasOffSet = canvas.getBoundingClientRect();
    canvasOffSetX.current = canvasOffSet.top;
    canvasOffSetY.current = canvasOffSet.left;
}, []);


  const Controls = () => {
    const controls = useRef();
    const { camera, gl } = useThree();
    return <orbitControls ref={controls} args={[camera, gl.domElement]} />;
  };

  const handleMouseDown = (nativeEvent) => {
    startX.current = nativeEvent.clientX - canvasOffSetX.current;
    startY.current = nativeEvent.clientY - canvasOffSetY.current;
  };
  const handleMouseMove = (nativeEvent) => {
    if (!isDrawing) {
      return;
  }

  nativeEvent.preventDefault();
  nativeEvent.stopPropagation();

  const newMouseX = nativeEvent.clientX - canvasOffSetX.current;
  const newMouseY = nativeEvent.clientY - canvasOffSetY.current;

  const rectWidht = newMouseX - startX.current;
  const rectHeight = newMouseY - startY.current;

  contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

  contextRef.current.strokeRect(startX.current, startY.current, rectWidht, rectHeight);
  };
  const handleMouseUp = (nativeEvent) => {

    setIsDrawing(false);

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
      <canvas className="canvas-container-rect"

                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}>
          <mesh ref={meshRef} onClick={handleMouseDown} >
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
        </canvas>
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