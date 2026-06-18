"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  IconChevronDown,
  IconChevronUp,
  IconDots,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { Patient } from "@/types/domain";
import { useRouter } from "next/navigation";
import { usePatientsStore } from "@/lib/store/patients";

type SortKey = "name";

type Props = {
  data: Patient[];
};

export function PatientTable({ data }: Props) {
  const router = useRouter();
  const remove = usePatientsStore((s) => s.remove);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [menuFor, setMenuFor] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Patient | null>(null);

  const sorted = useMemo(() => {
    const copy = [...data];
    copy.sort((a, b) => {
      if (a.name < b.name) return sortDir === "asc" ? -1 : 1;
      if (a.name > b.name) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [data, sortKey, sortDir]);

  function toggleSort(k: SortKey) {
    if (sortKey === k) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(k);
      setSortDir(k === "name" ? "asc" : "desc");
    }
  }

  function SortArrow({ k }: { k: SortKey }) {
    if (sortKey !== k)
      return <IconChevronDown size={12} className="opacity-30" />;
    return sortDir === "asc" ? (
      <IconChevronUp size={12} />
    ) : (
      <IconChevronDown size={12} />
    );
  }

  return (
    <>
      <div className="bg-white rounded-card border-[0.5px] border-ink-200 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-[13px] min-w-[560px]">
          <thead>
            <tr className="border-b border-ink-200 bg-snow/50">
              <SortableTh
                onClick={() => toggleSort("name")}
                className="pl-5"
              >
                대상자 <SortArrow k="name" />
              </SortableTh>
              <th className="w-[8%]" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => (
              <tr
                key={p.id}
                className="border-b border-ink-200/70 last:border-b-0 hover:bg-snow/60 group transition-colors cursor-pointer"
                onClick={() => router.push(`/patients/${p.pid}`)}
              >
                <td className="py-4 px-3 pl-5">
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={p.name}
                      tone="navy"
                      size={40}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-navy text-[14px]">
                          {p.name}
                        </span>
                        <span className="text-[11px] text-ink-500">
                          {p.age}세 · {p.gender}
                        </span>
                      </div>
                      <div className="text-[11px] text-ink-500 fl-num mt-0.5">
                        {p.pid}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  className="py-4 px-3 relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setMenuFor(menuFor === p.id ? null : p.id)}
                    aria-label="액션"
                    className="w-8 h-8 rounded-full hover:bg-ink-100 flex items-center justify-center text-ink-500 hover:text-navy opacity-60 group-hover:opacity-100"
                  >
                    <IconDots size={16} />
                  </button>
                  {menuFor === p.id && (
                    <div
                      className="absolute right-3 top-12 z-20 bg-white border border-ink-200 rounded-card shadow-card-hover p-1 min-w-[160px] animate-fade-in"
                      onMouseLeave={() => setMenuFor(null)}
                    >
                      <Link
                        href={`/patients/${p.pid}/edit`}
                        className="flex items-center gap-2 px-3 py-2 text-[12px] font-semibold text-ink-700 hover:bg-snow rounded-md"
                      >
                        <IconEdit size={14} /> 정보 수정
                      </Link>
                      <button
                        onClick={() => {
                          setMenuFor(null);
                          setConfirmDelete(p);
                        }}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 text-[12px] font-semibold text-red hover:bg-red-light rounded-md"
                      >
                        <IconTrash size={14} /> 삭제
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {sorted.length === 0 && (
          <div className="py-16 text-center text-ink-500 text-[13px]">
            조건에 맞는 대상자가 없습니다.
          </div>
        )}
      </div>

      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        caption="DELETE PATIENT"
        title="대상자를 삭제하시겠어요?"
        footer={
          <>
            <Button
              variant="secondary"
              size="md"
              onClick={() => setConfirmDelete(null)}
            >
              취소
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={async () => {
                if (confirmDelete) await remove(confirmDelete.id);
                setConfirmDelete(null);
              }}
            >
              삭제
            </Button>
          </>
        }
      >
        <p className="text-[13px] text-ink-700 leading-relaxed">
          <b className="text-navy">{confirmDelete?.name}</b> (
          <span className="fl-num">{confirmDelete?.pid}</span>) 환자를 삭제하면
          모든 측정 데이터 연결이 해제됩니다. 이 작업은 되돌릴 수 없습니다.
        </p>
      </Modal>
    </>
  );
}

function SortableTh({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <th className={cn("text-left py-3 px-3", className)}>
      <button
        onClick={onClick}
        className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide12 uppercase text-ink-500 hover:text-navy"
      >
        {children}
      </button>
    </th>
  );
}
