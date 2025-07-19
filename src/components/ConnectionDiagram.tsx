import React, { useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  MarkerType,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const initialNodes: Node[] = [
  // Placa Principal
  {
    id: 'main-board',
    type: 'default',
    position: { x: 400, y: 50 },
    data: { 
      label: (
        <div className="text-center">
          <div className="font-bold text-primary">PLACA PRINCIPAL</div>
          <div className="text-xs text-muted-foreground">ESP32 + ART-NET</div>
        </div>
      )
    },
    style: {
      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      color: 'white',
      border: '2px solid #1e40af',
      borderRadius: '12px',
      width: 200,
      height: 80
    }
  },
  
  // Hub de Distribuição
  {
    id: 'distribution-hub',
    type: 'default',
    position: { x: 350, y: 200 },
    data: { 
      label: (
        <div className="text-center">
          <div className="font-bold">HUB DISTRIBUIÇÃO</div>
          <div className="text-xs">Cabo Flat 50P</div>
        </div>
      )
    },
    style: {
      background: 'linear-gradient(135deg, #059669, #047857)',
      color: 'white',
      border: '2px solid #065f46',
      borderRadius: '12px',
      width: 180,
      height: 60
    }
  },

  // Placas de Saída
  {
    id: 'output-board-1',
    type: 'default',
    position: { x: 50, y: 350 },
    data: { 
      label: (
        <div className="text-center">
          <div className="font-bold text-accent">PLACA SAÍDA #1</div>
          <div className="text-xs">Saídas 01-08</div>
          <div className="text-xs">+ Amplificadores</div>
        </div>
      )
    },
    style: {
      background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
      color: 'white',
      border: '2px solid #991b1b',
      borderRadius: '12px',
      width: 150,
      height: 80
    }
  },

  {
    id: 'output-board-2',
    type: 'default',
    position: { x: 250, y: 350 },
    data: { 
      label: (
        <div className="text-center">
          <div className="font-bold text-accent">PLACA SAÍDA #2</div>
          <div className="text-xs">Saídas 09-16</div>
          <div className="text-xs">+ Amplificadores</div>
        </div>
      )
    },
    style: {
      background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
      color: 'white',
      border: '2px solid #991b1b',
      borderRadius: '12px',
      width: 150,
      height: 80
    }
  },

  {
    id: 'output-board-3',
    type: 'default',
    position: { x: 450, y: 350 },
    data: { 
      label: (
        <div className="text-center">
          <div className="font-bold text-accent">PLACA SAÍDA #3</div>
          <div className="text-xs">Saídas 17-24</div>
          <div className="text-xs">+ Amplificadores</div>
        </div>
      )
    },
    style: {
      background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
      color: 'white',
      border: '2px solid #991b1b',
      borderRadius: '12px',
      width: 150,
      height: 80
    }
  },

  {
    id: 'output-board-4',
    type: 'default',
    position: { x: 650, y: 350 },
    data: { 
      label: (
        <div className="text-center">
          <div className="font-bold text-accent">PLACA SAÍDA #4</div>
          <div className="text-xs">Saídas 25-32</div>
          <div className="text-xs">+ Amplificadores</div>
        </div>
      )
    },
    style: {
      background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
      color: 'white',
      border: '2px solid #991b1b',
      borderRadius: '12px',
      width: 150,
      height: 80
    }
  },

  // Fitas LED
  {
    id: 'led-strip-1',
    type: 'default',
    position: { x: 50, y: 500 },
    data: { 
      label: (
        <div className="text-center">
          <div className="font-bold text-led-green">FITAS LED</div>
          <div className="text-xs">WS2811/WS2812</div>
          <div className="text-xs">Até 100m</div>
        </div>
      )
    },
    style: {
      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
      color: 'white',
      border: '2px solid #15803d',
      borderRadius: '12px',
      width: 150,
      height: 70
    }
  },

  {
    id: 'led-strip-2',
    type: 'default',
    position: { x: 250, y: 500 },
    data: { 
      label: (
        <div className="text-center">
          <div className="font-bold text-led-green">FITAS LED</div>
          <div className="text-xs">WS2811/WS2812</div>
          <div className="text-xs">Até 100m</div>
        </div>
      )
    },
    style: {
      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
      color: 'white',
      border: '2px solid #15803d',
      borderRadius: '12px',
      width: 150,
      height: 70
    }
  },

  {
    id: 'led-strip-3',
    type: 'default',
    position: { x: 450, y: 500 },
    data: { 
      label: (
        <div className="text-center">
          <div className="font-bold text-led-green">FITAS LED</div>
          <div className="text-xs">WS2811/WS2812</div>
          <div className="text-xs">Até 100m</div>
        </div>
      )
    },
    style: {
      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
      color: 'white',
      border: '2px solid #15803d',
      borderRadius: '12px',
      width: 150,
      height: 70
    }
  },

  {
    id: 'led-strip-4',
    type: 'default',
    position: { x: 650, y: 500 },
    data: { 
      label: (
        <div className="text-center">
          <div className="font-bold text-led-green">FITAS LED</div>
          <div className="text-xs">WS2811/WS2812</div>
          <div className="text-xs">Até 100m</div>
        </div>
      )
    },
    style: {
      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
      color: 'white',
      border: '2px solid #15803d',
      borderRadius: '12px',
      width: 150,
      height: 70
    }
  },

  // Fonte de Alimentação
  {
    id: 'power-supply',
    type: 'default',
    position: { x: 850, y: 200 },
    data: { 
      label: (
        <div className="text-center">
          <div className="font-bold text-yellow-400">FONTE</div>
          <div className="text-xs">5V/12V/24V</div>
          <div className="text-xs">Alta Corrente</div>
        </div>
      )
    },
    style: {
      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
      color: 'white',
      border: '2px solid #b45309',
      borderRadius: '12px',
      width: 120,
      height: 70
    }
  }
];

const initialEdges: Edge[] = [
  // Conexão principal para hub
  {
    id: 'main-to-hub',
    source: 'main-board',
    target: 'distribution-hub',
    label: 'Cabo Flat 50P',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#3b82f6', strokeWidth: 3 }
  },

  // Conexões do hub para placas de saída
  {
    id: 'hub-to-output1',
    source: 'distribution-hub',
    target: 'output-board-1',
    label: 'FFC 20P',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#059669', strokeWidth: 2 }
  },
  {
    id: 'hub-to-output2',
    source: 'distribution-hub',
    target: 'output-board-2',
    label: 'FFC 20P',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#059669', strokeWidth: 2 }
  },
  {
    id: 'hub-to-output3',
    source: 'distribution-hub',
    target: 'output-board-3',
    label: 'FFC 20P',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#059669', strokeWidth: 2 }
  },
  {
    id: 'hub-to-output4',
    source: 'distribution-hub',
    target: 'output-board-4',
    label: 'FFC 20P',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#059669', strokeWidth: 2 }
  },

  // Conexões das placas de saída para fitas LED
  {
    id: 'output1-to-led1',
    source: 'output-board-1',
    target: 'led-strip-1',
    label: 'Bornes 4P',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#dc2626', strokeWidth: 2 }
  },
  {
    id: 'output2-to-led2',
    source: 'output-board-2',
    target: 'led-strip-2',
    label: 'Bornes 4P',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#dc2626', strokeWidth: 2 }
  },
  {
    id: 'output3-to-led3',
    source: 'output-board-3',
    target: 'led-strip-3',
    label: 'Bornes 4P',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#dc2626', strokeWidth: 2 }
  },
  {
    id: 'output4-to-led4',
    source: 'output-board-4',
    target: 'led-strip-4',
    label: 'Bornes 4P',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#dc2626', strokeWidth: 2 }
  },

  // Alimentação
  {
    id: 'power-to-hub',
    source: 'power-supply',
    target: 'distribution-hub',
    label: 'Alimentação',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#f59e0b', strokeWidth: 3 }
  }
];

export function ConnectionDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  return (
    <Card className="p-4 bg-card border-2 border-primary">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-xl font-bold text-primary font-mono">
            DIAGRAMA DE CONEXÕES - SISTEMA CONTROLADOR LED
          </h3>
          <p className="text-sm text-muted-foreground">
            Arquitetura de conectividade entre placa principal e placas de saída
          </p>
        </div>

        {/* Legenda */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge className="bg-blue-600">Controle Principal</Badge>
          <Badge className="bg-green-600">Distribuição</Badge>
          <Badge className="bg-red-600">Saídas Amplificadas</Badge>
          <Badge className="bg-green-500">Fitas LED</Badge>
          <Badge className="bg-orange-600">Alimentação</Badge>
        </div>

        {/* Diagrama React Flow */}
        <div style={{ width: '100%', height: '600px' }} className="border rounded-lg">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            attributionPosition="bottom-right"
            style={{ backgroundColor: "#f8fafc" }}
          >
            <MiniMap 
              zoomable 
              pannable 
              style={{
                backgroundColor: "#f1f5f9",
                border: "1px solid #e2e8f0"
              }}
            />
            <Controls />
            <Background color="#e2e8f0" gap={20} />
          </ReactFlow>
        </div>

        {/* Especificações Técnicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3 bg-blue-50 rounded border border-blue-200">
            <h4 className="font-bold text-blue-800 text-sm">CABO PRINCIPAL</h4>
            <div className="text-xs text-blue-600 space-y-1">
              <div>• Cabo Flat 50 pinos</div>
              <div>• Comprimento: até 30cm</div>
              <div>• Conectores IDC</div>
              <div>• Dados + Alimentação</div>
            </div>
          </div>

          <div className="p-3 bg-green-50 rounded border border-green-200">
            <h4 className="font-bold text-green-800 text-sm">DISTRIBUIÇÃO</h4>
            <div className="text-xs text-green-600 space-y-1">
              <div>• 4x Conectores FFC 20P</div>
              <div>• Buffer de dados</div>
              <div>• Isolação por placa</div>
              <div>• Status LEDs</div>
            </div>
          </div>

          <div className="p-3 bg-red-50 rounded border border-red-200">
            <h4 className="font-bold text-red-800 text-sm">AMPLIFICAÇÃO</h4>
            <div className="text-xs text-red-600 space-y-1">
              <div>• 74HCT245 + ULN2803</div>
              <div>• Isolação galvânica</div>
              <div>• Distância até 100m</div>
              <div>• Proteção ESD/surtos</div>
            </div>
          </div>

          <div className="p-3 bg-orange-50 rounded border border-orange-200">
            <h4 className="font-bold text-orange-800 text-sm">ALIMENTAÇÃO</h4>
            <div className="text-xs text-orange-600 space-y-1">
              <div>• 5V/12V/24V externos</div>
              <div>• Reguladores locais</div>
              <div>• Filtragem avançada</div>
              <div>• Proteção sobrecarga</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}