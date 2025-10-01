import React, { useState, useEffect, useCallback } from "react";
import { Plus, Minus, Navigation2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProgramSelector from "./ProgramSelector";
import VolunteerMapModal from "./VolunteerMapModal";
import { DEFAULT_LOCATION } from "../data/MarkerData";

const MapPlaceholder = () => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedProgramData, setSelectedProgramData] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get user location on component mount
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setUserLocation(DEFAULT_LOCATION);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.log("Geolocation error:", error);
        // Default to Cape Town if geolocation fails
        setUserLocation(DEFAULT_LOCATION);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, []);

  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  // Handle program selection
  const handleSelectProgram = (programType, programData) => {
    setSelectedProgram(programType);
    setSelectedProgramData(programData);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProgram(null);
    setSelectedProgramData(null);
  };

  return (
    <>
      {/* Program Selection Section */}
      <ProgramSelector onSelectProgram={handleSelectProgram} />

      {/* Map Modal */}
      <VolunteerMapModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        programType={selectedProgram}
        programData={selectedProgramData}
        userLocation={userLocation}
      />
    </>
  );
};

export default MapPlaceholder;
