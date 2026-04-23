import Ask from "@/pages/app/Ask";
import PersonaMint from "@/pages/app/PersonaMint";
import { usePersonaNft } from "@/hooks/usePersonaNft";

const Persona = () => {
  const persona = usePersonaNft();

  if (!persona.mounted) return null;
  if (!persona.minted) return <PersonaMint />;
  return <Ask />;
};

export default Persona;

