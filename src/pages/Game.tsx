
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { HexColorPicker } from 'react-colorful';
import { getRandomColor, calculateColorDifference, calculateScore } from '../utils/colorUtils';
import { useLanguage } from '../hooks/use-language';

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
  const { t } = useLanguage();
  const [playerName, setPlayerName] = useState<string>('');
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [allTargetColors, setAllTargetColors] = useState<string[]>([]);
  const [targetColor, setTargetColor] = useState<string>('#000000');
  const [selectedColor, setSelectedColor] = useState<string>('#FFFFFF');
  const [timeRemaining, setTimeRemaining] = useState<number>(SECONDS_PER_ROUND);
  const [isRoundActive, setIsRoundActive] = useState<boolean>(true);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [countdown, setCountdown] = useState<number>(3);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [showColorPicker, setShowColorPicker] = useState<boolean>(true);

  // Get player name from localStorage
  useEffect(() => {
    const storedName = localStorage.getItem('playerName');
    if (!storedName) {
      navigate('/');
      return;
    }
    setPlayerName(storedName);
  }, [navigate]);

  // Generate all target colors at the start
  useEffect(() => {
    const colors = [];
    for (let i = 0; i < TOTAL_ROUNDS; i++) {
      colors.push(getRandomColor());
    }
    setAllTargetColors(colors);
  }, []);

  // Initial countdown before starting the game
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // Show "Go!" for 1 second
      const timer = setTimeout(() => {
        setGameStarted(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Set a random initial selected color when the game starts
  useEffect(() => {
    if (gameStarted) {
      setSelectedColor(getRandomColor());
    }
  }, [gameStarted]);

  // Set the current round's target color
  useEffect(() => {
    if (!gameStarted || allTargetColors.length === 0) return;

    if (currentRound <= TOTAL_ROUNDS) {
      const roundIndex = currentRound - 1;
      const roundColor = allTargetColors[roundIndex];
      setTargetColor(roundColor);

      setTimeRemaining(SECONDS_PER_ROUND);
      setIsRoundActive(true);
      setShowColorPicker(true);
    } else {
      // Make sure we save the results before navigating
      localStorage.setItem('gameResults', JSON.stringify(results));
      navigate('/results');
    }
  }, [currentRound, gameStarted, navigate, results, allTargetColors]);

  // Timer countdown
  useEffect(() => {
    if (!gameStarted || !isRoundActive) return;

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
  }, [isRoundActive, gameStarted]);

  const endRound = useCallback(() => {
    setIsRoundActive(false);

    const difference = calculateColorDifference(targetColor, selectedColor);
    const roundScore = calculateScore(difference);

    const roundResult = {
      targetColor,
      selectedColor,
      difference,
      score: roundScore,
      timeRemaining,
    };

    setResults(prevResults => {
      const updatedResults = [...prevResults, roundResult];
      // Save results after each round
      localStorage.setItem('gameResults', JSON.stringify(updatedResults));
      return updatedResults;
    });

    // After a short delay, proceed to the next round
    setTimeout(() => {
      setCurrentRound(prev => prev + 1);
    }, 500);
  }, [targetColor, selectedColor, timeRemaining]);

  const toggleColorPicker = () => {
    if (isRoundActive) {
      setShowColorPicker(!showColorPicker);
    }
  };

  if (!gameStarted) {
    return (
      <Layout fullHeight>
        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="brutalist-container w-full max-w-4xl mx-auto flex flex-col items-center justify-center py-32">
            <h1 className="brutalist-title mb-8 text-7xl">
              {countdown > 0 ? countdown : '¡GO!'}
            </h1>
            <p className="text-xl">Prepárate para empezar...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout fullHeight>
      <div className="flex flex-col h-full">
        <div className="brutalist-container my-6 flex-grow flex flex-col max-w-6xl mx-auto w-full">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-display text-xl">{t('round')} {currentRound}/{TOTAL_ROUNDS}</h2>
            <div className="text-xl font-mono px-4 py-2 border border-white rounded flex items-center justify-center min-w-16">
              {timeRemaining}s
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
            <div className="flex flex-col">
              <h3 className="font-display text-lg mb-4">{t('colorTarget')}</h3>
              <div className="font-mono text-center mb-2 uppercase">{targetColor}</div>
              <div 
                className="color-swatch h-48 md:h-72"
                style={{ backgroundColor: targetColor }}
              ></div>
            </div>

            <div className="flex flex-col">
              <h3 className="font-display text-lg mb-4">{t('yourSelection')}</h3>
              <div className="font-mono text-center mb-2 uppercase">{selectedColor}</div>
              <div 
                className="color-swatch mb-4 h-48 md:h-72 cursor-pointer"
                style={{ backgroundColor: selectedColor }}
                onClick={toggleColorPicker}
              ></div>

              {isRoundActive && showColorPicker && (
                <HexColorPicker 
                  color={selectedColor} 
                  onChange={setSelectedColor}
                  className="w-full mb-6"
                />
              )}

              {!isRoundActive && (
                <div className="flex-grow flex items-center justify-center">
                  <p className="text-xl text-center animate-pulse">
                    {t('preparing')}
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
