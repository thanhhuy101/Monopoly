import { useMemo } from 'react';
import { LayoutGroup } from 'framer-motion';
import { buildGridMap } from '../data/gameData';
import BoardCell from './BoardCell';
import BoardCenter from './BoardCenter';

const GRID_MAP = buildGridMap();

interface CellEntry { row: number; col: number; spaceId: number }

export default function Board() {
  const cells = useMemo<CellEntry[]>(() => {
    const list: CellEntry[] = [];
    for (let row = 0; row < 11; row++) {
      for (let col = 0; col < 11; col++) {
        if (row >= 1 && row <= 9 && col >= 1 && col <= 9) continue;
        const spaceId = GRID_MAP[`${row},${col}`];
        if (spaceId !== undefined) list.push({ row, col, spaceId });
      }
    }
    return list;
  }, []);

  return (
    <div id="board-wrap">
      <div id="board-outer">
        <LayoutGroup>
          <div id="board">
            {cells.map(({ row, col, spaceId }) => (
              <BoardCell key={spaceId} spaceId={spaceId} row={row} col={col} />
            ))}
            <BoardCenter />
          </div>
        </LayoutGroup>
      </div>
    </div>
  );
}
