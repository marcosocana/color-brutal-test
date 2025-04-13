
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { generateFeedback } from '../utils/colorUtils';
import { toast } from 'sonner';
import { Copy, ArrowDown } from 'lucide-react';
import { ScrollArea } from '../components/ui/scroll-area';
import { useLanguage } from '../hooks/use-language';

interface RoundResult {
  targetColor: string;
  selectedColor: string;
  difference: number;
  score: number;
  timeRemaining: number;
}

const EXPECTED_ROUNDS = 6;

const Results = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState<string>('');
  const [results, setResults] = useState<RoundResult[]>([]);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const { t, language } = useLanguage();
  const [showAddLastRoundButton, setShowAddLastRoundButton] = useState<boolean>(false);

  useEffect(() => {
    // Get player name and results from localStorage
    const storedName = localStorage.getItem('playerName');
    const storedResults = localStorage.getItem('gameResults');
    
    console.log("Stored results:", storedResults);
    
    if (!storedName || !storedResults) {
      navigate('/');
      return;
    }
    
    setPlayerName(storedName);
    
    // Parse all results
    const parsedResults = JSON.parse(storedResults) as RoundResult[];
    console.log("Parsed results:", parsedResults);
    
    // Skip the first round if it's the default black/white one
    const firstRound = parsedResults[0];
    const isDefaultFirstRound = 
      firstRound && 
      ((firstRound.targetColor === '#000000' && firstRound.selectedColor === '#FFFFFF') ||
       (firstRound.targetColor === firstRound.selectedColor));
    
    // Filter out the first round if it's the default one
    const filteredResults = isDefaultFirstRound 
      ? parsedResults.slice(1) 
      : parsedResults;
    
    setResults(filteredResults);
    
    // Check if we need to show the "Add Last Round" button
    // Only show if we have fewer than expected rounds and there are more results available
    setShowAddLastRoundButton(filteredResults.length < EXPECTED_ROUNDS && parsedResults.length > filteredResults.length);
    
    // Calculate total score based on filtered results
    const total = filteredResults.reduce((sum, round) => sum + round.score, 0);
    setTotalScore(total);
    
    // Generate feedback
    const maxPossibleScore = EXPECTED_ROUNDS * 100; // Always 500 points max (5 rounds * 100 points)
    const feedbackText = generateFeedback(total, maxPossibleScore);
    setFeedback(feedbackText);
  }, [navigate]);

  const handlePlayAgain = () => {
    // Clear previous results
    localStorage.removeItem('gameResults');
    navigate('/');
  };

  const handleCopyResults = () => {
    let shareText;
    if (language === 'en') {
      shareText = `🎨 Colorete: ${playerName} got ${totalScore} points out of ${EXPECTED_ROUNDS * 100}. "${feedback}" 🎨 Try to beat it!`;
    } else {
      shareText = `🎨 Colorete: ${playerName} consiguió ${totalScore} puntos de ${EXPECTED_ROUNDS * 100}. "${feedback}" 🎨 ¡Intenta superarlo!`;
    }
    
    navigator.clipboard.writeText(shareText)
      .then(() => toast.success(language === 'en' ? 'Results copied to clipboard!' : '¡Resultado copiado al portapapeles!'))
      .catch(() => toast.error(language === 'en' ? 'Could not copy results' : 'No se pudo copiar el resultado'));
  };

  // Calculate similarity percentage from difference
  const getSimilarityPercentage = (difference: number): number => {
    return Math.max(0, Math.round(100 - difference));
  };

  // Function to add the last round if it's missing
  const handleAddLastRound = () => {
    // Get the original results from localStorage
    const storedResults = localStorage.getItem('gameResults');
    if (!storedResults) return;
    
    const parsedResults = JSON.parse(storedResults) as RoundResult[];
    
    // Skip the first round if it's the default black/white one
    const firstRound = parsedResults[0];
    const isDefaultFirstRound = 
      firstRound && 
      ((firstRound.targetColor === '#000000' && firstRound.selectedColor === '#FFFFFF') ||
       (firstRound.targetColor === firstRound.selectedColor));
    
    // If we already have all rounds, do nothing
    if ((!isDefaultFirstRound && parsedResults.length >= EXPECTED_ROUNDS) || 
        (isDefaultFirstRound && parsedResults.length >= EXPECTED_ROUNDS + 1)) {
      return;
    }
    
    // Get all valid rounds
    const validResults = isDefaultFirstRound 
      ? parsedResults.slice(1) 
      : parsedResults;
    
    // Set all valid rounds
    setResults(validResults);
    
    // Calculate total score
    const total = validResults.reduce((sum, round) => sum + round.score, 0);
    setTotalScore(total);
    
    // Hide the button
    setShowAddLastRoundButton(false);
  };

  return (
    <Layout fullHeight={false}>
      <div className="brutalist-container my-6 w-full">
        <h1 className="brutalist-title text-center mb-12">{t('results')}</h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <p className="text-2xl mb-2 font-display uppercase">{playerName}</p>
            <p className="text-4xl md:text-6xl font-display mb-6">{totalScore}/{EXPECTED_ROUNDS * 100}</p>
            <p className="text-xl font-mono">{feedback}</p>
          </div>
          
          {showAddLastRoundButton && (
            <div className="flex justify-center mb-8">
              <Button 
                onClick={handleAddLastRound} 
                className="brutalist-button flex items-center gap-2"
              >
                <ArrowDown size={18} />
                {t('addLastRound')}
              </Button>
            </div>
          )}
          
          <ScrollArea className="mb-8 max-h-full">
            <div className="grid grid-cols-1 gap-6">
              {results.map((round, index) => (
                <div key={index} className="border border-white p-4">
                  <div className="flex justify-between items-center mb-4">
                    <p className="font-display">{t('round')} {index + 1}</p>
                    <div className="flex items-center gap-3">
                      <p className="font-mono text-sm">{getSimilarityPercentage(round.difference)}% {t('similarity')}</p>
                      <p className="font-display">{round.score} {t('score')}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm mb-2">{t('target')}</p>
                      <div className="h-36 w-full border border-white/30" style={{ backgroundColor: round.targetColor }}></div>
                      <p className="text-xs mt-1 font-mono">{round.targetColor}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm mb-2">{t('yourColor')}</p>
                      <div className="h-36 w-full border border-white/30" style={{ backgroundColor: round.selectedColor }}></div>
                      <p className="text-xs mt-1 font-mono">{round.selectedColor}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <Button 
              onClick={handleCopyResults} 
              variant="secondary"
              className="brutalist-button flex items-center justify-center gap-2 flex-grow"
            >
              <Copy size={18} />
              {t('copyResults')}
            </Button>
            
            <Button 
              onClick={handlePlayAgain} 
              className="brutalist-button flex-grow"
            >
              {t('playAgain')}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Results;
