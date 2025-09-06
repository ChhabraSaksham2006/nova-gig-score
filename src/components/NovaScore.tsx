import React, { useState, useEffect } from 'react';

interface NovaScoreProps {
  score: number;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const NovaScore: React.FC<NovaScoreProps> = ({ 
  score, 
  animated = true, 
  size = 'md' 
}) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
      setDisplayScore(score);
    }
  }, [animated]);

  useEffect(() => {
    if (isVisible && animated) {
      const duration = 2000;
      const steps = 60;
      const stepValue = score / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += stepValue;
        if (current >= score) {
          setDisplayScore(score);
          clearInterval(timer);
        } else {
          setDisplayScore(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isVisible, score, animated]);

  const getScoreColor = (currentScore: number) => {
    if (currentScore >= 80) return 'success';
    if (currentScore >= 60) return 'warning';
    return 'error';
  };

  const getScoreLabel = (currentScore: number) => {
    if (currentScore >= 80) return 'Excellent';
    if (currentScore >= 60) return 'Good';
    if (currentScore >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const sizeClasses = {
    sm: 'w-20 h-20 text-lg',
    md: 'w-32 h-32 text-2xl',
    lg: 'w-48 h-48 text-4xl'
  };

  const strokeWidth = size === 'lg' ? 8 : size === 'md' ? 6 : 4;
  const radius = size === 'lg' ? 88 : size === 'md' ? 58 : 36;
  const circumference = 2 * Math.PI * radius;
  const progressLength = (displayScore / 100) * circumference;
  const strokeDasharray = `${progressLength} ${circumference - progressLength}`;

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Background Circle */}
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 200 200"
        >
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke={getScoreColor(displayScore) === 'success' ? 'hsl(var(--success))' :
                   getScoreColor(displayScore) === 'warning' ? 'hsl(var(--warning))' :
                   'hsl(var(--error))'}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className={animated ? "transition-all duration-200" : ""}
            style={{
              filter: 'drop-shadow(0 0 6px hsl(var(--primary) / 0.3))'
            }}
          />
        </svg>
        
        {/* Score Display - Absolutely positioned and centered */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`font-bold text-center ${size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-2xl' : 'text-lg'}`}>
            <div className="text-gradient-primary leading-none">{Math.round(displayScore)}</div>
            <div className={`text-muted-foreground leading-none ${size === 'lg' ? 'text-sm' : 'text-xs'}`}>/ 100</div>
          </div>
        </div>
      </div>

      {/* Score Label */}
      <div className="text-center">
        <div className={`font-semibold ${
          getScoreColor(displayScore) === 'success' ? 'text-success' :
          getScoreColor(displayScore) === 'warning' ? 'text-warning' :
          'text-error'
        }`}>
          {getScoreLabel(displayScore)}
        </div>
        <div className="text-sm text-muted-foreground">Nova Score</div>
      </div>
    </div>
  );
};

export default NovaScore;