import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Upload, Download, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProjectData {
  name: string;
  description: string;
  schematic?: string;
  pcb?: string;
  bom?: string;
  gerbers?: string[];
}

export function CelusIntegration() {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const projectData: ProjectData = {
    name: "CONTROLADOR LED WS2811",
    description: "Controlador LED para ART-NET com até 4 saídas WS2811",
    schematic: "/src/assets/led-controller-schematic.jpg",
    pcb: "/src/assets/main-pcb-premium-top.jpg",
    bom: "/led-controller-BOM.csv",
    gerbers: [
      "/led-controller.GTL",
      "/led-controller.GBL", 
      "/led-controller.GTO",
      "/led-controller.GBS",
      "/led-controller.GTS",
      "/led-controller.GML"
    ]
  };

  const handleExportToCelus = async () => {
    setIsExporting(true);
    
    try {
      // Preparar dados para exportação
      const exportData = {
        project: projectData,
        timestamp: new Date().toISOString(),
        format: "celus-import-v1"
      };

      // Criar arquivo JSON para download
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectData.name.toLowerCase().replace(/\s+/g, '-')}-celus-export.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Projeto exportado",
        description: "Arquivo JSON criado para importação no Celus",
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar o projeto",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleOpenCelus = () => {
    window.open('https://www.celus.io/en/design-platform', '_blank');
  };

  const handleDownloadGerbers = () => {
    // Simular download dos arquivos Gerber
    projectData.gerbers?.forEach((file, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = file;
        link.download = file.split('/').pop() || `gerber-${index}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 200);
    });

    toast({
      title: "Download iniciado",
      description: "Arquivos Gerber sendo baixados",
    });
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="h-5 w-5" />
          Integração Celus
        </CardTitle>
        <CardDescription>
          Abra este projeto no Celus - plataforma de design de PCB com IA
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">Dados do Projeto</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Nome:</strong> {projectData.name}</p>
              <p><strong>Descrição:</strong> {projectData.description}</p>
              <p><strong>Arquivos:</strong> Esquemático, PCB, BOM, Gerbers</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Ações</h4>
            <div className="space-y-2">
              <Button 
                onClick={handleExportToCelus}
                disabled={isExporting}
                className="w-full"
                variant="default"
              >
                {isExporting ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-spin" />
                    Exportando...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Exportar para Celus
                  </>
                )}
              </Button>
              
              <Button 
                onClick={handleDownloadGerbers}
                variant="outline"
                className="w-full"
              >
                <FileText className="mr-2 h-4 w-4" />
                Download Gerbers
              </Button>
              
              <Button 
                onClick={handleOpenCelus}
                variant="secondary"
                className="w-full"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Abrir Celus
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Como usar:</h4>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Clique em "Exportar para Celus" para baixar os dados do projeto</li>
            <li>Abra o site do Celus clicando em "Abrir Celus"</li>
            <li>Faça login ou crie uma conta no Celus</li>
            <li>Importe o arquivo JSON baixado na plataforma Celus</li>
            <li>Continue o design com as ferramentas de IA do Celus</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}