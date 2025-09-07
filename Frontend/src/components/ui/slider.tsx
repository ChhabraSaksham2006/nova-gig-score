import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn("relative flex w-full touch-none select-none items-center group", className)}
      onPointerDown={() => setIsDragging(true)}
      onPointerUp={() => setIsDragging(false)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDragging(false);
      }}
      {...props}
    >
      <SliderPrimitive.Track
        className={cn(
          "relative h-3 w-full grow overflow-hidden rounded-full bg-muted transition-all duration-200",
          (isHovered || isDragging) && "h-4 shadow-md"
        )}
      >
        <SliderPrimitive.Range
          className={cn(
            "absolute h-full bg-gradient-primary shadow-green rounded-full transition-all duration-200",
            isDragging && "shadow-lg animate-pulse"
          )}
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className={cn(
          "block h-6 w-6 rounded-full border-2 border-primary bg-background ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-green cursor-grab active:cursor-grabbing",
          "hover:scale-125 hover:shadow-lg hover:border-primary/80",
          isDragging && "scale-125 shadow-xl ring-2 ring-primary/30 animate-pulse",
          isHovered && !isDragging && "scale-110"
        )}
      />
      
      {/* Animated value indicator */}
      {(isHovered || isDragging) && (
        <div
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium shadow-lg animate-in fade-in-0 zoom-in-95 duration-200"
          style={{
            left: `${((props.value?.[0] || 0) / (props.max || 100)) * 100}%`,
          }}
        >
          {props.value?.[0] || 0}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-primary"></div>
        </div>
      )}
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
