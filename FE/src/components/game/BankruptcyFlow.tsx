import { useState } from 'react';
import BankruptModal from './BankruptModal';
import LiquidationPanel from './LiquidationPanel';
import PrivateTrade from './PrivateTrade';
import PaymentSuccess from './PaymentSuccess';
import TransactionHistory from './TransactionHistory';
import LoseModal from './LoseModal';
import { useGameStore } from '../../store/gameStore';

type BankruptcyStep = 'bankrupt' | 'liquidation' | 'trade' | 'success' | 'history' | 'lose';

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

  if (!isOpen) return null;

  const handleLiquidate = () => {
    setCurrentStep('liquidation');
  };

  const handleTrade = () => {
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

    case 'trade':
      return (
        <PrivateTrade
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
