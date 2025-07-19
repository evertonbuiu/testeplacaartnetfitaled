import { DisplayPCBView } from '@/components/DisplayPCBView';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Cable } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DisplayPCBPage() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation */}
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" className="font-mono">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              VOLTAR AO CONTROLADOR
            </Link>
          </Button>
          <Button asChild variant="outline" className="font-mono">
            <Link to="/pcb">
              <Cable className="w-4 h-4 mr-2" />
              VER PLACA PRINCIPAL
            </Link>
          </Button>
        </div>

        {/* Display PCB View */}
        <DisplayPCBView />
      </div>
    </div>
  );
}