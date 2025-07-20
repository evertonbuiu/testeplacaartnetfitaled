import { useState, useEffect } from 'react';
import { LEDOutput } from '@/components/LEDOutput';
import { ControlDisplay } from '@/components/ControlDisplay';
import { NetworkPanel } from '@/components/NetworkPanel';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Zap, Cpu, HardDrive, FileText, Microchip, Cable } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OutputConfig {
  universes: number;
  isActive: boolean;
}

interface NetworkConfig {
  ip: string;
  subnet: string;
  gateway: string;
  mode: 'auto' | 'broadcast' | 'fixed';
}

interface ICConfig {
  type: 'WS2811' | 'WS2812' | 'WS2812B' | 'SK6812' | 'APA102' | 'APA104' | 'UCS1903' | 'TM1809' | 'TM1804';
  frequency: string;
  colorOrder: 'RGB' | 'GRB' | 'RBG' | 'BRG' | 'BGR' | 'GBR';
  voltage: '5V' | '12V' | '24V';
  pixelsPerMeter: number;
}

export default function LEDController() {
  const [outputs, setOutputs] = useState<OutputConfig[]>(
    Array.from({ length: 32 }, () => ({ universes: 1, isActive: false }))
  );
  
  const [networkConfig, setNetworkConfig] = useState<NetworkConfig>({
    ip: '192.168.1.100',
    subnet: '255.255.255.0',
    gateway: '192.168.1.1',
    mode: 'fixed'
  });
  
  const [icConfig, setICConfig] = useState<ICConfig>({
    type: 'WS2811',
    frequency: '400kHz',
    colorOrder: 'GRB',
    voltage: '5V',
    pixelsPerMeter: 60
  });
  
  const [artnetPackets, setArtnetPackets] = useState(0);
  const [systemStats, setSystemStats] = useState({
    temperature: 42,
    voltage: 5.0,
    current: 15.2
  });

  // Simula recebimento de pacotes ART-NET
  useEffect(() => {
    const interval = setInterval(() => {
      setArtnetPackets(prev => prev + Math.floor(Math.random() * 10) + 5);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleUniverseChange = (outputIndex: number, universes: number) => {
    setOutputs(prev => prev.map((output, index) => 
      index === outputIndex ? { ...output, universes } : output
    ));
  };

  const handleOutputToggle = (outputIndex: number) => {
    setOutputs(prev => prev.map((output, index) => 
      index === outputIndex ? { ...output, isActive: !output.isActive } : output
    ));
  };

  const getCurrentIP = () => {
    switch (networkConfig.mode) {
      case 'auto':
        return '192.168.1.105'; // IP simulado obtido via DHCP
      case 'broadcast':
        return '2.255.255.255';
      case 'fixed':
        return networkConfig.ip;
      default:
        return networkConfig.ip;
    }
  };

  const totalUniverses = outputs.reduce((sum, output) => 
    output.isActive ? sum + output.universes : sum, 0
  );
  
  const activeOutputs = outputs.filter(output => output.isActive).length;

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-card via-card to-card border-2 border-primary">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-primary font-mono">
            CONTROLADOR LED {icConfig.type} - 32 SAÍDAS
          </h1>
          <p className="text-muted-foreground font-mono">
            Sistema Profissional de Controle de Fitas LED via ART-NET
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Badge variant="default" className="font-mono">
              {activeOutputs} SAÍDAS ATIVAS
            </Badge>
            <Badge variant="secondary" className="font-mono">
              {totalUniverses} UNIVERSOS TOTAL
            </Badge>
            <Badge variant="outline" className="font-mono">
              ART-NET ATIVO
            </Badge>
          </div>
          <div className="flex justify-center gap-3 mt-4">
            <Button asChild variant="outline" className="font-mono">
              <Link to="/schematic">
                <FileText className="w-4 h-4 mr-2" />
                VER ESQUEMA ELÉTRICO
              </Link>
            </Button>
            <Button asChild variant="outline" className="font-mono">
              <Link to="/pcb">
                <Microchip className="w-4 h-4 mr-2" />
                VER PLACA PRINCIPAL
              </Link>
            </Button>
            <Button asChild variant="outline" className="font-mono">
              <Link to="/display-pcb">
                <Microchip className="w-4 h-4 mr-2" />
                VER PLACA DISPLAY
              </Link>
            </Button>
            <Button asChild variant="outline" className="font-mono">
              <Link to="/output-pcb">
                <Cable className="w-4 h-4 mr-2" />
                VER PLACAS DE SAÍDA
              </Link>
            </Button>
            <Button asChild variant="default" className="font-mono">
              <Link to="/interactive-viewer">
                <Zap className="w-4 h-4 mr-2" />
                VIEWER INTERATIVO 3D
              </Link>
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Painel de Controle */}
        <div className="lg:col-span-1 space-y-4">
          <ControlDisplay
            artnetStatus="connected"
            universe={1}
            subnet={0}
            networkConfig={networkConfig}
            onNetworkConfigChange={setNetworkConfig}
            icConfig={icConfig}
            onICConfigChange={setICConfig}
          />
          
          <NetworkPanel
            inputStatus="connected"
            outputStatus="connected"
            artnetPackets={artnetPackets}
            dataRate="125 Mbps"
            currentIP={getCurrentIP()}
            networkMode={networkConfig.mode.toUpperCase()}
          />

          {/* Status do Sistema */}
          <Card className="p-4 bg-card border-2 border-accent">
            <h3 className="text-lg font-bold text-center text-accent mb-3">
              STATUS DO SISTEMA
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-background rounded border">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-led-orange" />
                  <span className="text-xs font-mono">TEMPERATURA</span>
                </div>
                <span className="text-sm font-bold font-mono">{systemStats.temperature}°C</span>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-background rounded border">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-led-blue" />
                  <span className="text-xs font-mono">TENSÃO</span>
                </div>
                <span className="text-sm font-bold font-mono">{systemStats.voltage}V</span>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-background rounded border">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-led-green" />
                  <span className="text-xs font-mono">CORRENTE</span>
                </div>
                <span className="text-sm font-bold font-mono">{systemStats.current}A</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Grid de Saídas LED */}
        <div className="lg:col-span-3">
          <Card className="p-6 bg-card border-2 border-primary">
            <h2 className="text-xl font-bold text-center text-primary mb-4 font-mono">
              SAÍDAS FÍSICAS {icConfig.type}
            </h2>
            <Separator className="mb-4" />
            
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {outputs.map((output, index) => (
                <LEDOutput
                  key={index}
                  outputNumber={index + 1}
                  universes={output.universes}
                  isActive={output.isActive}
                  onUniverseChange={(universes) => handleUniverseChange(index, universes)}
                  onToggle={() => handleOutputToggle(index)}
                />
              ))}
            </div>

            {/* Resumo das Configurações */}
            <Separator className="my-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-background rounded border">
                <div className="text-2xl font-bold text-primary font-mono">{activeOutputs}</div>
                <div className="text-xs text-muted-foreground">SAÍDAS ATIVAS</div>
              </div>
              <div className="p-3 bg-background rounded border">
                <div className="text-2xl font-bold text-accent font-mono">{totalUniverses}</div>
                <div className="text-xs text-muted-foreground">UNIVERSOS</div>
              </div>
              <div className="p-3 bg-background rounded border">
                <div className="text-2xl font-bold text-led-green font-mono">{artnetPackets}</div>
                <div className="text-xs text-muted-foreground">PACOTES/SEC</div>
              </div>
              <div className="p-3 bg-background rounded border">
                <div className="text-2xl font-bold text-led-orange font-mono">32</div>
                <div className="text-xs text-muted-foreground">CANAIS TOTAL</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <Card className="p-4 bg-card border border-border">
          <div className="text-center text-xs text-muted-foreground font-mono">
            SISTEMA DE CONTROLE LED {icConfig.type} | PROTOCOLO ART-NET | 32 SAÍDAS × 8 UNIVERSOS | 
            {icConfig.frequency} {icConfig.colorOrder} {icConfig.voltage} | DESIGN PROFISSIONAL PARA ILUMINAÇÃO CÊNICA
          </div>
      </Card>
    </div>
  );
}