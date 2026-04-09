import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";

type CometCardProps = {
  children: ReactNode;
  className?: string;
};

export function CometCard({ children, className }: CometCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const currentRef = useRef({ x: 0.5, y: 0.5, rx: 0, ry: 0 });
  const targetRef = useRef({ x: 0.5, y: 0.5, rx: 0, ry: 0 });
  const activeRef = useRef(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const animate = () => {
      const c = currentRef.current;
      const t = targetRef.current;
      const lerp = activeRef.current ? 0.12 : 0.08;

      c.x += (t.x - c.x) * lerp;
      c.y += (t.y - c.y) * lerp;
      c.rx += (t.rx - c.rx) * lerp;
      c.ry += (t.ry - c.ry) * lerp;

      const opacity = activeRef.current ? 1 : Math.max(0, 1 - Math.abs(c.x - 0.5) * 4);

      el.style.setProperty("--cx", `${(c.x * 100).toFixed(2)}%`);
      el.style.setProperty("--cy", `${(c.y * 100).toFixed(2)}%`);
      el.style.setProperty("--rx", `${c.rx.toFixed(2)}deg`);
      el.style.setProperty("--ry", `${c.ry.toFixed(2)}deg`);
      el.style.setProperty("--co", `${opacity.toFixed(3)}`);
      el.style.setProperty(
        "--shine-angle",
        `${(Math.atan2(c.y - 0.5, c.x - 0.5) * 180 / Math.PI + 90).toFixed(1)}deg`
      );

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;

    const bounds = el.getBoundingClientRect();
    const px = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    const py = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));

    targetRef.current = {
      x: px,
      y: py,
      ry: (px - 0.5) * 28,
      rx: (0.5 - py) * 22,
    };
    activeRef.current = true;
  };

  const handleLeave = () => {
    targetRef.current = { x: 0.5, y: 0.5, rx: 0, ry: 0 };
    activeRef.current = false;
  };

  return (
    <div
      ref={cardRef}
      className={`cc ${className ?? ""}`.trim()}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      <div className="cc-inner">
        <div className="cc-shine" />
        <div className="cc-holo" />
        <div className="cc-glow" />
        <div className="cc-edge" />
        <div className="cc-content">{children}</div>
      </div>
    </div>
  );
}
