"use client";
import { notFound } from "next/navigation";
import { usePatientsStore } from "@/lib/store/patients";
import { PatientHeader } from "@/components/patients/PatientHeader";

export default function PatientLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { pid: string };
}) {
  const decoded = decodeURIComponent(params.pid);
  const patient = usePatientsStore((s) =>
    s.patients.find((p) => p.pid === decoded),
  );
  if (!patient) notFound();
  return (
    <div>
      <PatientHeader patient={patient} />
      <div className="mt-6">{children}</div>
    </div>
  );
}
