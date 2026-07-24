import type { InterestLevel } from "@prisma/client";

/**
 * Clasificación automática del nivel de interés (requisito #5).
 * El nivel NO es una etiqueta manual: se calcula a partir del comportamiento
 * observable del lead. Score 0–100 → frío / tibio / caliente.
 *
 * Señales:
 *  - Volumen de comunicaciones (hasta 40 pts)
 *  - Recencia del último contacto (hasta 25 pts) — un lead que se enfría baja
 *  - Visitas realizadas y su feedback (hasta 20 pts)
 *  - Completitud de las necesidades declaradas (hasta 15 pts)
 */

export type ScoringSignals = {
  communications: { createdAt: Date }[];
  visits: { status: string; feedback?: unknown }[];
  requirements: Record<string, unknown> | null | undefined;
  createdAt: Date;
};

const DAY = 1000 * 60 * 60 * 24;

function daysSince(date: Date): number {
  return (Date.now() - date.getTime()) / DAY;
}

export function computeScore(signals: ScoringSignals): number {
  let score = 0;

  // 1) Volumen de comunicaciones (máx 40)
  score += Math.min(signals.communications.length, 5) * 8;

  // 2) Recencia del último contacto (máx 25)
  const lastContact =
    signals.communications
      .map((c) => c.createdAt)
      .sort((a, b) => b.getTime() - a.getTime())[0] ?? signals.createdAt;
  const d = daysSince(lastContact);
  if (d <= 3) score += 25;
  else if (d <= 7) score += 18;
  else if (d <= 14) score += 10;
  else if (d <= 30) score += 4;

  // 3) Visitas realizadas + feedback (máx 20)
  const realizadas = signals.visits.filter((v) => v.status === "REALIZADA");
  score += Math.min(realizadas.length, 2) * 8;
  const interesado = realizadas.some((v) => {
    const fb = v.feedback as { nivelInteres?: string } | null;
    return fb?.nivelInteres === "ALTO";
  });
  if (interesado) score += 4;

  // 4) Necesidades declaradas (máx 15)
  const req = signals.requirements ?? {};
  const hasZona = Boolean((req as Record<string, unknown>).zona);
  const hasTipo = Boolean((req as Record<string, unknown>).tipo);
  const hasPresupuesto =
    Boolean((req as Record<string, unknown>).presupuestoMax) ||
    Boolean((req as Record<string, unknown>).presupuestoMin);
  score +=
    (hasZona ? 5 : 0) + (hasTipo ? 5 : 0) + (hasPresupuesto ? 5 : 0);

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function levelFromScore(score: number): InterestLevel {
  if (score >= 60) return "CALIENTE";
  if (score >= 30) return "TIBIO";
  return "FRIO";
}

export function classify(signals: ScoringSignals): {
  score: number;
  level: InterestLevel;
} {
  const score = computeScore(signals);
  return { score, level: levelFromScore(score) };
}
