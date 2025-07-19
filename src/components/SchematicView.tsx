import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Maximize2 } from 'lucide-react';
import schematicImage from '@/assets/led-controller-schematic.jpg';

export function SchematicView() {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = schematicImage;
    link.download = 'esquema-eletrico-ws2811-controller.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFullscreen = () => {
    window.open(schematicImage, '_blank');
  };

  return (
    <Card className="p-6 bg-card border-2 border-primary">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary font-mono">
            ESQUEMA ELÉTRICO
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleFullscreen}
              className="font-mono"
            >
              <Maximize2 className="w-4 h-4 mr-1" />
              AMPLIAR
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleDownload}
              className="font-mono"
            >
              <Download className="w-4 h-4 mr-1" />
              BAIXAR
            </Button>
          </div>
        </div>

        <div className="border-2 border-border rounded-lg overflow-hidden bg-background">
          <img
            src={schematicImage}
            alt="Esquema Elétrico do Controlador WS2811"
            className="w-full h-auto object-contain"
            style={{ maxHeight: '600px' }}
          />
        </div>

        <div className="text-xs text-muted-foreground font-mono text-center">
          CONTROLADOR WS2811 - 32 SAÍDAS | PROTOCOLO ART-NET | ESQUEMA ELÉTRICO COMPLETO
        </div>
      </div>
    </Card>
  );
}