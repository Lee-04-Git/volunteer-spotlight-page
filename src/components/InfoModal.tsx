import { useState } from "react";
import { MapPin, Clock, Users, Heart, ExternalLink, Phone, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const InfoModal = () => {
  const [open, setOpen] = useState(false);

  // Example NGO data - this would come from map marker click
  const ngoData = {
    name: "Hope Community Center",
    address: "123 Main Street, Downtown",
    distance: "2.5 km",
    driveTime: "8 minutes",
    activities: ["Education Support", "Food Distribution", "Community Events"],
    description: "A local community center dedicated to supporting underprivileged families through education, nutrition, and community building programs.",
    contact: {
      phone: "+1 (555) 123-4567",
      email: "volunteer@hopecenter.org"
    },
    volunteersNeeded: 12,
    nextEvent: "Saturday, 10:00 AM - Community Meal Service"
  };

  return (
    <div className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Map Popup Modal Preview
        </h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          When you click on a marker on the map, a modal like this will appear with detailed 
          information about the volunteer opportunity.
        </p>

        {/* Demo Modal Trigger */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="default" size="lg">
              <MapPin className="h-5 w-5" />
              Preview Modal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-start gap-3">
                <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <span>{ngoData.name}</span>
              </DialogTitle>
              <DialogDescription className="text-base">
                {ngoData.address}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {/* Distance & Drive Time */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{ngoData.distance} away</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg">
                  <Clock className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">{ngoData.driveTime} drive</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{ngoData.volunteersNeeded} volunteers needed</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-muted-foreground">{ngoData.description}</p>
              </div>

              <Separator />

              {/* Activities */}
              <div>
                <h3 className="font-semibold mb-3">Volunteer Activities</h3>
                <div className="flex flex-wrap gap-2">
                  {ngoData.activities.map((activity, index) => (
                    <Badge key={index} variant="secondary">
                      {activity}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Next Event */}
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Next Volunteer Opportunity</h4>
                    <p className="text-sm text-muted-foreground">{ngoData.nextEvent}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="font-semibold mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <a 
                    href={`tel:${ngoData.contact.phone}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    {ngoData.contact.phone}
                  </a>
                  <a 
                    href={`mailto:${ngoData.contact.email}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    {ngoData.contact.email}
                  </a>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button variant="hero" className="flex-1">
                  <Heart className="h-4 w-4" />
                  Sign Up to Volunteer
                </Button>
                <Button variant="outline" className="flex-1">
                  <ExternalLink className="h-4 w-4" />
                  Visit Website
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default InfoModal;
