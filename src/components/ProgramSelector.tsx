import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Heart, 
  BookOpen, 
  Home, 
  MapPin, 
  Users, 
  Clock, 
  Search,
  Filter,
  Star,
  TrendingUp,
  Calendar,
  Award,
  Target,
  Zap
} from "lucide-react";
import { PROGRAM_TYPES, PROGRAM_DATA } from '../data/MarkerData';

const ProgramSelector = ({ onSelectProgram }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Icon mapping for each program type
  const getIconComponent = (iconType, isLarge = false) => {
    const size = isLarge ? "h-12 w-12" : "h-8 w-8";
    switch (iconType) {
      case 'medical':
        return <Heart className={size} />;
      case 'book':
        return <BookOpen className={size} />;
      case 'home':
        return <Home className={size} />;
      default:
        return <MapPin className={size} />;
    }
  };

  // Calculate comprehensive stats for each program
  const getProgramStats = (programType) => {
    const programData = PROGRAM_DATA[programType];
    const totalLocations = programData.length;
    const totalVolunteersNeeded = programData.reduce((sum, location) => sum + location.volunteers_needed, 0);
    const totalVolunteersSignedUp = programData.reduce((sum, location) => sum + location.volunteers_signed_up, 0);
    const averageCommitment = programData.reduce((sum, location) => {
      const hours = parseFloat(location.commitment.match(/\d+/)?.[0] || '3');
      return sum + hours;
    }, 0) / programData.length;
    
    return {
      locations: totalLocations,
      volunteersNeeded: totalVolunteersNeeded,
      volunteersSignedUp: totalVolunteersSignedUp,
      availableSpots: totalVolunteersNeeded - totalVolunteersSignedUp,
      averageCommitment: Math.round(averageCommitment),
      fillRate: Math.round((totalVolunteersSignedUp / totalVolunteersNeeded) * 100)
    };
  };

  const programCards = [
    {
      type: 'rehab',
      data: PROGRAM_TYPES.REHAB,
      stats: getProgramStats('rehab'),
      impact: 'Life-Changing',
      urgency: 'urgent',
      timeCommitment: 'Medium',
      skills: ['Empathy', 'Active Listening', 'Patience'],
      trending: true,
      featured: true
    },
    {
      type: 'education',
      data: PROGRAM_TYPES.EDUCATION,
      stats: getProgramStats('education'),
      impact: 'Future-Building',
      urgency: 'medium',
      timeCommitment: 'Flexible',
      skills: ['Teaching', 'Mentoring', 'Subject Knowledge'],
      trending: false,
      featured: false
    },
    {
      type: 'homeless_shelter',
      data: PROGRAM_TYPES.HOMELESS_SHELTER,
      stats: getProgramStats('homeless_shelter'),
      impact: 'Immediate Relief',
      urgency: 'high',
      timeCommitment: 'High',
      skills: ['Compassion', 'Physical Tasks', 'Team Work'],
      trending: true,
      featured: false
    }
  ];

  // Filter programs based on search and filters
  const filteredPrograms = useMemo(() => {
    return programCards.filter(program => {
      const matchesSearch = program.data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           program.data.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           program.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFilter = selectedFilter === 'all' || 
                           selectedFilter === program.urgency ||
                           (selectedFilter === 'trending' && program.trending) ||
                           (selectedFilter === 'featured' && program.featured);
      
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, selectedFilter, programCards]);

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'Life-Changing':
        return 'text-purple-600';
      case 'Future-Building':
        return 'text-blue-600';
      case 'Immediate Relief':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-background via-secondary/20 to-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-sm font-medium text-primary mb-4">
              <Zap className="h-4 w-4" />
              Volunteer Opportunities
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Find Your Perfect Match
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover volunteer opportunities tailored to your skills, schedule, and passion. 
              Join a community of changemakers making real impact across Cape Town.
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-border/50 p-6 mb-12 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search by program, skills, or impact type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-lg border-2 focus:border-primary"
                />
              </div>
              
              {/* Advanced Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="h-12 px-6"
              >
                <Filter className="h-4 w-4 mr-2" />
                {showAdvanced ? 'Simple View' : 'Advanced Filters'}
              </Button>
            </div>

            {/* Filter Pills */}
            {showAdvanced && (
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'All Programs', icon: Target },
                  { id: 'urgent', label: 'Urgent Need', icon: Zap },
                  { id: 'high', label: 'High Priority', icon: TrendingUp },
                  { id: 'medium', label: 'Standard', icon: Calendar },
                  { id: 'trending', label: 'Trending', icon: Star },
                  { id: 'featured', label: 'Featured', icon: Award }
                ].map((filter) => (
                  <Button
                    key={filter.id}
                    variant={selectedFilter === filter.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter(filter.id)}
                    className="transition-all duration-200"
                  >
                    <filter.icon className="h-3 w-3 mr-1" />
                    {filter.label}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Programs Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {filteredPrograms.map((program) => (
              <Card 
                key={program.type}
                className="group relative overflow-hidden border-2 border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:scale-105 bg-gradient-to-br from-white to-gray-50/50"
              >
                {/* Featured Badge */}
                {program.featured && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                )}

                {/* Trending Indicator */}
                {program.trending && (
                  <div className="absolute top-4 left-4 z-10">
                    <Badge variant="secondary" className="bg-gradient-to-r from-green-100 to-green-200 text-green-800">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  </div>
                )}

                {/* Card Header with Enhanced Icon */}
                <CardHeader className="text-center pb-6 pt-12">
                  <div className="relative">
                    <div 
                      className="mx-auto mb-6 p-6 rounded-2xl transition-all duration-300 group-hover:scale-110"
                      style={{ 
                        backgroundColor: `${program.data.color}15`, 
                        color: program.data.color,
                        boxShadow: `0 8px 32px ${program.data.color}20`
                      }}
                    >
                      {getIconComponent(program.data.icon, true)}
                    </div>
                    
                    {/* Floating Stats */}
                    <div className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-lg border">
                      <div className="text-xs font-bold" style={{ color: program.data.color }}>
                        {program.stats.fillRate}%
                      </div>
                    </div>
                  </div>
                  
                  <CardTitle className="text-2xl font-bold mb-3">{program.data.name}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {program.data.description}
                  </CardDescription>
                </CardHeader>

                {/* Enhanced Card Content */}
                <CardContent className="space-y-6">
                  {/* Impact Badge */}
                  <div className="text-center">
                    <Badge 
                      variant="outline" 
                      className={`${getImpactColor(program.impact)} border-2 px-4 py-2 text-sm font-semibold`}
                    >
                      {program.impact}
                    </Badge>
                  </div>

                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{program.stats.locations}</div>
                        <div className="text-xs text-muted-foreground">Locations</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{program.stats.availableSpots}</div>
                        <div className="text-xs text-muted-foreground">Open Spots</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{program.stats.averageCommitment}h/week</div>
                        <div className="text-xs text-muted-foreground">Avg Time</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{program.timeCommitment}</div>
                        <div className="text-xs text-muted-foreground">Commitment</div>
                      </div>
                    </div>
                  </div>

                  {/* Skills Required */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-gray-700">Skills Needed:</h4>
                    <div className="flex flex-wrap gap-1">
                      {program.skills.map((skill, index) => (
                        <Badge 
                          key={index}
                          variant="secondary" 
                          className="text-xs bg-gray-100 text-gray-700"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Volunteer Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Volunteer Progress</span>
                      <span className="font-medium">
                        {program.stats.volunteersSignedUp}/{program.stats.volunteersNeeded}
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-3 rounded-full transition-all duration-500 relative overflow-hidden"
                        style={{ 
                          backgroundColor: program.data.color,
                          width: `${program.stats.fillRate}%`
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
                      </div>
                    </div>
                  </div>

                  {/* Urgency Indicator */}
                  <div className="flex items-center justify-between">
                    <Badge className={`${getUrgencyColor(program.urgency)} border`}>
                      {program.urgency === 'urgent' && '🔥 Urgent Need'}
                      {program.urgency === 'high' && '⚡ High Priority'}
                      {program.urgency === 'medium' && '📅 Standard'}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      Updated today
                    </div>
                  </div>

                  {/* Call to Action */}
                  <Button 
                    onClick={() => onSelectProgram(program.type, program.data)}
                    className="w-full mt-6 h-12 text-base font-semibold group-hover:scale-105 transition-all duration-300 shadow-lg"
                    style={{ backgroundColor: program.data.color }}
                  >
                    <MapPin className="h-5 w-5 mr-2" />
                    Explore {program.stats.locations} Locations
                  </Button>
                </CardContent>

                {/* Decorative Background Elements */}
                <div 
                  className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-500"
                  style={{ backgroundColor: program.data.color }}
                />
                <div 
                  className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-500"
                  style={{ backgroundColor: program.data.color }}
                />
              </Card>
            ))}
          </div>

          {/* Enhanced Info Section */}
          <div className="bg-gradient-to-r from-primary/5 via-purple-500/5 to-blue-500/5 rounded-3xl border border-border p-12 text-center">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Join the Movement
              </h3>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Every volunteer makes a difference. From one-time events to long-term commitments, 
                your contribution creates ripple effects that transform communities. Choose your path 
                and start making an impact today.
              </p>
              
              <div className="grid md:grid-cols-4 gap-8 mt-12">
                {[
                  { icon: Clock, title: "Flexible Scheduling", desc: "2-8 hours/week options", color: "text-blue-600" },
                  { icon: Users, title: "Community Support", desc: "500+ active volunteers", color: "text-green-600" },
                  { icon: Heart, title: "Meaningful Impact", desc: "Direct community benefit", color: "text-red-600" },
                  { icon: Award, title: "Recognition", desc: "Certificates & references", color: "text-purple-600" }
                ].map((item, index) => (
                  <div key={index} className="flex flex-col items-center text-center space-y-3">
                    <div className={`p-4 rounded-2xl bg-white shadow-lg ${item.color}`}>
                      <item.icon className="h-8 w-8" />
                    </div>
                    <div>
                      <div className="font-bold text-lg text-gray-800">{item.title}</div>
                      <div className="text-sm text-muted-foreground">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgramSelector;