import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import NovaScore from '@/components/NovaScore';
import FeatureCard from '@/components/FeatureCard';
import NovaScoreForm from '@/components/NovaScoreForm';
import NovaComparison from '@/components/NovaComparison';
import NovaFAQ from '@/components/NovaFAQ';
import Header from '@/components/Header';
import BackToTop from '@/components/BackToTop';
import LazyImage from '@/components/LazyImage';
import {
  TrendingUp,
  Shield,
  Star,
  CreditCard,
  Users,
  Brain,
  CheckCircle,
  ArrowRight,
  Play,
  Zap,
  Target,
  Award,
  BarChart3,
  Globe
} from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';
import aiNetworkImage from '@/assets/ai-network.png';

const Index = () => {
  const [demoScore, setDemoScore] = useState(85);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleDemoScore = () => {
    const newScore = Math.floor(Math.random() * 40) + 60; // Random score between 60-100
    setDemoScore(newScore);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToNovaScoreForm = () => {
    scrollToSection('nova-score-form');
  };

  const scrollToHowItWorks = () => {
    scrollToSection('how-it-works');
  };

  const features = [
    {
      icon: TrendingUp,
      title: "Earnings Stability",
      description: "Track consistency, growth trends, and resilience after income dips to build a complete financial picture."
    },
    {
      icon: CheckCircle,
      title: "Reliability & Fulfillment",
      description: "Monitor on-time completion rates, cancellation patterns, and commitment to contracted work."
    },
    {
      icon: Star,
      title: "Customer Experience",
      description: "Evaluate ratings, repeat customers, and Net Promoter Scores to measure service excellence."
    },
    {
      icon: CreditCard,
      title: "Financial Discipline",
      description: "Assess micro-advance repayments, wallet management habits, and spending patterns."
    },
    {
      icon: Users,
      title: "Ecosystem Trust",
      description: "Consider badges, referrals, peer benchmarking, and community standing within platforms."
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "SHAP-enabled machine learning provides full transparency on what influences your score."
    }
  ];

  const benefits = [
    { text: "No traditional credit history required", icon: Shield },
    { text: "Real-time score updates", icon: Zap },
    { text: "Bias-free AI assessment", icon: Target },
    { text: "Fully transparent scoring", icon: Award }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header onNavigate={scrollToSection} />
      
      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto slide-up">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 hero-text">
              Unlock Financial
              <span className="text-gradient-hero block">Opportunity</span>
              for the Gig Economy
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-3xl mx-auto hero-subtitle font-medium">
              Meet Nova Score: The AI-powered credit scoring revolution built for drivers,
              riders, freelancers, and gig entrepreneurs—beyond traditional credit checks.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center slide-up-delay">
              <Button
                variant="hero"
                size="xl"
                onClick={scrollToNovaScoreForm}
                className="focus-visible:focus-visible btn-enhanced"
                aria-label="Navigate to Nova Score calculation form"
              >
                Get Your Nova Score
                <ArrowRight className="w-6 h-6 ml-2" aria-hidden="true" />
              </Button>
              
              <Button
                variant="outline"
                size="xl"
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm focus-visible:focus-visible btn-enhanced"
                onClick={scrollToHowItWorks}
                aria-label="Learn how Nova Score works"
              >
                <Play className="w-5 h-5 mr-2" aria-hidden="true" />
                How It Works
              </Button>
            </div>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-pulse">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* What is Nova Section */}
      <section id="about-nova" className="py-20 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="fade-in-up">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-enhanced">
                  What is
                  <span className="text-gradient-primary"> Project Nova</span>?
                </h2>
                
                <p className="text-lg text-muted-enhanced mb-6 leading-relaxed">
                  Project Nova is transforming the future of financial inclusion. Our AI-driven
                  Equitable Credit Scoring Engine empowers gig economy workers—those too often
                  excluded by standard credit systems—to access fair loans, micro-advances, and
                  insurance products.
                </p>
                
                <p className="text-lg text-muted-enhanced mb-8 leading-relaxed">
                  Nova Score doesn't rely on old-school credit reports. Instead, it reads the
                  true story of your earnings, reliability, and customer feedback to build an
                  accurate, bias-aware credit profile—instantly and transparently.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {benefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-enhanced">{benefit.text}</span>
                      </div>
                    );
                  })}
                </div>

                <Button
                  variant="nova"
                  size="lg"
                  onClick={scrollToHowItWorks}
                  className="focus-visible:focus-visible btn-enhanced"
                  aria-label="Learn more about how Nova Score works"
                >
                  Learn More About Nova
                  <BarChart3 className="w-5 h-5 ml-2" aria-hidden="true" />
                </Button>
              </div>

              <div className="relative fade-in-up">
                <LazyImage
                  src={aiNetworkImage}
                  alt="AI Network Visualization"
                  className="w-full max-w-md mx-auto rounded-3xl"
                />
                <div className="absolute inset-0 bg-gradient-primary/10 rounded-3xl pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Nova Score Works */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-enhanced">
              How <span className="text-gradient-primary">Nova Score</span> Works
            </h2>
            <p className="text-lg text-muted-enhanced max-w-3xl mx-auto">
              Nova Score leverages real-time operational and behavioral data to create a unique,
              data-driven risk score (0-100) that accurately reflects your financial reliability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Nova Comparison Section */}
      <NovaComparison />

      {/* Interactive Demo Section */}
      <section id="nova-score-form" className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <NovaScoreForm />
        </div>
      </section>

      {/* Fairness & Ethics */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="fade-in-up">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-enhanced">
                <span className="text-gradient-primary">Fairness & Ethics</span> Commitment
              </h2>
              <p className="text-lg text-muted-enhanced mb-12">
                Nova Score is built with equity at its core, ensuring transparent,
                bias-audited AI that democratizes access to financial growth.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 fade-in-up">
              <Card className="nova-card p-6 text-center">
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3 text-enhanced">Bias Detection</h3>
                <p className="text-muted-enhanced">
                  Advanced bias detection and mitigation algorithms baked into every assessment.
                </p>
              </Card>

              <Card className="nova-card p-6 text-center">
                <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3 text-enhanced">Inclusive Design</h3>
                <p className="text-muted-enhanced">
                  Sensitive attributes excluded from model training to ensure fair outcomes.
                </p>
              </Card>

              <Card className="nova-card p-6 text-center">
                <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3 text-enhanced">Transparency</h3>
                <p className="text-muted-enhanced">
                  Fully documented and auditable process with SHAP-based explainability.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <NovaFAQ />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 hero-text">
              Ready to Unlock Your Financial Potential?
            </h2>
            <p className="text-xl mb-8 opacity-95 font-medium hero-subtitle">
              Join thousands of gig workers who have already discovered their Nova Score.
              Start your journey to better financial opportunities today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="xl"
                className="border-white text-white hover:bg-white hover:text-primary focus-visible:focus-visible btn-enhanced"
                onClick={scrollToNovaScoreForm}
                aria-label="Apply for early access to Nova Score"
              >
                Apply for Early Access
              </Button>
              
              <Button
                variant="secondary"
                size="xl"
                className="bg-white text-primary hover:bg-white/90 focus-visible:focus-visible btn-enhanced"
                onClick={() => window.open('https://github.com', '_blank')}
                aria-label="View Project Nova on GitHub (opens in new tab)"
              >
                View on GitHub
                <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gradient-primary mb-4">
              Project Nova
            </h3>
            <p className="text-muted-enhanced mb-6 font-medium">
              Financial inclusion through fair, data-driven credit scoring.
            </p>
            
            <div className="flex justify-center space-x-6 text-sm text-muted-enhanced font-medium">
              <a href="#" className="hover:text-primary transition-colors focus-visible:focus-visible">Contact</a>
              <a href="#" className="hover:text-primary transition-colors focus-visible:focus-visible">Blog</a>
              <a href="#" className="hover:text-primary transition-colors focus-visible:focus-visible">Ethics</a>
              <a href="#" className="hover:text-primary transition-colors focus-visible:focus-visible">GitHub</a>
            </div>
            
            <div className="mt-8 pt-8 border-t border-border text-sm text-muted-enhanced font-medium">
              © 2024 Project Nova. Building fair financial access for everyone.
            </div>
          </div>
        </div>
      </footer>
      
      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
};

export default Index;