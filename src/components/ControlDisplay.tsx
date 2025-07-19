import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { 
  Settings, 
  Wifi, 
  TestTube, 
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Network,
  Home,
  Info,
  Sliders,
  Play,
  Square,
  RotateCcw,
  Zap,
  Activity,
  Factory,
  RotateCcw as Reset
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type MenuState = 'main' | 'artnet' | 'network' | 'test' | 'effects' | 'settings' | 'ic_config' | 'system_info' | 'outputs_config';

interface OutputConfig {
  id: number;
  enabled: boolean;
  universes: number;
  startUniverse: number;
  pixelsPerUniverse: number;
  name: string;
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

interface ControlDisplayProps {
  artnetStatus: 'connected' | 'disconnected';
  universe: number;
  subnet: number;
  networkConfig: NetworkConfig;
  onNetworkConfigChange: (config: NetworkConfig) => void;
  icConfig?: ICConfig;
  onICConfigChange?: (config: ICConfig) => void;
}

export function ControlDisplay({ 
  artnetStatus, 
  universe, 
  subnet, 
  networkConfig, 
  onNetworkConfigChange,
  icConfig = {
    type: 'WS2811',
    frequency: '800kHz',
    colorOrder: 'GRB',
    voltage: '5V',
    pixelsPerMeter: 60
  },
  onICConfigChange 
}: ControlDisplayProps) {
  const { toast } = useToast();
  const [currentMenu, setCurrentMenu] = useState<MenuState>('main');
  const [selectedOption, setSelectedOption] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [tempConfig, setTempConfig] = useState(networkConfig);
  const [tempICConfig, setTempICConfig] = useState(icConfig);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [testMode, setTestMode] = useState<'off' | 'rgb' | 'rainbow' | 'chase'>('off');
  const [selectedTestOutput, setSelectedTestOutput] = useState(1);
  const [manualRGB, setManualRGB] = useState({ r: 255, g: 0, b: 0 });
  const [testAllOutputs, setTestAllOutputs] = useState(false);
  const [selectedEffect, setSelectedEffect] = useState('rainbow');
  const [effectSpeed, setEffectSpeed] = useState(50);
  const [effectDirection, setEffectDirection] = useState<'forward' | 'backward'>('forward');
  const [effectColor, setEffectColor] = useState({ r: 255, g: 0, b: 0 });
  const [customChase, setCustomChase] = useState({
    color1: { r: 255, g: 0, b: 0 },
    color2: { r: 0, g: 255, b: 0 },
    pixelSpacing: 10,
    blockSize: 5
  });
  const [outputs, setOutputs] = useState<OutputConfig[]>(() => {
    const outputArray: OutputConfig[] = [];
    for (let i = 1; i <= 32; i++) {
      outputArray.push({
        id: i,
        enabled: i <= 8, // Primeiras 8 saídas ativas por padrão
        universes: 1,
        startUniverse: i,
        pixelsPerUniverse: 170,
        name: `SAÍDA ${i.toString().padStart(2, '0')}`
      });
    }
    return outputArray;
  });
  const [selectedOutput, setSelectedOutput] = useState(0);

  // Funções do sistema
  const handleSystemReset = () => {
    toast({
      title: "Sistema Reiniciado",
      description: "Controller reiniciado com sucesso",
    });
  };

  const handleFactoryDefault = () => {
    // Reset all configurations to factory defaults
    setTempConfig({
      ip: '192.168.1.100',
      subnet: '255.255.255.0',
      gateway: '192.168.1.1',
      mode: 'auto'
    });
    setTempICConfig({
      type: 'WS2811',
      frequency: '800kHz',
      colorOrder: 'GRB',
      voltage: '5V',
      pixelsPerMeter: 60
    });
    setTestMode('off');
    setSelectedEffect('rainbow');
    setEffectSpeed(50);
    setEffectDirection('forward');
    
    // Reset outputs to default
    const defaultOutputs: OutputConfig[] = [];
    for (let i = 1; i <= 32; i++) {
      defaultOutputs.push({
        id: i,
        enabled: i <= 8,
        universes: 1,
        startUniverse: i,
        pixelsPerUniverse: 170,
        name: `SAÍDA ${i.toString().padStart(2, '0')}`
      });
    }
    setOutputs(defaultOutputs);
    
    toast({
      title: "Configurações de Fábrica Restauradas",
      description: "Todas as configurações foram restauradas aos valores padrão",
    });
  };

  // Atualizar relógio
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const mainMenuOptions = [
    { icon: Wifi, label: 'ART-NET', action: () => setCurrentMenu('artnet'), color: 'text-led-green' },
    { icon: Network, label: 'REDE IP', action: () => setCurrentMenu('network'), color: 'text-led-blue' },
    { icon: Settings, label: 'IC CONFIG', action: () => setCurrentMenu('ic_config'), color: 'text-led-orange' },
    { icon: Sliders, label: 'SAÍDAS', action: () => setCurrentMenu('outputs_config'), color: 'text-led-purple' },
    { icon: TestTube, label: 'TESTE', action: () => setCurrentMenu('test'), color: 'text-primary' },
    { icon: Sparkles, label: 'EFEITOS', action: () => setCurrentMenu('effects'), color: 'text-accent' },
    { icon: Info, label: 'SISTEMA', action: () => setCurrentMenu('system_info'), color: 'text-muted-foreground' },
  ];

  const getCurrentIP = () => {
    switch (networkConfig.mode) {
      case 'auto':
        return '192.168.1.105';
      case 'broadcast':
        return '2.255.255.255';
      case 'fixed':
        return networkConfig.ip;
      default:
        return networkConfig.ip;
    }
  };

  const artnetOptions = [
    { label: 'UNIVERSO', value: universe.toString().padStart(3, '0') },
    { label: 'SUBNET', value: subnet.toString().padStart(3, '0') },
    { label: 'NET', value: '000' },
    { label: 'STATUS', value: artnetStatus === 'connected' ? 'CONECTADO' : 'DESCONECTADO' },
  ];

  const saveNetworkConfig = () => {
    onNetworkConfigChange(tempConfig);
    setIsEditing(false);
    toast({
      title: "Configuração Salva",
      description: `IP ${tempConfig.ip} configurado em modo ${tempConfig.mode.toUpperCase()}`,
    });
  };

  const saveICConfig = () => {
    if (onICConfigChange) {
      onICConfigChange(tempICConfig);
    }
    toast({
      title: "Configuração IC Salva",
      description: `${tempICConfig.type} configurado - ${tempICConfig.colorOrder} ${tempICConfig.voltage}`,
    });
  };

  const handleButtonPress = (buttonType: 'up' | 'down' | 'enter' | 'back') => {
    switch (buttonType) {
      case 'back':
        if (currentMenu !== 'main') {
          setCurrentMenu('main');
          setSelectedOption(0);
        }
        break;
    }
  };

  return (
    <div className="space-y-4">
      {/* Display Touch Premium - Simulação 4.3" */}
      <Card className="p-4 bg-gradient-to-br from-card to-card/80 border-2 border-primary shadow-[var(--shadow-glow)]">
        <div className="space-y-4">
          {/* Header do Display */}
          <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg p-3 border border-primary/30">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-led-green rounded-full animate-pulse"></div>
                <span className="text-sm font-bold text-primary font-mono">LED CONTROLLER PREMIUM</span>
              </div>
              <div className="text-xs font-mono text-muted-foreground">
                {currentTime.toLocaleTimeString()}
              </div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <Badge 
                variant={artnetStatus === 'connected' ? "default" : "destructive"}
                className="text-xs font-mono"
              >
                {artnetStatus === 'connected' ? 'ART-NET ✓' : 'ART-NET ✗'}
              </Badge>
              <Badge variant="outline" className="text-xs font-mono">
                {icConfig.type} {icConfig.voltage}
              </Badge>
              <Badge 
                variant={testMode !== 'off' ? 'secondary' : 'outline'} 
                className="text-xs font-mono"
              >
                {testMode !== 'off' ? `TESTE: ${testMode.toUpperCase()}` : 'NORMAL'}
              </Badge>
            </div>
          </div>

          {/* Área do Display Touch - 4.3" Simulado */}
          <div className="bg-black rounded-lg p-4 min-h-[280px] border-2 border-accent relative overflow-hidden">
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded h-full p-3">
              
              {/* Menu Principal */}
              {currentMenu === 'main' && (
                <div className="space-y-2">
                  {/* Conexões de Rede */}
                  <div className="bg-gradient-to-r from-green-900/30 to-green-800/30 rounded-lg p-3 border border-green-600">
                    <div className="text-center text-green-400 font-bold text-xs font-mono mb-2">CONEXÕES DE REDE</div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-white text-xs font-mono">ENTRADA ETH</span>
                        </div>
                        <Badge className="bg-green-600 text-white text-xs font-mono">CONECTADO</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                          <span className="text-white text-xs font-mono">SAÍDA ETH</span>
                        </div>
                        <Badge className="bg-green-600 text-white text-xs font-mono">CONECTADO</Badge>
                      </div>
                      <div className="border-t border-green-600/50 pt-1 mt-2">
                        <div className="text-blue-300 text-xs font-mono mb-1">📡 ART-NET STATUS</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="text-center">
                            <div className="text-white font-bold">4172</div>
                            <div className="text-gray-400">PACOTES/SEC</div>
                          </div>
                          <div className="text-center">
                            <div className="text-orange-400 font-bold">125 Mbps</div>
                            <div className="text-gray-400">TAXA DADOS</div>
                          </div>
                        </div>
                        <div className="mt-2 text-center">
                          <div className="text-green-400 text-xs font-mono">CONFIGURAÇÃO IP:</div>
                          <div className="text-white text-sm font-bold">{getCurrentIP()}</div>
                          <div className="text-gray-400 text-xs">MODO: {networkConfig.mode.toUpperCase()}</div>
                        </div>
                        <div className="flex items-center justify-center gap-2 mt-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-green-400 text-xs font-mono">SISTEMA ATIVO</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status do Sistema */}
                  <div className="bg-gradient-to-r from-orange-900/30 to-orange-800/30 rounded-lg p-3 border border-orange-600">
                    <div className="text-center text-orange-400 font-bold text-xs font-mono mb-2">STATUS DO SISTEMA</div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center p-1 bg-black/20 rounded">
                        <div className="flex items-center gap-2">
                          <Zap className="w-3 h-3 text-yellow-400" />
                          <span className="text-white text-xs font-mono">TEMPERATURA</span>
                        </div>
                        <span className="text-white text-sm font-bold font-mono">42°C</span>
                      </div>
                      <div className="flex justify-between items-center p-1 bg-black/20 rounded">
                        <div className="flex items-center gap-2">
                          <Activity className="w-3 h-3 text-blue-400" />
                          <span className="text-white text-xs font-mono">TENSÃO</span>
                        </div>
                        <span className="text-white text-sm font-bold font-mono">5V</span>
                      </div>
                      <div className="flex justify-between items-center p-1 bg-black/20 rounded">
                        <div className="flex items-center gap-2">
                          <Activity className="w-3 h-3 text-green-400" />
                          <span className="text-white text-xs font-mono">CORRENTE</span>
                        </div>
                        <span className="text-white text-sm font-bold font-mono">15.2A</span>
                      </div>
                    </div>
                  </div>

                  {/* Menu de Navegação */}
                  <div className="grid grid-cols-2 gap-1">
                    {mainMenuOptions.map((option, index) => (
                      <button
                        key={option.label}
                        onClick={option.action}
                        className={`p-2 rounded border transition-all duration-200 font-mono text-xs
                          ${selectedOption === index 
                            ? 'border-white bg-white/20 text-white' 
                            : 'border-gray-500 bg-gray-800/50 text-gray-300 hover:border-gray-300'
                          }`}
                      >
                        <div className="flex items-center gap-1">
                          <option.icon className={`w-3 h-3 ${option.color || 'text-white'}`} />
                          <span>{option.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Menu ART-NET */}
              {currentMenu === 'artnet' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-bold font-mono">CONFIGURAÇÃO ART-NET</h3>
                    <button 
                      onClick={() => setCurrentMenu('main')}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Home className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {artnetOptions.map((option, index) => (
                      <div key={option.label} className="flex justify-between items-center p-2 bg-gray-800/50 rounded border border-gray-600">
                        <span className="text-gray-300 text-xs font-mono">{option.label}:</span>
                        <span className="text-white text-sm font-bold font-mono">{option.value}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3 p-2 bg-green-900/30 rounded border border-green-600">
                    <div className="text-green-300 text-xs font-mono text-center">
                      ✓ PROTOCOLO ART-NET ATIVO • UNIVERSO 001 • 30 FPS
                    </div>
                  </div>
                </div>
              )}

              {/* Menu de Rede */}
              {currentMenu === 'network' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-bold font-mono">CONFIGURAÇÃO DE REDE</h3>
                    <button 
                      onClick={() => setCurrentMenu('main')}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Home className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-1">
                      {['AUTO', 'BROADCAST', 'FIXO'].map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setTempConfig(prev => ({ 
                            ...prev, 
                            mode: mode === 'AUTO' ? 'auto' : mode === 'BROADCAST' ? 'broadcast' : 'fixed' 
                          }))}
                          className={`p-2 rounded text-xs font-mono border transition-all
                            ${tempConfig.mode === (mode === 'AUTO' ? 'auto' : mode === 'BROADCAST' ? 'broadcast' : 'fixed')
                              ? 'bg-blue-600 text-white border-blue-400' 
                              : 'bg-gray-700 text-gray-300 border-gray-600 hover:border-gray-400'
                            }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                    
                    {tempConfig.mode === 'fixed' && (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={tempConfig.ip}
                          onChange={(e) => setTempConfig(prev => ({ ...prev, ip: e.target.value }))}
                          placeholder="IP Address"
                          className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded text-xs font-mono"
                        />
                        <input
                          type="text"
                          value={tempConfig.subnet}
                          onChange={(e) => setTempConfig(prev => ({ ...prev, subnet: e.target.value }))}
                          placeholder="Subnet Mask"
                          className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded text-xs font-mono"
                        />
                      </div>
                    )}
                    
                    <button
                      onClick={saveNetworkConfig}
                      className="w-full p-2 bg-green-600 hover:bg-green-700 text-white rounded font-mono text-sm transition-all"
                    >
                      💾 SALVAR CONFIGURAÇÃO
                    </button>
                  </div>
                  
                  <div className="p-2 bg-blue-900/30 rounded border border-blue-600">
                    <div className="text-blue-300 text-xs font-mono text-center">
                      🌐 CONECTORES RJ45 • LED VERDE: 1000Mbps • LED LARANJA: 100Mbps
                    </div>
                  </div>
                </div>
              )}

              {/* Menu IC Config */}
              {currentMenu === 'ic_config' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-bold font-mono">CONFIGURAÇÃO IC LED</h3>
                    <button 
                      onClick={() => setCurrentMenu('main')}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Home className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-xs text-gray-300 font-mono">TIPO DE IC:</div>
                    <div className="grid grid-cols-2 gap-1">
                      {['WS2811', 'WS2812B', 'SK6812', 'APA102'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setTempICConfig(prev => ({ ...prev, type: type as any }))}
                          className={`p-2 rounded text-xs font-mono border transition-all
                            ${tempICConfig.type === type
                              ? 'bg-orange-600 text-white border-orange-400' 
                              : 'bg-gray-700 text-gray-300 border-gray-600 hover:border-gray-400'
                            }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                    
                    <div className="text-xs text-gray-300 font-mono">ORDEM RGB:</div>
                    <div className="grid grid-cols-3 gap-1">
                      {['RGB', 'GRB', 'BRG'].map((order) => (
                        <button
                          key={order}
                          onClick={() => setTempICConfig(prev => ({ ...prev, colorOrder: order as any }))}
                          className={`p-2 rounded text-xs font-mono border transition-all
                            ${tempICConfig.colorOrder === order
                              ? 'bg-purple-600 text-white border-purple-400' 
                              : 'bg-gray-700 text-gray-300 border-gray-600 hover:border-gray-400'
                            }`}
                        >
                          {order}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={saveICConfig}
                      className="w-full p-2 bg-green-600 hover:bg-green-700 text-white rounded font-mono text-sm transition-all"
                    >
                      💾 SALVAR IC CONFIG
                    </button>
                  </div>
                  
                  <div className="p-2 bg-orange-900/30 rounded border border-orange-600">
                    <div className="text-orange-300 text-xs font-mono text-center">
                      🔧 {tempICConfig.type} • {tempICConfig.colorOrder} • {tempICConfig.voltage}
                    </div>
                  </div>
                </div>
              )}

              {/* Menu Configuração de Saídas */}
              {currentMenu === 'outputs_config' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-bold font-mono">CONFIGURAÇÃO SAÍDAS</h3>
                    <button 
                      onClick={() => setCurrentMenu('main')}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Home className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-2 max-h-44 overflow-y-auto">
                    {outputs.map((output, index) => (
                      <div 
                        key={output.id} 
                        className={`p-2 rounded border transition-all cursor-pointer
                          ${selectedOutput === index 
                            ? 'bg-purple-600/30 border-purple-400' 
                            : 'bg-gray-800/50 border-gray-600 hover:border-gray-400'
                          }`}
                        onClick={() => setSelectedOutput(index)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${output.enabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-white text-xs font-mono">{output.name}</span>
                          </div>
                          <Badge 
                            variant={output.enabled ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {output.enabled ? 'ATIVO' : 'INATIVO'}
                          </Badge>
                        </div>
                        <div className="mt-1 text-xs text-gray-300 font-mono">
                          Universos: {output.universes} • Início: {output.startUniverse} • Pixels/U: {output.pixelsPerUniverse}
                        </div>
                        
                        {selectedOutput === index && (
                          <div className="mt-2 space-y-2 border-t border-gray-600 pt-2">
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newOutputs = [...outputs];
                                  newOutputs[index].enabled = !newOutputs[index].enabled;
                                  setOutputs(newOutputs);
                                }}
                                className={`p-1 rounded text-xs font-mono border transition-all
                                  ${output.enabled 
                                    ? 'bg-red-600 text-white border-red-400' 
                                    : 'bg-green-600 text-white border-green-400'
                                  }`}
                              >
                                {output.enabled ? 'DESATIVAR' : 'ATIVAR'}
                              </button>
                              
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-300">Univ:</span>
                                <input
                                   type="number"
                                   value={output.universes}
                                   onChange={(e) => {
                                     const newOutputs = [...outputs];
                                     const value = parseInt(e.target.value) || 1;
                                     newOutputs[index].universes = Math.min(Math.max(value, 1), 8);
                                     setOutputs(newOutputs);
                                   }}
                                   className="w-12 p-1 bg-gray-700 text-white border border-gray-600 rounded text-xs font-mono"
                                   min="1"
                                   max="8"
                                 />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-300">Início:</span>
                                <input
                                  type="number"
                                  value={output.startUniverse}
                                  onChange={(e) => {
                                    const newOutputs = [...outputs];
                                    newOutputs[index].startUniverse = parseInt(e.target.value) || 1;
                                    setOutputs(newOutputs);
                                  }}
                                  className="w-12 p-1 bg-gray-700 text-white border border-gray-600 rounded text-xs font-mono"
                                  min="1"
                                  max="512"
                                />
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-300">Pixels:</span>
                                <input
                                  type="number"
                                  value={output.pixelsPerUniverse}
                                  onChange={(e) => {
                                    const newOutputs = [...outputs];
                                    newOutputs[index].pixelsPerUniverse = parseInt(e.target.value) || 170;
                                    setOutputs(newOutputs);
                                  }}
                                  className="w-12 p-1 bg-gray-700 text-white border border-gray-600 rounded text-xs font-mono"
                                  min="1"
                                  max="170"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-2 bg-purple-900/30 rounded border border-purple-600">
                    <div className="text-purple-300 text-xs font-mono text-center">
                      🔌 TOTAL: {outputs.filter(o => o.enabled).reduce((sum, o) => sum + o.universes, 0)} UNIVERSOS ATIVOS
                    </div>
                  </div>
                </div>
              )}

              {/* Menu Teste RGB */}
              {currentMenu === 'test' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-bold font-mono">TESTE RGB SAÍDAS</h3>
                    <button 
                      onClick={() => setCurrentMenu('main')}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Home className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-xs text-gray-300 font-mono">SELECIONAR SAÍDA:</div>
                    <div className="grid grid-cols-4 gap-1 max-h-24 overflow-y-auto">
                      <button
                        onClick={() => {
                          setTestAllOutputs(true);
                          setSelectedTestOutput(0);
                        }}
                        className={`p-2 rounded text-xs font-mono border transition-all
                          ${testAllOutputs
                            ? 'bg-yellow-600 text-white border-yellow-400' 
                            : 'bg-gray-700 text-gray-300 border-gray-600 hover:border-gray-400'
                          }`}
                      >
                        TODAS
                      </button>
                      {outputs.map((output) => (
                        <button
                          key={output.id}
                          onClick={() => {
                            setTestAllOutputs(false);
                            setSelectedTestOutput(output.id);
                          }}
                          className={`p-2 rounded text-xs font-mono border transition-all
                            ${!testAllOutputs && selectedTestOutput === output.id
                              ? 'bg-primary text-white border-primary' 
                              : 'bg-gray-700 text-gray-300 border-gray-600 hover:border-gray-400'
                            }`}
                        >
                          {output.id.toString().padStart(2, '0')}
                        </button>
                      ))}
                    </div>
                    
                    <div className="text-xs text-gray-300 font-mono">MODO DE TESTE:</div>
                    <div className="grid grid-cols-2 gap-1">
                      {[
                        { mode: 'off', label: 'DESLIGAR', color: 'bg-gray-600' },
                        { mode: 'rgb', label: 'RGB FIXO', color: 'bg-red-600' },
                        { mode: 'rainbow', label: 'RAINBOW', color: 'bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500' },
                        { mode: 'chase', label: 'CHASE', color: 'bg-blue-600' }
                      ].map((test) => (
                        <button
                          key={test.mode}
                          onClick={() => setTestMode(test.mode as any)}
                          className={`p-2 rounded text-xs font-mono border transition-all text-white
                            ${testMode === test.mode
                              ? 'border-white shadow-md' 
                              : 'border-gray-600 hover:border-gray-400'
                            } ${test.color}`}
                        >
                          {test.label}
                        </button>
                      ))}
                    </div>
                    
                    {testMode === 'rgb' && (
                      <div className="space-y-2">
                        <div className="text-xs text-gray-300 font-mono">CONTROLE RGB MANUAL:</div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="space-y-1">
                            <div className="text-xs text-red-400 font-mono">R: {manualRGB.r}</div>
                            <input
                              type="range"
                              min="0"
                              max="255"
                              value={manualRGB.r}
                              onChange={(e) => setManualRGB(prev => ({ ...prev, r: parseInt(e.target.value) }))}
                              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                              style={{
                                background: `linear-gradient(to right, #000 0%, #ff0000 100%)`
                              }}
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-green-400 font-mono">G: {manualRGB.g}</div>
                            <input
                              type="range"
                              min="0"
                              max="255"
                              value={manualRGB.g}
                              onChange={(e) => setManualRGB(prev => ({ ...prev, g: parseInt(e.target.value) }))}
                              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                              style={{
                                background: `linear-gradient(to right, #000 0%, #00ff00 100%)`
                              }}
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-blue-400 font-mono">B: {manualRGB.b}</div>
                            <input
                              type="range"
                              min="0"
                              max="255"
                              value={manualRGB.b}
                              onChange={(e) => setManualRGB(prev => ({ ...prev, b: parseInt(e.target.value) }))}
                              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                              style={{
                                background: `linear-gradient(to right, #000 0%, #0000ff 100%)`
                              }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-center p-2 rounded border" style={{
                          backgroundColor: `rgb(${manualRGB.r}, ${manualRGB.g}, ${manualRGB.b})`
                        }}>
                          <span className="text-white text-xs font-mono font-bold drop-shadow-lg">
                            RGB({manualRGB.r}, {manualRGB.g}, {manualRGB.b})
                          </span>
                        </div>
                      </div>
                    )}
                    
                     {testMode !== 'off' && (
                       <div className="p-2 bg-blue-900/30 rounded border border-blue-600">
                         <div className="text-blue-300 text-xs font-mono text-center">
                           🧪 TESTANDO {testAllOutputs ? 'TODAS AS SAÍDAS' : `SAÍDA ${selectedTestOutput.toString().padStart(2, '0')}`} • MODO: {testMode.toUpperCase()}
                           {testMode === 'rgb' && ` • RGB(${manualRGB.r},${manualRGB.g},${manualRGB.b})`}
                         </div>
                       </div>
                     )}
                  </div>
                  
                  <div className="p-2 bg-yellow-900/30 rounded border border-yellow-600">
                    <div className="text-yellow-300 text-xs font-mono text-center">
                      ⚠️ TESTE INDIVIDUAL POR SAÍDA FÍSICA • RGB/RAINBOW/CHASE
                    </div>
                  </div>
                </div>
              )}

              {/* Menu Efeitos */}
              {currentMenu === 'effects' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-bold font-mono">EFEITOS PRONTOS</h3>
                    <button 
                      onClick={() => setCurrentMenu('main')}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Home className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-xs text-gray-300 font-mono">SELECIONAR EFEITO:</div>
                    <div className="grid grid-cols-1 gap-1 max-h-28 overflow-y-auto">
                      {[
                        { id: 'rainbow', name: 'RAINBOW CYCLE', icon: '🌈', color: 'bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500' },
                        { id: 'chase', name: 'COLOR CHASE', icon: '🏃', color: 'bg-blue-600' },
                        { id: 'custom_chase', name: 'CHASE DUAL COLOR', icon: '🎯', color: 'bg-gradient-to-r from-orange-500 to-pink-500' },
                        { id: 'fade', name: 'FADE IN/OUT', icon: '🌙', color: 'bg-purple-600' },
                        { id: 'strobe', name: 'STROBE FLASH', icon: '⚡', color: 'bg-yellow-600' },
                        { id: 'wipe', name: 'COLOR WIPE', icon: '🎨', color: 'bg-green-600' },
                        { id: 'theater', name: 'THEATER CHASE', icon: '🎭', color: 'bg-pink-600' },
                        { id: 'fire', name: 'FIRE EFFECT', icon: '🔥', color: 'bg-red-600' },
                        { id: 'water', name: 'WATER WAVE', icon: '🌊', color: 'bg-cyan-600' },
                        { id: 'matrix', name: 'MATRIX RAIN', icon: '💚', color: 'bg-emerald-600' },
                        { id: 'sparkle', name: 'SPARKLE STARS', icon: '✨', color: 'bg-indigo-600' }
                      ].map((effect) => (
                        <button
                          key={effect.id}
                          onClick={() => setSelectedEffect(effect.id)}
                          className={`p-2 rounded text-xs font-mono border transition-all text-white flex items-center gap-2
                            ${selectedEffect === effect.id
                              ? 'border-white shadow-md' 
                              : 'border-gray-600 hover:border-gray-400'
                            } ${effect.color}`}
                        >
                          <span>{effect.icon}</span>
                          <span>{effect.name}</span>
                        </button>
                      ))}
                    </div>
                    
                    <div className="space-y-2 border-t border-gray-600 pt-2">
                      <div className="text-xs text-gray-300 font-mono">CONFIGURAÇÕES:</div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <div className="text-xs text-blue-400 font-mono">VELOCIDADE: {effectSpeed}%</div>
                          <input
                            type="range"
                            min="1"
                            max="100"
                            value={effectSpeed}
                            onChange={(e) => setEffectSpeed(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <div className="text-xs text-purple-400 font-mono">DIREÇÃO:</div>
                          <div className="grid grid-cols-2 gap-1">
                            {['forward', 'backward'].map((direction) => (
                              <button
                                key={direction}
                                onClick={() => setEffectDirection(direction as any)}
                                className={`p-1 rounded text-xs font-mono border transition-all
                                  ${effectDirection === direction
                                    ? 'bg-purple-600 text-white border-purple-400' 
                                    : 'bg-gray-700 text-gray-300 border-gray-600 hover:border-gray-400'
                                  }`}
                              >
                                {direction === 'forward' ? '→' : '←'}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {['wipe', 'chase', 'theater', 'strobe'].includes(selectedEffect) && (
                        <div className="space-y-1">
                          <div className="text-xs text-green-400 font-mono">COR BASE:</div>
                          <div className="grid grid-cols-3 gap-1">
                            <div className="space-y-1">
                              <div className="text-xs text-red-400 font-mono">R: {effectColor.r}</div>
                              <input
                                type="range"
                                min="0"
                                max="255"
                                value={effectColor.r}
                                onChange={(e) => setEffectColor(prev => ({ ...prev, r: parseInt(e.target.value) }))}
                                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                              />
                            </div>
                            <div className="space-y-1">
                              <div className="text-xs text-green-400 font-mono">G: {effectColor.g}</div>
                              <input
                                type="range"
                                min="0"
                                max="255"
                                value={effectColor.g}
                                onChange={(e) => setEffectColor(prev => ({ ...prev, g: parseInt(e.target.value) }))}
                                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                              />
                            </div>
                            <div className="space-y-1">
                              <div className="text-xs text-blue-400 font-mono">B: {effectColor.b}</div>
                              <input
                                type="range"
                                min="0"
                                max="255"
                                value={effectColor.b}
                                onChange={(e) => setEffectColor(prev => ({ ...prev, b: parseInt(e.target.value) }))}
                                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>
                       )}
                       
                       {selectedEffect === 'custom_chase' && (
                         <div className="space-y-2">
                           <div className="text-xs text-orange-400 font-mono">CHASE DUAL COLOR - CONFIGURAÇÕES:</div>
                           
                           <div className="grid grid-cols-2 gap-2">
                             <div className="space-y-1">
                               <div className="text-xs text-cyan-400 font-mono">COR 1 (BLOCO A):</div>
                               <div className="grid grid-cols-3 gap-1">
                                 <div>
                                   <div className="text-xs text-red-400">R: {customChase.color1.r}</div>
                                   <input
                                     type="range"
                                     min="0"
                                     max="255"
                                     value={customChase.color1.r}
                                     onChange={(e) => setCustomChase(prev => ({ ...prev, color1: { ...prev.color1, r: parseInt(e.target.value) } }))}
                                     className="w-full h-1 bg-gray-700 rounded appearance-none cursor-pointer"
                                   />
                                 </div>
                                 <div>
                                   <div className="text-xs text-green-400">G: {customChase.color1.g}</div>
                                   <input
                                     type="range"
                                     min="0"
                                     max="255"
                                     value={customChase.color1.g}
                                     onChange={(e) => setCustomChase(prev => ({ ...prev, color1: { ...prev.color1, g: parseInt(e.target.value) } }))}
                                     className="w-full h-1 bg-gray-700 rounded appearance-none cursor-pointer"
                                   />
                                 </div>
                                 <div>
                                   <div className="text-xs text-blue-400">B: {customChase.color1.b}</div>
                                   <input
                                     type="range"
                                     min="0"
                                     max="255"
                                     value={customChase.color1.b}
                                     onChange={(e) => setCustomChase(prev => ({ ...prev, color1: { ...prev.color1, b: parseInt(e.target.value) } }))}
                                     className="w-full h-1 bg-gray-700 rounded appearance-none cursor-pointer"
                                   />
                                 </div>
                               </div>
                             </div>
                             
                             <div className="space-y-1">
                               <div className="text-xs text-cyan-400 font-mono">COR 2 (BLOCO B):</div>
                               <div className="grid grid-cols-3 gap-1">
                                 <div>
                                   <div className="text-xs text-red-400">R: {customChase.color2.r}</div>
                                   <input
                                     type="range"
                                     min="0"
                                     max="255"
                                     value={customChase.color2.r}
                                     onChange={(e) => setCustomChase(prev => ({ ...prev, color2: { ...prev.color2, r: parseInt(e.target.value) } }))}
                                     className="w-full h-1 bg-gray-700 rounded appearance-none cursor-pointer"
                                   />
                                 </div>
                                 <div>
                                   <div className="text-xs text-green-400">G: {customChase.color2.g}</div>
                                   <input
                                     type="range"
                                     min="0"
                                     max="255"
                                     value={customChase.color2.g}
                                     onChange={(e) => setCustomChase(prev => ({ ...prev, color2: { ...prev.color2, g: parseInt(e.target.value) } }))}
                                     className="w-full h-1 bg-gray-700 rounded appearance-none cursor-pointer"
                                   />
                                 </div>
                                 <div>
                                   <div className="text-xs text-blue-400">B: {customChase.color2.b}</div>
                                   <input
                                     type="range"
                                     min="0"
                                     max="255"
                                     value={customChase.color2.b}
                                     onChange={(e) => setCustomChase(prev => ({ ...prev, color2: { ...prev.color2, b: parseInt(e.target.value) } }))}
                                     className="w-full h-1 bg-gray-700 rounded appearance-none cursor-pointer"
                                   />
                                 </div>
                               </div>
                             </div>
                           </div>
                           
                           <div className="grid grid-cols-2 gap-2">
                             <div className="space-y-1">
                               <div className="text-xs text-yellow-400 font-mono">PIXELS ENTRE BLOCOS: {customChase.pixelSpacing}</div>
                               <input
                                 type="range"
                                 min="1"
                                 max="50"
                                 value={customChase.pixelSpacing}
                                 onChange={(e) => setCustomChase(prev => ({ ...prev, pixelSpacing: parseInt(e.target.value) }))}
                                 className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                               />
                             </div>
                             
                             <div className="space-y-1">
                               <div className="text-xs text-yellow-400 font-mono">TAMANHO BLOCO: {customChase.blockSize}</div>
                               <input
                                 type="range"
                                 min="1"
                                 max="20"
                                 value={customChase.blockSize}
                                 onChange={(e) => setCustomChase(prev => ({ ...prev, blockSize: parseInt(e.target.value) }))}
                                 className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                               />
                             </div>
                           </div>
                           
                           <div className="grid grid-cols-2 gap-1">
                             <div className="flex items-center justify-center p-1 rounded border text-xs font-mono" style={{
                               backgroundColor: `rgb(${customChase.color1.r}, ${customChase.color1.g}, ${customChase.color1.b})`
                             }}>
                               <span className="text-white drop-shadow-lg">COR A</span>
                             </div>
                             <div className="flex items-center justify-center p-1 rounded border text-xs font-mono" style={{
                               backgroundColor: `rgb(${customChase.color2.r}, ${customChase.color2.g}, ${customChase.color2.b})`
                             }}>
                               <span className="text-white drop-shadow-lg">COR B</span>
                             </div>
                           </div>
                         </div>
                       )}
                       
                       <button
                         onClick={() => {
                           toast({
                             title: "Efeito Ativado",
                             description: selectedEffect === 'custom_chase' 
                               ? `CHASE DUAL COLOR • ${customChase.pixelSpacing}px entre blocos • Tamanho: ${customChase.blockSize}px`
                               : `${selectedEffect.toUpperCase()} executando a ${effectSpeed}% velocidade`,
                           });
                         }}
                         className="w-full p-2 bg-green-600 hover:bg-green-700 text-white rounded font-mono text-sm transition-all"
                       >
                         ▶️ EXECUTAR EFEITO
                       </button>
                    </div>
                  </div>
                  
                  <div className="p-2 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded border border-purple-600">
                    <div className="text-purple-300 text-xs font-mono text-center">
                      ✨ {selectedEffect === 'custom_chase' 
                        ? `CHASE DUAL COLOR • ${customChase.blockSize}px blocos • ${customChase.pixelSpacing}px espaço`
                        : `${selectedEffect.toUpperCase()} • VEL: ${effectSpeed}% • DIR: ${effectDirection === 'forward' ? '→' : '←'}`
                      }
                    </div>
                  </div>
                </div>
              )}

              {/* Menu Sistema */}
              {currentMenu === 'system_info' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-bold font-mono">INFORMAÇÕES DO SISTEMA</h3>
                    <button 
                      onClick={() => setCurrentMenu('main')}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Home className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-gray-800/50 rounded border border-gray-600">
                        <div className="text-xs text-gray-300 font-mono">MODELO:</div>
                        <div className="text-white text-sm font-bold font-mono">LED CTRL PRO 32</div>
                      </div>
                      <div className="p-2 bg-gray-800/50 rounded border border-gray-600">
                        <div className="text-xs text-gray-300 font-mono">FIRMWARE:</div>
                        <div className="text-white text-sm font-bold font-mono">v2.1.3</div>
                      </div>
                      <div className="p-2 bg-gray-800/50 rounded border border-gray-600">
                        <div className="text-xs text-gray-300 font-mono">UPTIME:</div>
                        <div className="text-white text-sm font-bold font-mono">72h 15m</div>
                      </div>
                      <div className="p-2 bg-gray-800/50 rounded border border-gray-600">
                        <div className="text-xs text-gray-300 font-mono">TEMP:</div>
                        <div className="text-green-400 text-sm font-bold font-mono">45°C</div>
                      </div>
                    </div>
                    
                    <div className="p-2 bg-blue-900/30 rounded border border-blue-600">
                      <div className="text-blue-300 text-xs font-mono text-center">
                        💾 MEMÓRIA: 156KB / 512KB • 📡 ETHERNET: 1000Mbps FULL DUPLEX
                      </div>
                    </div>
                    
                    <div className="space-y-2 border-t border-gray-600 pt-2">
                      <div className="text-xs text-yellow-400 font-mono text-center">CONFIGURAÇÕES DO SISTEMA:</div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={handleSystemReset}
                          className="p-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded font-mono text-sm transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                          <Reset className="w-4 h-4" />
                          RESET SISTEMA
                        </button>
                        
                        <button
                          onClick={handleFactoryDefault}
                          className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded font-mono text-sm transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                          <Factory className="w-4 h-4" />
                          PADRÃO FÁBRICA
                        </button>
                      </div>
                      
                      <div className="text-xs text-red-400 font-mono text-center bg-red-900/20 p-2 rounded border border-red-600">
                        ⚠️ ATENÇÃO: PADRÃO FÁBRICA APAGA TODAS AS CONFIGURAÇÕES PERSONALIZADAS
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2 bg-gradient-to-r from-gray-900/30 to-blue-900/30 rounded border border-gray-600">
                    <div className="text-gray-300 text-xs font-mono text-center">
                      🔧 SISTEMA ESTÁVEL • CPU: 23% • RAM: 30% • TEMP: NORMAL
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Indicadores de Touch */}
            <div className="absolute bottom-2 right-2 flex gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            </div>
          </div>

          {/* Botões Físicos Premium com LED */}
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => handleButtonPress('back')}
              className="p-3 bg-gradient-to-b from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg border border-red-500 font-mono text-sm transition-all transform hover:scale-105 shadow-lg"
            >
              <Home className="w-4 h-4 mx-auto mb-1" />
              HOME
            </button>
            
            <button
              onClick={() => handleButtonPress('up')}
              className="p-3 bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg border border-blue-500 font-mono text-sm transition-all transform hover:scale-105 shadow-lg"
            >
              <ArrowLeft className="w-4 h-4 mx-auto mb-1" />
              UP
            </button>
            
            <button
              onClick={() => handleButtonPress('down')}
              className="p-3 bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg border border-blue-500 font-mono text-sm transition-all transform hover:scale-105 shadow-lg"
            >
              <ArrowRight className="w-4 h-4 mx-auto mb-1" />
              DOWN
            </button>
            
            <button
              onClick={() => handleButtonPress('enter')}
              className="p-3 bg-gradient-to-b from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-lg border border-green-500 font-mono text-sm transition-all transform hover:scale-105 shadow-lg"
            >
              <Check className="w-4 h-4 mx-auto mb-1" />
              ENTER
            </button>
          </div>

          {/* Status Bar */}
          <div className="bg-background rounded p-2 border border-border">
            <div className="flex justify-between items-center text-xs font-mono">
              <div className="flex items-center gap-2">
                <Activity className="w-3 h-3 text-led-green" />
                <span>CPU: 23%</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-led-orange" />
                <span>12.3V</span>
              </div>
              <div className="flex items-center gap-2">
                <Network className="w-3 h-3 text-led-blue" />
                <span>1000 Mbps</span>
              </div>
              <div className="text-muted-foreground">
                IP: {getCurrentIP()}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}