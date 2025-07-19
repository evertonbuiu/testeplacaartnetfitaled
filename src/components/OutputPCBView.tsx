import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Maximize2, Zap, Cable } from 'lucide-react';
import outputPcbImage from '@/assets/output-pcb-board.jpg';

interface OutputPCBViewProps {
  boardNumber: number;
  outputRange: string;
}

export function OutputPCBView({ boardNumber, outputRange }: OutputPCBViewProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = outputPcbImage;
    link.download = `placa-saidas-${boardNumber}-ws2811.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFullscreen = () => {
    window.open(outputPcbImage, '_blank');
  };

  const pcbSpecs = [
    { label: 'DIMENSÕES', value: '100mm x 60mm' },
    { label: 'CAMADAS', value: '2 Layer PCB' },
    { label: 'ESPESSURA', value: '1.6mm' },
    { label: 'ACABAMENTO', value: 'HASL Lead-Free' },
    { label: 'MÁSCARA', value: 'Verde Fosco' },
    { label: 'SILKSCREEN', value: 'Branco' }
  ];

  const components = [
    { name: 'Drivers WS2811', qty: '8x', type: 'SN74HCT245' },
    { name: 'Conectores BORN', qty: '8x', type: '3-Pin Terminal' },
    { name: 'Conector Cabo Flat', qty: '1x', type: '20-Pin FFC' },
    { name: 'LEDs de Status', qty: '8x', type: 'SMD 0805' },
    { name: 'Capacitores de Filtro', qty: '8x', type: 'SMD 1206' },
    { name: 'Resistores Pull-up', qty: '8x', type: 'SMD 0805' }
  ];

  return (
    <Card className="p-4 bg-card border-2 border-accent">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-accent font-mono">
              PLACA SAÍDAS #{boardNumber}
            </h3>
            <p className="text-sm text-muted-foreground font-mono">
              Saídas {outputRange} • Conectores BORN
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleFullscreen}
              className="font-mono"
            >
              <Maximize2 className="w-3 h-3 mr-1" />
              VER
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownload}
              className="font-mono"
            >
              <Download className="w-3 h-3 mr-1" />
              BAIXAR
            </Button>
          </div>
        </div>

        {/* Imagem da PCB */}
        <div className="border-2 border-border rounded-lg overflow-hidden bg-background p-2">
          <img
            src={outputPcbImage}
            alt={`Placa de Saídas ${boardNumber}`}
            className="w-full h-auto object-contain rounded"
            style={{ maxHeight: '200px' }}
          />
        </div>

        {/* Especificações Compactas */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-primary font-mono flex items-center gap-1">
              <Zap className="w-3 h-3" />
              SPECS
            </h4>
            <div className="space-y-1">
              {pcbSpecs.slice(0, 3).map((spec, index) => (
                <div key={index} className="flex justify-between text-xs font-mono">
                  <span className="text-muted-foreground">{spec.label}:</span>
                  <span className="text-foreground font-bold">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="text-xs font-bold text-accent font-mono flex items-center gap-1">
              <Cable className="w-3 h-3" />
              COMPONENTES
            </h4>
            <div className="space-y-1">
              {components.slice(0, 3).map((component, index) => (
                <div key={index} className="text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-foreground truncate">{component.name}</span>
                    <Badge variant="outline" className="text-xs h-4">
                      {component.qty}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Características */}
        <div className="text-xs font-mono text-muted-foreground border-t pt-2">
          <div>• 8 Saídas WS2811 independentes</div>
          <div>• Conectores BORN para facilitar instalação</div>
          <div>• Conexão via cabo flat 20 pinos</div>
        </div>
      </div>
    </Card>
  );
}