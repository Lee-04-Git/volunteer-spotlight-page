// MarkerData.js - Centralized data for all volunteer programs
// Cape Town coordinates as default location
export const DEFAULT_LOCATION = { lat: -33.9249, lng: 18.4241 };

// Program types with their custom icons and colors
export const PROGRAM_TYPES = {
  REHAB: {
    id: 'rehab',
    name: 'Rehabilitation Centers',
    icon: 'medical',
    color: '#10B981', // Green
    description: 'Support addiction recovery and mental health programs'
  },
  EDUCATION: {
    id: 'education',
    name: 'Education Centers',
    icon: 'book',
    color: '#3B82F6', // Blue
    description: 'Help provide educational support and tutoring'
  },
  HOMELESS_SHELTER: {
    id: 'homeless_shelter',
    name: 'Homeless Shelters',
    icon: 'home',
    color: '#F59E0B', // Orange
    description: 'Assist with housing and basic needs support'
  }
};

// Generate locations around a center point with some randomization
const generateLocationsAround = (centerLat, centerLng, count = 5, radius = 0.05) => {
  const locations = [];
  for (let i = 0; i < count; i++) {
    const angle = (i * (360 / count)) * (Math.PI / 180);
    const distance = radius * (0.3 + Math.random() * 0.7);
    
    locations.push({
      lat: centerLat + (distance * Math.cos(angle)),
      lng: centerLng + (distance * Math.sin(angle))
    });
  }
  return locations;
};

// Base NGO data structure
const createNGOData = (locations, baseData) => {
  return locations.map((location, index) => ({
    ...baseData[index % baseData.length],
    id: `${baseData[index % baseData.length].id}_${index}`,
    lat: location.lat,
    lng: location.lng
  }));
};

// Base data for each program type
const REHAB_BASE_DATA = [
  {
    id: 'hope_recovery',
    name: 'Hope Recovery Center',
    description: 'Comprehensive addiction recovery and mental health support',
    address: '123 Recovery Ave, Cape Town',
    contact: 'volunteer@hoperecovery.org',
    phone: '+27 21 123 4567',
    hours_open: 'Mon-Fri: 8AM-6PM, Sat: 9AM-4PM',
    volunteers_needed: 12,
    volunteers_signed_up: 8,
    commitment: '3-4 hours/week',
    next_event: 'Group Therapy Support - Wednesday 2 PM',
    programs: ['Addiction Counseling', 'Art Therapy', 'Life Skills Training'],
    requirements: ['Background check required', 'Training provided', 'Minimum 6 month commitment'],
    connected_programs: ['education', 'homeless_shelter']
  },
  {
    id: 'healing_minds',
    name: 'Healing Minds Foundation',
    description: 'Mental health awareness and crisis intervention support',
    address: '456 Wellness St, Cape Town',
    contact: 'help@healingminds.org',
    phone: '+27 21 234 5678',
    hours_open: 'Daily: 9AM-9PM',
    volunteers_needed: 15,
    volunteers_signed_up: 11,
    commitment: '4-6 hours/week',
    next_event: 'Crisis Hotline Training - Saturday 10 AM',
    programs: ['Crisis Hotline', 'Peer Support', 'Community Outreach'],
    requirements: ['Mental health first aid certification preferred', 'Excellent listening skills'],
    connected_programs: ['education']
  },
  {
    id: 'new_beginnings',
    name: 'New Beginnings Rehab',
    description: 'Residential rehabilitation and aftercare programs',
    address: '789 Fresh Start Rd, Cape Town',
    contact: 'volunteer@newbeginnings.org',
    phone: '+27 21 345 6789',
    hours_open: 'Mon-Sun: 7AM-10PM',
    volunteers_needed: 20,
    volunteers_signed_up: 14,
    commitment: '2-3 hours/week',
    next_event: 'Recovery Workshop - Friday 4 PM',
    programs: ['Residential Care', 'Aftercare Support', 'Family Counseling'],
    requirements: ['Must be 21+', 'Substance-free lifestyle', 'Regular availability'],
    connected_programs: ['homeless_shelter']
  }
];

const EDUCATION_BASE_DATA = [
  {
    id: 'bright_futures',
    name: 'Bright Futures Learning Center',
    description: 'Educational support for underprivileged children and adults',
    address: '321 Education Blvd, Cape Town',
    contact: 'teach@brightfutures.org',
    phone: '+27 21 456 7890',
    hours_open: 'Mon-Fri: 2PM-8PM, Sat: 9AM-5PM',
    volunteers_needed: 18,
    volunteers_signed_up: 12,
    commitment: '3-5 hours/week',
    next_event: 'Math Tutoring Session - Monday 4 PM',
    programs: ['Academic Tutoring', 'Computer Literacy', 'Adult Education'],
    requirements: ['High school diploma minimum', 'Patience with learners', 'Reliable schedule'],
    connected_programs: ['rehab', 'homeless_shelter']
  },
  {
    id: 'knowledge_bridge',
    name: 'Knowledge Bridge Academy',
    description: 'Bridging educational gaps in disadvantaged communities',
    address: '654 Learning Lane, Cape Town',
    contact: 'volunteer@knowledgebridge.org',
    phone: '+27 21 567 8901',
    hours_open: 'Mon-Fri: 3PM-7PM, Sat: 10AM-4PM',
    volunteers_needed: 10,
    volunteers_signed_up: 7,
    commitment: '2-4 hours/week',
    next_event: 'Reading Program - Tuesday 3:30 PM',
    programs: ['Reading Support', 'Science Labs', 'Career Guidance'],
    requirements: ['Subject expertise preferred', 'Background check required'],
    connected_programs: ['rehab']
  },
  {
    id: 'digital_literacy',
    name: 'Digital Literacy Hub',
    description: 'Teaching essential computer and digital skills',
    address: '987 Tech Center Way, Cape Town',
    contact: 'info@digitalliteracy.org',
    phone: '+27 21 678 9012',
    hours_open: 'Mon-Sat: 10AM-6PM',
    volunteers_needed: 8,
    volunteers_signed_up: 5,
    commitment: '4-6 hours/week',
    next_event: 'Basic Computer Skills - Thursday 11 AM',
    programs: ['Basic Computing', 'Internet Safety', 'Digital Job Skills'],
    requirements: ['Computer proficiency required', 'Teaching experience preferred'],
    connected_programs: ['homeless_shelter']
  }
];

const HOMELESS_SHELTER_BASE_DATA = [
  {
    id: 'safe_harbor',
    name: 'Safe Harbor Shelter',
    description: 'Emergency housing and support services for homeless individuals',
    address: '147 Shelter St, Cape Town',
    contact: 'help@safeharbor.org',
    phone: '+27 21 789 0123',
    hours_open: 'Daily: 24/7 (Volunteer shifts vary)',
    volunteers_needed: 25,
    volunteers_signed_up: 19,
    commitment: '4-8 hours/week',
    next_event: 'Meal Service - Daily 6 PM',
    programs: ['Emergency Housing', 'Meal Service', 'Case Management'],
    requirements: ['Flexible schedule', 'Compassionate attitude', 'Physical ability for meal prep'],
    connected_programs: ['rehab', 'education']
  },
  {
    id: 'hope_house',
    name: 'Hope House Transitional Living',
    description: 'Transitional housing and life skills development',
    address: '258 Transition Ave, Cape Town',
    contact: 'volunteer@hopehouse.org',
    phone: '+27 21 890 1234',
    hours_open: 'Mon-Fri: 8AM-8PM, Weekends: 10AM-6PM',
    volunteers_needed: 16,
    volunteers_signed_up: 12,
    commitment: '3-5 hours/week',
    next_event: 'Life Skills Workshop - Wednesday 1 PM',
    programs: ['Transitional Housing', 'Job Training', 'Financial Literacy'],
    requirements: ['Professional experience helpful', 'Long-term commitment preferred'],
    connected_programs: ['education']
  },
  {
    id: 'community_outreach',
    name: 'Community Outreach Mobile Unit',
    description: 'Mobile services bringing aid directly to homeless communities',
    address: '369 Outreach Rd, Cape Town',
    contact: 'mobile@communityoutreach.org',
    phone: '+27 21 901 2345',
    hours_open: 'Daily: 6AM-10PM (Mobile schedule)',
    volunteers_needed: 12,
    volunteers_signed_up: 8,
    commitment: '6-8 hours/week',
    next_event: 'Street Outreach - Saturday 7 AM',
    programs: ['Mobile Services', 'Health Screenings', 'Resource Connection'],
    requirements: ['Ability to work outdoors', 'Valid driver license preferred', 'Strong communication skills'],
    connected_programs: ['rehab']
  }
];

// Generate location data for each program type
export const PROGRAM_DATA = {
  rehab: createNGOData(
    generateLocationsAround(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng, 5, 0.04),
    REHAB_BASE_DATA
  ),
  education: createNGOData(
    generateLocationsAround(DEFAULT_LOCATION.lat + 0.02, DEFAULT_LOCATION.lng - 0.02, 5, 0.04),
    EDUCATION_BASE_DATA
  ),
  homeless_shelter: createNGOData(
    generateLocationsAround(DEFAULT_LOCATION.lat - 0.02, DEFAULT_LOCATION.lng + 0.02, 5, 0.04),
    HOMELESS_SHELTER_BASE_DATA
  )
};

// Helper function to get connected program data
export const getConnectedPrograms = (currentProgramType, connectedProgramIds, userLocation = null) => {
  const connected = [];
  
  connectedProgramIds.forEach(programId => {
    if (PROGRAM_DATA[programId]) {
      // Get closest location from each connected program
      let closestLocation = PROGRAM_DATA[programId][0];
      
      if (userLocation) {
        closestLocation = PROGRAM_DATA[programId].reduce((closest, current) => {
          const closestDistance = calculateDistance(userLocation.lat, userLocation.lng, closest.lat, closest.lng);
          const currentDistance = calculateDistance(userLocation.lat, userLocation.lng, current.lat, current.lng);
          return currentDistance < closestDistance ? current : closest;
        });
      }
      
      connected.push({
        programType: PROGRAM_TYPES[programId.toUpperCase()],
        location: closestLocation
      });
    }
  });
  
  return connected;
};

// Helper function to calculate distance between two points
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return {
    km: distance.toFixed(2),
    walkingTimeMinutes: Math.round(distance * 12), // ~5 km/h walking speed
    drivingTimeMinutes: Math.round(distance * 2.5) // ~25 km/h city driving
  };
};

// Helper function to find nearest location
export const findNearestLocation = (userLocation, programData) => {
  if (!userLocation || !programData.length) return programData[0];
  
  return programData.reduce((nearest, current) => {
    const nearestDistance = calculateDistance(userLocation.lat, userLocation.lng, nearest.lat, nearest.lng);
    const currentDistance = calculateDistance(userLocation.lat, userLocation.lng, current.lat, current.lng);
    return currentDistance.km < nearestDistance.km ? current : nearest;
  });
};