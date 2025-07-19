import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cable, Wifi, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NetworkPanelProps {
  inputStatus: 'connected' | 'disconnected';
  outputStatus: 'connected' | 'disconnected';
  artnetPackets: number;
  dataRate: string;
}

export function NetworkPanel({ inputStatus, outputStatus, artnetPackets, dataRate }: NetworkPanelProps) {
  return (
    <Card className="p-4 bg-card border-2 border-primary">
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-center text-primary">
          CONEXÕES DE REDE
        </h3>

        {/* Conectores Ethernet */}
        <div className="space-y-3">
          {/* Entrada */}
          <div className="flex items-center justify-between p-3 bg-background rounded border">
            <div className="flex items-center gap-3">
              <Cable className="w-5 h-5 text-primary" />
              <span className="font-mono text-sm">ENTRADA ETH</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant={inputStatus === 'connected' ? "default" : "destructive"}
                className="font-mono"
              >
                {inputStatus === 'connected' ? 'CONECTADO' : 'DESCONECTADO'}
              </Badge>
              <div className={cn(
                "w-3 h-3 rounded-full transition-all duration-500",
                inputStatus === 'connected' 
                  ? "bg-led-green shadow-[var(--shadow-led)] animate-pulse" 
                  : "bg-led-off"
              )} />
            </div>
          </div>

          {/* Saída */}
          <div className="flex items-center justify-between p-3 bg-background rounded border">
            <div className="flex items-center gap-3">
              <Cable className="w-5 h-5 text-accent" />
              <span className="font-mono text-sm">SAÍDA ETH</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant={outputStatus === 'connected' ? "default" : "destructive"}
                className="font-mono"
              >
                {outputStatus === 'connected' ? 'CONECTADO' : 'DESCONECTADO'}
              </Badge>
              <div className={cn(
                "w-3 h-3 rounded-full transition-all duration-500",
                outputStatus === 'connected' 
                  ? "bg-led-orange shadow-[0_0_10px_hsl(var(--led-orange)/0.5)] animate-pulse" 
                  : "bg-led-off"
              )} />
            </div>
          </div>
        </div>

        {/* Estatísticas ART-NET */}
        <div className="border-t border-border pt-3">
          <div className="flex items-center gap-2 mb-3">
            <Wifi className="w-4 h-4 text-artnet-active" />
            <span className="font-mono text-sm text-foreground">ART-NET STATUS</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-background p-2 rounded border">
              <div className="text-muted-foreground">PACOTES/SEC</div>
              <div className="text-lg font-bold text-artnet-active">{artnetPackets}</div>
            </div>
            <div className="bg-background p-2 rounded border">
              <div className="text-muted-foreground">TAXA DADOS</div>
              <div className="text-lg font-bold text-accent">{dataRate}</div>
            </div>
          </div>
        </div>

        {/* Indicador de Atividade */}
        <div className="flex items-center justify-center gap-2 p-2 bg-background rounded border">
          <Activity className="w-4 h-4 text-primary" />
          <span className="text-xs font-mono text-foreground">SISTEMA ATIVO</span>
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        </div>
      </div>
    </Card>
  );
}