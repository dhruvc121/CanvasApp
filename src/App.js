import React,{useRef,useState,useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button,ButtonGroup,ToggleButton} from 'react-bootstrap';
import './App.css'


function App() {
  const canvasRef=useRef(null)
  const contextRef=useRef(null)
  const [drag,setDrag]=useState(false)				//reponsible to handle mouseup/down event
  const [dragStart,setDragStart]=useState({x:0,y:0})//store start position of drag event
  const [snapshot,setSnapshot]=useState()			//stores the canvas data
  const [checked, setChecked] = useState(false);	
  const [radioValue, setRadioValue] = useState('1');

  const radios = [
    { name: 'Free', value: '1' },
    { name: 'Line', value: '2' },
    { name: 'Circle', value: '3' },
    { name: 'Rectangle', value: '4' },
  ]; 
 
//to load canvas on initailization
  useEffect(()=>{
		setCanvas()
	  },[])
	  
//function to set/initailize empty canvas	  
  const setCanvas=()=>{
	  //setting canvas 
		const canvas=canvasRef.current;
		canvas.height=window.innerHeight * 2;
		canvas.width=window.innerWidth * 2;
		canvas.style.height=`${window.innerHeight}px`;
		canvas.style.width=`${window.innerWidth}px`;
		
	  //setting context	
		const context=canvas.getContext("2d")
		context.scale(2,2)
		context.lineCap="round"
		context.strokeStyle="black"
		context.lineWidth=5
		contextRef.current=context;
	  }
	  
//function to start draw. invoked on mouseDown event
  const startToDraw=({nativeEvent})=>{
			const {offsetX,offsetY}=nativeEvent;
			setDrag(true)
			setDragStart({x:offsetX,y:offsetY})
			takeSnapshot()
	  }

//function to store the canvas. Used to store start value(coordinates) for shapes
  const takeSnapshot=()=>{
			const canvas=document.getElementById("canvas")
			const snapshot=contextRef.current.getImageData(0,0,canvas.width,canvas.height)
			setSnapshot(snapshot)
	  }

//function to restore canvas.
  const restoreSnapshot=()=>{
			contextRef.current.putImageData(snapshot,0,0)
	  }
	  
//function to handle free hand drwaing
  const drawFree=(position)=>{
			contextRef.current.lineTo(position.x,position.y)
			contextRef.current.stroke()
	  }

//function to handle drawing lines
  const drawLine=(position)=>{
			contextRef.current.beginPath();
			contextRef.current.moveTo(dragStart.x,dragStart.y)
			contextRef.current.lineTo(position.x,position.y)
			contextRef.current.stroke()
	  }
	  
//function to handle drawing circle
  const drawCircle=(position)=>{
			let radius = Math.sqrt(Math.pow((dragStart.x-position.x),2)+Math.pow((dragStart.y-position.y),2))
			contextRef.current.beginPath()
			contextRef.current.arc(dragStart.x,dragStart.y,radius,0,2*Math.PI,false)
			contextRef.current.stroke()
	  }

//function to handle drawing rectangles
  const drawRectangle=(position,)=>{
			contextRef.current.beginPath()
			let width=position.x-dragStart.x
			let height=position.y-dragStart.y
			contextRef.current.rect(dragStart.x,dragStart.y,width,height)
			contextRef.current.stroke()
	  }

//function to call respective shape drawing functions
  const drawShape=(position,radioValue)=>{
				if(radioValue==='1'){
					drawFree(position);
				}else if(radioValue==='2'){
					drawLine(position)
					}else if(radioValue==='3'){
						drawCircle(position)
						}else if(radioValue==='4'){
							drawRectangle(position)
							}
	}

//function to continue to draw. invoked on mouse move event.
  const draw=({nativeEvent})=>{
			const {offsetX,offsetY}=nativeEvent;
			if(drag){
					restoreSnapshot()
					let position={x:offsetX,y:offsetY}
					drawShape(position,radioValue)
				}
	  }

//function to stop draw. invoked on mouse up event.
  const stopDraw=()=>{
			contextRef.current.closePath()
			setDrag(false)
	  }

//function to reset canvas
  const reset=()=>{
		setCanvas()
	  }
	  
//function to save the canvas as high-resolution png file.  
  const save=()=>{
	    window.alert("Image will be downloaded shortly.")
		const canvas=document.getElementById("canvas")
		const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
		window.location.href=image;
	  }
  return (
    <>
    <center><h1>Canvas App</h1></center>
    <div className="canvas">
	<canvas id="canvas"
	onMouseDown={startToDraw}
	onMouseUp={stopDraw}
	onMouseMove={draw}
	on
	ref={canvasRef}
	/>
	</div>
	<div className="menu">
	<Button className="float-left" onClick={reset}>Reset</Button>
	 <ButtonGroup>
        {radios.map((radio, idx) => (
          <ToggleButton
            key={idx}
            id={`radio-${idx}`}
            type="radio"
            variant="primary"
            name="radio"
            value={radio.value}
            checked={radioValue === radio.value}
            onChange={(e) => setRadioValue(e.currentTarget.value)}
          >
            {radio.name}
          </ToggleButton>
        ))}
      </ButtonGroup>
      <Button className="float-right" onClick={save}>Save</Button>
	</div>
    </>
  );
}

export default App;
