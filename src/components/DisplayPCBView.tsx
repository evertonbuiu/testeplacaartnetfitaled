import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Maximize2, Monitor, Gamepad2, Layers, FlipHorizontal } from 'lucide-react';
import displayPCBTop from '@/assets/display-pcb-top.jpg';
import displayPCBBottom from '@/assets/display-pcb-bottom.jpg';

export function DisplayPCBView() {
  const [currentSide, setCurrentSide] = useState<'top' | 'bottom'>('top');
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentSide === 'top' ? displayPCBTop : displayPCBBottom;
    link.download = `placa-display-${currentSide}-ws2811-controller.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFullscreen = () => {
    window.open(currentSide === 'top' ? displayPCBTop : displayPCBBottom, '_blank');
  };

  const displaySpecs = [
    { label: 'DIMENSÕES', value: '80mm x 60mm' },
    { label: 'CAMADAS', value: '2 Layer PCB' },
    { label: 'ESPESSURA', value: '1.6mm' },
    { label: 'ACABAMENTO', value: 'HASL Lead-Free' },
    { label: 'MÁSCARA', value: 'Verde Fosco' },
    { label: 'SILKSCREEN', value: 'Branco' }
  ];

  const displayComponents = [
    { name: 'Display LCD', qty: '1x', type: '20x4 Character', side: 'top' },
    { name: 'Botões Tácteis', qty: '4x', type: '6mm SPST', side: 'top' },
    { name: 'LEDs de Status', qty: '4x', type: 'SMD 0805', side: 'top' },
    { name: 'Conector Cabo Flat', qty: '1x', type: '20-Pin FFC', side: 'both' },
    { name: 'Resistores Pull-up', qty: '8x', type: '10kΩ SMD', side: 'bottom' },
    { name: 'Capacitores Bypass', qty: '4x', type: '100nF SMD', side: 'bottom' },
    { name: 'Regulador de Tensão', qty: '1x', type: '3.3V LDO', side: 'bottom' },
    { name: 'Cristal Oscilador', qty: '1x', type: '16MHz SMD', side: 'bottom' }
  ];

  const connectionSpecs = [
    { pin: '1-2', signal: 'VCC (5V)', description: 'Alimentação' },
    { pin: '3-4', signal: 'GND', description: 'Terra' },
    { pin: '5-8', signal: 'LCD Data', description: 'Dados do Display' },
    { pin: '9-10', signal: 'LCD Control', description: 'Controle do Display' },
    { pin: '11-14', signal: 'Button Inputs', description: 'Entradas dos Botões' },
    { pin: '15-18', signal: 'LED Outputs', description: 'Saídas dos LEDs' },
    { pin: '19-20', signal: 'SPI/I2C', description: 'Comunicação Serial' }
  ];

  const getFilteredComponents = () => {
    return displayComponents.filter(component => 
      component.side === currentSide || component.side === 'both'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header com controles */}
      <Card className="p-6 bg-gradient-to-r from-card via-card to-card border-2 border-accent">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-accent font-mono mb-2">
              PLACA DE DISPLAY E CONTROLE
            </h2>
            <p className="text-muted-foreground font-mono">
              Visualização {currentSide === 'top' ? 'SUPERIOR' : 'INFERIOR'} - Conectada via Cabo Flat 20 Pinos
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={currentSide === 'top' ? 'default' : 'outline'}
              onClick={() => setCurrentSide('top')}
              className="font-mono"
            >
              <Layers className="w-4 h-4 mr-2" />
              LADO SUPERIOR
            </Button>
            <Button
              variant={currentSide === 'bottom' ? 'default' : 'outline'}
              onClick={() => setCurrentSide('bottom')}
              className="font-mono"
            >
              <FlipHorizontal className="w-4 h-4 mr-2" />
              LADO INFERIOR
            </Button>
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
        {/* Imagem da Placa */}
        <div className="lg:col-span-2">
          <Card className="p-4 bg-card border-2 border-accent">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-accent font-mono">
                  PCB DISPLAY - {currentSide === 'top' ? 'COMPONENTES' : 'SOLDAS E SMD'}
                </h3>
                <Badge variant="outline" className="font-mono">
                  LADO {currentSide.toUpperCase()}
                </Badge>
              </div>

              <div className="border-2 border-border rounded-lg overflow-hidden bg-background p-4 relative">
                <img
                  src={currentSide === 'top' ? displayPCBTop : displayPCBBottom}
                  alt={`Placa PCB do Display - Lado ${currentSide}`}
                  className="w-full h-auto object-contain rounded"
                  style={{ maxHeight: '500px' }}
                />
                
                {/* Overlays informativos */}
                {currentSide === 'top' && (
                  <>
                    <div className="absolute top-6 left-6 bg-primary text-primary-foreground px-3 py-1 rounded font-mono text-sm">
                      DISPLAY LCD 20x4
                    </div>
                    <div className="absolute top-6 right-6 bg-accent text-accent-foreground px-3 py-1 rounded font-mono text-sm">
                      FLAT 20P
                    </div>
                    <div className="absolute bottom-6 left-6 bg-led-green text-background px-3 py-1 rounded font-mono text-sm">
                      BOTÕES CONTROLE
                    </div>
                  </>
                )}
                
                {currentSide === 'bottom' && (
                  <>
                    <div className="absolute top-6 left-6 bg-primary text-primary-foreground px-3 py-1 rounded font-mono text-sm">
                      SMD COMPONENTS
                    </div>
                    <div className="absolute top-6 right-6 bg-accent text-accent-foreground px-3 py-1 rounded font-mono text-sm">
                      TRACES & VIAS
                    </div>
                    <div className="absolute bottom-6 right-6 bg-led-orange text-background px-3 py-1 rounded font-mono text-sm">
                      CONECTOR FLAT
                    </div>
                  </>
                )}
              </div>

              <div className="text-xs text-muted-foreground font-mono text-center">
                PLACA COMPACTA | CONEXÃO VIA CABO FLAT | DESIGN MODULAR
              </div>
            </div>
          </Card>

          {/* Pinagem do Cabo Flat */}
          <Card className="p-4 bg-card border-2 border-primary mt-4">
            <h3 className="text-lg font-bold text-primary font-mono mb-3">
              PINAGEM DO CABO FLAT (20 PINOS)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {connectionSpecs.map((conn, index) => (
                <div key={index} className="p-2 bg-background rounded border text-sm font-mono">
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary" className="text-xs">
                      {conn.pin}
                    </Badge>
                    <span className="text-primary font-bold">{conn.signal}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {conn.description}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Especificações e Componentes */}
        <div className="space-y-4">
          {/* Especificações da PCB Display */}
          <Card className="p-4 bg-card border-2 border-accent">
            <h3 className="text-lg font-bold text-accent font-mono mb-3 flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              ESPECIFICAÇÕES
            </h3>
            <div className="space-y-2">
              {displaySpecs.map((spec, index) => (
                <div key={index} className="flex justify-between p-2 bg-background rounded border text-sm font-mono">
                  <span className="text-muted-foreground">{spec.label}:</span>
                  <span className="text-foreground font-bold">{spec.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Componentes da Placa Display - Filtrados por lado */}
          <Card className="p-4 bg-card border-2 border-primary">
            <h3 className="text-lg font-bold text-primary font-mono mb-3 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5" />
              COMPONENTES - LADO {currentSide.toUpperCase()}
            </h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {getFilteredComponents().map((component, index) => (
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

          {/* Vantagens do Design Modular */}
          <Card className="p-4 bg-card border border-border">
            <h4 className="text-sm font-bold text-accent font-mono mb-2">
              VANTAGENS DO DESIGN MODULAR
            </h4>
            <div className="space-y-1 text-xs font-mono text-muted-foreground">
              <div>• Instalação flexível do painel</div>
              <div>• Facilita manutenção e reparo</div>
              <div>• Cabo flat até 50cm de distância</div>
              <div>• Proteção contra interferências</div>
              <div>• Design compacto e profissional</div>
              <div>• Fácil substituição de componentes</div>
              <div>• Visualização dos dois lados da PCB</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}