import { cn } from '@/lib/utils';
import * as React from 'react';

export interface ProgressCircleProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** النسبة المئوية للتقدم (0-100) */
  progress: number;
  
  /** قطر الدائرة بالبكسل */
  size?: number;
  
  /** عرض خط التقدم بالبكسل */
  strokeWidth?: number;
}

/**
 * مؤشر التقدم الدائري لإظهار نسبة اكتمال الرفع
 */
const ProgressCircle = React.forwardRef<HTMLDivElement, ProgressCircleProps>(
  ({ progress, size = 48, strokeWidth = 4, className, ...props }, ref) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;
    
    // التأكد من أن النسبة المئوية بين 0 و 100
    const normalizedProgress = Math.min(100, Math.max(0, progress));

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex flex-col items-center justify-center text-white',
          className,
        )}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg
          className="absolute transform -rotate-90"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* الدائرة الخلفية */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            className="fill-none stroke-white/30"
          />
          
          {/* دائرة التقدم */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            className="fill-none stroke-white transition-all duration-300 ease-out"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              strokeDashoffset: offset,
              transition: 'stroke-dashoffset 0.3s ease',
            }}
          />
        </svg>
        
        {/* النص المئوي */}
        <div className="relative z-10 text-xs font-bold text-white drop-shadow-sm">
          {Math.round(normalizedProgress)}%
        </div>
      </div>
    );
  },
);

ProgressCircle.displayName = 'ProgressCircle';

export { ProgressCircle };