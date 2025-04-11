
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface RoundSummaryModalProps {
  isOpen: boolean;
  roundNumber: number;
  targetColor: string;
  selectedColor: string;
  score: number;
  similarity: number;
  onContinue: () => void;
}

const RoundSummaryModal = ({
  isOpen,
  roundNumber,
  targetColor,
  selectedColor,
  score,
  similarity,
  onContinue,
}: RoundSummaryModalProps) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md border-white bg-background" hideCloseButton>
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-display">RONDA {roundNumber} COMPLETADA</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-6 py-6">
          <div className="flex flex-col items-center gap-2">
            <div className="text-sm mb-1">OBJETIVO</div>
            <div 
              className="w-full h-16 rounded-sm border border-white/30" 
              style={{ backgroundColor: targetColor }}
            ></div>
            <div className="text-xs font-mono">{targetColor}</div>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="text-sm mb-1">TU COLOR</div>
            <div 
              className="w-full h-16 rounded-sm border border-white/30" 
              style={{ backgroundColor: selectedColor }}
            ></div>
            <div className="text-xs font-mono">{selectedColor}</div>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-display">{score} PUNTOS</div>
            <div className="text-sm mt-1">Similitud: {similarity.toFixed(1)}%</div>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-center">
          <Button 
            onClick={onContinue}
            className="brutalist-button w-full"
          >
            CONTINUAR
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoundSummaryModal;
