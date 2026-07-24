import type { PropertyStatus } from "@prisma/client";
import { Chip } from "@/components/ui/chip";
import { statusLabels, statusTone } from "@/lib/properties/labels";

export function StatusBadge({ status }: { status: PropertyStatus }) {
  return <Chip tone={statusTone[status]}>{statusLabels[status]}</Chip>;
}
