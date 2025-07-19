import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Maximize2, Zap, Cpu, Cable, Network, Layers, FlipHorizontal, Wifi } from 'lucide-react';
import { Link } from 'react-router-dom';
import centralPcbTop from '@/assets/main-pcb-premium-top.jpg';
import centralPcbBottom from '@/assets/main-pcb-premium-bottom.jpg';

export function PCBView() {
  const [currentSide, setCurrentSide] = useState<'top' | 'bottom'>('top');
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentSide === 'top' ? centralPcbTop : centralPcbBottom;
    link.download = `placa-central-premium-${currentSide}-controlador.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFullscreen = () => {
    window.open(currentSide === 'top' ? centralPcbTop : centralPcbBottom, '_blank');
  };

  const pcbSpecs = [
    { label: 'DIMENSÕES', value: '220mm x 180mm' },
    { label: 'CAMADAS', value: '6 Layer PCB' },
    { label: 'ESPESSURA', value: '1.6mm' },
    { label: 'ACABAMENTO', value: 'ENIG Gold Premium' },
    { label: 'MÁSCARA', value: 'Preto Fosco' },
    { label: 'SILKSCREEN', value: 'Branco/Ouro' },
    { label: 'IMPEDÂNCIA', value: 'Controlada 50Ω' },
    { label: 'QUALIDADE', value: 'Industrial Grade' }
  ];

  const components = [
    { name: 'MCU Principal ARM', qty: '1x', type: 'STM32H743 400MHz', side: 'bottom' },
    { name: 'Ethernet PHY', qty: '1x', type: 'KSZ9031RNX Gigabit', side: 'bottom' },
    { name: 'Conectores RJ45 LED', qty: '2x', type: 'Magjack c/ LEDs', side: 'top' },
    { name: 'Reguladores Premium', qty: '6x', type: '5V/3.3V/1.8V/1.2V', side: 'bottom' },
    { name: 'Conectores Cabo Flat', qty: '5x', type: '30-Pin FFC Premium', side: 'both' },
    { name: 'Flash Memory', qty: '1x', type: '32MB QSPI', side: 'bottom' },
    { name: 'SDRAM Externa', qty: '1x', type: '32MB DDR3', side: 'bottom' },
    { name: 'LEDs Status RGB', qty: '12x', type: 'WS2812B Individual', side: 'top' },
    { name: 'Cristal Ethernet', qty: '1x', type: '25MHz TCXO', side: 'bottom' },
    { name: 'Cristal Sistema', qty: '1x', type: '32MHz TCXO', side: 'bottom' },
    { name: 'Supercapacitor RTC', qty: '1x', type: '0.1F Backup', side: 'bottom' },
    { name: 'Conectores Alimentação', qty: '2x', type: 'Terminal Block Premium', side: 'top' }
  ];

  const networkFeatures = [
    { feature: 'LED Verde', status: 'Gigabit (1000 Mbps)', description: 'Conexão de alta velocidade ativa' },
    { feature: 'LED Laranja', status: 'Fast Ethernet (100 Mbps)', description: 'Conexão padrão ativa' },
    { feature: 'Auto-MDIX', status: 'Automático', description: 'Detecção automática de cabo' },
    { feature: 'Wake-on-LAN', status: 'Suportado', description: 'Ativação remota via rede' },
    { feature: 'Link Status', status: 'LED Integrado', description: 'Indicação visual da conexão' },
    { feature: 'Activity LED', status: 'Piscando', description: 'Indicação de tráfego de dados' }
  ];

  const getFilteredComponents = () => {
    return components.filter(component => 
      component.side === currentSide || component.side === 'both'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header com controles */}
      <Card className="p-6 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 border-2 border-primary shadow-[var(--shadow-glow)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-primary font-mono mb-2 flex items-center gap-3">
              <Network className="w-8 h-8 text-accent" />
              PLACA CENTRAL PREMIUM
            </h2>
            <p className="text-muted-foreground font-mono">
              Controlador Ethernet Gigabit • Conectores RJ45 com LEDs • {currentSide === 'top' ? 'COMPONENTES' : 'CIRCUITOS'}
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
        {/* Imagem da PCB */}
        <div className="lg:col-span-2">
          <Card className="p-4 bg-card border-2 border-accent shadow-[var(--shadow-elegant)]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-accent font-mono flex items-center gap-2">
                  <Wifi className="w-6 h-6" />
                  PLACA CENTRAL - {currentSide === 'top' ? 'CONECTORES' : 'PROCESSAMENTO'}
                </h3>
                <Badge variant="outline" className="font-mono bg-primary/20">
                  6 CAMADAS PREMIUM
                </Badge>
              </div>

              <div className="border-2 border-primary rounded-lg overflow-hidden bg-gradient-to-br from-background to-background/80 p-4 relative shadow-[var(--shadow-elegant)]">
                <img
                  src={currentSide === 'top' ? centralPcbTop : centralPcbBottom}
                  alt={`Placa Central Premium - ${currentSide}`}
                  className="w-full h-auto object-contain rounded"
                  style={{ maxHeight: '400px' }}
                />

                {/* Overlays informativos */}
                {currentSide === 'top' && (
                  <>
                    <div className="absolute top-4 left-4 bg-led-green text-background px-3 py-2 rounded-lg font-mono text-sm shadow-lg">
                      RJ45 c/ LEDs 1000/100
                    </div>
                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-2 rounded-lg font-mono text-sm shadow-lg">
                      FLAT 30P x5
                    </div>
                    <div className="absolute bottom-4 left-4 bg-accent text-accent-foreground px-3 py-2 rounded-lg font-mono text-sm shadow-lg">
                      ALIMENTAÇÃO PREMIUM
                    </div>
                    <div className="absolute bottom-4 right-4 bg-led-blue text-background px-3 py-2 rounded-lg font-mono text-sm shadow-lg">
                      STATUS LEDs RGB
                    </div>
                  </>
                )}

                {currentSide === 'bottom' && (
                  <>
                    <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-2 rounded-lg font-mono text-sm shadow-lg">
                      STM32H743 400MHz
                    </div>
                    <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-2 rounded-lg font-mono text-sm shadow-lg">
                      ETHERNET PHY
                    </div>
                    <div className="absolute bottom-4 left-4 bg-led-orange text-background px-3 py-2 rounded-lg font-mono text-sm shadow-lg">
                      32MB FLASH + RAM
                    </div>
                    <div className="absolute bottom-4 right-4 bg-led-purple text-background px-3 py-2 rounded-lg font-mono text-sm shadow-lg">
                      POWER MANAGEMENT
                    </div>
                  </>
                )}
              </div>

              <div className="text-sm text-muted-foreground font-mono text-center p-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded">
                DESIGN PREMIUM | CONECTORES EXTERNOS | QUALIDADE INDUSTRIAL | 6 CAMADAS
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

          {/* Recursos de Rede com LEDs */}
          <Card className="p-4 bg-card border-2 border-led-green">
            <h3 className="text-lg font-bold text-led-green font-mono mb-3 flex items-center gap-2">
              <Network className="w-5 h-5" />
              CONECTORES RJ45 COM LEDs
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {networkFeatures.map((feature, index) => (
                <div key={index} className="p-2 bg-background rounded border">
                  <div className="flex justify-between items-start text-xs font-mono">
                    <span className="text-foreground font-medium flex-1">
                      {feature.feature}
                    </span>
                    <Badge 
                      variant={feature.feature.includes('Verde') ? 'default' : 
                              feature.feature.includes('Laranja') ? 'secondary' : 'outline'} 
                      className="ml-2 text-xs"
                    >
                      {feature.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {feature.description}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Lista de Componentes Filtrada */}
          <Card className="p-4 bg-card border-2 border-accent">
            <h3 className="text-lg font-bold text-accent font-mono mb-3 flex items-center gap-2">
              <Cpu className="w-5 h-5" />
              COMPONENTES - {currentSide.toUpperCase()}
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

          {/* Características Técnicas Premium */}
          <Card className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/50">
            <h4 className="text-sm font-bold text-primary font-mono mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              RECURSOS PREMIUM
            </h4>
            <div className="space-y-1 text-xs font-mono text-muted-foreground">
              <div>🚀 MCU ARM Cortex-M7 400MHz com cache</div>
              <div>🌐 Ethernet Gigabit com PHY dedicado</div>
              <div>💡 LEDs integrados: Verde (1000) / Laranja (100)</div>
              <div>🔌 Conectores RJ45 para montagem externa</div>
              <div>⚡ Reguladores premium multi-estágio</div>
              <div>💾 32MB Flash + 32MB RAM externa</div>
              <div>🔒 Backup RTC com supercapacitor</div>
              <div>🎯 Design 6 camadas com impedância controlada</div>
              <div>🏆 Acabamento ENIG dourado premium</div>
            </div>
            
            {/* Botão para ver placas de saída */}
            <div className="mt-4 pt-2 border-t">
              <Button asChild variant="outline" size="sm" className="w-full font-mono">
                <Link to="/output-pcb">
                  <Cable className="w-4 h-4 mr-2" />
                  VER PLACAS DE SAÍDA
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}