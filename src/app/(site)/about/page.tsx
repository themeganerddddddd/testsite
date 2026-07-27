import { EditablePage } from "@/components/EditablePage";

export const dynamic = "force-dynamic";
export const metadata = { title: "About" };

export default function AboutPage() {
  return <EditablePage slug="about" />;
}
