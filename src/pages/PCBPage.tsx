import { PCBView } from '@/components/PCBView';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';
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
            PLACA PCB - SISTEMA WS2811
          </h1>
        </div>
        
        <Button asChild variant="outline" size="sm">
          <Link to="/schematic">
            <FileText className="w-4 h-4 mr-2" />
            Ver Esquema Elétrico
          </Link>
        </Button>
      </div>

      {/* Vista da PCB */}
      <PCBView />
    </div>
  );
}