import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Maximize2, Zap, Cpu } from 'lucide-react';
import mainPcbImage from '@/assets/main-pcb-board.jpg';

export function PCBView() {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = mainPcbImage;
    link.download = 'placa-pcb-principal-ws2811.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFullscreen = () => {
    window.open(mainPcbImage, '_blank');
  };

  const pcbSpecs = [
    { label: 'DIMENSÕES', value: '160mm x 120mm' },
    { label: 'CAMADAS', value: '4 Layer PCB' },
    { label: 'ESPESSURA', value: '1.6mm' },
    { label: 'ACABAMENTO', value: 'HASL Lead-Free' },
    { label: 'MÁSCARA', value: 'Verde Fosco' },
    { label: 'SILKSCREEN', value: 'Branco' }
  ];

  const components = [
    { name: 'Microcontrolador Principal', qty: '1x', type: 'STM32F4' },
    { name: 'Drivers WS2811', qty: '32x', type: 'SN74HCT245' },
    { name: 'Conectores RJ45', qty: '2x', type: 'Ethernet' },
    { name: 'Reguladores de Tensão', qty: '3x', type: '5V/3.3V' },
    { name: 'Conector Cabo Flat', qty: '1x', type: '20-Pin FFC' },
    { name: 'LEDs de Status', qty: '4x', type: 'SMD 0805' },
    { name: 'Conectores de Saída', qty: '32x', type: '3-Pin JST' },
    { name: 'Capacitores de Filtro', qty: '16x', type: 'SMD 1206' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-card via-card to-card border-2 border-primary">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary font-mono mb-2">
              PLACA PRINCIPAL - CONTROLADOR WS2811
            </h2>
            <p className="text-muted-foreground font-mono">
              Placa principal com conexão para módulo de display via cabo flat
            </p>
          </div>
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
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Imagem da PCB */}
        <div className="lg:col-span-2">
          <Card className="p-4 bg-card border-2 border-accent">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-accent font-mono">
                  PLACA PRINCIPAL (SEM DISPLAY)
                </h3>
                <Badge variant="outline" className="font-mono">
                  4 CAMADAS
                </Badge>
              </div>

              <div className="border-2 border-border rounded-lg overflow-hidden bg-background p-4">
                <img
                  src={mainPcbImage}
                  alt="Placa Principal do Controlador WS2811"
                  className="w-full h-auto object-contain rounded"
                  style={{ maxHeight: '500px' }}
                />
              </div>

              <div className="text-xs text-muted-foreground font-mono text-center">
                PLACA PRINCIPAL | CONEXÃO CABO FLAT | DESIGN MODULAR
              </div>
            </div>
          </Card>
        </div>

        {/* Especificações e Componentes */}
        <div className="space-y-4">
          {/* Especificações da PCB */}
          <Card className="p-4 bg-card border-2 border-primary">
            <h3 className="text-lg font-bold text-primary font-mono mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              ESPECIFICAÇÕES
            </h3>
            <div className="space-y-2">
              {pcbSpecs.map((spec, index) => (
                <div key={index} className="flex justify-between p-2 bg-background rounded border text-sm font-mono">
                  <span className="text-muted-foreground">{spec.label}:</span>
                  <span className="text-foreground font-bold">{spec.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Lista de Componentes */}
          <Card className="p-4 bg-card border-2 border-accent">
            <h3 className="text-lg font-bold text-accent font-mono mb-3 flex items-center gap-2">
              <Cpu className="w-5 h-5" />
              COMPONENTES
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {components.map((component, index) => (
                <div key={index} className="p-2 bg-background rounded border">
                  <div className="flex justify-between items-start text-xs font-mono">
                    <span className="text-foreground font-medium flex-1">
                      {component.name}
                    </span>
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {component.qty}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {component.type}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Características Técnicas */}
          <Card className="p-4 bg-card border border-border">
            <h4 className="text-sm font-bold text-primary font-mono mb-2">
              CARACTERÍSTICAS TÉCNICAS
            </h4>
            <div className="space-y-1 text-xs font-mono text-muted-foreground">
              <div>• Tensão de alimentação: 5V DC</div>
              <div>• Corrente máxima: 20A</div>
              <div>• Temperatura operacional: -20°C a +70°C</div>
              <div>• Protocolo: ART-NET sobre Ethernet</div>
              <div>• Taxa de atualização: 40 FPS</div>
              <div>• Resolução: 512 canais por universo</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}