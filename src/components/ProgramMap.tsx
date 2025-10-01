import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  MapPin,
  Navigation,
  Clock,
  Users,
  Star,
  Plus,
  Minus,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PROGRAM_DATA,
  DEFAULT_LOCATION,
  calculateDistance,
  findNearestLocation,
  getConnectedPrograms,
} from "../data/MarkerData";

// TypeScript declarations for Leaflet
declare global {
  interface Window {
    L: any;
  }
}

const ProgramMap = ({
  programType,
  programData,
  userLocation: initialUserLocation,
  isFullscreen,
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);

  const [userLocation, setUserLocation] = useState(initialUserLocation);
  const [isLoading, setIsLoading] = useState(true);
  const [nearestLocation, setNearestLocation] = useState(null);
  const [showConnectedPrograms, setShowConnectedPrograms] = useState({});
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Get current program locations
  const programLocations = PROGRAM_DATA[programType] || [];

  // Custom icons for different program types
  const getCustomIcon = useCallback(
    (type, isNearest = false) => {
      const color = isNearest ? "#F59E0B" : programData.color; // Orange for nearest, program color for others
      const size = isNearest ? 35 : 25;

      let iconHtml = "";
      switch (programData.icon) {
        case "medical":
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
            font-size: ${isNearest ? "16px" : "12px"};
            position: relative;
          ">
            🏥
            ${
              isNearest
                ? '<div style="position: absolute; top: -8px; right: -8px; background: #F59E0B; color: white; border-radius: 50%; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold;">★</div>'
                : ""
            }
          </div>
        `;
          break;
        case "book":
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
            font-size: ${isNearest ? "16px" : "12px"};
            position: relative;
          ">
            📚
            ${
              isNearest
                ? '<div style="position: absolute; top: -8px; right: -8px; background: #F59E0B; color: white; border-radius: 50%; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold;">★</div>'
                : ""
            }
          </div>
        `;
          break;
        case "home":
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
            font-size: ${isNearest ? "16px" : "12px"};
            position: relative;
          ">
            🏠
            ${
              isNearest
                ? '<div style="position: absolute; top: -8px; right: -8px; background: #F59E0B; color: white; border-radius: 50%; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold;">★</div>'
                : ""
            }
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
        className: "custom-program-marker",
        html: iconHtml,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });
    },
    [programData]
  );

  // Create enhanced popup content

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
          lng: position.coords.longitude,
        };
        setUserLocation(location);
        setIsLoading(false);
      },
      (error) => {
        console.log("Geolocation error:", error);
        setUserLocation(DEFAULT_LOCATION);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, []);

  // Handle location marker click
  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    setIsDetailModalOpen(true);
  };

  // Initialize map
  useEffect(() => {
    if (!userLocation) {
      getUserLocation();
      return;
    }

    const initializeMap = () => {
      if (
        typeof window !== "undefined" &&
        window.L &&
        mapRef.current &&
        !mapInstanceRef.current
      ) {
        // Find nearest location
        const nearest = findNearestLocation(userLocation, programLocations);
        setNearestLocation(nearest);

        // Initialize map
        const map = window.L.map(mapRef.current, {
          minZoom: 10,
          maxZoom: 18,
        }).setView([userLocation.lat, userLocation.lng], 12);

        // Add tiles
        window.L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18,
          }
        ).addTo(map);

        // Add user location marker with enhanced visibility
        const userIcon = window.L.divIcon({
          className: "user-location-marker",
          html: `
            <div style="
              background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
              width: 24px;
              height: 24px;
              border-radius: 50%;
              border: 4px solid white;
              box-shadow: 0 3px 8px rgba(0,0,0,0.4);
              position: relative;
              cursor: pointer;
            ">
              <div style="
                position: absolute;
                top: -8px;
                left: -8px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: rgba(59, 130, 246, 0.2);
                animation: userPulse 2.5s infinite;
                pointer-events: none;
              "></div>
              <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 8px;
                height: 8px;
                background: white;
                border-radius: 50%;
              "></div>
            </div>
            <style>
              @keyframes userPulse {
                0% { transform: scale(1); opacity: 0.8; }
                50% { transform: scale(1.3); opacity: 0.4; }
                100% { transform: scale(1.6); opacity: 0; }
              }
            </style>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const userMarker = window.L.marker(
          [userLocation.lat, userLocation.lng],
          { icon: userIcon }
        ).addTo(map);

        // Add click handler for user location with enhanced info
        userMarker.on("click", () => {
          const nearestDist = nearest
            ? calculateDistance(
                userLocation.lat,
                userLocation.lng,
                nearest.lat,
                nearest.lng
              )
            : null;

          handleLocationClick({
            id: "user-location",
            name: "📍 Your Current Location",
            address: "Cape Town, South Africa",
            description: nearestDist
              ? `You are ${nearestDist.km} km away from the nearest ${programData?.name} location (${nearest?.name})`
              : "Your current location on the map",
            category: "User Location",
            hours_open: "N/A",
            volunteers_signed_up: 0,
            volunteers_needed: 0,
            commitment: "N/A",
            next_event: "N/A",
            programs: ["Your Location"],
            contact: "You",
            lat: userLocation.lat,
            lng: userLocation.lng,
          });
        });
        userMarkerRef.current = userMarker;

        // Add program location markers
        const markers = [];
        programLocations.forEach((location) => {
          const isNearest = nearest && location.id === nearest.id;
          const icon = getCustomIcon(programType, isNearest);
          const marker = window.L.marker([location.lat, location.lng], {
            icon,
          }).addTo(map);

          // Add click handler instead of popup
          marker.on("click", () => {
            handleLocationClick(location);
          });

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
          alert(
            `🎯 VOLUNTEER REGISTRATION\n\nLocation: ${locationName}\n\n` +
              `This would open the registration form for ${locationName}.\n\n` +
              `Registration process includes:\n` +
              `• Application form\n• Background check\n• Orientation scheduling\n• Training programs`
          );
        };

        (window as any).showConnectedPrograms = (locationId) => {
          const location = programLocations.find(
            (loc) => loc.id === locationId
          );
          if (location && location.connected_programs) {
            const connectedData = getConnectedPrograms(
              programType,
              location.connected_programs,
              userLocation
            );

            let message = `🔗 CONNECTED PROGRAMS\n\nFor ${location.name}:\n\n`;
            connectedData.forEach((program) => {
              const distance = calculateDistance(
                userLocation.lat,
                userLocation.lng,
                program.location.lat,
                program.location.lng
              );
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
  }, [
    userLocation,
    programType,
    programLocations,
    getUserLocation,
    getCustomIcon,
  ]);

  // Zoom control functions
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  // Handle register for volunteer
  const handleRegisterVolunteer = (location) => {
    const distance = userLocation
      ? calculateDistance(
          userLocation.lat,
          userLocation.lng,
          location.lat,
          location.lng
        )
      : null;

    alert(
      `🎯 VOLUNTEER REGISTRATION\n\n` +
        `Organization: ${location.name}\n` +
        `Category: ${location.category}\n` +
        `Current Volunteers: ${location.volunteers_signed_up}/${location.volunteers_needed}\n` +
        `Commitment: ${location.commitment}\n` +
        `Next Event: ${location.next_event}\n` +
        (distance ? `\nDistance: ${distance.km} km away\n` : "") +
        `\n📝 Registration Process:\n` +
        `• Complete volunteer application\n` +
        `• Background verification\n` +
        `• Orientation scheduling\n` +
        `• Training program enrollment\n\n` +
        `Contact: ${location.contact}\n\n` +
        `[This would open a proper registration form in production]`
    );

    setIsDetailModalOpen(false);
  };

  return (
    <div className="relative w-full h-full bg-gray-100">
      {/* Map Container */}
      <div
        ref={mapRef}
        className="w-full h-full"
        style={{ minHeight: "400px" }}
      />

      {/* Map Overlay when modal is open */}
      {isDetailModalOpen && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-20 pointer-events-none" />
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-30 backdrop-blur-sm">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-gray-700">
              Loading map...
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Finding {programData?.name} locations
            </p>
          </div>
        </div>
      )}

      {/* Zoom Controls */}
      <div
        className={`absolute top-4 right-4 flex flex-col gap-2 z-10 transition-all duration-300 ${
          isDetailModalOpen ? "opacity-30 pointer-events-none" : "opacity-100"
        }`}
      >
        <Button
          variant="outline"
          size="sm"
          className="w-10 h-10 p-0 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all"
          onClick={handleZoomIn}
          title="Zoom In"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-10 h-10 p-0 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all"
          onClick={handleZoomOut}
          title="Zoom Out"
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>

      {/* Map Info Overlay */}
      {!isLoading && nearestLocation && (
        <div
          className={`absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-sm z-10 transition-all duration-300 ${
            isDetailModalOpen ? "opacity-30 pointer-events-none" : "opacity-100"
          }`}
        >
          <h3 className="font-bold text-sm mb-2 flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-2" />
            Nearest Location
          </h3>
          <div className="space-y-1 text-xs">
            <p className="font-medium">{nearestLocation.name}</p>
            {userLocation && (
              <p className="text-gray-600">
                {
                  calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    nearestLocation.lat,
                    nearestLocation.lng
                  ).km
                }{" "}
                km away
              </p>
            )}
            <p className="text-gray-600">
              {nearestLocation.volunteers_needed -
                nearestLocation.volunteers_signed_up}{" "}
              volunteer spots available
            </p>
          </div>
        </div>
      )}

      {/* Location Detail Modal */}
      {(isDetailModalOpen && selectedLocation) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]"
          onClick={() => setIsDetailModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedLocation.name}</h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600">{selectedLocation.description}</p>
              
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium">Address:</p>
                <p className="text-sm">{selectedLocation.address}</p>
              </div>
              
              {userLocation && (
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm font-medium text-blue-800">Distance from you:</p>
                  <p className="text-lg font-bold text-blue-900">
                    {calculateDistance(userLocation.lat, userLocation.lng, selectedLocation.lat, selectedLocation.lng).km} km
                  </p>
                  <div className="text-sm text-blue-700 mt-1">
                    <p>🚶 ~{calculateDistance(userLocation.lat, userLocation.lng, selectedLocation.lat, selectedLocation.lng).walkingTimeMinutes} min walk</p>
                    <p>🚗 ~{calculateDistance(userLocation.lat, userLocation.lng, selectedLocation.lat, selectedLocation.lng).drivingTimeMinutes} min drive</p>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <div>
                  <p className="font-medium">Volunteers needed:</p>
                  <p>{selectedLocation.volunteers_signed_up}/{selectedLocation.volunteers_needed}</p>
                </div>
                <div>
                  <p className="font-medium">Hours:</p>
                  <p>{selectedLocation.hours_open}</p>
                </div>
              </div>
              
              <button
                onClick={() => handleRegisterVolunteer(selectedLocation)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded font-semibold hover:bg-blue-700 transition-colors"
              >
                Apply to Volunteer
              </button>
              
              <p className="text-xs text-gray-500 text-center">
                Contact: {selectedLocation.contact}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramMap;
