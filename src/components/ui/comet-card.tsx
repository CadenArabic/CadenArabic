import { useRef, type PointerEvent, type ReactNode } from "react";

import { cn } from "../../utils/cn";

type CometCardProps = {
  children: ReactNode;
  className?: string;
};

export function CometCard({ children, className }: CometCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const updatePointer = (event: PointerEvent<HTMLDivElement>) => {
    const element = cardRef.current;

    if (!element) {
      return;
    }

    const bounds = element.getBoundingClientRect();
    const pointerX = (event.clientX - bounds.left) / bounds.width;
    const pointerY = (event.clientY - bounds.top) / bounds.height;
    const rotateY = (pointerX - 0.5) * 16;
    const rotateX = (0.5 - pointerY) * 14;

    element.style.setProperty("--comet-x", `${pointerX * 100}%`);
    element.style.setProperty("--comet-y", `${pointerY * 100}%`);
    element.style.setProperty("--comet-rotate-x", `${rotateX}deg`);
    element.style.setProperty("--comet-rotate-y", `${rotateY}deg`);
    element.style.setProperty("--comet-opacity", "1");
  };

  const resetPointer = () => {
    const element = cardRef.current;

    if (!element) {
      return;
    }

    element.style.setProperty("--comet-x", "50%");
    element.style.setProperty("--comet-y", "50%");
    element.style.setProperty("--comet-rotate-x", "0deg");
    element.style.setProperty("--comet-rotate-y", "0deg");
    element.style.setProperty("--comet-opacity", "0");
  };

  return (
    <div
      ref={cardRef}
      className={cn("comet-card relative h-full overflow-hidden rounded-3xl", className)}
      onPointerMove={updatePointer}
      onPointerLeave={resetPointer}
    >
      <div className="comet-card__inner relative h-full rounded-[inherit]">
        <div className="comet-card__gradient" />
        <div className="comet-card__glow" />
        <div className="comet-card__trail" />
        <div className="comet-card__content relative z-[1] h-full rounded-[inherit]">{children}</div>
      </div>
    </div>
  );
}
