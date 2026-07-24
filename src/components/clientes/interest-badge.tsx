import type { InterestLevel } from "@prisma/client";
import { Chip } from "@/components/ui/chip";
import { interestLabels, interestTone } from "@/lib/clients/labels";

export function InterestBadge({
  level,
  score,
}: {
  level: InterestLevel;
  score?: number;
}) {
  return (
    <Chip tone={interestTone[level]}>
      {interestLabels[level]}
      {score !== undefined ? ` · ${score}` : ""}
    </Chip>
  );
}
