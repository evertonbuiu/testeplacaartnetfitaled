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
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
  voltage: '5V' | '12V';
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
  const [currentMenu, setCurrentMenu] = useState<MenuState>('main');
  const [selectedOption, setSelectedOption] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [tempConfig, setTempConfig] = useState(networkConfig);
  const [tempICConfig, setTempICConfig] = useState(icConfig);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [testMode, setTestMode] = useState<'off' | 'rgb' | 'rainbow' | 'chase'>('off');
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
                <div className="space-y-3">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-white font-mono mb-1">MENU PRINCIPAL</h3>
                    <div className="text-xs text-blue-300 font-mono">Toque para navegar</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {mainMenuOptions.map((option, index) => (
                      <button
                        key={option.label}
                        onClick={option.action}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 font-mono text-sm
                          ${selectedOption === index 
                            ? 'border-white bg-white/20 text-white' 
                            : 'border-gray-500 bg-gray-800/50 text-gray-300 hover:border-gray-300'
                          }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <option.icon className={`w-5 h-5 ${option.color || 'text-white'}`} />
                          <span className="text-xs">{option.label}</span>
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