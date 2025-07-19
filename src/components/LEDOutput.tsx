import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LEDOutputProps {
  outputNumber: number;
  universes: number;
  isActive: boolean;
  onUniverseChange: (universes: number) => void;
  onToggle: () => void;
}

export function LEDOutput({ outputNumber, universes, isActive, onUniverseChange, onToggle }: LEDOutputProps) {
  const [isConfiguring, setIsConfiguring] = useState(false);

  return (
    <Card className={cn(
      "p-3 border-2 transition-all duration-300",
      isActive 
        ? "border-primary bg-card shadow-[var(--shadow-glow)]" 
        : "border-border bg-card/50"
    )}>
      <div className="flex flex-col gap-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-mono text-foreground">
            OUT {outputNumber.toString().padStart(2, '0')}
          </span>
          <div className={cn(
            "w-3 h-3 rounded-full transition-all duration-300",
            isActive 
              ? "bg-led-green shadow-[var(--shadow-led)]" 
              : "bg-led-off"
          )} />
        </div>

        {/* Universe Count */}
        <div className="text-center">
          <Badge variant={isActive ? "default" : "secondary"} className="font-mono">
            {universes}U
          </Badge>
        </div>

        {/* Controls */}
        <div className="flex gap-1">
          <Button
            size="sm"
            variant={isConfiguring ? "default" : "outline"}
            className="flex-1 text-xs"
            onClick={() => setIsConfiguring(!isConfiguring)}
          >
            CFG
          </Button>
          <Button
            size="sm"
            variant={isActive ? "destructive" : "default"}
            className="flex-1 text-xs"
            onClick={onToggle}
          >
            {isActive ? "OFF" : "ON"}
          </Button>
        </div>

        {/* Configuration Panel */}
        {isConfiguring && (
          <div className="border-t border-border pt-2 mt-1">
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="outline"
                className="px-2 py-1 text-xs"
                onClick={() => onUniverseChange(Math.max(1, universes - 1))}
                disabled={universes <= 1}
              >
                -
              </Button>
              <span className="flex-1 text-center text-xs font-mono">
                {universes} Universos
              </span>
              <Button
                size="sm"
                variant="outline"
                className="px-2 py-1 text-xs"
                onClick={() => onUniverseChange(Math.min(8, universes + 1))}
                disabled={universes >= 8}
              >
                +
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}