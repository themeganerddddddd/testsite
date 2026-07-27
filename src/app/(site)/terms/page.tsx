import { EditablePage } from "@/components/EditablePage";

export const dynamic = "force-dynamic";
export const metadata = { title: "Terms" };

export default function TermsPage() {
  return <EditablePage slug="terms" />;
}
