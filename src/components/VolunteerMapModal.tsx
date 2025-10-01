import React, { useEffect, useRef } from 'react';
import { X, MapPin, Navigation, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProgramMap from './ProgramMap';

const VolunteerMapModal = ({ 
  isOpen, 
  onClose, 
  programType, 
  programData, 
  userLocation 
}) => {
  const modalRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle click outside modal to close
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className={`
          bg-white rounded-2xl shadow-2xl transform transition-all duration-300 
          ${isFullscreen 
            ? 'w-full h-full rounded-none' 
            : 'w-full max-w-6xl h-[90vh] max-h-[800px]'
          }
          flex flex-col overflow-hidden
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-center gap-4">
            {/* Program Icon */}
            <div 
              className="p-3 rounded-full"
              style={{ backgroundColor: `${programData?.color}20`, color: programData?.color }}
            >
              {programData?.icon === 'medical' && <div className="text-2xl">🏥</div>}
              {programData?.icon === 'book' && <div className="text-2xl">📚</div>}
              {programData?.icon === 'home' && <div className="text-2xl">🏠</div>}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {programData?.name}
              </h2>
              <p className="text-gray-600">
                {programData?.description}
              </p>
            </div>
          </div>

          {/* Modal Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="text-gray-500 hover:text-gray-700"
            >
              {isFullscreen ? (
                <Minimize2 className="h-5 w-5" />
              ) : (
                <Maximize2 className="h-5 w-5" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Location Stats Bar */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">
                  {programType ? 
                    `${require('../data/MarkerData').PROGRAM_DATA[programType]?.length || 0} locations` 
                    : '0 locations'
                  }
                </span>
              </div>
              
              {userLocation && (
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-blue-500" />
                  <span className="text-gray-600">Your location detected</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-xs">
                Interactive Map
              </Badge>
              <Badge 
                style={{ backgroundColor: `${programData?.color}20`, color: programData?.color }}
                className="text-xs"
              >
                {programData?.name}
              </Badge>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative overflow-hidden">
          {programType && (
            <ProgramMap 
              programType={programType}
              programData={programData}
              userLocation={userLocation}
              isFullscreen={isFullscreen}
            />
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Your Location</span>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: programData?.color }}
                ></div>
                <span>Program Locations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Nearest Location</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onClose}>
                Close Map
              </Button>
              <Button 
                style={{ backgroundColor: programData?.color }}
                className="text-white"
                onClick={() => {
                  // This could navigate to a registration page
                  alert(`Would navigate to ${programData?.name} volunteer registration page`);
                }}
              >
                Start Volunteering
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerMapModal;