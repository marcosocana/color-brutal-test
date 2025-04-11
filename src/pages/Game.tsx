
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { HexColorPicker } from 'react-colorful';
import { getRandomColor, calculateColorDifference, calculateScore } from '../utils/colorUtils';
import { toast } from 'sonner';

interface RoundResult {
  targetColor: string;
  selectedColor: string;
  difference: number;
  score: number;
  timeRemaining: number;
}

const TOTAL_ROUNDS = 5;
const SECONDS_PER_ROUND = 10;

const Game = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState<string>('');
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [targetColor, setTargetColor] = useState<string>('#000000');
  const [selectedColor, setSelectedColor] = useState<string>('#FFFFFF');
  const [timeRemaining, setTimeRemaining] = useState<number>(SECONDS_PER_ROUND);
  const [isRoundActive, setIsRoundActive] = useState<boolean>(true);
  const [results, setResults] = useState<RoundResult[]>([]);

  // Get player name from localStorage
  useEffect(() => {
    const storedName = localStorage.getItem('playerName');
    if (!storedName) {
      navigate('/');
      return;
    }
    setPlayerName(storedName);
  }, [navigate]);

  // Generate a new target color at the start of each round
  useEffect(() => {
    if (currentRound <= TOTAL_ROUNDS) {
      const newColor = getRandomColor();
      setTargetColor(newColor);
      setSelectedColor('#FFFFFF'); // Reset to white
      setTimeRemaining(SECONDS_PER_ROUND);
      setIsRoundActive(true);
    } else {
      // Game over, navigate to results
      const totalResults = [...results];
      localStorage.setItem('gameResults', JSON.stringify(totalResults));
      navigate('/results');
    }
  }, [currentRound, navigate, results]);

  // Timer countdown
  useEffect(() => {
    if (!isRoundActive) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          endRound();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRoundActive]);

  // End current round
  const endRound = useCallback(() => {
    setIsRoundActive(false);
    
    const difference = calculateColorDifference(targetColor, selectedColor);
    const roundScore = calculateScore(difference);
    
    setResults((prev) => [
      ...prev,
      {
        targetColor,
        selectedColor,
        difference,
        score: roundScore,
        timeRemaining,
      },
    ]);
    
    toast(`Ronda ${currentRound}: ${roundScore} puntos`, {
      description: difference === 0 ? "¡Color exacto!" : `Diferencia: ${difference}%`,
    });
    
    // Wait 2 seconds before next round
    setTimeout(() => {
      setCurrentRound((prev) => prev + 1);
    }, 2000);
  }, [targetColor, selectedColor, currentRound, timeRemaining]);

  // Submit button handler
  const handleSubmit = () => {
    if (isRoundActive) {
      endRound();
    }
  };

  return (
    <Layout>
      <div className="flex flex-col min-h-screen">
        <div className="brutalist-container my-6 flex-grow flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-display text-xl">RONDA {currentRound}/{TOTAL_ROUNDS}</h2>
            <div className="text-xl font-mono">
              {timeRemaining}s
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
            <div className="flex flex-col">
              <h3 className="font-display text-lg mb-4">COLOR OBJETIVO</h3>
              <div 
                className="color-swatch flex-grow"
                style={{ backgroundColor: targetColor }}
              ></div>
              <div className="mt-4 font-mono text-center uppercase">{targetColor}</div>
            </div>
            
            <div className="flex flex-col">
              <h3 className="font-display text-lg mb-4">TU SELECCIÓN</h3>
              <div 
                className="color-swatch mb-4 flex-grow"
                style={{ backgroundColor: selectedColor }}
              ></div>
              
              {isRoundActive && (
                <>
                  <HexColorPicker 
                    color={selectedColor} 
                    onChange={setSelectedColor}
                    className="w-full mb-6"
                  />
                  
                  <div className="font-mono text-center mb-4">{selectedColor}</div>
                  
                  <Button
                    onClick={handleSubmit}
                    className="brutalist-button w-full"
                  >
                    ENVIAR
                  </Button>
                </>
              )}
              
              {!isRoundActive && (
                <div className="flex-grow flex items-center justify-center">
                  <p className="text-xl text-center animate-pulse">
                    Preparando siguiente ronda...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Game;
