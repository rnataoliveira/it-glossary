import { getAllTerms } from "@/lib/terms";
import HomeClient from "@/components/HomeClient";

export default function Home() {
  const terms = getAllTerms();

  return <HomeClient terms={terms} />;
}
