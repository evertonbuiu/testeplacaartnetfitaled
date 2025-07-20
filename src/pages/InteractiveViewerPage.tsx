import { InteractiveKiCadViewer } from '@/components/InteractiveKiCadViewer';
import schematicImage from '@/assets/led-controller-schematic.jpg';
import pcbImageTop from '@/assets/main-pcb-premium-top.jpg';
import pcbImageBottom from '@/assets/main-pcb-premium-bottom.jpg';

export default function InteractiveViewerPage() {
  return (
    <div className="min-h-screen bg-background p-4">
      <InteractiveKiCadViewer
        title="CONTROLADOR LED WS2811"
        schematicImage={schematicImage}
        pcbImageTop={pcbImageTop}
        pcbImageBottom={pcbImageBottom}
      />
    </div>
  );
}