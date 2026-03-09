import React from 'react';
import { useGameStore } from '../../store';
import { Text, Float, ContactShadows, useKeyboardControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface InteriorProps {
  onExit: () => void;
}

export const HomeInterior: React.FC<InteriorProps> = ({ onExit }) => {
  const refillEnergy = useGameStore((state) => state.refillEnergy);

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      
      {/* Walls */}
      <mesh position={[0, 2.5, -10]}>
        <boxGeometry args={[20, 5, 0.5]} />
        <meshStandardMaterial color="#f5f5dc" />
      </mesh>
      <mesh position={[0, 2.5, 10]}>
        <boxGeometry args={[20, 5, 0.5]} />
        <meshStandardMaterial color="#f5f5dc" />
      </mesh>
      <mesh position={[-10, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[20, 5, 0.5]} />
        <meshStandardMaterial color="#f5f5dc" />
      </mesh>
      <mesh position={[10, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[20, 5, 0.5]} />
        <meshStandardMaterial color="#f5f5dc" />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Furniture */}
      {/* Bed */}
      <group position={[-7, 0, -7]}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[3, 0.6, 5]} />
          <meshStandardMaterial color="#5d4037" />
        </mesh>
        <mesh position={[0, 0.7, 0]} castShadow>
          <boxGeometry args={[2.8, 0.2, 4.8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, 0.8, -2]} castShadow>
          <boxGeometry args={[2.5, 0.3, 1]} />
          <meshStandardMaterial color="#e0e0e0" />
        </mesh>
        <InteractionPoint position={[0, 0.5, 0]} label="Rest (Refill Energy)" onInteract={() => {
          refillEnergy();
          alert("You rested and feel refreshed!");
        }} />
      </group>

      {/* Sofa */}
      <group position={[7, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[4, 0.8, 1.5]} />
          <meshStandardMaterial color="#1a237e" />
        </mesh>
        <mesh position={[0, 1, -0.6]} castShadow>
          <boxGeometry args={[4, 1.2, 0.3]} />
          <meshStandardMaterial color="#1a237e" />
        </mesh>
      </group>

      {/* TV Stand */}
      <group position={[7, 0, 7]} rotation={[0, -Math.PI / 4, 0]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[2, 0.8, 0.8]} />
          <meshStandardMaterial color="#212121" />
        </mesh>
        <mesh position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[1.8, 1.2, 0.1]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <InteractionPoint position={[0, 0.5, 0.5]} label="Watch TV" onInteract={() => alert("Watching Sharqia TV News...")} />
      </group>

      {/* Fridge */}
      <group position={[-7, 0, 7]}>
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[1.2, 2.4, 1]} />
          <meshStandardMaterial color="#eeeeee" />
        </mesh>
        <InteractionPoint position={[0, 0.5, 0.6]} label="Eat Snack (Refill Energy)" onInteract={() => {
          refillEnergy(10);
          alert("Had a quick snack!");
        }} />
      </group>

      {/* Exit Door */}
      <group position={[0, 0, 9.7]}>
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[2, 3, 0.1]} />
          <meshStandardMaterial color="#5d4037" />
        </mesh>
        <InteractionPoint position={[0, 0.5, -0.5]} label="Exit Building" onInteract={onExit} />
      </group>

      {/* Lighting */}
      <pointLight position={[0, 4, 0]} intensity={1.5} distance={20} castShadow />
      <ambientLight intensity={0.3} />
    </group>
  );
};

export const ShopInterior: React.FC<InteriorProps> = ({ onExit }) => {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      
      {/* Walls */}
      <mesh position={[0, 2.5, -7.5]}>
        <boxGeometry args={[15, 5, 0.5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 2.5, 7.5]}>
        <boxGeometry args={[15, 5, 0.5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-7.5, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[15, 5, 0.5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[7.5, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[15, 5, 0.5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Shelves */}
      {Array.from({ length: 3 }).map((_, i) => (
        <group key={i} position={[-6, 0, -5 + i * 5]}>
          <mesh position={[0, 1.5, 0]} castShadow>
            <boxGeometry args={[1, 3, 4]} />
            <meshStandardMaterial color="#757575" />
          </mesh>
          <InteractionPoint position={[1, 0.5, 0]} label="Buy Items" onInteract={() => alert("Shop menu coming soon!")} />
        </group>
      ))}

      {/* Counter */}
      <group position={[4, 0, 0]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[2, 1, 4]} />
          <meshStandardMaterial color="#3e2723" />
        </mesh>
        <InteractionPoint position={[-1.5, 0.5, 0]} label="Talk to Cashier" onInteract={() => alert("Welcome to the shop!")} />
      </group>

      {/* Exit Door */}
      <group position={[0, 0, 7.2]}>
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[2, 3, 0.1]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <InteractionPoint position={[0, 0.5, -0.5]} label="Exit Shop" onInteract={onExit} />
      </group>

      <pointLight position={[0, 4, 0]} intensity={2} distance={20} />
      <ambientLight intensity={0.5} />
    </group>
  );
};

export const CafeInterior: React.FC<InteriorProps> = ({ onExit }) => {
  const refillEnergy = useGameStore((state) => state.refillEnergy);
  const removeMoney = useGameStore((state) => state.removeMoney);
  const money = useGameStore((state) => state.money);

  const buyCoffee = () => {
    if (money >= 10) {
      removeMoney(10);
      refillEnergy(20);
      alert("You enjoyed a fresh Egyptian coffee! +20 Energy");
    } else {
      alert("Not enough money!");
    }
  };

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial color="#5d4037" />
      </mesh>
      
      {/* Walls */}
      <mesh position={[0, 2.5, -7.5]}>
        <boxGeometry args={[15, 5, 0.5]} />
        <meshStandardMaterial color="#d7ccc8" />
      </mesh>
      <mesh position={[0, 2.5, 7.5]}>
        <boxGeometry args={[15, 5, 0.5]} />
        <meshStandardMaterial color="#d7ccc8" />
      </mesh>
      <mesh position={[-7.5, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[15, 5, 0.5]} />
        <meshStandardMaterial color="#d7ccc8" />
      </mesh>
      <mesh position={[7.5, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[15, 5, 0.5]} />
        <meshStandardMaterial color="#d7ccc8" />
      </mesh>

      {/* Tables */}
      {Array.from({ length: 4 }).map((_, i) => (
        <group key={i} position={[(i % 2 - 0.5) * 6, 0, (Math.floor(i / 2) - 0.5) * 6]}>
          <mesh position={[0, 0.6, 0]} castShadow>
            <cylinderGeometry args={[1, 1, 0.1, 32]} />
            <meshStandardMaterial color="#3e2723" />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.6, 16]} />
            <meshStandardMaterial color="#3e2723" />
          </mesh>
          <InteractionPoint position={[0, 0.7, 0]} label="Order Coffee ($10)" onInteract={buyCoffee} />
        </group>
      ))}

      {/* Counter */}
      <group position={[0, 0, -5]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[6, 1, 1.5]} />
          <meshStandardMaterial color="#3e2723" />
        </mesh>
        <Text position={[0, 1.5, 0.8]} fontSize={0.3} color="white">Sharqia Coffee House</Text>
      </group>

      {/* Exit Door */}
      <group position={[0, 0, 7.2]}>
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[2, 3, 0.1]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <InteractionPoint position={[0, 0.5, -0.5]} label="Exit Cafe" onInteract={onExit} />
      </group>

      <pointLight position={[0, 4, 0]} intensity={1.5} distance={15} />
      <ambientLight intensity={0.4} />
    </group>
  );
};

export const GarageInterior: React.FC<InteriorProps> = ({ onExit }) => {
  const improveSkill = useGameStore((state) => state.improveSkill);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      
      {/* Walls */}
      <mesh position={[0, 3, -10]}>
        <boxGeometry args={[20, 6, 0.5]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      <mesh position={[0, 3, 10]}>
        <boxGeometry args={[20, 6, 0.5]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      <mesh position={[-10, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[20, 6, 0.5]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      <mesh position={[10, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[20, 6, 0.5]} />
        <meshStandardMaterial color="#555" />
      </mesh>

      {/* Workbenches */}
      <group position={[-8, 0, -8]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[4, 1, 2]} />
          <meshStandardMaterial color="#757575" />
        </mesh>
        <InteractionPoint position={[0, 1.1, 0]} label="Tune Vehicle" onInteract={() => {
          improveSkill('repairing', 20);
          alert("You spent time tuning vehicles. Repairing skill increased! Open Vehicle App to upgrade stats.");
        }} />
      </group>

      {/* Tools */}
      <group position={[8, 0, 0]}>
        <mesh position={[0, 1, 0]} castShadow>
          <boxGeometry args={[1, 2, 3]} />
          <meshStandardMaterial color="#b71c1c" />
        </mesh>
      </group>

      {/* Exit Door */}
      <group position={[0, 0, 9.7]}>
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[3, 3, 0.1]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        <InteractionPoint position={[0, 0.5, -0.5]} label="Exit Garage" onInteract={onExit} />
      </group>

      <pointLight position={[0, 5, 0]} intensity={2} distance={25} />
      <ambientLight intensity={0.3} />
    </group>
  );
};

// Re-using InteractionPoint logic but simplified for internal use
function InteractionPoint({ position, label, onInteract, distance = 2.5 }: { position: [number, number, number], label: string, onInteract: () => void, distance?: number }) {
  const [hovered, setHovered] = React.useState(false);
  const [, get] = useKeyboardControls();
  const { camera } = useThree();
  
  useFrame(() => {
    const playerPos = camera.position;
    const dist = playerPos.distanceTo(new THREE.Vector3(...position));
    
    if (dist < distance) {
      setHovered(true);
      if (get().interact) {
        onInteract();
      }
    } else {
      setHovered(false);
    }
  });
  
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.3, 0.3, 0.05, 32]} />
        <meshStandardMaterial color={hovered ? "#fbbf24" : "#f59e0b"} transparent opacity={0.3} />
      </mesh>
      {hovered && (
        <Float speed={5} rotationIntensity={0} floatIntensity={1}>
          <Text
            position={[0, 1.2, 0]}
            fontSize={0.25}
            color="white"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000"
          >
            {`[E] ${label}`}
          </Text>
        </Float>
      )}
    </group>
  );
}
