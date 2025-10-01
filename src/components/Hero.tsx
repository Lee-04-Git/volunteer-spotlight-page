import { MapPin, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(var(--hero-gradient-from))] to-[hsl(var(--hero-gradient-to))] text-primary-foreground">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl" />
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">Join 10,000+ active volunteers</span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Find a Place to Volunteer{" "}
            <span className="inline-flex items-center gap-2">
              Near You
              <MapPin className="h-10 w-10 md:h-12 md:w-12 inline-block animate-bounce" />
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-lg sm:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-1000">
            Make a difference in your community. Discover local NGOs and volunteer opportunities 
            that match your passion and schedule. Every helping hand counts.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <Button variant="hero" size="lg" className="w-full sm:w-auto">
              <Heart className="h-5 w-5" />
              Start Volunteering
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20"
            >
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-16 pt-8 border-t border-primary-foreground/20">
            <div className="animate-in fade-in slide-in-from-bottom-7 duration-1000">
              <div className="text-3xl md:text-4xl font-bold mb-1">150+</div>
              <div className="text-sm text-primary-foreground/80">NGO Partners</div>
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
              <div className="text-3xl md:text-4xl font-bold mb-1">10K+</div>
              <div className="text-sm text-primary-foreground/80">Active Volunteers</div>
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-9 duration-1000 delay-200">
              <div className="text-3xl md:text-4xl font-bold mb-1">50+</div>
              <div className="text-sm text-primary-foreground/80">Cities Covered</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
