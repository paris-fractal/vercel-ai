import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
export interface PinkBubbleProps extends HTMLAttributes<HTMLDivElement> {
    // Optional prop to control the gradient direction
    gradientDirection?: 'to-b' | 'to-r' | 'to-br';
}

export const PinkBubble = forwardRef<HTMLDivElement, PinkBubbleProps>(
    ({ className = '', gradientDirection = 'to-b', children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={`rounded-2xl p-4 bg-rose-100 text-rose-900 
          shadow-sm bg-gradient-${gradientDirection} from-rose-100 to-rose-50
          border border-rose-200 transition-all duration-200
          ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    }
);

PinkBubble.displayName = 'PinkBubble'; 