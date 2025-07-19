import { useState } from 'react';
import { OutputPCBView } from '@/components/OutputPCBView';
import { ConnectionDiagram } from '@/components/ConnectionDiagram';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, FileText, Monitor, Microchip, Cable, Network, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OutputPCBPage() {
  const [currentView, setCurrentView] = useState<'boards' | 'connections'>('boards');
  const [selectedBoard, setSelectedBoard] = useState(1);
  
  const outputBoards = [
    { number: 1, range: '01-08' },
    { number: 2, range: '09-16' },
    { number: 3, range: '17-24' },
    { number: 4, range: '25-32' }
  ];

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header com navegação */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Controlador
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-primary font-mono">
            PLACAS DE SAÍDA WS2811
          </h1>
        </div>
        
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/schematic">
              <FileText className="w-4 h-4 mr-2" />
              Ver Esquema Elétrico
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/pcb">
              <Microchip className="w-4 h-4 mr-2" />
              Ver Placa Principal
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/display-pcb">
              <Monitor className="w-4 h-4 mr-2" />
              Ver Placa Display
            </Link>
          </Button>
        </div>
      </div>

      {/* Descrição do Sistema */}
      <Card className="p-6 bg-gradient-to-r from-card via-card to-card border-2 border-primary">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-primary font-mono">
            SISTEMA MODULAR DE SAÍDAS
          </h2>
          <p className="text-muted-foreground font-mono">
            4 Placas de Saída Independentes • 8 Saídas por Placa • Conectores BORN
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Button
              variant={currentView === 'boards' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentView('boards')}
              className="font-mono"
            >
              <Layers className="w-4 h-4 mr-2" />
              PLACAS DE SAÍDA
            </Button>
            <Button
              variant={currentView === 'connections' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentView('connections')}
              className="font-mono"
            >
              <Network className="w-4 h-4 mr-2" />
              DIAGRAMA CONEXÕES
            </Button>
          </div>
        </div>
      </Card>

      {currentView === 'connections' ? (
        <ConnectionDiagram />
      ) : (
        <div className="space-y-6">
          {/* Seletor de placas */}
          <Card className="p-4 bg-card border border-border">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {outputBoards.map((board) => (
                <Button
                  key={board.number}
                  variant={selectedBoard === board.number ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedBoard(board.number)}
                  className="font-mono"
                >
                  <Cable className="w-3 h-3 mr-1" />
                  PLACA #{board.number}
                </Button>
              ))}
            </div>
          </Card>

          {/* Visualização da placa selecionada */}
          <OutputPCBView
            boardNumber={selectedBoard}
            outputRange={outputBoards[selectedBoard - 1].range}
          />
        </div>
      )}

      {/* Especificações do Sistema */}
      <Card className="p-6 bg-card border-2 border-accent">
        <h3 className="text-xl font-bold text-accent font-mono mb-4 text-center">
          ESPECIFICAÇÕES DO SISTEMA MODULAR
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h4 className="text-lg font-bold text-primary font-mono">CONECTIVIDADE</h4>
            <div className="space-y-2 text-sm font-mono">
              <div>• Cabo flat 20 pinos por placa</div>
              <div>• Conectores BORN 3 terminais</div>
              <div>• Blindagem contra interferência</div>
              <div>• Comprimento máximo: 2 metros</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-lg font-bold text-primary font-mono">CARACTERÍSTICAS</h4>
            <div className="space-y-2 text-sm font-mono">
              <div>• 8 drivers WS2811 por placa</div>
              <div>• LEDs de status individuais</div>
              <div>• Proteção contra sobrecorrente</div>
              <div>• Filtragem de alimentação</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-lg font-bold text-primary font-mono">INSTALAÇÃO</h4>
            <div className="space-y-2 text-sm font-mono">
              <div>• Fixação em trilho DIN</div>
              <div>• Identificação clara das saídas</div>
              <div>• Fácil manutenção modular</div>
              <div>• Expansão simples do sistema</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Footer */}
      <Card className="p-4 bg-card border border-border">
        <div className="text-center text-xs text-muted-foreground font-mono">
          SISTEMA MODULAR WS2811 | 4 PLACAS × 8 SAÍDAS | CONECTORES BORN | 
          CONEXÃO CABO FLAT | DESIGN PROFISSIONAL
        </div>
      </Card>
    </div>
  );
}