import { useEffect, useRef, useCallback } from "react";

export function useAutoScroll(dependency: unknown) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldAutoScroll = useRef(true);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    shouldAutoScroll.current = isNearBottom;
  }, []);

  useEffect(() => {
    if (!containerRef.current || !shouldAutoScroll.current) return;

    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [dependency]);

  return { containerRef, handleScroll };
}