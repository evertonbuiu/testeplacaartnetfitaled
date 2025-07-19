import { useState } from 'react';
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
  Network
} from 'lucide-react';
import { cn } from '@/lib/utils';

type MenuState = 'main' | 'artnet' | 'network' | 'test' | 'effects' | 'settings';

interface NetworkConfig {
  ip: string;
  subnet: string;
  gateway: string;
  dhcp: boolean;
}

interface ControlDisplayProps {
  artnetStatus: 'connected' | 'disconnected';
  universe: number;
  subnet: number;
  networkConfig: NetworkConfig;
  onNetworkConfigChange: (config: NetworkConfig) => void;
}

export function ControlDisplay({ artnetStatus, universe, subnet, networkConfig, onNetworkConfigChange }: ControlDisplayProps) {
  const [currentMenu, setCurrentMenu] = useState<MenuState>('main');
  const [selectedOption, setSelectedOption] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [tempConfig, setTempConfig] = useState(networkConfig);

  const mainMenuOptions = [
    { icon: Wifi, label: 'ART-NET', action: () => setCurrentMenu('artnet') },
    { icon: Network, label: 'REDE IP', action: () => setCurrentMenu('network') },
    { icon: TestTube, label: 'TESTE', action: () => setCurrentMenu('test') },
    { icon: Sparkles, label: 'EFEITOS', action: () => setCurrentMenu('effects') },
    { icon: Settings, label: 'CONFIG', action: () => setCurrentMenu('settings') },
  ];

  const artnetOptions = [
    { label: 'UNIVERSO', value: universe.toString().padStart(3, '0') },
    { label: 'SUBNET', value: subnet.toString().padStart(3, '0') },
    { label: 'NET', value: '000' },
    { label: 'STATUS', value: artnetStatus === 'connected' ? 'CONECTADO' : 'DESCONECTADO' },
  ];

  const networkOptions = [
    { label: 'MODO', value: networkConfig.dhcp ? 'DHCP' : 'MANUAL', editable: true },
    { label: 'IP ADDRESS', value: networkConfig.ip, editable: true },
    { label: 'SUBNET MASK', value: networkConfig.subnet, editable: true },
    { label: 'GATEWAY', value: networkConfig.gateway, editable: true },
    { label: 'SALVAR CONFIG', action: () => saveNetworkConfig() },
  ];

  const testOptions = [
    { label: 'TESTE TOTAL', action: () => console.log('Teste total') },
    { label: 'TESTE CANAL', action: () => console.log('Teste canal') },
    { label: 'TESTE RGB', action: () => console.log('Teste RGB') },
    { label: 'RESET SAIDAS', action: () => console.log('Reset saídas') },
  ];

  const effectOptions = [
    { label: 'RAINBOW', action: () => console.log('Rainbow effect') },
    { label: 'FADE', action: () => console.log('Fade effect') },
    { label: 'STROBE', action: () => console.log('Strobe effect') },
    { label: 'CHASE', action: () => console.log('Chase effect') },
  ];

  const saveNetworkConfig = () => {
    onNetworkConfigChange(tempConfig);
    setIsEditing(false);
    toast({
      title: "Configuração Salva",
      description: `IP ${tempConfig.ip} configurado em modo ${tempConfig.dhcp ? 'DHCP' : 'MANUAL'}`,
    });
    console.log('Configuração de rede salva:', tempConfig);
  };

  const handleNetworkEdit = (field: string, value: string) => {
    setTempConfig(prev => ({
      ...prev,
      [field]: field === 'dhcp' ? value === 'DHCP' : value
    }));
  };

  const getCurrentOptions = () => {
    switch (currentMenu) {
      case 'artnet': return artnetOptions;
      case 'network': return networkOptions;
      case 'test': return testOptions;
      case 'effects': return effectOptions;
      default: return mainMenuOptions;
    }
  };

  const handleButtonPress = (buttonType: 'up' | 'down' | 'enter' | 'back') => {
    const options = getCurrentOptions();
    
    switch (buttonType) {
      case 'up':
        setSelectedOption(Math.max(0, selectedOption - 1));
        break;
      case 'down':
        setSelectedOption(Math.min(options.length - 1, selectedOption + 1));
        break;
      case 'enter':
        if (currentMenu === 'main') {
          (options[selectedOption] as any).action();
        } else if ('action' in options[selectedOption]) {
          (options[selectedOption] as any).action();
        }
        break;
      case 'back':
        if (currentMenu !== 'main') {
          setCurrentMenu('main');
          setSelectedOption(0);
        }
        break;
    }
  };

  return (
    <Card className="p-4 bg-card border-2 border-primary">
      <div className="space-y-4">
        {/* Display LCD Simulado */}
        <div className="bg-background border-2 border-border rounded p-3 font-mono text-sm min-h-[120px]">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-border pb-1 mb-2">
            <span className="text-primary font-bold">LED CONTROLLER WS2811</span>
            <Badge 
              variant={artnetStatus === 'connected' ? "default" : "destructive"}
              className="text-xs"
            >
              {artnetStatus === 'connected' ? 'ART-NET OK' : 'ART-NET ERR'}
            </Badge>
          </div>

          {/* Menu Content */}
          <div className="space-y-1">
            {currentMenu === 'main' && (
              <>
                <div className="text-xs text-muted-foreground mb-2">MENU PRINCIPAL:</div>
                {mainMenuOptions.map((option, index) => (
                  <div 
                    key={option.label}
                    className={cn(
                      "flex items-center gap-2 p-1 rounded",
                      selectedOption === index && "bg-primary text-primary-foreground"
                    )}
                  >
                    <option.icon className="w-3 h-3" />
                    <span>{option.label}</span>
                  </div>
                ))}
              </>
            )}

            {currentMenu === 'artnet' && (
              <>
                <div className="text-xs text-muted-foreground mb-2">CONFIGURAÇÃO ART-NET:</div>
                {artnetOptions.map((option, index) => (
                  <div 
                    key={option.label}
                    className={cn(
                      "flex justify-between p-1 rounded",
                      selectedOption === index && "bg-primary text-primary-foreground"
                    )}
                  >
                    <span>{option.label}:</span>
                    <span>{option.value}</span>
                  </div>
                ))}
              </>
            )}

            {currentMenu === 'network' && (
              <>
                <div className="text-xs text-muted-foreground mb-2">CONFIGURAÇÃO DE REDE:</div>
                {networkOptions.map((option, index) => (
                  <div 
                    key={option.label}
                    className={cn(
                      "flex justify-between p-1 rounded",
                      selectedOption === index && "bg-primary text-primary-foreground"
                    )}
                  >
                    <span>{option.label}:</span>
                    {option.editable ? (
                      <span className="font-bold">
                        {option.label === 'MODO' ? (tempConfig.dhcp ? 'DHCP' : 'MANUAL') : 
                         option.label === 'IP ADDRESS' ? tempConfig.ip :
                         option.label === 'SUBNET MASK' ? tempConfig.subnet :
                         option.label === 'GATEWAY' ? tempConfig.gateway : ''}
                      </span>
                    ) : (
                      <span className="font-bold text-accent">{option.label}</span>
                    )}
                  </div>
                ))}
                
                {/* Indicador de mudanças não salvas */}
                {JSON.stringify(tempConfig) !== JSON.stringify(networkConfig) && (
                  <div className="text-xs text-destructive mt-2 text-center">
                    * CONFIGURAÇÕES NÃO SALVAS *
                  </div>
                )}
              </>
            )}

            {(currentMenu === 'test' || currentMenu === 'effects') && (
              <>
                <div className="text-xs text-muted-foreground mb-2">
                  {currentMenu === 'test' ? 'MODO TESTE:' : 'EFEITOS:'}
                </div>
                {getCurrentOptions().map((option, index) => (
                  <div 
                    key={option.label}
                    className={cn(
                      "p-1 rounded",
                      selectedOption === index && "bg-primary text-primary-foreground"
                    )}
                  >
                    {option.label}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Configuração de IP Detalhada (quando em modo de rede) */}
        {currentMenu === 'network' && (
          <Card className="p-3 bg-background border border-border">
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-accent font-mono">
                CONFIGURAÇÃO IP DETALHADA
              </h4>
              
              <div className="space-y-2">
                {/* Modo DHCP/Manual */}
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono">MODO:</span>
                  <Button
                    size="sm"
                    variant={tempConfig.dhcp ? "default" : "outline"}
                    onClick={() => setTempConfig(prev => ({ ...prev, dhcp: !prev.dhcp }))}
                    className="text-xs font-mono"
                  >
                    {tempConfig.dhcp ? 'DHCP' : 'MANUAL'}
                  </Button>
                </div>

                {/* Campos IP (apenas se manual) */}
                {!tempConfig.dhcp && (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-muted-foreground">IP ADDRESS:</label>
                      <Input
                        value={tempConfig.ip}
                        onChange={(e) => setTempConfig(prev => ({ ...prev, ip: e.target.value }))}
                        className="text-xs font-mono h-8"
                        placeholder="192.168.1.100"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-muted-foreground">SUBNET MASK:</label>
                      <Input
                        value={tempConfig.subnet}
                        onChange={(e) => setTempConfig(prev => ({ ...prev, subnet: e.target.value }))}
                        className="text-xs font-mono h-8"
                        placeholder="255.255.255.0"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-muted-foreground">GATEWAY:</label>
                      <Input
                        value={tempConfig.gateway}
                        onChange={(e) => setTempConfig(prev => ({ ...prev, gateway: e.target.value }))}
                        className="text-xs font-mono h-8"
                        placeholder="192.168.1.1"
                      />
                    </div>
                  </>
                )}

                {/* Botão Salvar */}
                <Button
                  variant="default"
                  size="sm"
                  onClick={saveNetworkConfig}
                  className="w-full text-xs font-mono"
                  disabled={JSON.stringify(tempConfig) === JSON.stringify(networkConfig)}
                >
                  <Check className="w-3 h-3 mr-1" />
                  SALVAR CONFIGURAÇÃO
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Botões de Controle */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleButtonPress('up')}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            UP
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleButtonPress('down')}
            className="flex items-center gap-1"
          >
            DOWN
            <ArrowRight className="w-3 h-3" />
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => handleButtonPress('enter')}
            className="flex items-center gap-1"
          >
            <Check className="w-3 h-3" />
            ENTER
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleButtonPress('back')}
            className="flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            BACK
          </Button>
        </div>
      </div>
    </Card>
  );
}