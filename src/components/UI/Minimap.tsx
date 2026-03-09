import React from 'react';
import { useGameStore } from '../../store';
import { MapPin, User } from 'lucide-react';

export default function Minimap() {
  const { currentDistrict, activeMission } = useGameStore();
  
  // Simple representation of the map
  // Old Neighborhood: center
  // The Souq: top-right
  // Industrial Zone: bottom-left
  // Palm Heights: top-left
  
  const districts = [
    { name: 'Old Neighborhood', x: 50, y: 50, color: 'bg-emerald-500' },
    { name: 'The Souq', x: 80, y: 20, color: 'bg-amber-500' },
    { name: 'Industrial Zone', x: 20, y: 80, color: 'bg-blue-500' },
    { name: 'Palm Heights', x: 20, y: 20, color: 'bg-purple-500' },
  ];

  return (
    <div className="w-40 h-40 bg-black/80 backdrop-blur-md rounded-2xl border-2 border-white/10 overflow-hidden relative shadow-2xl">
      {/* Grid lines */}
      <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-10">
        {[...Array(16)].map((_, i) => (
          <div key={i} className="border border-white" />
        ))}
      </div>
      
      {/* Roads */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-white/5" />
        <div className="absolute top-0 left-1/2 w-1 h-full bg-white/5" />
      </div>
      
      {/* Districts */}
      {districts.map((d) => (
        <div 
          key={d.name}
          className={`absolute w-3 h-3 rounded-full ${d.color} ${currentDistrict === d.name ? 'ring-4 ring-white shadow-lg scale-125' : 'opacity-50'} transition-all duration-500`}
          style={{ left: `${d.x}%`, top: `${d.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          {currentDistrict === d.name && (
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-black text-white uppercase bg-black/60 px-1 rounded">
              You
            </div>
          )}
        </div>
      ))}

      {/* Locations */}
      <div className="absolute top-[30%] left-[30%] w-1 h-1 bg-red-500 rounded-full opacity-50" title="Hospital" />
      <div className="absolute top-[70%] left-[70%] w-1 h-1 bg-blue-500 rounded-full opacity-50" title="Police" />
      <div className="absolute top-[15%] left-[15%] w-1 h-1 bg-purple-500 rounded-full opacity-50" title="Mall" />

      {/* Mission Marker */}
      {activeMission && (
        <div 
          className="absolute w-4 h-4 text-red-500 animate-bounce"
          style={{ 
            left: `${districts.find(d => d.name === activeMission.district)?.x || 50}%`, 
            top: `${districts.find(d => d.name === activeMission.district)?.y || 50}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <MapPin size={16} fill="currentColor" />
        </div>
      )}

      {/* Compass */}
      <div className="absolute bottom-2 right-2 text-[10px] font-bold text-white/40">
        N
      </div>
    </div>
  );
}
