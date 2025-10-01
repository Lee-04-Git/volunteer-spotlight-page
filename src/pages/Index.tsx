import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MapPlaceholder from "@/components/MapPlaceholder";
import InfoModal from "@/components/InfoModal";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <MapPlaceholder />
      <InfoModal />
    </div>
  );
};

export default Index;
