import React from 'react';
import { Card } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  HelpCircle,
  Shield,
  Clock,
  CreditCard,
  Users,
  Brain,
  Zap,
  Lock,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

const NovaFAQ: React.FC = () => {
  const faqCategories = [
    {
      title: 'Getting Started',
      icon: HelpCircle,
      faqs: [
        {
          question: 'What is Nova Score and how is it different from traditional credit scores?',
          answer: 'Nova Score is an AI-powered credit scoring system designed specifically for gig economy workers. Unlike traditional credit scores that rely on banking history and credit cards, Nova Score evaluates your gig work performance, earnings consistency, customer ratings, and reliability patterns to create a comprehensive financial profile.'
        },
        {
          question: 'Who can get a Nova Score?',
          answer: 'Any active gig worker can get a Nova Score! This includes rideshare drivers, delivery partners, freelancers, independent contractors, and anyone earning income through gig platforms. You don\'t need existing credit history or traditional banking relationships.'
        },
        {
          question: 'How do I get started with Nova Score?',
          answer: 'Simply fill out our Nova Score form with your gig work details including monthly earnings, active days, customer ratings, and recent performance data. Our AI will calculate your score instantly and provide detailed insights about your financial profile.'
        }
      ]
    },
    {
      title: 'How It Works',
      icon: Brain,
      faqs: [
        {
          question: 'What data does Nova Score use to calculate my score?',
          answer: 'Nova Score analyzes multiple data points including: monthly earnings stability, active working days, customer ratings and reviews, earnings per active day, cancellation rates, earnings trends over 3-6 months, trip/order completion rates, and platform-specific performance metrics.'
        },
        {
          question: 'How often is my Nova Score updated?',
          answer: 'Your Nova Score updates in real-time based on your ongoing gig work performance. Unlike traditional credit scores that update monthly, Nova Score reflects your current earning patterns and reliability, giving you immediate feedback on improvements.'
        },
        {
          question: 'What makes Nova Score\'s AI fair and unbiased?',
          answer: 'Our AI uses SHAP (SHapley Additive exPlanations) technology for complete transparency. We actively exclude demographic data like age, gender, race, and location from our models. Our algorithms are regularly audited for bias and designed to focus purely on work performance and financial behavior.'
        }
      ]
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      faqs: [
        {
          question: 'Is my personal and financial data secure?',
          answer: 'Absolutely. We use bank-level encryption and security protocols to protect your data. Your information is never sold to third parties, and we comply with all major data protection regulations including GDPR and CCPA. You maintain full control over your data and can request deletion at any time.'
        },
        {
          question: 'What data do you collect and store?',
          answer: 'We only collect gig work performance data that you voluntarily provide, such as earnings, ratings, and work patterns. We do not access your personal banking information, social media, or other sensitive personal data without explicit consent.'
        },
        {
          question: 'Can I control who sees my Nova Score?',
          answer: 'Yes, you have complete control over your Nova Score visibility. You decide when and with whom to share your score. Financial institutions and lenders can only access your score with your explicit permission.'
        }
      ]
    },
    {
      title: 'Using Your Score',
      icon: CreditCard,
      faqs: [
        {
          question: 'What can I use my Nova Score for?',
          answer: 'Your Nova Score can help you access micro-loans, advance payments, insurance products, equipment financing, and other financial services designed for gig workers. Many financial partners recognize Nova Score as a valid creditworthiness indicator.'
        },
        {
          question: 'How do I improve my Nova Score?',
          answer: 'Focus on consistency: maintain regular active working days, keep high customer ratings, minimize cancellations, and show steady or growing earnings over time. The AI provides specific recommendations based on your current performance patterns.'
        },
        {
          question: 'What\'s considered a good Nova Score?',
          answer: 'Nova Scores range from 0-100. Generally: 80-100 is excellent (access to premium financial products), 65-79 is good (solid creditworthiness), 50-64 is fair (room for improvement), and below 50 suggests focusing on consistency and performance improvements.'
        }
      ]
    },
    {
      title: 'Technical Questions',
      icon: Zap,
      faqs: [
        {
          question: 'Why does Nova Score work better for gig workers than traditional credit scores?',
          answer: 'Traditional credit scores miss the unique financial patterns of gig work - irregular income, cash transactions, and platform-based earnings. Nova Score understands these patterns and evaluates the reliability and growth potential that traditional systems overlook.'
        },
        {
          question: 'How accurate is the Nova Score prediction model?',
          answer: 'Our AI model has been trained on thousands of gig worker profiles and continuously improves its accuracy. The model focuses on proven predictors of financial reliability specific to gig work, making it highly relevant for this unique employment model.'
        },
        {
          question: 'Can I see exactly how my score is calculated?',
          answer: 'Yes! Nova Score provides full transparency through SHAP explanations. You\'ll see exactly which factors positively or negatively impact your score, with specific recommendations for improvement. No black box algorithms - complete visibility into your assessment.'
        }
      ]
    }
  ];

  return (
    <section id="nova-faq" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 fade-in-up">
            <div className="flex items-center justify-center mb-4">
              <HelpCircle className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-3xl md:text-4xl font-bold text-enhanced">
                Frequently Asked Questions
              </h2>
            </div>
            <p className="text-lg text-muted-enhanced max-w-3xl mx-auto font-medium">
              Everything you need to know about Nova Score, how it works, and how it can
              help transform your financial opportunities.
            </p>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {faqCategories.map((category, categoryIndex) => {
              const CategoryIcon = category.icon;
              return (
                <Card key={categoryIndex} className="nova-card p-6 fade-in-up">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center mr-4">
                      <CategoryIcon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-enhanced">{category.title}</h3>
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    {category.faqs.map((faq, faqIndex) => (
                      <AccordionItem 
                        key={faqIndex} 
                        value={`${categoryIndex}-${faqIndex}`}
                        className="border-border"
                      >
                        <AccordionTrigger className="text-left hover:no-underline hover:text-primary transition-colors">
                          <span className="font-semibold text-enhanced pr-4">
                            {faq.question}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-enhanced leading-relaxed pt-2">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </Card>
              );
            })}
          </div>

          {/* Contact Support */}
          <Card className="nova-card p-8 mt-12 text-center fade-in-up">
            <div className="max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-enhanced mb-4">
                Still Have Questions?
              </h3>
              <p className="text-muted-enhanced mb-6 font-medium">
                Can't find the answer you're looking for? Our support team is here to help
                you understand how Nova Score can work for your unique situation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:support@projectnova.com"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-primary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity focus-visible:focus-visible"
                >
                  Contact Support
                </a>
                <a
                  href="#nova-score-form"
                  className="inline-flex items-center justify-center px-6 py-3 border border-border text-foreground font-semibold rounded-lg hover:bg-muted transition-colors focus-visible:focus-visible"
                >
                  Try Nova Score
                </a>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default NovaFAQ;