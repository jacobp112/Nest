import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Stage, Layer, Circle, Text } from 'react-konva';
import type { Stage as StageType } from 'konva/lib/Stage';
import type { Layer as KonvaLayer } from 'konva/lib/Layer';
import type { Circle as KonvaCircle } from 'konva/lib/shapes/Circle';

import type { SeatNode } from '../types/seatingTypes';

const seatRadius = 22;

const seatColors: Record<SeatNode['status'], string> = {
  available: '#0f172a',
  reserved: '#1e293b',
  vip: '#047857',
};

const statusBadges: Record<SeatNode['status'], string> = {
  available: 'Available seat',
  reserved: 'Reserved seat',
  vip: 'VIP seat',
};

const buildSeats = (): SeatNode[] => {
  const rows = 4;
  const columns = 6;
  const horizontalGap = 72;
  const verticalGap = 78;
  const originX = 80;
  const originY = 90;

  const layout: SeatNode[] = [];
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const id = `R${row + 1}-C${column + 1}`;
      const status: SeatNode['status'] =
        row === 0 && column >= 4 ? 'vip' : column === 2 ? 'reserved' : 'available';
      layout.push({
        id,
        row: row + 1,
        column: column + 1,
        status,
        x: originX + column * horizontalGap,
        y: originY + row * verticalGap,
      });
    }
  }
  return layout;
};

export const AccessibleSeatingChart: React.FC = () => {
  const seats = useMemo(buildSeats, []);
  const layerRef = useRef<KonvaLayer | null>(null);
  const stageRef = useRef<StageType>(null);
  const seatRefs = useRef<Map<string, KonvaCircle>>(new Map());
  const focusedSeatRef = useRef<string | null>(null);
  const rafRef = useRef<number | null>(null);

  const applyFocus = useCallback((seatId: string | null) => {
    if (focusedSeatRef.current === seatId) return;
    const previousId = focusedSeatRef.current;
    if (previousId) {
      const previousNode = seatRefs.current.get(previousId);
      previousNode?.setAttrs({
        stroke: '#1f2937',
        strokeWidth: 1.5,
        shadowBlur: 0,
      });
    }
    focusedSeatRef.current = seatId;
    if (seatId) {
      const currentNode = seatRefs.current.get(seatId);
      currentNode?.setAttrs({
        stroke: '#34d399',
        strokeWidth: 4,
        shadowBlur: 12,
        shadowColor: '#34d399',
      });
    }
    layerRef.current?.batchDraw();
  }, []);

  const scheduleFocus = useCallback(
    (seatId: string | null) => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = window.requestAnimationFrame(() => {
        applyFocus(seatId);
        rafRef.current = null;
      });
    },
    [applyFocus],
  );

  useEffect(
    () => () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    },
    [],
  );

  return (
    <div className="relative inline-block">
      <div aria-hidden="true">
        <Stage width={520} height={420} ref={stageRef}>
          <Layer ref={layerRef}>
            <Text
              text="Wing A · Lower Deck"
              x={40}
              y={24}
              fontSize={20}
              fontStyle="bold"
              fill="#cbd5f5"
            />
            {seats.map((seat) => (
              <React.Fragment key={seat.id}>
                <Circle
                  x={seat.x}
                  y={seat.y}
                  radius={seatRadius}
                  fill={seatColors[seat.status]}
                  stroke="#1f2937"
                  strokeWidth={1.5}
                  shadowColor="rgba(15,118,110,0.35)"
                  shadowBlur={4}
                  ref={(node) => {
                    if (node) {
                      seatRefs.current.set(seat.id, node);
                    } else {
                      seatRefs.current.delete(seat.id);
                    }
                  }}
                  onMouseEnter={() => scheduleFocus(seat.id)}
                  onMouseLeave={() => scheduleFocus(null)}
                />
                <Text
                  x={seat.x - seatRadius / 1.5}
                  y={seat.y - 8}
                  text={`${seat.row}${String.fromCharCode(64 + seat.column)}`}
                  fill="#e2e8f0"
                  fontSize={14}
                />
              </React.Fragment>
            ))}
          </Layer>
        </Stage>
      </div>
      {/* Hidden DOM overlay keeps seats keyboard-accessible without touching the canvas tree. */}
      <div className="pointer-events-none absolute inset-0">
        {seats.map((seat) => (
          <button
            key={`dom-${seat.id}`}
            type="button"
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-none bg-transparent opacity-0 focus-visible:opacity-0"
            style={{
              left: `${seat.x}px`,
              top: `${seat.y}px`,
              width: `${seatRadius * 2}px`,
              height: `${seatRadius * 2}px`,
            }}
            aria-label={`${statusBadges[seat.status]} ${seat.id}`}
            onFocus={() => scheduleFocus(seat.id)}
            onBlur={() => scheduleFocus(null)}
            tabIndex={0}
            data-seat-id={seat.id}
          />
        ))}
      </div>
    </div>
  );
};
