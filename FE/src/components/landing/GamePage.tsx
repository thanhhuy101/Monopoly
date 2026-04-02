import { useEffect } from 'react';
import Board3D from '../Board3D';
import Modal from '../Modal2';
import Toast from '../Toast';
import FloatingMoney from '../FloatingMoney';
import GameHeader from '../game/GameHeader';
import GameLeftSidebar from '../game/GameLeftSidebar';
import GameRightSidebar from '../game/GameRightSidebar';
import CardRevealOverlay from '../game/CardRevealOverlay';
import BankruptcyFlow from '../game/BankruptcyFlow';
import VictoryModal from '../game/VictoryModal';
import { useGameStore } from '../../store/gameStore';
import { useSetupStore } from '../../store/setupStore';
import { useBotController } from '../../bot/useBotController';

export default function GamePage() {
  const init = useGameStore(s => s.init);
  const slots = useSetupStore(s => s.slots);
  const bankruptcyFlow = useGameStore(s => s.bankruptcyFlow);
  const gameOver = useGameStore(s => s.gameOver);
  const winner = useGameStore(s => s.winner);
  const resolveDebt = useGameStore(s => s.resolveDebt);
  const closeBankruptcyFlow = useGameStore(s => s.closeBankruptcyFlow);

  useEffect(() => {
    const enabled = slots.filter(s => s.enabled).map(({ enabled, ...rest }) => rest);
    init(enabled.length >= 2 ? enabled : undefined);
  }, [init, slots]);

  useBotController();

  return (
    <div className="min-h-screen bg-[#0b0e1a] flex flex-col">
      <GameHeader />

      <div className="flex flex-1 pt-16">
        <GameLeftSidebar />

        <main className="flex-1 flex items-start justify-center overflow-auto p-4">
          <Board3D />
        </main>

        <GameRightSidebar />
      </div>

      <Modal />
      <CardRevealOverlay />
      <Toast />
      <FloatingMoney />
      <BankruptcyFlow
        isOpen={bankruptcyFlow}
        onClose={closeBankruptcyFlow}
        onDebtResolved={resolveDebt}
      />
      {gameOver && winner && (
        <VictoryModal
          isOpen={true}
          winnerName={winner.name}
          totalAssets={`$${winner.money.toLocaleString()}`}
          turns={0}
          onPlayAgain={() => window.location.reload()}
          onShowLeaderboard={() => console.log('Show leaderboard')}
        />
      )}
    </div>
  );
}
