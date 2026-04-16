import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  title: string;
  step: number;
  totalSteps: number;
  active: boolean;
  subtitle?: string;
}

export function StepIndicator({ title, step, totalSteps, active, subtitle }: StepIndicatorProps) {
  return (
    <div className="flex justify-between items-center gap-2 font-semibold text-lg">
      <span className={cn("flex items-center", !active && "!text-[#6B7280]")} style={{ color: "#0F172A" }}>
        {title}
      </span>
      <span
        className={cn("text-[12px] font-medium", !active && "!text-[#6B7280]")}
        style={{ color: "#0F172A" }}
      >
        {step} de {totalSteps}
      </span>
    </div>
  );
}

export function StepSubtitle({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <p
      className={cn("text-[13px] font-normal", !active && "!text-[#6B7280]")}
      style={{ paddingBottom: active ? 20 : 0, color: "#0F172A" }}
    >
      {children}
    </p>
  );
}
