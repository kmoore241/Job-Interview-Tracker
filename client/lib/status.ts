import { Application } from "@/context/ApplicationContext";

export const STATUS_ORDER: Application["status"][] = [
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
];

export const STATUS_STYLES: Record<
  Application["status"],
  { pill: string; dot: string; text: string }
> = {
  Applied: {
    pill: "bg-sky-50 text-sky-700",
    dot: "bg-sky-500",
    text: "text-sky-700",
  },
  Interview: {
    pill: "bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
    text: "text-amber-700",
  },
  Offer: {
    pill: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
  },
  Rejected: {
    pill: "bg-rose-50 text-rose-700",
    dot: "bg-rose-500",
    text: "text-rose-700",
  },
};
