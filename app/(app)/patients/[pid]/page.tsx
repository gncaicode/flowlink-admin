import { redirect } from "next/navigation";

export default function PatientPage({ params }: { params: { pid: string } }) {
  redirect(`/patients/${params.pid}/sessions`);
}
