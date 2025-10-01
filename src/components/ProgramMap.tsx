import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin, Navigation, Clock, Users, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  PROGRAM_DATA, 
  DEFAULT_LOCATION, 
  calculateDistance, 
  findNearestLocation,
  getConnectedPrograms 
} from '../data/MarkerData';

// TypeScript declarations for Leaflet
declare global {
  interface Window {
    L: any;
  }
}

const ProgramMap = ({ programType, programData, userLocation: initialUserLocation, isFullscreen }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);
  
  const [userLocation, setUserLocation] = useState(initialUserLocation);
  const [isLoading, setIsLoading] = useState(true);
  const [nearestLocation, setNearestLocation] = useState(null);
  const [showConnectedPrograms, setShowConnectedPrograms] = useState({});

  // Get current program locations
  const programLocations = PROGRAM_DATA[programType] || [];

  // Custom icons for different program types
  const getCustomIcon = useCallback((type, isNearest = false) => {
    const color = isNearest ? '#F59E0B' : programData.color; // Orange for nearest, program color for others
    const size = isNearest ? 35 : 25;
    
    let iconHtml = '';
    switch (programData.icon) {
      case 'medical':
        iconHtml = `
          <div style="
            background: ${color};
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${isNearest ? '16px' : '12px'};
            position: relative;
          ">
            🏥
            ${isNearest ? '<div style="position: absolute; top: -8px; right: -8px; background: #F59E0B; color: white; border-radius: 50%; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold;">★</div>' : ''}
          </div>
        `;
        break;
      case 'book':
        iconHtml = `
          <div style="
            background: ${color};
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${isNearest ? '16px' : '12px'};
            position: relative;
          ">
            📚
            ${isNearest ? '<div style="position: absolute; top: -8px; right: -8px; background: #F59E0B; color: white; border-radius: 50%; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold;">★</div>' : ''}
          </div>
        `;
        break;
      case 'home':
        iconHtml = `
          <div style="
            background: ${color};
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${isNearest ? '16px' : '12px'};
            position: relative;
          ">
            🏠
            ${isNearest ? '<div style="position: absolute; top: -8px; right: -8px; background: #F59E0B; color: white; border-radius: 50%; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold;">★</div>' : ''}
          </div>
        `;
        break;
      default:
        iconHtml = `
          <div style="
            background: ${color};
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          "></div>
        `;
    }

    return window.L.divIcon({
      className: 'custom-program-marker',
      html: iconHtml,
      iconSize: [size, size],
      iconAnchor: [size/2, size/2]
    });
  }, [programData]);

  // Create enhanced popup content
  const createPopupContent = useCallback((location, isNearest = false) => {
    let distanceInfo = '';
    if (userLocation) {
      const distance = calculateDistance(userLocation.lat, userLocation.lng, location.lat, location.lng);
      distanceInfo = `
        <div class="border-t border-b py-3 my-3 bg-gray-50 rounded">
          <h4 class="font-semibold text-gray-700 mb-2 flex items-center">
            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
            </svg>
            Distance & Travel Time
          </h4>
          <div class="grid grid-cols-3 gap-2 text-xs">
            <div class="text-center">
              <div class="font-semibold text-gray-700">${distance.km} km</div>
              <div class="text-gray-500">Distance</div>
            </div>
            <div class="text-center">
              <div class="font-semibold text-gray-700">~${distance.walkingTimeMinutes} min</div>
              <div class="text-gray-500">Walking</div>
            </div>
            <div class="text-center">
              <div class="font-semibold text-gray-700">~${distance.drivingTimeMinutes} min</div>
              <div class="text-gray-500">Driving</div>
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div class="p-4 min-w-[350px] max-w-[400px]">
        ${isNearest ? `
          <div class="flex items-center justify-center mb-3 p-2 bg-yellow-100 rounded-lg">
            <svg class="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <span class="text-yellow-800 font-semibold text-sm">Nearest Location</span>
          </div>
        ` : ''}
        
        <h3 class="font-bold text-lg mb-2 text-gray-800">${location.name}</h3>
        <p class="text-sm text-gray-600 mb-3">${location.description}</p>
        
        <div class="space-y-2 mb-3">
          <div class="flex items-start text-xs">
            <span class="font-semibold text-gray-700 w-20 flex-shrink-0">Address:</span>
            <span class="text-gray-600">${location.address}</span>
          </div>
          <div class="flex items-center text-xs">
            <span class="font-semibold text-gray-700 w-20 flex-shrink-0">Hours:</span>
            <span class="text-gray-600">${location.hours_open}</span>
          </div>
          <div class="flex items-center text-xs">
            <span class="font-semibold text-gray-700 w-20 flex-shrink-0">Volunteers:</span>
            <span class="text-gray-600">${location.volunteers_signed_up}/${location.volunteers_needed} signed up</span>
          </div>
          <div class="flex items-center text-xs">
            <span class="font-semibold text-gray-700 w-20 flex-shrink-0">Commitment:</span>
            <span class="text-gray-600">${location.commitment}</span>
          </div>
        </div>

        ${distanceInfo}

        <div class="space-y-2 mb-3">
          <h4 class="font-semibold text-gray-700 text-sm">Programs Offered:</h4>
          <div class="flex flex-wrap gap-1">
            ${location.programs.map(program => `
              <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">${program}</span>
            `).join('')}
          </div>
        </div>

        <div class="space-y-2 mb-4">
          <h4 class="font-semibold text-gray-700 text-sm">Next Event:</h4>
          <div class="p-2 bg-green-50 rounded text-sm">
            <div class="font-medium text-green-800">${location.next_event}</div>
          </div>
        </div>

        <div class="space-y-2">
          <button 
            class="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors font-semibold"
            onclick="registerForProgram('${location.id}', '${location.name.replace(/'/g, "\\'")}')"
          >
            🚀 Register to Volunteer
          </button>
          
          ${location.connected_programs && location.connected_programs.length > 0 ? `
            <button 
              class="w-full bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors"
              onclick="showConnectedPrograms('${location.id}')"
            >
              🔗 View Connected Programs (${location.connected_programs.length})
            </button>
          ` : ''}
          
          <div class="flex space-x-2">
            <button class="flex-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-200 transition-colors">
              📧 Contact
            </button>
            <button class="flex-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-200 transition-colors">
              📍 Directions
            </button>
          </div>
          
          <p class="text-xs text-gray-500 text-center mt-2">
            Contact: ${location.contact} | ${location.phone}
          </p>
        </div>
      </div>
    `;
  }, [userLocation]);

  // Get user location if not provided
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setUserLocation(DEFAULT_LOCATION);
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);
        setIsLoading(false);
      },
      (error) => {
        console.log('Geolocation error:', error);
        setUserLocation(DEFAULT_LOCATION);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  }, []);

  // Initialize map
  useEffect(() => {
    if (!userLocation) {
      getUserLocation();
      return;
    }

    const initializeMap = () => {
      if (typeof window !== 'undefined' && window.L && mapRef.current && !mapInstanceRef.current) {
        // Find nearest location
        const nearest = findNearestLocation(userLocation, programLocations);
        setNearestLocation(nearest);

        // Initialize map
        const map = window.L.map(mapRef.current, {
          minZoom: 10,
          maxZoom: 18
        }).setView([userLocation.lat, userLocation.lng], 12);

        // Add tiles
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        }).addTo(map);

        // Add user location marker
        const userIcon = window.L.divIcon({
          className: 'user-location-marker',
          html: `
            <div style="
              background: #3B82F6;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              position: relative;
            ">
              <div style="
                position: absolute;
                top: -5px;
                left: -5px;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background: rgba(59, 130, 246, 0.3);
                animation: pulse 2s infinite;
              "></div>
            </div>
            <style>
              @keyframes pulse {
                0% { transform: scale(1); opacity: 1; }
                100% { transform: scale(1.5); opacity: 0; }
              }
            </style>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const userMarker = window.L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map);
        userMarker.bindPopup(`
          <div class="p-3 text-center">
            <h3 class="font-bold text-lg mb-2">📍 Your Location</h3>
            <p class="text-sm text-gray-600">Cape Town, South Africa</p>
          </div>
        `);
        userMarkerRef.current = userMarker;

        // Add program location markers
        const markers = [];
        programLocations.forEach(location => {
          const isNearest = nearest && location.id === nearest.id;
          const icon = getCustomIcon(programType, isNearest);
          const marker = window.L.marker([location.lat, location.lng], { icon }).addTo(map);
          
          const popupContent = createPopupContent(location, isNearest);
          marker.bindPopup(popupContent);
          markers.push(marker);
        });

        markersRef.current = markers;

        // Fit map to show all markers
        const allMarkers = [...markers, userMarker];
        if (allMarkers.length > 0) {
          const group = new window.L.featureGroup(allMarkers);
          map.fitBounds(group.getBounds().pad(0.1));
        }

        mapInstanceRef.current = map;
        setIsLoading(false);

        // Add global functions for popup interactions
        (window as any).registerForProgram = (locationId, locationName) => {
          alert(`🎯 VOLUNTEER REGISTRATION\n\nLocation: ${locationName}\n\n` +
                `This would open the registration form for ${locationName}.\n\n` +
                `Registration process includes:\n` +
                `• Application form\n• Background check\n• Orientation scheduling\n• Training programs`);
        };

        (window as any).showConnectedPrograms = (locationId) => {
          const location = programLocations.find(loc => loc.id === locationId);
          if (location && location.connected_programs) {
            const connectedData = getConnectedPrograms(programType, location.connected_programs, userLocation);
            
            let message = `🔗 CONNECTED PROGRAMS\n\nFor ${location.name}:\n\n`;
            connectedData.forEach(program => {
              const distance = calculateDistance(userLocation.lat, userLocation.lng, program.location.lat, program.location.lng);
              message += `• ${program.programType.name}\n`;
              message += `  ${program.location.name}\n`;
              message += `  ${distance.km} km away\n\n`;
            });
            message += `These programs work together to provide comprehensive community support.`;
            
            alert(message);
          }
        };
      }
    };

    // Check if Leaflet is loaded
    if (window.L) {
      initializeMap();
    } else {
      const checkLeaflet = setInterval(() => {
        if (window.L) {
          clearInterval(checkLeaflet);
          initializeMap();
        }
      }, 100);

      return () => clearInterval(checkLeaflet);
    }

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [userLocation, programType, programLocations, getUserLocation, getCustomIcon, createPopupContent]);

  return (
    <div className="relative w-full h-full bg-gray-100">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-20 backdrop-blur-sm">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-gray-700">Loading map...</p>
            <p className="text-sm text-gray-500 mt-1">Finding {programData?.name} locations</p>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div 
        ref={mapRef}
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />

      {/* Map Info Overlay */}
      {!isLoading && nearestLocation && (
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-sm z-10">
          <h3 className="font-bold text-sm mb-2 flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-2" />
            Nearest Location
          </h3>
          <div className="space-y-1 text-xs">
            <p className="font-medium">{nearestLocation.name}</p>
            {userLocation && (
              <p className="text-gray-600">
                {calculateDistance(userLocation.lat, userLocation.lng, nearestLocation.lat, nearestLocation.lng).km} km away
              </p>
            )}
            <p className="text-gray-600">{nearestLocation.volunteers_needed - nearestLocation.volunteers_signed_up} volunteer spots available</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramMap;