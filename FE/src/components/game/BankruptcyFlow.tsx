import { useState } from 'react';
import BankruptModal from './BankruptModal';
import LiquidationPanel from './LiquidationPanel';
import PrivateTrade from './PrivateTrade';
import PaymentSuccess from './PaymentSuccess';
import TransactionHistory from './TransactionHistory';
import LoseModal from './LoseModal';
import { useGameStore } from '../../store/gameStore';

type BankruptcyStep = 'bankrupt' | 'liquidation' | 'partner-selection' | 'trade' | 'success' | 'history' | 'lose';

interface BankruptcyFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onDebtResolved: () => void;
}

export default function BankruptcyFlow({ isOpen, onClose, onDebtResolved }: BankruptcyFlowProps) {
  const [currentStep, setCurrentStep] = useState<BankruptcyStep>('bankrupt');
  const { 
    players, 
    cur, 
    eliminatePlayer, 
    spectateGame, 
    leaveGame
  } = useGameStore();
  const [selectedPartnerId, setSelectedPartnerId] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleLiquidate = () => {
    setCurrentStep('liquidation');
  };

  const handleTrade = () => {
    setCurrentStep('partner-selection');
  };

  const handlePartnerSelect = (pid: number) => {
    setSelectedPartnerId(pid);
    setCurrentStep('trade');
  };

  const handleTransactionComplete = () => {
    setCurrentStep('success');
  };

  const handleViewHistory = () => {
    setCurrentStep('history');
  };

  const handleContinueGame = () => {
    onDebtResolved();
    onClose();
    setCurrentStep('bankrupt');
  };

  const handleBackToBankrupt = () => {
    setCurrentStep('bankrupt');
  };

  const handleCannotPayDebt = () => {
    // Player cannot pay debt even after liquidation/trade
    const currentPlayer = players[cur];
    eliminatePlayer(currentPlayer.id);
    setCurrentStep('lose');
  };

  const handleSpectate = () => {
    spectateGame(cur);
    onClose();
  };

  const handleLeaveGame = () => {
    leaveGame(cur);
    onClose();
  };

  // Render current step
  switch (currentStep) {
    case 'bankrupt':
      return (
        <BankruptModal
          onLiquidate={handleLiquidate}
          onTrade={handleTrade}
          onClose={onClose}
        />
      );

    case 'liquidation':
      return (
        <LiquidationPanel
          onConfirm={handleTransactionComplete}
          onCancel={handleBackToBankrupt}
          onCannotPay={handleCannotPayDebt}
        />
      );

    case 'partner-selection':
      const others = players.filter(p => !p.bankrupt && p.id !== cur);
      return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-6 z-60 font-['Barlow_Condensed']">
          <div className="bg-[#131212] border-2 border-[#d4a017] w-full max-w-md p-8 shadow-2xl">
            <h2 className="text-[#f6be39] text-2xl font-bold italic mb-6 text-center tracking-widest uppercase">
              CHỌN ĐỐI TÁC GIAO DỊCH
            </h2>
            <div className="space-y-3 mb-8">
              {others.map(p => (
                <button
                  key={p.id}
                  onClick={() => handlePartnerSelect(p.id)}
                  className="w-full flex items-center justify-between p-4 bg-[#1c1b1b] border border-white/5 hover:bg-[#2a2a2a] hover:border-[#d4a017]/50 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{p.emoji}</span>
                    <span className="text-[#e5e2e1] font-bold tracking-wider">{p.name}</span>
                  </div>
                  <span className="text-[#f6be39] opacity-0 group-hover:opacity-100 transition-opacity">CHỌN ➔</span>
                </button>
              ))}
              {others.length === 0 && (
                <p className="text-[#555] text-center italic py-4">Không có người chơi nào khả dụng</p>
              )}
            </div>
            <button
              onClick={handleBackToBankrupt}
              className="w-full py-3 border border-[#d4a017] text-[#f6be39] uppercase text-xs font-bold tracking-[0.2em] hover:bg-white/5 cursor-pointer transition-all"
            >
              QUAY LẠI
            </button>
          </div>
        </div>
      );

    case 'trade':
      return (
        <PrivateTrade
          initiatorId={cur}
          partnerId={selectedPartnerId!}
          onConfirm={handleTransactionComplete}
          onCancel={handleBackToBankrupt}
          onCannotPay={handleCannotPayDebt}
        />
      );

    case 'success':
      return (
        <PaymentSuccess
          onContinue={handleContinueGame}
          onViewLedger={handleViewHistory}
        />
      );

    case 'history':
      return (
        <TransactionHistory
          onClose={handleContinueGame}
        />
      );

    case 'lose':
      const currentPlayer = players[cur];
      const rank = players.filter(p => !p.bankrupt).length + 1;
      return (
        <LoseModal
          rank={rank}
          finalAssets={`$${currentPlayer.money}`}
          playTime="00:00" // You might want to track play time
          onSpectate={handleSpectate}
          onLeave={handleLeaveGame}
        />
      );

    default:
      return null;
  }
}
