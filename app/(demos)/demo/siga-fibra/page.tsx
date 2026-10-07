import App from "@/demos/siga-fibra/App";
import { SiteProvider } from "@/demos/siga-fibra/context/SiteContext";

/* Mesma composição do main.tsx do painel original. */
export default function SigaFibraDemo() {
  return (
    <SiteProvider>
      <App />
    </SiteProvider>
  );
}
