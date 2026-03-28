import { useEffect } from "react";

/**
 * Prevents Backspace key from triggering browser back navigation
 * when not focused in an input field
 */
export function useBackspacePrevention() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Backspace") return;

      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const isInput =
        tag === "input" ||
        tag === "textarea" ||
        (target as any)?.isContentEditable;

      // If you're not typing in a field, prevent browser "Back"
      if (!isInput) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handler, { capture: true });
    return () =>
      window.removeEventListener("keydown", handler, { capture: true } as any);
  }, []);
}
