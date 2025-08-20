import React from "react";
import { useEffect, useRef, useState } from "react";

type Dir = "left" | "right" | null;

export default function App() {
  // state 
  const [headIndex, setHeadIndex] = useState(1);
  const MAX_HEADS = 2;

  // for slide animation
  const [animating, setAnimating] = useState(false);
  const [dir, setDir] = useState<Dir>(null);
  const [useA, setUseA] = useState(true);

  // overlay (long-press picker)
  const [showHeadOverlay, setShowHeadOverlay] = useState(false);

  // refs
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lpTimer = useRef<number | null>(null);
  const lpActive = useRef(false);
  const pointerDownAt = useRef<{ x: number; y: number } | null>(null);

  // helpers
  const srcFor = (idx: number) => `/assets/head/head_${String(idx).padStart(3, "0")}_front.png`;
  const currentSrc = srcFor(headIndex);
  const nextIdxRight = (headIndex % MAX_HEADS) + 1;
  const nextIdxLeft = headIndex - 1 < 1 ? MAX_HEADS : headIndex - 1;

  // preload prev/next
  useEffect(() => {
    const prev = nextIdxLeft;
    const next = nextIdxRight;
    [prev, next].forEach((i) => {
      const img = new Image();
      img.src = srcFor(i);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headIndex]);

  // slide change
  const prevHead = () => startSlide("right", nextIdxLeft);
  const nextHead = () => startSlide("left", nextIdxRight);

  function startSlide(direction: Dir, toIndex: number) {
    if (animating) return;
    setDir(direction);
    setAnimating(true);
    window.setTimeout(() => {
      setHeadIndex(toIndex);
      setUseA((v) => !v);
      setAnimating(false);
      setDir(null);
    }, 220);
  }

  const incomingSrc =
    dir === "left" ? srcFor(nextIdxRight) : dir === "right" ? srcFor(nextIdxLeft) : currentSrc;

  // long press (overlay trigger)
  function isInHeadZone(clientX: number, clientY: number) {
    if (!containerRef.current) return false;
    const r = containerRef.current.getBoundingClientRect();
    const xIn = clientX >= r.left && clientX <= r.right;
    const yIn = clientY >= r.top && clientY <= r.top + r.height * 0.35; // viršutiniai 35% – „galvos“ zona
    return xIn && yIn;
  }

  function startLongPress(e: { clientX: number; clientY: number }) {
    if (!isInHeadZone(e.clientX, e.clientY)) return;
    pointerDownAt.current = { x: e.clientX, y: e.clientY };
    lpActive.current = true;
    lpTimer.current = window.setTimeout(() => {
      if (!lpActive.current) return;
      setShowHeadOverlay(true);
    }, 450) as unknown as number;
  }

  function cancelLongPress() {
    lpActive.current = false;
    if (lpTimer.current) {
      clearTimeout(lpTimer.current);
      lpTimer.current = null;
    }
  }

  function maybeCancelOnMove(e: { clientX: number; clientY: number }) {
    if (!pointerDownAt.current) return;
    const dx = Math.abs(e.clientX - pointerDownAt.current.x);
    const dy = Math.abs(e.clientY - pointerDownAt.current.y);
    if (dx > 12 || dy > 12) cancelLongPress();
  }

  // swipe (touch only) 
  function onTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    touchX = e.touches[0].clientX;
    startLongPress({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
  }
  function onTouchMove(e: React.TouchEvent<HTMLDivElement>) {
    maybeCancelOnMove({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
  }
  function onTouchEnd(e: React.TouchEvent<HTMLDivElement>) {
    cancelLongPress();
    if (touchX == null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) {
      if (dx > 0) prevHead();
      else nextHead();
    }
    touchX = null;
  }

  return (
    <div style={{ textAlign: "center", padding: "20px 16px 120px" }}>
      <h1>LEGO Customizer MVP</h1>

      {/* main container */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: 400,
          height: 800,
          margin: "0 auto",
          border: "1px solid #eee",
          background: "#fff",
          overflow: "hidden",
          touchAction: "pan-y",
        }}
        onMouseDown={(e) => startLongPress(e)}
        onMouseUp={cancelLongPress}
        onMouseLeave={cancelLongPress}
        onMouseMove={(e) => maybeCancelOnMove(e)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* BODY */}
        <img
          src="/assets/body/body_001_front.png"
          alt="Lego Body"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            zIndex: 0,
          }}
          draggable={false}
        />

        {/* HEAD active */}
        <img
          key={`active-${useA ? "A" : "B"}`}
          src={currentSrc}
          alt="Head active"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            zIndex: 1,
            transform:
              animating && dir === "left"
                ? "translateX(-100%)"
                : animating && dir === "right"
                ? "translateX(100%)"
                : "translateX(0)",
            transition: "transform 200ms ease",
          }}
          draggable={false}
        />

        {/* HEAD incoming */}
        <img
          key={`incoming-${useA ? "B" : "A"}`}
          src={incomingSrc}
          alt="Head incoming"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            zIndex: 2,
            transform:
              animating && dir === "left"
                ? "translateX(0)"
                : animating && dir === "right"
                ? "translateX(0)"
                : dir === "left"
                ? "translateX(100%)"
                : dir === "right"
                ? "translateX(-100%)"
                : "translateX(100%)",
            transition: "transform 200ms ease",
          }}
          draggable={false}
        />

        {/* arrows in head height */}
        <button onClick={prevHead} style={arrowStyle("left")} aria-label="Previous head" disabled={animating}>
          ←
        </button>
        <button onClick={nextHead} style={arrowStyle("right")} aria-label="Next head" disabled={animating}>
          →
        </button>

        {/* indicator */}
        <div
          style={{
            position: "absolute",
            bottom: 8,
            right: 8,
            padding: "6px 10px",
            borderRadius: 999,
            background: "rgba(0,0,0,0.06)",
            fontSize: 12,
            zIndex: 4,
          }}
        >
          H {headIndex}/{MAX_HEADS}
        </div>

        {/* OVERLAY Long press */}
        {showHeadOverlay && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 8,
              margin: "0 auto",
              width: "95%",
              maxWidth: 380,
              background: "rgba(255,255,255,0.96)",
              border: "1px solid #e6e6e6",
              borderRadius: 12,
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              zIndex: 10,
              padding: "8px 6px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                gap: 8,
                overflowX: "auto",
                padding: "4px 2px",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "thin",
              }}
            >
              {Array.from({ length: MAX_HEADS }, (_, i) => i + 1).map((idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setHeadIndex(idx);
                    setShowHeadOverlay(false);
                  }}
                  style={{
                    minWidth: 72,
                    width: 72,
                    height: 72,
                    borderRadius: 8,
                    border: idx === headIndex ? "2px solid #111" : "1px solid #ddd",
                    padding: 0,
                    background: "#fff",
                    overflow: "hidden",
                    cursor: "pointer",
                    flex: "0 0 auto",
                  }}
                >
                  <img
                    src={srcFor(idx)}
                    alt={`Head ${idx}`}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    draggable={false}
                  />
                </button>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "center", paddingTop: 6 }}>
              <button
                onClick={() => setShowHeadOverlay(false)}
                style={{
                  border: "none",
                  background: "#f2f2f2",
                  borderRadius: 999,
                  padding: "6px 12px",
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                Close {/* Uždaryti */}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// „global“ variable for touch swipe
let touchX: number | null = null;

function arrowStyle(side: "left" | "right"): React.CSSProperties {
  return {
    position: "absolute",
    top: "35%",
    [side]: 8,
    transform: "translateY(-50%)",
    width: 44,
    height: 44,
    borderRadius: 999,
    border: "none",
    background: "rgba(0,0,0,0.06)",
    cursor: "pointer",
    zIndex: 3,
  } as React.CSSProperties;
}