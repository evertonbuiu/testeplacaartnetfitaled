import { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, Text, Box } from '@react-three/drei';
import { Canvas as FabricCanvas, Circle, Rect, Line, Point } from 'fabric';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Layers, 
  MousePointer, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Download,
  Eye,
  EyeOff,
  Settings,
  Cpu,
  Zap,
  Network,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface LayerConfig {
  name: string;
  color: string;
  visible: boolean;
  opacity: number;
}

interface Component3D {
  id: string;
  name: string;
  position: [number, number, number];
  type: 'IC' | 'capacitor' | 'resistor' | 'connector' | 'led';
  value?: string;
  footprint?: string;
  highlighted: boolean;
}

interface ViewerProps {
  title: string;
  schematicImage?: string;
  pcbImageTop?: string;
  pcbImageBottom?: string;
  components?: Component3D[];
}

// Componente 3D para representar componentes eletrônicos
function Component3DModel({ component, onClick }: { component: Component3D; onClick: () => void }) {
  const getColor = () => {
    switch (component.type) {
      case 'IC': return component.highlighted ? '#ff4444' : '#333333';
      case 'capacitor': return component.highlighted ? '#ff8844' : '#4444ff';
      case 'resistor': return component.highlighted ? '#88ff44' : '#44ff44';
      case 'connector': return component.highlighted ? '#ff44ff' : '#888888';
      case 'led': return component.highlighted ? '#ffff44' : '#ff4444';
      default: return '#cccccc';
    }
  };

  const getSize = (): [number, number, number] => {
    switch (component.type) {
      case 'IC': return [2, 0.2, 2];
      case 'capacitor': return [0.5, 1, 0.5];
      case 'resistor': return [1, 0.2, 0.3];
      case 'connector': return [1.5, 0.5, 1];
      case 'led': return [0.3, 0.3, 0.3];
      default: return [1, 0.5, 1];
    }
  };

  return (
    <group position={component.position} onClick={onClick}>
      <Box args={getSize()} castShadow receiveShadow>
        <meshStandardMaterial color={getColor()} />
      </Box>
      <Text
        position={[0, getSize()[1] + 0.3, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {component.name}
      </Text>
    </group>
  );
}

// Scene 3D da PCB
function PCB3DScene({ components, onComponentClick }: { components: Component3D[]; onComponentClick: (id: string) => void }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      
      {/* Base da PCB */}
      <Box position={[0, -0.1, 0]} args={[20, 0.2, 15]} receiveShadow>
        <meshStandardMaterial color="#0066cc" />
      </Box>
      
      {/* Grid de referência */}
      <Grid 
        infiniteGrid={true}
        cellSize={1} 
        cellThickness={0.5} 
        sectionSize={5} 
        sectionThickness={1} 
        sectionColor="#cccccc" 
        cellColor="#eeeeee" 
        fadeDistance={30} 
        fadeStrength={1} 
      />
      
      {/* Componentes 3D */}
      {components.map((component) => (
        <Component3DModel
          key={component.id}
          component={component}
          onClick={() => onComponentClick(component.id)}
        />
      ))}
      
      <Environment preset="warehouse" />
    </>
  );
}

export function InteractiveKiCadViewer({ 
  title, 
  schematicImage, 
  pcbImageTop, 
  pcbImageBottom,
  components = []
}: ViewerProps) {
  const [currentView, setCurrentView] = useState<'schematic' | 'pcb-2d' | 'pcb-3d'>('schematic');
  const [currentSide, setCurrentSide] = useState<'top' | 'bottom'>('top');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [layers, setLayers] = useState<LayerConfig[]>([
    { name: 'Copper Top', color: '#ff4444', visible: true, opacity: 100 },
    { name: 'Copper Bottom', color: '#4444ff', visible: true, opacity: 100 },
    { name: 'Silkscreen', color: '#ffffff', visible: true, opacity: 80 },
    { name: 'Solder Mask', color: '#008800', visible: true, opacity: 70 },
    { name: 'Vias', color: '#888888', visible: true, opacity: 100 }
  ]);
  const [zoom, setZoom] = useState([100]);
  const [rotation, setRotation] = useState([0]);
  const [showGrid, setShowGrid] = useState(true);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  
  const [componentsList, setComponentsList] = useState<Component3D[]>([
    {
      id: 'U1',
      name: 'ESP32',
      position: [0, 0.5, 0],
      type: 'IC',
      value: 'ESP32-DevKitC',
      footprint: 'Module:ESP32-DevKitC',
      highlighted: false
    },
    {
      id: 'U2',
      name: '74HCT245',
      position: [-3, 0.5, 2],
      type: 'IC',
      value: '74HCT245',
      footprint: 'Package_SO:SOIC-20',
      highlighted: false
    },
    {
      id: 'U3',
      name: 'ULN2803',
      position: [3, 0.5, 2],
      type: 'IC',
      value: 'ULN2803A',
      footprint: 'Package_DIP:DIP-18',
      highlighted: false
    },
    {
      id: 'J1',
      name: 'LED_OUT_1',
      position: [-6, 0.5, -3],
      type: 'connector',
      value: 'KF301-4P',
      footprint: 'TerminalBlock_KF301',
      highlighted: false
    },
    {
      id: 'C1',
      name: '100nF',
      position: [-1.5, 0.7, 1],
      type: 'capacitor',
      value: '100nF',
      footprint: '0805',
      highlighted: false
    },
    {
      id: 'R1',
      name: '10k',
      position: [1.5, 0.3, 1],
      type: 'resistor',
      value: '10k',
      footprint: '0805',
      highlighted: false
    },
    {
      id: 'D1',
      name: 'LED_STATUS',
      position: [0, 0.4, -2],
      type: 'led',
      value: 'Red LED',
      footprint: '0805',
      highlighted: false
    }
  ]);

  // Inicializar Fabric.js para vista 2D
  useEffect(() => {
    if (currentView === 'pcb-2d' && canvasRef.current && !fabricCanvasRef.current) {
      const canvas = new FabricCanvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: '#0066cc',
      });
      
      fabricCanvasRef.current = canvas;
      
      // Adicionar elementos visuais da PCB
      setupPCB2D(canvas);
      
      return () => {
        canvas.dispose();
        fabricCanvasRef.current = null;
      };
    }
  }, [currentView]);

  const setupPCB2D = (canvas: FabricCanvas) => {
    // Outline da PCB
    const pcbOutline = new Rect({
      left: 50,
      top: 50,
      width: 700,
      height: 500,
      fill: 'transparent',
      stroke: '#ffffff',
      strokeWidth: 3,
      selectable: false
    });
    canvas.add(pcbOutline);

    // Adicionar pads e vias
    for (let i = 0; i < 20; i++) {
      const via = new Circle({
        left: 100 + (i % 5) * 140,
        top: 100 + Math.floor(i / 5) * 100,
        radius: 8,
        fill: '#888888',
        stroke: '#ffffff',
        strokeWidth: 1,
        selectable: false
      });
      canvas.add(via);
    }

    // Adicionar trilhas (simplified)
    for (let i = 0; i < 10; i++) {
      const track = new Line([100, 150 + i * 40, 700, 150 + i * 40], {
        stroke: '#ffaa00',
        strokeWidth: 2,
        selectable: false
      });
      canvas.add(track);
    }
  };

  const handleLayerToggle = (layerIndex: number) => {
    setLayers(prev => prev.map((layer, index) => 
      index === layerIndex ? { ...layer, visible: !layer.visible } : layer
    ));
    
    if (soundEnabled) {
      // Simular som de click
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMdCSJ2bF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmM=');
      audio.volume = 0.1;
      audio.play().catch(() => {}); // Ignore errors
    }
  };

  const handleLayerOpacity = (layerIndex: number, opacity: number[]) => {
    setLayers(prev => prev.map((layer, index) => 
      index === layerIndex ? { ...layer, opacity: opacity[0] } : layer
    ));
  };

  const handleComponentClick = (componentId: string) => {
    setComponentsList(prev => prev.map(comp => ({
      ...comp,
      highlighted: comp.id === componentId ? !comp.highlighted : false
    })));
    
    setSelectedComponent(componentId);
    
    if (soundEnabled) {
      toast(`Componente selecionado: ${componentId}`);
    }
  };

  const resetView = () => {
    setZoom([100]);
    setRotation([0]);
    setSelectedComponent(null);
    setComponentsList(prev => prev.map(comp => ({ ...comp, highlighted: false })));
    
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.setZoom(1);
      fabricCanvasRef.current.absolutePan(new Point(0, 0));
    }
  };

  const exportView = () => {
    if (currentView === 'pcb-2d' && fabricCanvasRef.current) {
      const dataURL = fabricCanvasRef.current.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 1
      });
      
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `${title}-${currentView}-export.png`;
      link.click();
    }
    
    toast('Vista exportada com sucesso!');
  };

  const selectedComponentData = componentsList.find(c => c.id === selectedComponent);

  return (
    <div className="space-y-6">
      {/* Header com controles principais */}
      <Card className="p-6 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 border-2 border-primary shadow-[var(--shadow-glow)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-primary font-mono mb-2 flex items-center gap-3">
              <Layers className="w-8 h-8 text-accent" />
              {title} - VIEWER INTERATIVO
            </h2>
            <p className="text-muted-foreground font-mono">
              Visualização Avançada • Esquemático • PCB 2D/3D • Componentes Interativos
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetView}
              className="font-mono"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              RESET
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportView}
              className="font-mono"
            >
              <Download className="w-4 h-4 mr-1" />
              EXPORT
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="font-mono"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Tabs de visualização */}
        <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 font-mono">
            <TabsTrigger value="schematic">ESQUEMÁTICO</TabsTrigger>
            <TabsTrigger value="pcb-2d">PCB 2D</TabsTrigger>
            <TabsTrigger value="pcb-3d">PCB 3D</TabsTrigger>
          </TabsList>
        </Tabs>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Painel de controles lateral */}
        <Card className="p-4 bg-card border-2 border-accent">
          <h3 className="text-lg font-bold text-accent font-mono mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            CONTROLES
          </h3>
          
          <div className="space-y-4">
            {/* Controles de Zoom */}
            <div>
              <label className="text-sm font-mono font-medium mb-2 block">Zoom: {zoom[0]}%</label>
              <Slider
                value={zoom}
                onValueChange={setZoom}
                max={500}
                min={10}
                step={10}
                className="mb-2"
              />
              <div className="flex gap-1">
                <Button size="sm" variant="outline" onClick={() => setZoom([Math.max(10, zoom[0] - 25)])}>
                  <ZoomOut className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => setZoom([Math.min(500, zoom[0] + 25)])}>
                  <ZoomIn className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {currentView === 'pcb-3d' && (
              <div>
                <label className="text-sm font-mono font-medium mb-2 block">Rotação: {rotation[0]}°</label>
                <Slider
                  value={rotation}
                  onValueChange={setRotation}
                  max={360}
                  min={0}
                  step={15}
                />
              </div>
            )}

            {/* Controles de Side (para PCB) */}
            {(currentView === 'pcb-2d' || currentView === 'pcb-3d') && (
              <div>
                <label className="text-sm font-mono font-medium mb-2 block">Lado da PCB</label>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant={currentSide === 'top' ? 'default' : 'outline'}
                    onClick={() => setCurrentSide('top')}
                    className="flex-1 font-mono text-xs"
                  >
                    TOP
                  </Button>
                  <Button
                    size="sm"
                    variant={currentSide === 'bottom' ? 'default' : 'outline'}
                    onClick={() => setCurrentSide('bottom')}
                    className="flex-1 font-mono text-xs"
                  >
                    BOTTOM
                  </Button>
                </div>
              </div>
            )}

            {/* Controles de exibição */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono">Grid</span>
                <Switch checked={showGrid} onCheckedChange={setShowGrid} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono">Medidas</span>
                <Switch checked={showMeasurements} onCheckedChange={setShowMeasurements} />
              </div>
            </div>

            {/* Controle de Camadas */}
            {currentView !== 'schematic' && (
              <div>
                <h4 className="text-sm font-mono font-medium mb-2">CAMADAS</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {layers.map((layer, index) => (
                    <div key={index} className="space-y-1 p-2 bg-background rounded border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded" 
                            style={{ backgroundColor: layer.color }} 
                          />
                          <span className="text-xs font-mono">{layer.name}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleLayerToggle(index)}
                          className="p-1"
                        >
                          {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        </Button>
                      </div>
                      {layer.visible && (
                        <Slider
                          value={[layer.opacity]}
                          onValueChange={(value) => handleLayerOpacity(index, value)}
                          max={100}
                          min={0}
                          step={5}
                          className="mt-1"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Área principal de visualização */}
        <div className="lg:col-span-2">
          <Card className="p-4 bg-card border-2 border-primary">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-primary font-mono">
                  {currentView === 'schematic' && 'ESQUEMA ELÉTRICO'}
                  {currentView === 'pcb-2d' && `PCB 2D - ${currentSide.toUpperCase()}`}
                  {currentView === 'pcb-3d' && 'PCB 3D INTERATIVO'}
                </h3>
                <Badge variant="outline" className="font-mono">
                  {currentView.toUpperCase()}
                </Badge>
              </div>

              {/* Visualização do Esquemático */}
              {currentView === 'schematic' && schematicImage && (
                <div className="border-2 border-border rounded-lg overflow-hidden bg-background">
                  <img
                    src={schematicImage}
                    alt="Esquema Elétrico"
                    className="w-full h-auto object-contain"
                    style={{ 
                      maxHeight: '600px',
                      transform: `scale(${zoom[0] / 100})`,
                      transformOrigin: 'center'
                    }}
                  />
                </div>
              )}

              {/* Visualização PCB 2D com Fabric.js */}
              {currentView === 'pcb-2d' && (
                <div className="border-2 border-border rounded-lg overflow-hidden bg-background relative">
                  <canvas 
                    ref={canvasRef} 
                    className="w-full" 
                    style={{ 
                      transform: `scale(${zoom[0] / 100})`,
                      transformOrigin: 'top left'
                    }}
                  />
                  {showGrid && (
                    <div className="absolute inset-0 pointer-events-none opacity-30"
                         style={{
                           backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)',
                           backgroundSize: '20px 20px'
                         }}
                    />
                  )}
                </div>
              )}

              {/* Visualização PCB 3D com React Three Fiber */}
              {currentView === 'pcb-3d' && (
                <div className="border-2 border-border rounded-lg overflow-hidden bg-black" style={{ height: '600px' }}>
                  <Canvas 
                    shadows 
                    camera={{ position: [10, 10, 10], fov: 50 }}
                    style={{ transform: `scale(${zoom[0] / 100})` }}
                  >
                    <Suspense fallback={null}>
                      <PCB3DScene 
                        components={componentsList} 
                        onComponentClick={handleComponentClick}
                      />
                      <OrbitControls 
                        enablePan 
                        enableZoom 
                        enableRotate 
                        autoRotate={false}
                      />
                    </Suspense>
                  </Canvas>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Painel de informações do componente */}
        <Card className="p-4 bg-card border-2 border-secondary">
          <h3 className="text-lg font-bold text-secondary font-mono mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5" />
            COMPONENTE
          </h3>
          
          {selectedComponentData ? (
            <div className="space-y-3">
              <div className="p-3 bg-primary/10 rounded border">
                <div className="text-lg font-bold text-primary font-mono mb-1">
                  {selectedComponentData.name}
                </div>
                <Badge variant="secondary" className="mb-2">
                  {selectedComponentData.type.toUpperCase()}
                </Badge>
                
                <div className="space-y-2 text-sm font-mono">
                  <div>
                    <span className="text-muted-foreground">Valor:</span>
                    <span className="ml-2 font-bold">{selectedComponentData.value || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Footprint:</span>
                    <span className="ml-2 text-xs">{selectedComponentData.footprint || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Posição:</span>
                    <span className="ml-2 text-xs">
                      X:{selectedComponentData.position[0].toFixed(1)} 
                      Y:{selectedComponentData.position[1].toFixed(1)} 
                      Z:{selectedComponentData.position[2].toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleComponentClick(selectedComponentData.id)}
                className="w-full font-mono"
              >
                {selectedComponentData.highlighted ? 'REMOVER DESTAQUE' : 'DESTACAR COMPONENTE'}
              </Button>
            </div>
          ) : (
            <div className="text-center text-muted-foreground font-mono">
              <MousePointer className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Clique em um componente na vista 3D para ver detalhes</p>
            </div>
          )}

          {/* Lista de todos os componentes */}
          <div className="mt-6">
            <h4 className="text-sm font-bold text-accent font-mono mb-2">LISTA DE COMPONENTES</h4>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {componentsList.map((component) => (
                <div
                  key={component.id}
                  className={`p-2 rounded border cursor-pointer transition-colors font-mono text-xs ${
                    component.highlighted 
                      ? 'bg-primary/20 border-primary' 
                      : 'bg-background hover:bg-accent/10'
                  }`}
                  onClick={() => handleComponentClick(component.id)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold">{component.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {component.type}
                    </Badge>
                  </div>
                  <div className="text-muted-foreground mt-1">
                    {component.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Footer com estatísticas */}
      <Card className="p-4 bg-card border border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-mono">
          <div>
            <div className="text-2xl font-bold text-primary">{componentsList.length}</div>
            <div className="text-xs text-muted-foreground">COMPONENTES</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent">{layers.filter(l => l.visible).length}</div>
            <div className="text-xs text-muted-foreground">CAMADAS ATIVAS</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-secondary">{zoom[0]}%</div>
            <div className="text-xs text-muted-foreground">ZOOM ATUAL</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-led-green">{currentView.toUpperCase()}</div>
            <div className="text-xs text-muted-foreground">MODO DE VISTA</div>
          </div>
        </div>
      </Card>
    </div>
  );
}