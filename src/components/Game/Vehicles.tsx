import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useKeyboardControls, Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../store';

interface VehicleProps {
  position: [number, number, number];
  type: 'motorbike' | 'car' | 'delivery';
  id: string;
}

export const Vehicle: React.FC<VehicleProps> = ({ position, type, id }) => {
  const vehicleRef = useRef<THREE.Group>(null);
  const [isDriving, setIsDriving] = useState(false);
  const [velocity] = useState(() => new THREE.Vector3());
  const [direction] = useState(() => new THREE.Vector3());
  const [, get] = useKeyboardControls();
  const { camera } = useThree();
  const { 
    currentVehicle, useEnergy, energy, vehicleStats, isRadioOn, 
    currentRadioStation, setRadioOn, setRadioStation, improveSkill,
    activeMission, completeMission
  } = useGameStore();

  const [prevRadioKey, setPrevRadioKey] = useState(false);
  const stations = [
    { name: 'Sharqia FM', genre: 'Local Hits' },
    { name: 'Nile Beats', genre: 'Arabic Pop' },
    { name: 'Desert Rock', genre: 'Classic Rock' },
    { name: 'Cairo Chill', genre: 'Lo-fi' }
  ];

  // Check if player is near to interact
  const [near, setNear] = useState(false);
  const [drivingTime, setDrivingTime] = useState(0);

  const stats = vehicleStats[id] || { speed: 10, handling: 50, color: '#333' };

  useFrame((state, delta) => {
    if (!vehicleRef.current) return;

    const playerPos = camera.position;
    const dist = playerPos.distanceTo(vehicleRef.current.position);
    setNear(dist < 3);

    if (near && get().interact && !isDriving) {
      setIsDriving(true);
    }

    if (isDriving) {
      if (get().jump) { // Use jump as 'exit' for simplicity
        setIsDriving(false);
        setRadioOn(false);
        return;
      }

      // Skill progression: Driving
      setDrivingTime(prev => {
        const next = prev + delta;
        if (next > 5) { // Every 5 seconds of driving
          improveSkill('driving', 1);
          return 0;
        }
        return next;
      });

      // Racing mission completion logic
      if (activeMission?.type === 'racing' && activeMission.targetPos) {
        const target = new THREE.Vector3(...activeMission.targetPos);
        if (vehicleRef.current.position.distanceTo(target) < 10) {
          completeMission();
          improveSkill('racing', 50);
          alert("Race Finished! You gained racing skill.");
        }
      }

      // Radio controls
      const radioKey = get().radio;
      if (radioKey && !prevRadioKey) {
        if (!isRadioOn) {
          setRadioOn(true);
        } else {
          const nextStation = (currentRadioStation + 1) % stations.length;
          if (nextStation === 0) {
            setRadioOn(false);
          }
          setRadioStation(nextStation);
        }
      }
      setPrevRadioKey(radioKey);

      const { forward, backward, left, right } = get();
      
      // Use stats from store
      const baseSpeed = type === 'motorbike' ? 15 : type === 'car' ? 12 : 8;
      const speedMultiplier = stats.speed / 50; // 50 is base
      const speed = baseSpeed * speedMultiplier;
      
      const baseTurnSpeed = type === 'motorbike' ? 3 : 2;
      const turnSpeedMultiplier = stats.handling / 50;
      const turnSpeed = baseTurnSpeed * turnSpeedMultiplier;

      if (forward) velocity.z = THREE.MathUtils.lerp(velocity.z, speed, delta * 2);
      else if (backward) velocity.z = THREE.MathUtils.lerp(velocity.z, -speed / 2, delta * 2);
      else velocity.z = THREE.MathUtils.lerp(velocity.z, 0, delta * 3);

      if (left && Math.abs(velocity.z) > 0.1) vehicleRef.current.rotation.y += turnSpeed * delta * (velocity.z > 0 ? 1 : -1);
      if (right && Math.abs(velocity.z) > 0.1) vehicleRef.current.rotation.y -= turnSpeed * delta * (velocity.z > 0 ? 1 : -1);

      direction.set(0, 0, 1).applyQuaternion(vehicleRef.current.quaternion);
      vehicleRef.current.position.addScaledVector(direction, velocity.z * delta);

      // Camera follow vehicle
      const idealOffset = new THREE.Vector3(0, 4, 8).applyQuaternion(vehicleRef.current.quaternion);
      const targetPos = vehicleRef.current.position.clone().add(idealOffset);
      camera.position.lerp(targetPos, 0.1);
      camera.lookAt(vehicleRef.current.position);

      // Energy drain
      if (Math.abs(velocity.z) > 0.1 && energy > 0) {
        useEnergy(0.005);
      }
    }
  });

  return (
    <group ref={vehicleRef} position={position}>
      {type === 'motorbike' ? (
        <MotorbikeModel color={stats.color} />
      ) : type === 'car' ? (
        <CarModel color={stats.color} />
      ) : (
        <DeliveryModel color={stats.color} />
      )}
      
      {near && !isDriving && (
        <Float speed={5} rotationIntensity={0} floatIntensity={1}>
          <Text
            position={[0, 2, 0]}
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000"
          >
            [E] Drive {type}
          </Text>
        </Float>
      )}
      
      {isDriving && (
        <group>
          <Float speed={5} rotationIntensity={0} floatIntensity={1}>
            <Text
              position={[0, 2.5, 0]}
              fontSize={0.25}
              color="white"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.02}
              outlineColor="#000"
            >
              [Space] Exit • [R] Radio
            </Text>
          </Float>
          
          {isRadioOn && (
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
              <group position={[0, 3, 0]}>
                <Text
                  fontSize={0.15}
                  color="#fbbf24"
                  anchorX="center"
                  anchorY="middle"
                  outlineWidth={0.01}
                  outlineColor="#000"
                >
                  📻 {stations[currentRadioStation].name}
                </Text>
                <Text
                  position={[0, -0.2, 0]}
                  fontSize={0.1}
                  color="#94a3b8"
                  anchorX="center"
                  anchorY="middle"
                  outlineWidth={0.01}
                  outlineColor="#000"
                >
                  Playing: {stations[currentRadioStation].genre}
                </Text>
              </group>
            </Float>
          )}
        </group>
      )}
    </group>
  );
};

const MotorbikeModel = ({ color }: { color: string }) => (
  <group>
    {/* Body */}
    <mesh castShadow position={[0, 0.5, 0]}>
      <boxGeometry args={[0.4, 0.6, 1.2]} />
      <meshStandardMaterial color={color} />
    </mesh>
    {/* Wheels */}
    <mesh castShadow position={[0, 0.2, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
      <meshStandardMaterial color="#111" />
    </mesh>
    <mesh castShadow position={[0, 0.2, -0.6]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
      <meshStandardMaterial color="#111" />
    </mesh>
    {/* Handlebars */}
    <mesh castShadow position={[0, 0.8, 0.4]}>
      <boxGeometry args={[0.8, 0.05, 0.05]} />
      <meshStandardMaterial color="#555" />
    </mesh>
  </group>
);

const CarModel = ({ color }: { color: string }) => (
  <group>
    {/* Body */}
    <mesh castShadow position={[0, 0.4, 0]}>
      <boxGeometry args={[1.8, 0.6, 3.5]} />
      <meshStandardMaterial color={color} />
    </mesh>
    {/* Cabin */}
    <mesh castShadow position={[0, 1, -0.2]}>
      <boxGeometry args={[1.6, 0.8, 1.8]} />
      <meshStandardMaterial color={color} />
    </mesh>
    {/* Windows */}
    <mesh position={[0, 1.1, 0.71]}>
      <boxGeometry args={[1.4, 0.5, 0.01]} />
      <meshStandardMaterial color="lightblue" transparent opacity={0.6} />
    </mesh>
    {/* Wheels */}
    {[[-0.9, 0.2, 1.2], [0.9, 0.2, 1.2], [-0.9, 0.2, -1.2], [0.9, 0.2, -1.2]].map((pos, i) => (
      <mesh key={i} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    ))}
  </group>
);

const DeliveryModel = ({ color }: { color: string }) => (
  <group>
    {/* Body */}
    <mesh castShadow position={[0, 0.5, 0]}>
      <boxGeometry args={[2, 0.8, 4.5]} />
      <meshStandardMaterial color={color} />
    </mesh>
    {/* Cargo Box */}
    <mesh castShadow position={[0, 1.8, -0.5]}>
      <boxGeometry args={[1.9, 2, 3]} />
      <meshStandardMaterial color="#ffffff" />
    </mesh>
    {/* Cabin */}
    <mesh castShadow position={[0, 1.2, 1.5]}>
      <boxGeometry args={[1.8, 1.2, 1.2]} />
      <meshStandardMaterial color={color} />
    </mesh>
    {/* Wheels */}
    {[[-1, 0.3, 1.5], [1, 0.3, 1.5], [-1, 0.3, -1.5], [1, 0.3, -1.5]].map((pos, i) => (
      <mesh key={i} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    ))}
  </group>
);
