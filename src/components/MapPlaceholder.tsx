import { Map, MapPin, Navigation, Clock, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef, useState } from "react";

// TypeScript declarations for Leaflet
declare global {
  interface Window {
    L: any;
  }
}

const MapPlaceholder = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [userCity, setUserCity] = useState<string>('');
  const [locationStatus, setLocationStatus] = useState<'detecting' | 'granted' | 'denied' | 'unavailable'>('detecting');

  // Default city coordinates (London, UK - you can change this to your city)
  const defaultLocation = { lat: 51.505, lng: -0.09 };

  // Function to generate NGO locations around user's location
  const generateNGOsAroundLocation = (centerLat: number, centerLng: number) => {
    const radius = 0.02; // ~2km radius
    const ngos = [
      {
        id: 1,
        name: "Community Food Bank",
        description: "Helping families access nutritious food",
        category: "Food Security",
        volunteers_needed: 15,
        volunteers_signed_up: 8,
        commitment: "2-4 hours/week",
        next_event: "Food Distribution - Saturday 10 AM",
        contact: "volunteer@foodbank.org",
        hours_open: "Mon-Fri: 9AM-5PM, Sat: 8AM-2PM",
        address: "123 Main St"
      },
      {
        id: 2,
        name: "Youth Education Center",
        description: "Educational support for underprivileged children",
        category: "Education",
        volunteers_needed: 8,
        volunteers_signed_up: 5,
        commitment: "3-5 hours/week",
        next_event: "Tutoring Session - Monday 4 PM",
        contact: "help@youthed.org",
        hours_open: "Mon-Fri: 3PM-7PM, Sat: 10AM-4PM",
        address: "456 School Ave"
      },
      {
        id: 3,
        name: "Senior Care Network",
        description: "Companionship and care for elderly residents",
        category: "Elder Care",
        volunteers_needed: 12,
        volunteers_signed_up: 9,
        commitment: "2-3 hours/week",
        next_event: "Social Hour - Wednesday 2 PM",
        contact: "volunteer@seniorcare.org",
        hours_open: "Daily: 10AM-6PM",
        address: "789 Care Blvd"
      },
      {
        id: 4,
        name: "Environmental Action Group",
        description: "Community clean-up and environmental awareness",
        category: "Environment",
        volunteers_needed: 20,
        volunteers_signed_up: 14,
        commitment: "4-6 hours/month",
        next_event: "Park Clean-up - Sunday 9 AM",
        contact: "action@envirogroup.org",
        hours_open: "Weekends: 8AM-4PM, Events vary",
        address: "321 Green St"
      },
      {
        id: 5,
        name: "Animal Rescue Shelter",
        description: "Care and rehabilitation for rescued animals",
        category: "Animal Welfare",
        volunteers_needed: 10,
        volunteers_signed_up: 7,
        commitment: "3-4 hours/week",
        next_event: "Dog Walking - Daily 8 AM",
        contact: "help@animalrescue.org",
        hours_open: "Daily: 7AM-7PM",
        address: "654 Pet Lane"
      }
    ];

    // Generate coordinates around the center location
    return ngos.map((ngo, index) => {
      const angle = (index * 72) * (Math.PI / 180); // 72 degrees apart (360/5)
      const distance = radius * (0.5 + Math.random() * 0.5); // Random distance within radius
      
      return {
        ...ngo,
        lat: centerLat + (distance * Math.cos(angle)),
        lng: centerLng + (distance * Math.sin(angle))
      };
    });
  };

  // Function to get city name from coordinates
  const getCityFromCoordinates = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      const data = await response.json();
      return data.city || data.locality || data.principalSubdivision || 'Unknown City';
    } catch (error) {
      console.log('Geocoding error:', error);
      return 'Unknown City';
    }
  };

  // Function to calculate distance and travel time
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    // Estimate travel time (assuming average city speed)
    const walkingTime = Math.round(distance * 12); // ~5 km/h walking speed
    const drivingTime = Math.round(distance * 2.5); // ~25 km/h city driving
    
    return {
      distance: distance.toFixed(1),
      walkingTime: walkingTime,
      drivingTime: drivingTime
    };
  };

  // Function to get user's geolocation
  const getUserLocation = () => {
    setLocationStatus('detecting');
    
    if (!navigator.geolocation) {
      setLocationStatus('unavailable');
      return Promise.resolve(null);
    }

    return new Promise<{lat: number, lng: number} | null>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          setLocationStatus('granted');
          
          // Get city name
          const cityName = await getCityFromCoordinates(location.lat, location.lng);
          setUserCity(cityName);
          
          resolve(location);
        },
        (error) => {
          console.log('Geolocation error:', error);
          setLocationStatus('denied');
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  };

  // Function to create user location marker
  const createUserMarker = (map: any, location: {lat: number, lng: number}, cityName?: string) => {
    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
    }

    // Custom icon for user location
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

    const userMarker = window.L.marker([location.lat, location.lng], { icon: userIcon }).addTo(map);
    
    userMarker.bindPopup(`
      <div class="p-3 min-w-[200px] text-center">
        <div class="flex items-center justify-center mb-2">
          <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <h3 class="font-bold text-lg">You are here</h3>
        </div>
        <p class="text-sm text-gray-600">
          ${cityName || 'Current location detected'}
        </p>
      </div>
    `);

    userMarkerRef.current = userMarker;
    return userMarker;
  };

  // Function to fit map bounds to include all markers
  const fitMapBounds = (map: any, ngoLocations: any[], userLoc?: {lat: number, lng: number}) => {
    const allLocations = [...ngoLocations.map(ngo => [ngo.lat, ngo.lng])];
    
    if (userLoc) {
      allLocations.push([userLoc.lat, userLoc.lng]);
    }

    if (allLocations.length > 0) {
      const group = new window.L.featureGroup(
        allLocations.map(loc => window.L.marker(loc))
      );
      map.fitBounds(group.getBounds().pad(0.1));
    }
  };

  useEffect(() => {
    // Wait for Leaflet to be available
    const initializeMap = async () => {
      if (typeof window !== 'undefined' && window.L && mapRef.current && !mapInstanceRef.current) {
        // Get user location first
        const userLoc = await getUserLocation();
        
        // Determine initial map center
        const initialCenter = userLoc || defaultLocation;
        
        // Generate NGO locations around the center point
        const ngoData = generateNGOsAroundLocation(initialCenter.lat, initialCenter.lng);
        
        // Initialize the map with zoom restrictions
        const map = window.L.map(mapRef.current, {
          minZoom: 11, // Prevent zooming out too far
          maxZoom: 18
        }).setView([initialCenter.lat, initialCenter.lng], 13);

        // Add OpenStreetMap tiles (standard OSM)
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        }).addTo(map);

        // Add user location marker if available
        let userMarker = null;
        if (userLoc) {
          // Create user marker immediately with basic info, update with city later
          userMarker = createUserMarker(map, userLoc, 'Current location detected');
        }

        // Add NGO markers with enhanced popups
        const ngoMarkers = [];
        ngoData.forEach(ngo => {
          const marker = window.L.marker([ngo.lat, ngo.lng]).addTo(map);
          ngoMarkers.push(marker);
          
          // Calculate distance if user location is available
          let distanceInfo = '';
          if (userLoc) {
            const distance = calculateDistance(userLoc.lat, userLoc.lng, ngo.lat, ngo.lng);
            distanceInfo = `
              <div class="border-t border-b py-2 my-3">
                <div class="flex items-center text-xs mb-1">
                  <span class="font-semibold text-gray-700 w-16">Distance:</span>
                  <span class="text-gray-600">${distance.distance} km away</span>
                </div>
                <div class="flex items-center text-xs mb-1">
                  <span class="font-semibold text-gray-700 w-16">Walk:</span>
                  <span class="text-gray-600">~${distance.walkingTime} min</span>
                </div>
                <div class="flex items-center text-xs">
                  <span class="font-semibold text-gray-700 w-16">Drive:</span>
                  <span class="text-gray-600">~${distance.drivingTime} min</span>
                </div>
              </div>
            `;
          }
          
          // Create enhanced popup content
          const popupContent = `
            <div class="p-4 min-w-[320px] max-w-[400px]">
              <h3 class="font-bold text-lg mb-2 text-gray-800">${ngo.name}</h3>
              <p class="text-sm text-gray-600 mb-3">${ngo.description}</p>
              
              <div class="space-y-2 mb-3">
                <div class="flex items-center text-xs">
                  <span class="font-semibold text-gray-700 w-20">Category:</span>
                  <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full">${ngo.category}</span>
                </div>
                <div class="flex items-center text-xs">
                  <span class="font-semibold text-gray-700 w-20">Volunteers:</span>
                  <span class="text-gray-600">${ngo.volunteers_signed_up}/${ngo.volunteers_needed} signed up</span>
                </div>
                <div class="flex items-center text-xs">
                  <span class="font-semibold text-gray-700 w-20">Time:</span>
                  <span class="text-gray-600">${ngo.commitment}</span>
                </div>
                <div class="flex items-center text-xs">
                  <span class="font-semibold text-gray-700 w-20">Hours:</span>
                  <span class="text-gray-600">${ngo.hours_open}</span>
                </div>
                <div class="flex items-start text-xs">
                  <span class="font-semibold text-gray-700 w-20">Next:</span>
                  <span class="text-gray-600">${ngo.next_event}</span>
                </div>
                <div class="flex items-start text-xs">
                  <span class="font-semibold text-gray-700 w-20">Address:</span>
                  <span class="text-gray-600">${ngo.address}</span>
                </div>
              </div>
              
              ${distanceInfo}
              
              <div class="space-y-2">
                <button 
                  class="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                  onclick="openRegisterModal('${ngo.id}', '${ngo.name.replace(/'/g, "\\'")}')"
                >
                  🚀 Register to Volunteer
                </button>
                <div class="flex space-x-2">
                  <button class="flex-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-200 transition-colors">
                    📧 Email Info
                  </button>
                  <button class="flex-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-200 transition-colors">
                    📍 Directions
                  </button>
                </div>
                <p class="text-xs text-gray-500 text-center mt-2">
                  Contact: ${ngo.contact}
                </p>
              </div>
            </div>
          `;
          
          marker.bindPopup(popupContent);
        });

        // Set initial view to show all markers nicely
        const allMarkers = [...ngoMarkers];
        if (userMarker) {
          allMarkers.push(userMarker);
        }
        
        if (allMarkers.length > 0) {
          const group = new window.L.featureGroup(allMarkers);
          map.fitBounds(group.getBounds().pad(0.15));
        }

        // Update user marker with city name when available (but don't change map view)
        if (userLoc) {
          setTimeout(() => {
            if (userCity && userMarkerRef.current) {
              userMarkerRef.current.bindPopup(`
                <div class="p-3 min-w-[200px] text-center">
                  <div class="flex items-center justify-center mb-2">
                    <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <h3 class="font-bold text-lg">You are here</h3>
                  </div>
                  <p class="text-sm text-gray-600">
                    ${userCity}
                  </p>
                </div>
              `);
            }
          }, 1000);
        }

        mapInstanceRef.current = map;
        
        // Add global function for register modal
        (window as any).openRegisterModal = (ngoId: string, ngoName: string) => {
          const selectedNgo = ngoData.find(ngo => ngo.id.toString() === ngoId);
          if (selectedNgo) {
            alert(`🎯 VOLUNTEER REGISTRATION\\n\\n` +
                  `Organization: ${ngoName}\\n` +
                  `Current Volunteers: ${selectedNgo.volunteers_signed_up}/${selectedNgo.volunteers_needed}\\n` +
                  `Commitment: ${selectedNgo.commitment}\\n` +
                  `Hours: ${selectedNgo.hours_open}\\n` +
                  `Next Event: ${selectedNgo.next_event}\\n\\n` +
                  `📝 Registration Features:\\n` +
                  `• Personal information form\\n` +
                  `• Schedule preferences\\n` +
                  `• Skills and interests\\n` +
                  `• Background check process\\n` +
                  `• Orientation scheduling\\n\\n` +
                  `Contact: ${selectedNgo.contact}\\n\\n` +
                  `[This would open a proper registration modal in production]`);
          }
        };
      }
    };

    // Check if Leaflet is already loaded
    if (window.L) {
      initializeMap();
    } else {
      // Wait for Leaflet to load
      const checkLeaflet = setInterval(() => {
        if (window.L) {
          clearInterval(checkLeaflet);
          initializeMap();
        }
      }, 100);

      return () => clearInterval(checkLeaflet);
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Explore Volunteer Opportunities
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Use our interactive map to find NGOs near you. We'll detect your location to show 
              the best opportunities in your area.
            </p>
            {userCity && (
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-primary">{userCity}</h3>
              </div>
            )}
          </div>

          {/* Map Container */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border bg-card">
            {/* Leaflet Map */}
            <div 
              ref={mapRef}
              className="w-full aspect-[16/10] md:aspect-[21/9] z-0"
              style={{ minHeight: '400px' }}
            />

            {/* Map Controls Overlay */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
              <button 
                className="bg-background/90 backdrop-blur-sm p-2 rounded-lg shadow-md border border-border hover:bg-background transition-colors"
                onClick={() => {
                  if (mapInstanceRef.current) {
                    const centerLocation = userLocation || defaultLocation;
                    mapInstanceRef.current.setView([centerLocation.lat, centerLocation.lng], 13);
                  }
                }}
                title="Reset Map View"
              >
                <Navigation className="h-5 w-5" />
              </button>
              <button 
                className="bg-background/90 backdrop-blur-sm p-2 rounded-lg shadow-md border border-border hover:bg-background transition-colors"
                onClick={() => {
                  // This would need to be implemented with a ref to the current ngoData
                  if (mapInstanceRef.current) {
                    const centerLocation = userLocation || defaultLocation;
                    mapInstanceRef.current.setView([centerLocation.lat, centerLocation.lng], 13);
                  }
                }}
                title="Show All Locations"
              >
                <MapPin className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Feature Description Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <MapPin className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Your Location</CardTitle>
                <CardDescription>
                  We detect your current location to show the most relevant volunteer 
                  opportunities near you. Your privacy is protected.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:border-accent/50 transition-colors">
              <CardHeader>
                <Clock className="h-10 w-10 text-accent mb-3" />
                <CardTitle>Smart Matching</CardTitle>
                <CardDescription>
                  View time commitments, upcoming events, and volunteer requirements 
                  to find opportunities that match your schedule.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Info className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Detailed Information</CardTitle>
                <CardDescription>
                  Get complete details about each NGO including their mission, contact 
                  information, and how you can make an impact.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapPlaceholder;