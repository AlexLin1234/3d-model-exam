import {useRef} from "react";
export function useOnDraw() {
    const canvasRef = useRef(null)
    function setCanvasRef(ref){
        if (!ref) return;
        canvasRef.current = ref;
        initMouseMoseListener();

    }
    function initMouseMoseListener(){
        const mouseMoveListener = (e) => {
            console.log({x: e.clientX, y: e.clientY})


        }
        window.addEventListener("mousemove", mouseMoveListener);

    }
    return setCanvasRef;


}