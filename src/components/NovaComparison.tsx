import React from 'react';
import { Card } from '@/components/ui/card';
import {
  Database,
  Users,
  Clock,
  Shield,
  BookOpen,
  CheckCircle,
  XCircle
} from 'lucide-react';

const NovaComparison: React.FC = () => {
  const comparisonData = [
    {
      aspect: 'Data Source',
      icon: Database,
      traditional: 'Credit cards, loans, banking history',
      nova: 'Gig work performance, earnings, service quality',
      novaAdvantage: true
    },
    {
      aspect: 'Accessibility',
      icon: Users,
      traditional: 'Requires existing credit history',
      nova: 'Available to all active gig workers',
      novaAdvantage: true
    },
    {
      aspect: 'Update Frequency',
      icon: Clock,
      traditional: 'Monthly, slow to reflect changes',
      nova: 'Real-time based on work performance',
      novaAdvantage: true
    },
    {
      aspect: 'Fairness',
      icon: Shield,
      traditional: 'Can perpetuate historical biases',
      nova: 'Designed to eliminate demographic bias',
      novaAdvantage: true
    },
    {
      aspect: 'Transparency',
      icon: BookOpen,
      traditional: 'Complex algorithms, limited explanations',
      nova: 'SHAP-enabled AI with full transparency',
      novaAdvantage: true
    }
  ];

  return (
    <section id="nova-comparison" className="py-20 bg-gradient-to-br from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 fade-in-up">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-3xl md:text-4xl font-bold text-enhanced">
                Understanding Nova Score
              </h2>
            </div>
            <p className="text-lg text-muted-enhanced max-w-3xl mx-auto font-medium">
              Learn how Nova revolutionizes credit scoring for the gig economy and what it
              means for your financial future.
            </p>
          </div>

          {/* Comparison Table */}
          <Card className="nova-card p-8 fade-in-up">
            <div className="mb-8 text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-enhanced mb-4">
                Nova vs Traditional Credit Scores
              </h3>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-full">
                {/* Header Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="font-semibold text-lg text-enhanced border-b-2 border-border pb-3">
                    Aspect
                  </div>
                  <div className="font-semibold text-lg text-enhanced border-b-2 border-border pb-3">
                    Traditional Credit
                  </div>
                  <div className="font-semibold text-lg text-primary border-b-2 border-primary pb-3">
                    Nova Score
                  </div>
                  <div className="font-semibold text-lg text-enhanced border-b-2 border-border pb-3 text-center">
                    Advantage
                  </div>
                </div>

                {/* Data Rows */}
                <div className="space-y-6">
                  {comparisonData.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center py-4 border-b border-border/50 last:border-b-0"
                      >
                        {/* Aspect */}
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-semibold text-enhanced">{item.aspect}</span>
                        </div>

                        {/* Traditional Credit */}
                        <div className="text-muted-enhanced font-medium">
                          {item.traditional}
                        </div>

                        {/* Nova Score */}
                        <div className="text-primary font-semibold">
                          {item.nova}
                        </div>

                        {/* Advantage Indicator */}
                        <div className="flex justify-center">
                          {item.novaAdvantage ? (
                            <div className="flex items-center space-x-2 text-success">
                              <CheckCircle className="w-5 h-5" />
                              <span className="font-medium text-sm">Nova</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2 text-muted-foreground">
                              <XCircle className="w-5 h-5" />
                              <span className="font-medium text-sm">Traditional</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Key Benefits Summary */}
            <div className="mt-8 pt-8 border-t border-border">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-success" />
                  </div>
                  <h4 className="font-semibold text-enhanced mb-2">Inclusive Access</h4>
                  <p className="text-sm text-muted-enhanced">
                    No credit history required - perfect for gig workers starting their financial journey
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-enhanced mb-2">Real-Time Updates</h4>
                  <p className="text-sm text-muted-enhanced">
                    Your score reflects your current performance, not just past financial behavior
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-warning" />
                  </div>
                  <h4 className="font-semibold text-enhanced mb-2">Bias-Free Scoring</h4>
                  <p className="text-sm text-muted-enhanced">
                    AI-powered assessment designed to eliminate demographic and historical biases
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default NovaComparison;