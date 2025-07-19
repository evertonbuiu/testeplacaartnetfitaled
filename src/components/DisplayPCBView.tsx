import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Maximize2, Monitor, Gamepad2, Layers, FlipHorizontal, TouchpadIcon, Palette, Cable } from 'lucide-react';
import displayPCBTop from '@/assets/display-pcb-premium-top.jpg';
import displayPCBBottom from '@/assets/display-pcb-premium-bottom.jpg';

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
    { label: 'DIMENSÕES', value: '120mm x 80mm' },
    { label: 'DISPLAY', value: '4.3" TFT Touch' },
    { label: 'RESOLUÇÃO', value: '480 x 272 px' },
    { label: 'CORES', value: '16.7M (24-bit)' },
    { label: 'CAMADAS', value: '4 Layer PCB' },
    { label: 'ESPESSURA', value: '1.6mm' },
    { label: 'ACABAMENTO', value: 'ENIG Gold' },
    { label: 'MÁSCARA', value: 'Preto Fosco' },
    { label: 'SILKSCREEN', value: 'Branco/Ouro' }
  ];

  const displayComponents = [
    { name: 'Display TFT Touch', qty: '1x', type: '4.3" 480x272 Capacitive', side: 'top' },
    { name: 'Botões Premium', qty: '6x', type: 'Tátil LED Backlight', side: 'top' },
    { name: 'LEDs de Status RGB', qty: '8x', type: 'SMD 2835 Full-Color', side: 'top' },
    { name: 'Conector Cabo Flat', qty: '1x', type: '30-Pin FFC', side: 'both' },
    { name: 'Touch Controller', qty: '1x', type: 'FT5206GE1 Capacitive', side: 'bottom' },
    { name: 'Display Driver', qty: '1x', type: 'ILI9488 TFT Controller', side: 'bottom' },
    { name: 'MCU Principal', qty: '1x', type: 'STM32F407VGT6 ARM', side: 'bottom' },
    { name: 'Flash Memory', qty: '1x', type: '16MB SPI Flash', side: 'bottom' },
    { name: 'RAM Externa', qty: '1x', type: '8MB SDRAM', side: 'bottom' },
    { name: 'Reguladores LDO', qty: '4x', type: '3.3V/1.8V/1.2V', side: 'bottom' },
    { name: 'Cristal Principal', qty: '1x', type: '25MHz SMD', side: 'bottom' },
    { name: 'Cristal RTC', qty: '1x', type: '32.768kHz', side: 'bottom' }
  ];

  const connectionSpecs = [
    { pin: '1-4', signal: 'VCC (5V/3.3V)', description: 'Alimentação Dual' },
    { pin: '5-8', signal: 'GND', description: 'Terra Digital/Analógico' },
    { pin: '9-16', signal: 'TFT Data Bus', description: 'Interface RGB565' },
    { pin: '17-20', signal: 'TFT Control', description: 'Sync/Clock/Enable' },
    { pin: '21-24', signal: 'Touch I2C', description: 'SDA/SCL/INT/RST' },
    { pin: '25-28', signal: 'Button Matrix', description: 'Entradas dos Botões' },
    { pin: '29-30', signal: 'SPI/UART', description: 'Comunicação Serial' }
  ];

  const getFilteredComponents = () => {
    return displayComponents.filter(component => 
      component.side === currentSide || component.side === 'both'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header com controles */}
      <Card className="p-6 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 border-2 border-accent shadow-[var(--shadow-glow)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-accent font-mono mb-2 flex items-center gap-3">
              <TouchpadIcon className="w-8 h-8 text-primary" />
              PLACA DISPLAY PREMIUM TOUCH
            </h2>
            <p className="text-muted-foreground font-mono">
              Display TFT 4.3" Touch Screen - {currentSide === 'top' ? 'COMPONENTES' : 'CIRCUITOS'} - Cabo Flat 30 Pinos
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
                <h3 className="text-xl font-bold text-accent font-mono flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  PCB PREMIUM - {currentSide === 'top' ? 'INTERFACE TOUCH' : 'CIRCUITOS AVANÇADOS'}
                </h3>
                <Badge variant="outline" className="font-mono bg-primary/20">
                  LADO {currentSide.toUpperCase()}
                </Badge>
              </div>

              <div className="border-2 border-primary rounded-lg overflow-hidden bg-gradient-to-br from-background to-background/80 p-4 relative shadow-[var(--shadow-elegant)]">
                <img
                  src={currentSide === 'top' ? displayPCBTop : displayPCBBottom}
                  alt={`Placa PCB do Display - Lado ${currentSide}`}
                  className="w-full h-auto object-contain rounded"
                  style={{ maxHeight: '500px' }}
                />
                
                {/* Overlays informativos */}
                {currentSide === 'top' && (
                  <>
                    <div className="absolute top-6 left-6 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-mono text-sm shadow-lg">
                      TFT TOUCH 4.3" 480x272
                    </div>
                    <div className="absolute top-6 right-6 bg-accent text-accent-foreground px-4 py-2 rounded-lg font-mono text-sm shadow-lg">
                      FLAT 30P PREMIUM
                    </div>
                    <div className="absolute bottom-6 left-6 bg-led-green text-background px-4 py-2 rounded-lg font-mono text-sm shadow-lg">
                      BOTÕES LED BACKLIGHT
                    </div>
                    <div className="absolute bottom-6 right-6 bg-led-blue text-background px-4 py-2 rounded-lg font-mono text-sm shadow-lg">
                      RGB STATUS LEDS
                    </div>
                  </>
                )}
                
                {currentSide === 'bottom' && (
                  <>
                    <div className="absolute top-6 left-6 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-mono text-sm shadow-lg">
                      STM32F407 ARM MCU
                    </div>
                    <div className="absolute top-6 right-6 bg-accent text-accent-foreground px-4 py-2 rounded-lg font-mono text-sm shadow-lg">
                      GOLDEN TRACES
                    </div>
                    <div className="absolute bottom-6 left-6 bg-led-orange text-background px-4 py-2 rounded-lg font-mono text-sm shadow-lg">
                      TOUCH CONTROLLER
                    </div>
                    <div className="absolute bottom-6 right-6 bg-led-purple text-background px-4 py-2 rounded-lg font-mono text-sm shadow-lg">
                      MEMORY & FLASH
                    </div>
                  </>
                )}
              </div>

              <div className="text-sm text-muted-foreground font-mono text-center p-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded">
                DESIGN PREMIUM | DISPLAY TOUCH COLORIDO | INTERFACE PROFISSIONAL | BOTÕES FÍSICOS LED
              </div>
            </div>
          </Card>

          {/* Pinagem do Cabo Flat Premium */}
          <Card className="p-4 bg-card border-2 border-primary mt-4 shadow-[var(--shadow-elegant)]">
            <h3 className="text-lg font-bold text-primary font-mono mb-3 flex items-center gap-2">
              <Cable className="w-5 h-5" />
              PINAGEM DO CABO FLAT PREMIUM (30 PINOS)
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

          {/* Vantagens do Design Premium */}
          <Card className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/50">
            <h4 className="text-sm font-bold text-accent font-mono mb-2 flex items-center gap-2">
              <TouchpadIcon className="w-4 h-4" />
              RECURSOS PREMIUM
            </h4>
            <div className="space-y-1 text-xs font-mono text-muted-foreground">
              <div>✨ Display touch capacitivo de alta resolução</div>
              <div>🎨 Interface colorida com 16.7M cores</div>
              <div>💡 Botões físicos com LED backlight</div>
              <div>🌈 LEDs de status RGB programáveis</div>
              <div>🔧 MCU ARM Cortex-M4 de alta performance</div>
              <div>💾 Memória Flash e RAM externa</div>
              <div>⚡ Cabo flat premium 30 pinos</div>
              <div>🏆 Acabamento ENIG dourado premium</div>
              <div>🎯 Design modular profissional</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}