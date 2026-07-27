import { EditablePage } from "@/components/EditablePage";

export const dynamic = "force-dynamic";
export const metadata = { title: "Corrections" };

export default function CorrectionsPage() {
  return <EditablePage slug="corrections" />;
}
