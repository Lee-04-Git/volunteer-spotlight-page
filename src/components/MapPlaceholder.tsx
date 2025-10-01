import { Map, MapPin, Navigation, Clock, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MapPlaceholder = () => {
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
              Use our interactive map to find NGOs near you. Click on any marker to see details 
              and sign up to volunteer.
            </p>
          </div>

          {/* Map Container */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border bg-card">
            {/* Map Placeholder */}
            <div className="relative aspect-[16/10] md:aspect-[21/9] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
              {/* Grid overlay */}
              <div className="absolute inset-0 bg-grid-foreground/[0.02] bg-[size:30px_30px]" />
              
              {/* Floating markers animation */}
              <div className="absolute top-1/4 left-1/4 animate-bounce">
                <MapPin className="h-8 w-8 text-primary fill-primary opacity-60" />
              </div>
              <div className="absolute top-1/3 right-1/3 animate-bounce delay-100">
                <MapPin className="h-8 w-8 text-accent fill-accent opacity-60" />
              </div>
              <div className="absolute bottom-1/4 right-1/4 animate-bounce delay-200">
                <MapPin className="h-8 w-8 text-primary fill-primary opacity-60" />
              </div>

              {/* Center content */}
              <div className="relative z-10 text-center max-w-md mx-auto px-4">
                <div className="bg-background/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-border">
                  <Map className="h-16 w-16 mx-auto mb-4 text-primary" />
                  <h3 className="text-2xl font-bold mb-2">Interactive Map Will Appear Here</h3>
                  <p className="text-muted-foreground mb-4">
                    Integration with Leaflet map library coming soon
                  </p>
                  <Badge variant="secondary" className="text-sm">
                    Under Development
                  </Badge>
                </div>
              </div>
            </div>

            {/* Map Controls Overlay */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button className="bg-background/90 backdrop-blur-sm p-2 rounded-lg shadow-md border border-border hover:bg-background transition-colors">
                <Navigation className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Feature Description Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <MapPin className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Location Details</CardTitle>
                <CardDescription>
                  View complete information about each NGO including address, contact details, 
                  and areas of focus.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:border-accent/50 transition-colors">
              <CardHeader>
                <Clock className="h-10 w-10 text-accent mb-3" />
                <CardTitle>Drive Time Estimates</CardTitle>
                <CardDescription>
                  See estimated travel time from your current location to help you plan your 
                  volunteer schedule efficiently.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Info className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Activity Information</CardTitle>
                <CardDescription>
                  Learn about ongoing projects, required skills, time commitments, and how you 
                  can make an impact.
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
