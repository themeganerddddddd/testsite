import { EditablePage } from "@/components/EditablePage";

export const dynamic = "force-dynamic";
export const metadata = { title: "Contact" };

export default function ContactPage() {
  return <EditablePage slug="contact" />;
}
