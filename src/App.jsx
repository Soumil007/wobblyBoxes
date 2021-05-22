import React,{useRef, useState} from "react";
import {Canvas,useFrame} from "@react-three/fiber";
import {softShadows,MeshWobbleMaterial,OrbitControls} from "@react-three/drei";
import {useSpring,a} from "@react-spring/three";
import "./App.css";

softShadows();

//Always make a new component to use useFrame, because it calls useFrame infinite times causing an infinite loop
const SpinningBox = ({position ,args, color, speed}) =>{
  // const [active,setActive] = useState(false);
  const [hovered,setHovered] = useState(false);
  const [expand,setExpand] = useState(false);
  const props = useSpring({
    // only use properties mesh have
    scale: expand?[1.3,1.3,1.3]:[1,1,1],
  })
  const mesh = useRef(null);
  useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01));
  return(
    // enclose mesh with a.mesh for animation
    <a.mesh 
    ref={mesh}
    position={position} 
    castShadow
    onPointerOver={()=>setHovered(true)}
    onPointerOut={()=>setHovered(false)}
    onClick={()=>setExpand(!expand)}
    scale={props.scale}
    >
      <boxBufferGeometry attach='geometry' args={args} />
      <MeshWobbleMaterial attach='material' color={!hovered?color:"lightpurple"} speed={speed} factor={0.6}/>
    </a.mesh>
  );
};


function App() {
  
  return (
    <>
      {/* Will set Camera position and field of view(fov) */}
      <Canvas 
        shadows
        colorManagement 
        camera={{ position: [-5,2,10], fov:60}}
      >

        {/* Gives a global lighting to all the objects around */}
        <ambientLight intensity={0.3} />
        {/* directionalLight */}
        <directionalLight
          castShadow
          position={[0,10,0]}
          intensity={1.5}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}

        />

        {/* point light from leftside */}
        <pointLight position={[-10,0,-20]} intensity={0.5}/>
        {/* point light from bottomside */}
        <pointLight position={[0,-10,0]} intensity={1}/>
        <group>
          <mesh  
          receiveShadow
          rotation={[-Math.PI/2,0,0]} 
          position={[0,-3,0]}>
            <planeBufferGeometry attach='geometry' args={[100,100]} />
            <shadowMaterial attach='material'opacity={0.3}/>
          </mesh>
          <SpinningBox position={[0,1,0]} args = {[3,2,1]} color="lightblue" speed={2}/>
          <SpinningBox position={[-2,1,-5]} color="pink" speed={6}/>
          <SpinningBox position={[5,1,-2]} color="pink" speed={6}/>
        </group>
        
        <OrbitControls />
      </Canvas>
    </>
  );
}

export default App;
