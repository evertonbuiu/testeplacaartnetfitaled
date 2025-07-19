import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Maximize2, Zap, Cable, Layers, FlipHorizontal, Settings } from 'lucide-react';
import outputPcbTop from '@/assets/output-pcb-borne-top.jpg';
import outputPcbBottom from '@/assets/output-pcb-borne-bottom.jpg';

interface OutputPCBViewProps {
  boardNumber: number;
  outputRange: string;
}

export function OutputPCBView({ boardNumber, outputRange }: OutputPCBViewProps) {
  const [currentSide, setCurrentSide] = useState<'top' | 'bottom'>('top');
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentSide === 'top' ? outputPcbTop : outputPcbBottom;
    link.download = `placa-saidas-${boardNumber}-${currentSide}-borne.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFullscreen = () => {
    window.open(currentSide === 'top' ? outputPcbTop : outputPcbBottom, '_blank');
  };

  const pcbSpecs = [
    { label: 'DIMENSÕES', value: '120mm x 80mm' },
    { label: 'CAMADAS', value: '2 Layer PCB' },
    { label: 'ESPESSURA', value: '1.6mm' },
    { label: 'ACABAMENTO', value: 'HASL Lead-Free' },
    { label: 'MÁSCARA', value: 'Verde Fosco' },
    { label: 'SILKSCREEN', value: 'Branco' },
    { label: 'SAÍDAS', value: '8x WS2811/WS2812' },
    { label: 'CONECTORES', value: 'Borne 4P Robustos' }
  ];

  const components = [
    { name: 'Drivers WS2811/WS2812', qty: '8x', type: 'Buffer Logic Level', side: 'bottom' },
    { name: 'Conectores BORNE 4P', qty: '8x', type: 'Terminais Parafuso', side: 'top' },
    { name: 'Conector Cabo Flat', qty: '1x', type: '20-Pin FFC', side: 'both' },
    { name: 'LEDs Status RGB', qty: '8x', type: 'SMD 0805', side: 'top' },
    { name: 'Capacitores de Filtro', qty: '16x', type: 'SMD 1206', side: 'bottom' },
    { name: 'Resistores Pull-up', qty: '8x', type: 'SMD 0805', side: 'bottom' },
    { name: 'Proteção ESD', qty: '8x', type: 'TVS Diodes', side: 'bottom' },
    { name: 'Regulador 5V', qty: '1x', type: 'LDO 5A', side: 'bottom' }
  ];

  const borneConnections = [
    { pin: '1', signal: '+V', description: 'Alimentação LED (5V/12V)', color: 'text-red-500' },
    { pin: '2', signal: 'DATA', description: 'Sinal Digital WS281x', color: 'text-blue-500' },
    { pin: '3', signal: 'CLK', description: 'Clock (APA102/SK9822)', color: 'text-yellow-600' },
    { pin: '4', signal: 'GND', description: 'Terra/Negativo', color: 'text-gray-600' }
  ];

  const supportedLedTypes = [
    { type: 'WS2811', pins: '3-Pin', connection: '+V, DATA, GND', voltage: '5V/12V' },
    { type: 'WS2812B', pins: '3-Pin', connection: '+V, DATA, GND', voltage: '5V' },
    { type: 'SK6812', pins: '3-Pin', connection: '+V, DATA, GND', voltage: '5V' },
    { type: 'APA102', pins: '4-Pin', connection: '+V, DATA, CLK, GND', voltage: '5V' },
    { type: 'SK9822', pins: '4-Pin', connection: '+V, DATA, CLK, GND', voltage: '5V' },
    { type: 'UCS1903', pins: '3-Pin', connection: '+V, DATA, GND', voltage: '5V/12V' }
  ];

  const getFilteredComponents = () => {
    return components.filter(component => 
      component.side === currentSide || component.side === 'both'
    );
  };

  return (
    <Card className="p-4 bg-card border-2 border-accent shadow-[var(--shadow-elegant)]">
      <div className="space-y-4">
        {/* Header com controles */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-accent font-mono flex items-center gap-2">
              <Zap className="w-5 h-5" />
              PLACA SAÍDAS #{boardNumber}
            </h3>
            <p className="text-sm text-muted-foreground font-mono">
              Saídas {outputRange} • Conectores BORNE 3P/4P • Lado {currentSide.toUpperCase()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={currentSide === 'top' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentSide('top')}
              className="font-mono"
            >
              <Layers className="w-3 h-3 mr-1" />
              TOP
            </Button>
            <Button
              variant={currentSide === 'bottom' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentSide('bottom')}
              className="font-mono"
            >
              <FlipHorizontal className="w-3 h-3 mr-1" />
              BOTTOM
            </Button>
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
        <div className="border-2 border-primary rounded-lg overflow-hidden bg-background p-2 relative">
          <img
            src={currentSide === 'top' ? outputPcbTop : outputPcbBottom}
            alt={`Placa de Saídas ${boardNumber} - ${currentSide}`}
            className="w-full h-auto object-contain rounded"
            style={{ maxHeight: '250px' }}
          />
          
          {/* Overlays informativos */}
          {currentSide === 'top' && (
            <>
              <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-2 py-1 rounded font-mono text-xs">
                BORNE 4P x8
              </div>
              <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-2 py-1 rounded font-mono text-xs">
                STATUS LEDS
              </div>
            </>
          )}
          
          {currentSide === 'bottom' && (
            <>
              <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-2 py-1 rounded font-mono text-xs">
                WS281x DRIVERS
              </div>
              <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-2 py-1 rounded font-mono text-xs">
                POWER & FILTER
              </div>
            </>
          )}
        </div>

        {/* Especificações e Componentes - Grid Responsivo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Especificações */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-primary font-mono flex items-center gap-1">
              <Settings className="w-4 h-4" />
              ESPECIFICAÇÕES
            </h4>
            <div className="space-y-1">
              {pcbSpecs.map((spec, index) => (
                <div key={index} className="flex justify-between text-xs font-mono p-1 bg-background rounded">
                  <span className="text-muted-foreground">{spec.label}:</span>
                  <span className="text-foreground font-bold">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Componentes Filtrados por Lado */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-accent font-mono flex items-center gap-1">
              <Cable className="w-4 h-4" />
              COMPONENTES - {currentSide.toUpperCase()}
            </h4>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {getFilteredComponents().map((component, index) => (
                <div key={index} className="p-1 bg-background rounded">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-foreground truncate flex-1">{component.name}</span>
                    <Badge variant="outline" className="text-xs h-4 ml-2">
                      {component.qty}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">{component.type}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pinagem dos Conectores BORNE */}
        <div className="border-t pt-3">
          <h4 className="text-sm font-bold text-primary font-mono mb-2">
            PINAGEM CONECTORES BORNE (4 PINOS)
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {borneConnections.map((conn, index) => (
              <div key={index} className="p-2 bg-background rounded border text-xs font-mono">
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="secondary" className="text-xs">
                    PIN {conn.pin}
                  </Badge>
                  <span className={`font-bold ${conn.color}`}>{conn.signal}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {conn.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tipos de Fitas LED Suportadas */}
        <div className="border-t pt-3">
          <h4 className="text-sm font-bold text-accent font-mono mb-2">
            FITAS LED COMPATÍVEIS
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {supportedLedTypes.map((led, index) => (
              <div key={index} className="p-2 bg-background rounded border text-xs font-mono">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-primary">{led.type}</span>
                  <Badge variant="outline" className="text-xs">
                    {led.pins}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {led.connection} • {led.voltage}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Características */}
        <div className="text-xs font-mono text-muted-foreground border-t pt-2">
          <div>✓ Conectores BORNE robustos para fácil instalação</div>
          <div>✓ Suporte a fitas LED de 3 e 4 pinos</div>
          <div>✓ Proteção ESD e filtros de alimentação</div>
          <div>✓ LEDs de status RGB por saída</div>
        </div>
      </div>
    </Card>
  );
}