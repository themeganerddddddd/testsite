import { EditablePage } from "@/components/EditablePage";

export const dynamic = "force-dynamic";
export const metadata = { title: "Conflicts Policy" };

export default function ConflictsPage() {
  return <EditablePage slug="conflicts" />;
}
