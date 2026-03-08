"use client";

import { ORDER_STATUS_COLORS } from "@/lib/constants";

export default function StatusBadge({ status }: { status: string }) {
  const colors = ORDER_STATUS_COLORS[status] ?? "bg-gray-100 text-gray-800";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${colors}`}
    >
      {status}
    </span>
  );
}
