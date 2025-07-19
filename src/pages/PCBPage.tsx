import { PCBView } from '@/components/PCBView';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Monitor, Cable } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PCBPage() {
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
            PLACA CENTRAL - SISTEMA WS2811
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
            <Link to="/display-pcb">
              <Monitor className="w-4 h-4 mr-2" />
              Ver Placa Display
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/output-pcb">
              <Cable className="w-4 h-4 mr-2" />
              Ver Placas de Saída
            </Link>
          </Button>
        </div>
      </div>

      {/* Vista da PCB */}
      <PCBView />
    </div>
  );
}