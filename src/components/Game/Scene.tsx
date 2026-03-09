import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sky, PointerLockControls, KeyboardControls, useKeyboardControls, PerspectiveCamera, Environment, Stars, ContactShadows, Text, Float, Cloud, Sparkles } from '@react-three/drei';
import { AnimatePresence } from 'motion/react';
import * as THREE from 'three';
import { useGameStore, GameState } from '../../store';
import ShopMenu from '../UI/ShopMenu';
import GarageMenu from '../UI/GarageMenu';
import { MAIN_MISSIONS, SIDE_MISSIONS } from '../../data/missions';
import { HomeInterior, ShopInterior, CafeInterior, GarageInterior } from './Interiors';
import { Vehicle } from './Vehicles';
import { Joystick } from '../UI/Joystick';

import SoundManager from './SoundManager';

// Simple Traffic Component
function Traffic({ position, direction }: { position: [number, number, number], direction: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  const [speed] = useState(() => 2 + Math.random() * 2);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.position.x += direction[0] * speed * delta;
    ref.current.position.z += direction[2] * speed * delta;

    if (Math.abs(ref.current.position.x) > 50 || Math.abs(ref.current.position.z) > 50) {
      ref.current.position.set(position[0], position[1], position[2]);
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh castShadow>
        <boxGeometry args={[1.5, 0.8, 0.8]} />
        <meshStandardMaterial color={["#ff4444", "#4444ff", "#44ff44", "#ffff44"][Math.floor(Math.random() * 4)]} />
      </mesh>
      <mesh position={[0.4, 0.4, 0.3]}>
        <boxGeometry args={[0.2, 0.2, 0.1]} />
        <meshStandardMaterial color="white" emissive="white" />
      </mesh>
      <mesh position={[0.4, 0.4, -0.3]}>
        <boxGeometry args={[0.2, 0.2, 0.1]} />
        <meshStandardMaterial color="white" emissive="white" />
      </mesh>
    </group>
  );
}

// Weather Effects Component
function WeatherEffects() {
  const weather = useGameStore((state) => state.weather);
  const timeOfDay = useGameStore((state) => state.timeOfDay);
  const isNight = timeOfDay < 6 || timeOfDay > 18;

  return (
    <>
      {(weather === 'cloudy' || weather === 'rainy' || weather === 'stormy') && (
        <group>
          <Cloud position={[-10, 15, -10]} opacity={0.5} speed={0.2} color={isNight ? "#222" : "#888"} />
          <Cloud position={[10, 18, 10]} opacity={0.5} speed={0.2} color={isNight ? "#111" : "#777"} />
          <Cloud position={[0, 20, -20]} opacity={0.4} speed={0.1} color={isNight ? "#333" : "#999"} />
        </group>
      )}
      {(weather === 'rainy' || weather === 'stormy') && (
        <group>
          <Sparkles count={400} scale={[50, 20, 50]} size={1.5} speed={4} color="#88ccff" />
          {weather === 'stormy' && (
            <Sparkles count={50} scale={[60, 30, 60]} size={10} speed={10} color="#ffffff" opacity={0.1} />
          )}
        </group>
      )}
    </>
  );
}

// Random Street Events Component
function RandomEvents() {
  const { setMission, activeMission, addXP, addMoney, addNotification } = useGameStore();
  const [event, setEvent] = useState<{ id: string, type: 'help' | 'delivery' | 'challenge', position: [number, number, number], label: string } | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!event && !activeMission && Math.random() < 0.3) {
        const types: ('help' | 'delivery' | 'challenge')[] = ['help', 'delivery', 'challenge'];
        const type = types[Math.floor(Math.random() * types.length)];
        const pos: [number, number, number] = [(Math.random() - 0.5) * 40, 0.05, (Math.random() - 0.5) * 40];
        
        let label = "Help NPC";
        if (type === 'delivery') label = "Quick Delivery";
        if (type === 'challenge') label = "Street Challenge";

        setEvent({ id: 'event_' + Date.now(), type, position: pos, label });
        
        // Auto-remove event after 30 seconds if not interacted
        setTimeout(() => setEvent(null), 30000);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [event, activeMission]);

  if (!event) return null;

  const handleEvent = () => {
    if (event.type === 'help') {
      addMoney(50);
      addXP(100);
      addNotification({ title: 'Event Completed', message: 'You helped a neighbor!', type: 'info' });
      alert("You helped the neighbor find their lost keys! +$50, +100 XP");
    } else if (event.type === 'delivery') {
      setMission({
        id: 'quick_delivery_' + Date.now(),
        title: 'Quick Neighborhood Delivery',
        reward: 100,
        district: 'Old Neighborhood',
        type: 'delivery',
        objective: 'Deliver the groceries to the next street'
      });
    } else if (event.type === 'challenge') {
      const won = Math.random() > 0.4;
      if (won) {
        addMoney(150);
        addXP(200);
        alert("You won the street challenge! +$150, +200 XP");
      } else {
        alert("You lost the challenge. Better luck next time!");
      }
    }
    setEvent(null);
  };

  return (
    <group position={event.position}>
      <Sparkles count={20} scale={[2, 2, 2]} size={2} speed={2} color="#fbbf24" />
      <InteractionPoint position={[0, 0, 0]} label={event.label} onInteract={handleEvent} />
      <Text position={[0, 1.5, 0]} fontSize={0.3} color="#fbbf24" outlineWidth={0.02}>{event.label}</Text>
    </group>
  );
}

// Simple NPC Component
function NPC({ position, color, name, dialogue, mission, type = 'citizen' }: { position: [number, number, number], color: string, name: string, dialogue?: string[], mission?: GameState['activeMission'], type?: 'citizen' | 'merchant' | 'worker' }) {
  const ref = useRef<THREE.Group>(null);
  const [target] = useState(() => new THREE.Vector3(position[0] + (Math.random() - 0.5) * 10, 0.5, position[2] + (Math.random() - 0.5) * 10));
  const [moving, setMoving] = useState(true);
  const [showDialogue, setShowDialogue] = useState(false);
  const { reputation, setMission, activeMission, improveSkill } = useGameStore();

  useFrame((state, delta) => {
    if (!ref.current || showDialogue) return;

    // Reputation awareness: NPCs avoid player if reputation is very low
    const playerPos = state.camera.position;
    const distToPlayer = ref.current.position.distanceTo(playerPos);
    
    if (reputation < -100 && distToPlayer < 8) {
      // Run away from player
      const runDir = ref.current.position.clone().sub(playerPos).normalize();
      ref.current.position.addScaledVector(runDir, delta * 4);
      ref.current.lookAt(ref.current.position.clone().add(runDir));
      return;
    }

    // High reputation: NPCs might follow or wave (simplified as stopping to look)
    if (reputation > 500 && distToPlayer < 5) {
      ref.current.lookAt(playerPos);
      return;
    }

    if (!moving) return;

    const currentPos = ref.current.position;
    const dist = currentPos.distanceTo(target);

    if (dist < 0.1) {
      setMoving(false);
      setTimeout(() => {
        if (!showDialogue) {
          target.set(position[0] + (Math.random() - 0.5) * 20, 0.5, position[2] + (Math.random() - 0.5) * 20);
          setMoving(true);
        }
      }, 2000 + Math.random() * 5000);
      return;
    }

    const dir = target.clone().sub(currentPos).normalize();
    ref.current.position.addScaledVector(dir, delta * 1.5);
    ref.current.lookAt(target);
  });

  const handleInteract = () => {
    if (reputation < -50) {
      alert(`${name} looks at you with suspicion. "I don't talk to troublemakers."`);
      return;
    }

    setShowDialogue(true);
    
    // Reputation based dialogue
    let greeting = dialogue?.[0] || "Hello!";
    if (reputation > 200) greeting = `Honored to see you, ${name}! How can I help a local legend?`;
    if (reputation > 1000) greeting = `The great Sharqia hero! It is a privilege to speak with you.`;

    if (mission && !activeMission && reputation >= 10) {
      if (window.confirm(`${name}: ${greeting}\n\nNew Mission Available: ${mission.title}\nAccept?`)) {
        setMission(mission);
        improveSkill('trading', 10);
      }
    } else {
      alert(`${name}: ${greeting}`);
    }
    
    setTimeout(() => setShowDialogue(false), 5000);
  };

  return (
    <group ref={ref} position={position}>
      <mesh castShadow>
        <capsuleGeometry args={[0.3, 0.8, 4, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Visual variety based on type */}
      {type === 'worker' && (
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[0.4, 0.1, 0.4]} />
          <meshStandardMaterial color="yellow" />
        </mesh>
      )}
      {type === 'merchant' && (
        <mesh position={[0, 0.4, 0.3]}>
          <boxGeometry args={[0.5, 0.4, 0.1]} />
          <meshStandardMaterial color="#8b4513" />
        </mesh>
      )}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/inter/v12/UcCOjFwrHDOn4cHdUlBf4r-V.woff"
        >
          {name}
        </Text>
      </Float>
      {showDialogue && dialogue && (
        <group position={[0, 2, 0]}>
          <Text
            fontSize={0.15}
            color="white"
            maxWidth={2}
            textAlign="center"
            anchorX="center"
            anchorY="bottom"
            outlineWidth={0.01}
            outlineColor="#000"
          >
            {dialogue[Math.floor(Math.random() * dialogue.length)]}
          </Text>
        </group>
      )}
      <InteractionPoint position={[0, 0, 0.5]} label={`Talk to ${name}`} onInteract={handleInteract} distance={2} />
    </group>
  );
}

// Interaction Point Component
function InteractionPoint({ position, label, onInteract, distance = 3 }: { position: [number, number, number], label: string, onInteract: () => void, distance?: number }) {
  const [hovered, setHovered] = useState(false);
  const [, get] = useKeyboardControls();
  const { camera } = useThree();
  const setActiveInteraction = useGameStore((state) => state.setActiveInteraction);
  
  useFrame(() => {
    const playerPos = camera.position;
    const dist = playerPos.distanceTo(new THREE.Vector3(...position));
    
    if (dist < distance) {
      if (!hovered) {
        setHovered(true);
        setActiveInteraction({ label, onInteract });
      }
      if (get().interact) {
        onInteract();
      }
    } else {
      if (hovered) {
        setHovered(false);
        setActiveInteraction(null);
      }
    }
  });
  
  useEffect(() => {
    return () => setActiveInteraction(null);
  }, [setActiveInteraction]);
  
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
        <meshStandardMaterial color={hovered ? "#fbbf24" : "#f59e0b"} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// Simple Player Controller
function Player({ joystick }: { joystick: { x: number, y: number } }) {
  const [, get] = useKeyboardControls();
  const playerRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const [velocity] = useState(() => new THREE.Vector3());
  const [direction] = useState(() => new THREE.Vector3());
  const [frontVector] = useState(() => new THREE.Vector3());
  const [sideVector] = useState(() => new THREE.Vector3());
  const useEnergy = useGameStore((state) => state.useEnergy);
  const energy = useGameStore((state) => state.energy);
  const customization = useGameStore((state) => state.characterCustomization);

  useFrame((state, delta) => {
    if (!playerRef.current) return;

    const { forward, backward, left, right, jump } = get();

    // Movement
    frontVector.set(0, 0, Number(backward) - Number(forward) + joystick.y);
    sideVector.set(Number(left) - Number(right) + joystick.x, 0, 0);
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(5).applyQuaternion(playerRef.current.quaternion);
    
    velocity.x = direction.x;
    velocity.z = direction.z;

    if (jump && playerRef.current.position.y <= 0.5) {
      velocity.y = 5;
    }

    // Gravity
    if (playerRef.current.position.y > 0.5) {
      velocity.y -= 9.8 * delta;
    } else {
      velocity.y = Math.max(0, velocity.y);
      playerRef.current.position.y = 0.5;
    }

    playerRef.current.position.addScaledVector(velocity, delta);

    // Camera follow
    const idealOffset = new THREE.Vector3(0, 2, 5).applyQuaternion(playerRef.current.quaternion);
    const targetPos = playerRef.current.position.clone().add(idealOffset);
    
    camera.position.lerp(targetPos, 0.1);
    camera.lookAt(playerRef.current.position);

    // Energy drain on movement
    if ((forward || backward || left || right) && energy > 0) {
      useEnergy(0.01);
    }
  });

  return (
    <group ref={playerRef} position={[0, 0.5, 0]}>
      <mesh castShadow>
        <capsuleGeometry args={[0.4, 1, 4, 8]} />
        <meshStandardMaterial color={customization.outfit === 'default' ? "orange" : "indigo"} />
      </mesh>
      {/* Simple face indicator */}
      <mesh position={[0, 0.6, -0.3]}>
        <boxGeometry args={[0.2, 0.1, 0.1]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  );
}

// Interactive Objects
function Bench({ position, rotation = [0, 0, 0] }: { position: [number, number, number], rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[2, 0.1, 0.8]} />
        <meshStandardMaterial color="#5d4037" />
      </mesh>
      <mesh position={[0, 0.2, 0.3]} castShadow>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0, 0.2, -0.3]} castShadow>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <InteractionPoint position={[0, 0.05, 0]} label="Sit on Bench" onInteract={() => useGameStore.getState().refillEnergy()} />
    </group>
  );
}

function VendingMachine({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[0.8, 2, 0.6]} />
        <meshStandardMaterial color="#d32f2f" />
      </mesh>
      <mesh position={[0, 1.2, 0.31]}>
        <boxGeometry args={[0.6, 0.8, 0.01]} />
        <meshStandardMaterial color="lightblue" transparent opacity={0.6} />
      </mesh>
      <InteractionPoint position={[0, 0.05, 0.5]} label="Buy Drink ($10)" onInteract={() => {
        const state = useGameStore.getState();
        if (state.money >= 10) {
          state.removeMoney(10);
          state.refillEnergy();
        }
      }} />
    </group>
  );
}

function GarageBuilding({ position, onOpen }: { position: [number, number, number], onOpen: () => void }) {
  return (
    <group position={position}>
      <mesh position={[0, 3, 0]} castShadow>
        <boxGeometry args={[12, 6, 10]} />
        <meshStandardMaterial color="#444" />
      </mesh>
      <mesh position={[0, 2, 5.1]}>
        <boxGeometry args={[6, 4, 0.1]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <InteractionPoint position={[0, 0.05, 6]} label="Open Garage" onInteract={onOpen} />
      <Text
        position={[0, 6.5, 5.1]}
        fontSize={0.8}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        GARAGE
      </Text>
    </group>
  );
}

function ShopBuilding({ position, onOpen }: { position: [number, number, number], onOpen: () => void }) {
  return (
    <group position={position}>
      <mesh position={[0, 2.5, 0]} castShadow>
        <boxGeometry args={[8, 5, 6]} />
        <meshStandardMaterial color="#1e3a8a" />
      </mesh>
      <mesh position={[0, 1.5, 3.1]}>
        <boxGeometry args={[2, 3, 0.1]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <InteractionPoint position={[0, 0.05, 4]} label="Open Shop" onInteract={onOpen} />
      <Text
        position={[0, 5.5, 3.1]}
        fontSize={0.6}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        SOUQ SHOP
      </Text>
    </group>
  );
}

function PoliceStation({ position }: { position: [number, number, number] }) {
  const { setMission, activeMission } = useGameStore();
  
  const acceptPoliceMission = () => {
    if (activeMission) return alert("Finish your current mission first!");
    setMission({
      id: 'police_' + Date.now(),
      title: 'Neighborhood Patrol',
      reward: 400,
      district: 'Old Neighborhood',
      type: 'side',
      objective: 'Patrol the Old Neighborhood and report suspicious activity'
    });
    alert("Mission accepted: Patrol the Old Neighborhood.");
  };

  return (
    <group position={position}>
      <mesh position={[0, 4, 0]} castShadow>
        <boxGeometry args={[15, 8, 12]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0, 8.5, 0]}>
        <boxGeometry args={[16, 1, 13]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0, 2, 6.1]}>
        <boxGeometry args={[4, 4, 0.1]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <Text position={[0, 9.5, 6.1]} fontSize={1} color="#3b82f6">POLICE</Text>
      <Text position={[0, 8.5, 6.1]} fontSize={0.4} color="white">مركز شرطة الشرقية</Text>
      <InteractionPoint position={[0, 0.05, 7]} label="Accept Police Task" onInteract={acceptPoliceMission} />
    </group>
  );
}

function Hospital({ position }: { position: [number, number, number] }) {
  const { heal, refillEnergy, money, removeMoney } = useGameStore();
  
  const treatPlayer = () => {
    if (money < 100) return alert("You need $100 for treatment.");
    removeMoney(100);
    heal(100);
    refillEnergy(100);
    alert("Treatment successful! Health and Energy restored.");
  };

  return (
    <group position={position}>
      <mesh position={[0, 5, 0]} castShadow>
        <boxGeometry args={[20, 10, 15]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[0, 10.5, 0]}>
        <boxGeometry args={[22, 1, 17]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <mesh position={[0, 2, 7.6]}>
        <boxGeometry args={[5, 4, 0.1]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
      <Text position={[0, 11.5, 7.6]} fontSize={1.2} color="#ef4444">HOSPITAL</Text>
      <Text position={[0, 10.5, 7.6]} fontSize={0.5} color="#333">مستشفى الزقازيق العام</Text>
      <InteractionPoint position={[0, 0.05, 9]} label="Get Treatment ($100)" onInteract={treatPlayer} />
    </group>
  );
}

function ShoppingMall({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 10, 0]} castShadow>
        <boxGeometry args={[50, 20, 40]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>
      <mesh position={[0, 20.5, 0]}>
        <boxGeometry args={[52, 1, 42]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[0, 4, 20.1]}>
        <boxGeometry args={[15, 8, 0.1]} />
        <meshStandardMaterial color="lightblue" transparent opacity={0.6} />
      </mesh>
      <Text position={[0, 22, 20.1]} fontSize={2} color="#4f46e5">SHARQIA MALL</Text>
      <Text position={[0, 20, 20.1]} fontSize={0.8} color="#333">مول الشرقية التجاري</Text>
      <InteractionPoint position={[0, 0.05, 22]} label="Enter Mall" onInteract={() => alert("Mall interior coming soon!")} />
    </group>
  );
}

function StreetSign({ position, label }: { position: [number, number, number], label: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 3]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[1.2, 0.6, 0.1]} />
        <meshStandardMaterial color="#1e40af" />
      </mesh>
      <Text position={[0, 3, 0.06]} fontSize={0.15} color="white">{label}</Text>
    </group>
  );
}

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 2]} />
        <meshStandardMaterial color="#5d4037" />
      </mesh>
      <mesh position={[0, 3, 0]} castShadow>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshStandardMaterial color="#2d5a27" />
      </mesh>
    </group>
  );
}

function TrashCan({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.8, 16]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.1, 16]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
    </group>
  );
}

function TaxiStand({ position }: { position: [number, number, number] }) {
  const { setMission, activeMission } = useGameStore();
  
  const startTaxiJob = () => {
    if (activeMission) return alert("Finish your current mission first!");
    setMission({
      id: 'taxi_' + Date.now(),
      title: 'Taxi Service',
      reward: 300,
      district: 'Palm Heights',
      type: 'delivery',
      objective: 'Pick up passenger and take them to Palm Heights'
    });
    alert("Taxi job accepted! Drive to Palm Heights.");
  };

  return (
    <group position={position}>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[4, 0.2, 6]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      <Text position={[0, 2, 0]} fontSize={0.5} color="#fbbf24">TAXI STAND</Text>
      <InteractionPoint position={[0, 0.05, 0]} label="Start Taxi Job" onInteract={startTaxiJob} />
    </group>
  );
}

function MarketStall({ position, label }: { position: [number, number, number], label: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[2, 1, 1.5]} />
        <meshStandardMaterial color="#5d4037" />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[2.2, 0.1, 1.7]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <Text position={[0, 1.8, 0]} fontSize={0.2} color="white">{label}</Text>
      <InteractionPoint position={[0, 0.05, 1]} label="Buy from Vendor" onInteract={() => alert(`Welcome to ${label} stall!`)} />
    </group>
  );
}

function TransitionPoint({ position, targetDistrict, label }: { position: [number, number, number], targetDistrict: 'Old Neighborhood' | 'The Souq' | 'Industrial Zone' | 'Palm Heights', label: string }) {
  const setDistrict = useGameStore((state) => state.setDistrict);
  
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[2, 2, 0.1, 32]} />
        <meshStandardMaterial color="#4f46e5" transparent opacity={0.2} />
      </mesh>
      <InteractionPoint 
        position={[0, 0.05, 0]} 
        label={`Travel to ${label}`} 
        onInteract={() => setDistrict(targetDistrict)} 
        distance={4}
      />
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Text
          position={[0, 3, 0]}
          fontSize={0.5}
          color="#818cf8"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#000"
        >
          {label}
        </Text>
      </Float>
    </group>
  );
}

function RaceStart({ position }: { position: [number, number, number] }) {
  const { setMission, activeMission, reputation } = useGameStore();
  
  const startRace = () => {
    if (activeMission) {
      alert("Finish your current mission first!");
      return;
    }
    if (reputation < 20) {
      alert("You need at least 20 reputation to enter street races!");
      return;
    }
    
    setMission({
      id: 'race_' + Date.now(),
      title: 'Sharqia Street Race',
      reward: 500,
      district: 'Industrial Zone',
      type: 'racing',
      objective: 'Reach the finish line in the Industrial Zone'
    });
    alert("Race started! Get to the Industrial Zone as fast as you can!");
  };

  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2, 32]} />
        <meshStandardMaterial color="#ef4444" transparent opacity={0.4} />
      </mesh>
      <InteractionPoint position={[0, 0.05, 0]} label="Start Street Race" onInteract={startRace} />
      <Text position={[0, 2, 0]} fontSize={0.5} color="#ef4444">🏁 RACE START</Text>
    </group>
  );
}

function DeliveryHub({ position }: { position: [number, number, number] }) {
  const { setMission, activeMission } = useGameStore();
  
  const startDelivery = () => {
    if (activeMission) {
      alert("Finish your current mission first!");
      return;
    }
    
    setMission({
      id: 'delivery_' + Date.now(),
      title: 'Express Delivery',
      reward: 200,
      district: 'The Souq',
      type: 'delivery',
      objective: 'Deliver the package to the Souq'
    });
    alert("Delivery mission accepted! Take the package to the Souq.");
  };

  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2, 32]} />
        <meshStandardMaterial color="#3b82f6" transparent opacity={0.4} />
      </mesh>
      <InteractionPoint position={[0, 0.05, 0]} label="Accept Delivery Task" onInteract={startDelivery} />
      <Text position={[0, 2, 0]} fontSize={0.5} color="#3b82f6">📦 DELIVERY HUB</Text>
    </group>
  );
}

function FootballField({ position }: { position: [number, number, number] }) {
  const addXP = useGameStore((state) => state.addXP);
  const useEnergy = useGameStore((state) => state.useEnergy);
  
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[20, 30]} />
        <meshStandardMaterial color="#2e8b57" />
      </mesh>
      {/* Goals */}
      <mesh position={[0, 1, -14.5]}>
        <boxGeometry args={[4, 2, 0.2]} />
        <meshStandardMaterial color="white" wireframe />
      </mesh>
      <mesh position={[0, 1, 14.5]}>
        <boxGeometry args={[4, 2, 0.2]} />
        <meshStandardMaterial color="white" wireframe />
      </mesh>
      {/* Interaction */}
      <group position={[0, 0.05, 0]}>
        <InteractionPoint 
          position={[-2, 0, 0]} 
          label="Practice Football" 
          onInteract={() => {
            const state = useGameStore.getState();
            if (state.energy >= 10) {
              useEnergy(10);
              addXP(50);
              alert("Practiced football! +50 XP");
            } else {
              alert("Not enough energy!");
            }
          }} 
        />
        <InteractionPoint 
          position={[2, 0, 0]} 
          label="Football Competition" 
          onInteract={() => {
            const state = useGameStore.getState();
            if (state.energy >= 30) {
              useEnergy(30);
              const won = Math.random() > 0.5;
              if (won) {
                state.addMoney(200);
                state.addXP(150);
                alert("You won the neighborhood match! +$200, +150 XP");
              } else {
                state.addXP(50);
                alert("Tough match! You lost but gained experience. +50 XP");
              }
            } else {
              alert("Not enough energy for a full match!");
            }
          }} 
        />
      </group>
    </group>
  );
}

// Simple Neighborhood Environment
function Neighborhood() {
  const enterInterior = useGameStore((state) => state.enterInterior);

  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>

      {/* Main Streets */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[12, 400]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[400, 12]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      {/* Environmental Details */}
      {Array.from({ length: 30 }).map((_, i) => (
        <Tree key={`tree-${i}`} position={[(Math.random() - 0.5) * 300, 0, (Math.random() - 0.5) * 300]} />
      ))}
      {Array.from({ length: 20 }).map((_, i) => (
        <TrashCan key={`trash-${i}`} position={[(Math.random() - 0.5) * 200, 0, (Math.random() - 0.5) * 200]} />
      ))}
      <StreetSign position={[10, 0, 10]} label="Haret El Asatir" />
      <StreetSign position={[-10, 0, -10]} label="Sharqia Center" />

      {/* Alleys and Side Streets */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[30, 0.01, 0]}>
        <planeGeometry args={[6, 400]} />
        <meshStandardMaterial color="#282828" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-30, 0.01, 0]}>
        <planeGeometry args={[6, 400]} />
        <meshStandardMaterial color="#282828" />
      </mesh>

      {/* Coffee Shop Area - Sharqia Style */}
      <group position={[-15, 0, -15]}>
        <mesh position={[0, 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[10, 4, 8]} />
          <meshStandardMaterial color="#8b4513" />
        </mesh>
        <mesh position={[0, 4.5, 0]}>
          <boxGeometry args={[11, 1, 9]} />
          <meshStandardMaterial color="#5d2e0d" />
        </mesh>
        <Text
          position={[0, 5.2, 4.6]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          قهوة الأساطير
        </Text>
        <Text
          position={[0, 4.6, 4.6]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Legends Coffee - Sharqia
        </Text>
        {/* Outdoor Seating */}
        <Bench position={[0, 0, 6]} />
        <Bench position={[4, 0, 6]} />
        <InteractionPoint position={[0, 0.05, 4.5]} label="Enter Cafe" onInteract={() => enterInterior('cafe_1')} />
      </group>

      {/* Residential Blocks with Interiors */}
      {Array.from({ length: 8 }).map((_, i) => (
        <group key={i} position={[(i % 4 - 1.5) * 60, 0, (Math.floor(i / 4) - 0.5) * 80]}>
          <mesh position={[0, 6, 0]} castShadow>
            <boxGeometry args={[20, 12, 20]} />
            <meshStandardMaterial color={["#fca5a5", "#93c5fd", "#86efac", "#fde68a"][i % 4]} />
          </mesh>
          <mesh position={[0, 12.5, 0]}>
            <boxGeometry args={[22, 1, 22]} />
            <meshStandardMaterial color="#333" />
          </mesh>
          {/* Door to Interior */}
          <mesh position={[0, 1.5, 10.1]}>
            <boxGeometry args={[2, 3, 0.1]} />
            <meshStandardMaterial color="#5d4037" />
          </mesh>
          <InteractionPoint position={[0, 0.05, 11]} label="Enter Home" onInteract={() => enterInterior('home_' + i)} />
          
          {/* Windows */}
          {Array.from({ length: 4 }).map((_, j) => (
            <mesh key={j} position={[10.1, 3 + j * 2, (j % 2 - 0.5) * 10]}>
              <boxGeometry args={[0.1, 1.5, 2]} />
              <meshStandardMaterial color="#ffffaa" emissive="#ffffaa" emissiveIntensity={0.5} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Vehicles */}
      <Vehicle position={[10, 0, 10]} type="motorbike" id="bike_1" />
      <Vehicle position={[-10, 0, 20]} type="car" id="car_1" />
      <Vehicle position={[20, 0, -10]} type="delivery" id="truck_1" />

      {/* Parks and Open Areas */}
      <group position={[50, 0, 50]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <circleGeometry args={[20, 32]} />
          <meshStandardMaterial color="#2d5a27" />
        </mesh>
        <Bench position={[0, 0, 15]} />
        <Bench position={[0, 0, -15]} rotation={[0, Math.PI, 0]} />
      </group>

      {/* Street Lights */}
      {Array.from({ length: 20 }).map((_, i) => (
        <group key={i} position={[(i % 5 - 2) * 40, 0, (Math.floor(i / 5) - 1.5) * 50]}>
          <mesh position={[0, 2, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 4]} />
            <meshStandardMaterial color="#333" />
          </mesh>
          <mesh position={[0, 4, 0]}>
            <sphereGeometry args={[0.3]} />
            <meshStandardMaterial color="#ffffaa" emissive="#ffffaa" emissiveIntensity={2} />
          </mesh>
          <pointLight position={[0, 4, 0]} intensity={1.5} distance={15} color="#ffffaa" castShadow />
        </group>
      ))}
    </group>
  );
}

function DayNightCycle() {
  const timeOfDay = useGameStore((state) => state.timeOfDay);
  const advanceTime = useGameStore((state) => state.advanceTime);

  useFrame((state, delta) => {
    advanceTime(delta * 0.1); // Advance time slowly
  });

  const isDay = timeOfDay > 6 && timeOfDay < 18;
  const sunIntensity = isDay ? Math.sin((timeOfDay - 6) / 12 * Math.PI) : 0;

  return (
    <>
      <Sky sunPosition={[100, sunIntensity * 100, 100]} />
      <directionalLight 
        position={[100, sunIntensity * 100, 100]} 
        intensity={sunIntensity * 1.5} 
        castShadow 
        shadow-mapSize={[1024, 1024]}
      />
      <ambientLight intensity={isDay ? 0.4 : 0.1} />
      {!isDay && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />}
    </>
  );
}

// District Environments
function OldNeighborhood({ onOpenShop, onOpenGarage }: { onOpenShop: () => void, onOpenGarage: () => void }) {
  const { activeMission, completeMission, reputation } = useGameStore();
  
  return (
    <group>
      <Neighborhood />
      <NPC 
        position={[-5, 0.5, -5]} 
        color="#ff6b6b" 
        name="Ahmed" 
        dialogue={["Hey! Nice day, isn't it?", "Have you seen the new shop in the Souq?", "I'm just chilling here."]}
      />
      <NPC 
        position={[8, 0.5, 2]} 
        color="#4ecdc4" 
        name="Sara" 
        dialogue={["The weather is changing fast.", "Be careful in the Industrial Zone.", "I heard Madam Laila is looking for help."]}
      />
      <NPC 
        position={[-12, 0.5, 8]} 
        color="#ffe66d" 
        name="Omar" 
        dialogue={["Want to race? Maybe later.", "I lost my keys somewhere...", "Reputation is everything here."]}
        mission={reputation >= 50 ? { id: 'omar_race', title: 'Street Race with Omar', reward: 200, district: 'Old Neighborhood', type: 'racing', objective: 'Reach the Souq entrance in 30 seconds' } : undefined}
      />
      
      {/* Story NPC: The Elder */}
      <NPC 
        position={[10, 0.5, 10]} 
        color="#ffffff" 
        name="The Elder" 
        dialogue={["Welcome, young one.", "The neighborhood needs someone like you.", "Respect is earned, not given."]}
      />
      <InteractionPoint 
        position={[10, 0.05, 10]} 
        label="Talk to Elder" 
        onInteract={() => {
          if (activeMission?.id === 'm1') {
            completeMission();
          }
        }} 
      />

      {/* Mission 2 Target: Bakery */}
      <InteractionPoint 
        position={[-15, 0.05, 5]} 
        label="Deliver Package" 
        onInteract={() => {
          if (activeMission?.id === 'm2') {
            completeMission();
          }
        }} 
      />

      {/* Decorative & Interactive Objects */}
      <Bench position={[5, 0, 5]} />
      <Bench position={[-5, 0, 10]} rotation={[0, Math.PI / 2, 0]} />
      <VendingMachine position={[0, 0, -8]} />
      
      <PoliceStation position={[30, 0, -30]} />
      <Hospital position={[-30, 0, 30]} />
      
      <FootballField position={[0, 0, -40]} />
      <RaceStart position={[20, 0, -20]} />
      <DeliveryHub position={[-20, 0, -20]} />
      
      <TaxiStand position={[20, 0, 20]} />
      
      <InteractionPoint position={[-10, 0.05, -7]} label="Talk to Barista" onInteract={() => useGameStore.getState().setMission({ id: 'coffee_delivery', title: 'Deliver coffee to the Workshop', reward: 50, district: 'Old Neighborhood', type: 'side', objective: 'Deliver coffee to the Workshop' })} />
      <InteractionPoint position={[-15, 0.05, 14]} label="Repair Station" onInteract={() => {
        const mission = useGameStore.getState().activeMission;
        if (mission?.id === 'coffee_delivery') {
          completeMission();
        }
      }} />

      {/* Transition Points */}
      <TransitionPoint position={[0, 0.05, 45]} targetDistrict="The Souq" label="The Souq" />
      <TransitionPoint position={[45, 0.05, 0]} targetDistrict="Industrial Zone" label="Industrial Zone" />
    </group>
  );
}

function TheSouq({ onOpenShop }: { onOpenShop: () => void }) {
  const { activeMission, completeMission, reputation, enterInterior } = useGameStore();
  
  return (
    <group>
      {/* Souq Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#d2b48c" />
      </mesh>
      
      {/* Arabic Sign for Souq */}
      <group position={[0, 8, -50]}>
        <mesh>
          <boxGeometry args={[15, 4, 0.5]} />
          <meshStandardMaterial color="#8b4513" />
        </mesh>
        <Text
          position={[0, 0, 0.3]}
          fontSize={1.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          سوق الشرقية الكبير
        </Text>
        <Text
          position={[0, -1.2, 0.3]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Grand Sharqia Souq
        </Text>
      </group>

      {/* Stalls */}
      {Array.from({ length: 12 }).map((_, i) => (
        <group key={i} position={[(i % 4 - 1.5) * 15, 0, (Math.floor(i / 4) - 1.5) * 20]}>
          <mesh position={[0, 1.5, 0]} castShadow>
            <boxGeometry args={[6, 3, 6]} />
            <meshStandardMaterial color={["#a52a2a", "#8b4513", "#d2691e", "#5d4037"][i % 4]} />
          </mesh>
          <mesh position={[0, 3.1, 0]}>
            <boxGeometry args={[7, 0.2, 7]} />
            <meshStandardMaterial color="white" />
          </mesh>
          <InteractionPoint position={[0, 0, 3.5]} label="Browse Stall" onInteract={() => alert("You found some exotic spices from Sharqia!")} />
        </group>
      ))}
      <NPC 
        position={[5, 0.5, 5]} 
        color="#ff00ff" 
        name="Uncle Hassan" 
        type="merchant"
        dialogue={["Best prices in Sharqia!", "Don't listen to Merchant Ali, his goods are fake.", "Reputation matters if you want a discount."]}
      />
      <NPC 
        position={[-5, 0.5, -5]} 
        color="#00ff00" 
        name="Merchant Ali" 
        type="merchant"
        dialogue={["Fresh fruits! Fresh vegetables!", "Hassan is just jealous.", "I have a special task for a reliable person."]}
        mission={reputation >= 30 ? { id: 'ali_delivery', title: 'Fruit Delivery', reward: 150, district: 'The Souq', type: 'delivery', objective: 'Deliver fruits to Palm Heights' } : undefined}
      />
      
      {/* Mission 3 Target: Merchant Ali */}
      <InteractionPoint 
        position={[-5, 0.05, -5]} 
        label="Talk to Merchant Ali" 
        onInteract={() => {
          if (activeMission?.id === 'm3') {
            completeMission();
          }
        }} 
      />

      <VendingMachine position={[25, 0, -15]} />
      <Bench position={[0, 0, 30]} />
      
      {/* Market Expansion */}
      <MarketStall position={[10, 0, -10]} label="Fresh Fruit" />
      <MarketStall position={[15, 0, -10]} label="Spices" />
      <MarketStall position={[20, 0, -10]} label="Handicrafts" />
      <MarketStall position={[10, 0, -15]} label="Egyptian Bread" />
      <MarketStall position={[15, 0, -15]} label="Vegetables" />
      
      {/* Environmental Details */}
      {Array.from({ length: 20 }).map((_, i) => (
        <Tree key={`tree-souq-${i}`} position={[(Math.random() - 0.5) * 200, 0, (Math.random() - 0.5) * 200]} />
      ))}
      {Array.from({ length: 15 }).map((_, i) => (
        <TrashCan key={`trash-souq-${i}`} position={[(Math.random() - 0.5) * 150, 0, (Math.random() - 0.5) * 150]} />
      ))}
      <StreetSign position={[0, 0, 20]} label="Grand Sharqia Souq" />
      
      {/* Shop with Interior */}
      <group position={[-30, 0, 30]}>
        <ShopBuilding position={[0, 0, 0]} onOpen={onOpenShop} />
        <InteractionPoint position={[0, 0.05, 4]} label="Enter Shop Interior" onInteract={() => enterInterior('shop_1')} />
      </group>

      <InteractionPoint position={[15, 0.05, 15]} label="Haggle with Hassan" onInteract={() => alert("Haggling mini-game coming soon!")} />
      
      {/* Transition Point back to Old Neighborhood */}
      <TransitionPoint position={[0, 0.05, -90]} targetDistrict="Old Neighborhood" label="Old Neighborhood" />
    </group>
  );
}

function IndustrialZone({ onOpenGarage }: { onOpenGarage: () => void }) {
  const { activeMission, completeMission, reputation, enterInterior } = useGameStore();
  
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#444" />
      </mesh>
      
      {/* Industrial Sign */}
      <group position={[0, 10, -80]}>
        <mesh>
          <boxGeometry args={[20, 5, 0.5]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <Text
          position={[0, 0, 0.3]}
          fontSize={1.2}
          color="#ff8800"
          anchorX="center"
          anchorY="middle"
        >
          منطقة الزقازيق الصناعية
        </Text>
        <Text
          position={[0, -1.2, 0.3]}
          fontSize={0.4}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Zagazig Industrial Zone - Sharqia
        </Text>
      </group>

      {/* Factory Buildings */}
      {Array.from({ length: 4 }).map((_, i) => (
        <group key={i} position={[(i % 2 - 0.5) * 60, 0, (Math.floor(i / 2) - 0.5) * 60]}>
          <mesh position={[0, 8, 0]} castShadow>
            <boxGeometry args={[40, 16, 30]} />
            <meshStandardMaterial color="#555" />
          </mesh>
          <mesh position={[0, 16.5, 0]}>
            <boxGeometry args={[42, 1, 32]} />
            <meshStandardMaterial color="#222" />
          </mesh>
          {/* Chimneys */}
          <mesh position={[15, 20, 10]}>
            <cylinderGeometry args={[2, 2, 10]} />
            <meshStandardMaterial color="#333" />
          </mesh>
        </group>
      ))}
      
      <NPC 
        position={[-10, 0.5, 0]} 
        color="#00ffff" 
        name="Engineer Nadia" 
        type="worker"
        dialogue={["The machines are acting up again.", "We need someone with technical skills.", "Safety first!"]}
        mission={reputation >= 40 ? { id: 'nadia_repair', title: 'Machine Repair', reward: 250, district: 'Industrial Zone', type: 'repair', objective: 'Fix the generator at the back' } : undefined}
      />
      <NPC 
        position={[10, 0.5, -10]} 
        color="#ff8800" 
        name="Worker Sam" 
        type="worker"
        dialogue={["Hard work builds character.", "Don't get too close to the crane.", "Lunch break is almost over."]}
      />
      
      {/* Mission 4 Target: Factory Entrance */}
      <InteractionPoint 
        position={[0, 0.05, -10]} 
        label="Enter Factory" 
        onInteract={() => {
          if (activeMission?.id === 'm4') {
            completeMission();
          }
        }} 
      />

      <VendingMachine position={[-25, 0, 20]} />
      <GarageBuilding position={[40, 0, 40]} onOpen={onOpenGarage} />
      <InteractionPoint position={[40, 0.05, 44]} label="Enter Garage Interior" onInteract={() => enterInterior('garage_1')} />
      
      <RaceStart position={[0, 0, 30]} />
      <DeliveryHub position={[30, 0, 0]} />
      
      <InteractionPoint position={[0, 0.05, 10]} label="Workshop Mechanic Job" onInteract={() => alert("Mechanic job accepted! Fix the broken car in the garage.")} />
      
      <PoliceStation position={[-50, 0, -50]} />
      
      {/* Vehicle Dealership Building */}
      <group position={[60, 0, -40]}>
        <mesh position={[0, 4, 0]} castShadow>
          <boxGeometry args={[20, 8, 20]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        <mesh position={[0, 8.5, 0]}>
          <boxGeometry args={[22, 1, 22]} />
          <meshStandardMaterial color="#ffd700" />
        </mesh>
        <Text
          position={[0, 9.2, 10.1]}
          fontSize={1}
          color="#ffd700"
          anchorX="center"
          anchorY="middle"
        >
          معرض سيارات الشرقية
        </Text>
        <Text
          position={[0, 8.2, 10.1]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Sharqia Vehicle Dealership
        </Text>
        <InteractionPoint position={[0, 0.05, 12]} label="Open Dealership" onInteract={() => alert("Open Dealership App on your phone!")} />
      </group>
      
      <InteractionPoint position={[-20, 0.05, 5]} label="Site Inspection" onInteract={() => alert("Crane mini-game coming soon!")} />

      {/* Transition Point back to Old Neighborhood */}
      <TransitionPoint position={[-90, 0.05, 0]} targetDistrict="Old Neighborhood" label="Old Neighborhood" />
      <TransitionPoint position={[0, 0.05, 90]} targetDistrict="Palm Heights" label="Palm Heights" />
    </group>
  );
}

function PalmHeights() {
  const { activeMission, completeMission, reputation } = useGameStore();
  
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#90ee90" />
      </mesh>
      
      {/* Luxury Sign */}
      <group position={[0, 6, -70]}>
        <mesh>
          <boxGeometry args={[15, 3, 0.5]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <Text
          position={[0, 0, 0.3]}
          fontSize={1}
          color="#ffd700"
          anchorX="center"
          anchorY="middle"
        >
          حي النخيل الراقي
        </Text>
        <Text
          position={[0, -0.8, 0.3]}
          fontSize={0.3}
          color="#333"
          anchorX="center"
          anchorY="middle"
        >
          Palm Heights - Luxury Living
        </Text>
      </group>

      {/* Luxury Villas */}
      {Array.from({ length: 6 }).map((_, i) => (
        <group key={i} position={[(i % 3 - 1) * 50, 0, (Math.floor(i / 3) - 0.5) * 60]}>
          <mesh position={[0, 5, 0]} castShadow>
            <boxGeometry args={[25, 10, 20]} />
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh position={[0, 0.1, 15]}>
            <boxGeometry args={[15, 0.1, 10]} />
            <meshStandardMaterial color="cyan" transparent opacity={0.6} />
          </mesh>
          <InteractionPoint position={[0, 0, 22]} label="Admire Villa" onInteract={() => alert("One day, you'll own one of these in Sharqia.")} />
        </group>
      ))}
      
      <NPC 
        position={[0, 0.5, 10]} 
        color="#ffd700" 
        name="Madam Laila" 
        type="citizen"
        dialogue={["The neighborhood is so quiet today.", "I need a package delivered to the Souq.", "My butler is away on vacation."]}
      />
      <NPC 
        position={[-15, 0.5, 5]} 
        color="#ffffff" 
        name="Butler James" 
        type="worker"
        dialogue={["Madam Laila is very busy.", "Please don't step on the grass.", "Can I help you with something?"]}
      />
      
      {/* Mission 5 Target: Madam Laila */}
      <InteractionPoint 
        position={[0, 0.05, 10]} 
        label="Talk to Madam Laila" 
        onInteract={() => {
          if (activeMission?.id === 'm5') {
            completeMission();
          }
        }} 
      />

      <Bench position={[20, 0, 30]} />
      <VendingMachine position={[-15, 0, 40]} />
      
      <ShoppingMall position={[0, 0, 60]} />

      {/* Environmental Details */}
      {Array.from({ length: 40 }).map((_, i) => (
        <Tree key={`tree-palm-${i}`} position={[(Math.random() - 0.5) * 300, 0, (Math.random() - 0.5) * 300]} />
      ))}
      {Array.from({ length: 10 }).map((_, i) => (
        <TrashCan key={`trash-palm-${i}`} position={[(Math.random() - 0.5) * 200, 0, (Math.random() - 0.5) * 200]} />
      ))}
      <StreetSign position={[0, 0, 30]} label="Palm Heights Luxury District" />

      {/* Transition Point back to Industrial Zone */}
      <TransitionPoint position={[0, 0.05, -90]} targetDistrict="Industrial Zone" label="Industrial Zone" />
    </group>
  );
}

export default function GameScene() {
  const { 
    currentDistrict, currentInterior, enterInterior, collectPassiveIncome, 
    checkDailyReward, storyStep, activeMission, setMission,
    checkAchievements, refreshDailyShop, advanceTime
  } = useGameStore();
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isGarageOpen, setIsGarageOpen] = useState(false);
  const [joystick, setJoystick] = useState({ x: 0, y: 0 });

  useEffect(() => {
    checkDailyReward();
    refreshDailyShop();
    
    const interval = setInterval(() => {
      collectPassiveIncome();
      checkAchievements();
      advanceTime(0.01);
    }, 10000); // Check every 10 seconds
    
    return () => clearInterval(interval);
  }, [collectPassiveIncome, checkDailyReward, checkAchievements, refreshDailyShop, advanceTime]);

  // Story Mission Auto-Assign
  useEffect(() => {
    if (!activeMission) {
      const nextMainMission = MAIN_MISSIONS.find(m => m.storyStep === storyStep);
      if (nextMainMission && useGameStore.getState().level >= nextMainMission.unlockLevel) {
        setMission(nextMainMission);
      }
    }
  }, [storyStep, activeMission, setMission]);

  return (
    <div className="w-full h-full bg-black">
          <KeyboardControls
            map={[
              { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
              { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
              { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
              { name: 'right', keys: ['ArrowRight', 'KeyD'] },
              { name: 'jump', keys: ['Space'] },
              { name: 'interact', keys: ['KeyE'] },
              { name: 'radio', keys: ['KeyR'] },
            ]}
          >
        <Canvas shadows camera={{ fov: 45 }}>
          <SoundManager />
          <DayNightCycle />
          <WeatherEffects />
          <RandomEvents />
          
          <AnimatePresence mode="wait">
            {currentInterior ? (
              <group key="interior">
                {currentInterior.startsWith('home') && <HomeInterior onExit={() => enterInterior(null)} />}
                {currentInterior.startsWith('shop') && <ShopInterior onExit={() => enterInterior(null)} />}
                {currentInterior.startsWith('cafe') && <CafeInterior onExit={() => enterInterior(null)} />}
                {currentInterior.startsWith('garage') && <GarageInterior onExit={() => enterInterior(null)} />}
              </group>
            ) : (
              <group key="world">
                {currentDistrict === 'Old Neighborhood' && <OldNeighborhood onOpenShop={() => setIsShopOpen(true)} onOpenGarage={() => setIsGarageOpen(true)} />}
                {currentDistrict === 'The Souq' && <TheSouq onOpenShop={() => setIsShopOpen(true)} />}
                {currentDistrict === 'Industrial Zone' && <IndustrialZone onOpenGarage={() => setIsGarageOpen(true)} />}
                {currentDistrict === 'Palm Heights' && <PalmHeights />}
                <Player joystick={joystick} />
              </group>
            )}
          </AnimatePresence>

          <Environment preset="city" />
          <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
          <PointerLockControls />
        </Canvas>
      </KeyboardControls>

      <Joystick onMove={(x, y) => setJoystick({ x, y })} />

      <ShopMenu isOpen={isShopOpen} onClose={() => setIsShopOpen(false)} />
      <GarageMenu isOpen={isGarageOpen} onClose={() => setIsGarageOpen(false)} />
    </div>
  );
}



