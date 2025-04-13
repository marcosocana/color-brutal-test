
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { generateFeedback } from '../utils/colorUtils';
import { toast } from 'sonner';
import { Copy } from 'lucide-react';
import { ScrollArea } from '../components/ui/scroll-area';
import { useLanguage } from '../hooks/use-language';

interface RoundResult {
  targetColor: string;
  selectedColor: string;
  difference: number;
  score: number;
  timeRemaining: number;
}

const Results = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState<string>('');
  const [results, setResults] = useState<RoundResult[]>([]);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const { t, language } = useLanguage();

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
      firstRound.targetColor === '#000000' && 
      firstRound.selectedColor === '#FFFFFF';
    
    // Filter out the first round if it's the default one
    const filteredResults = isDefaultFirstRound 
      ? parsedResults.slice(1) 
      : parsedResults;
    
    setResults(filteredResults);
    
    // Calculate total score based on filtered results
    const total = filteredResults.reduce((sum, round) => sum + round.score, 0);
    setTotalScore(total);
    
    // Generate feedback
    const maxPossibleScore = filteredResults.length * 100;
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
      shareText = `🎨 Colorete: ${playerName} got ${totalScore} points out of ${results.length * 100}. "${feedback}" 🎨 Try to beat it!`;
    } else {
      shareText = `🎨 Colorete: ${playerName} consiguió ${totalScore} puntos de ${results.length * 100}. "${feedback}" 🎨 ¡Intenta superarlo!`;
    }
    
    navigator.clipboard.writeText(shareText)
      .then(() => toast.success(language === 'en' ? 'Results copied to clipboard!' : '¡Resultado copiado al portapapeles!'))
      .catch(() => toast.error(language === 'en' ? 'Could not copy results' : 'No se pudo copiar el resultado'));
  };

  // Calculate similarity percentage from difference
  const getSimilarityPercentage = (difference: number): number => {
    return Math.max(0, Math.round(100 - difference));
  };

  return (
    <Layout fullHeight={false}>
      <div className="brutalist-container my-6 w-full">
        <h1 className="brutalist-title text-center mb-12">{t('results')}</h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <p className="text-2xl mb-2 font-display uppercase">{playerName}</p>
            <p className="text-4xl md:text-6xl font-display mb-6">{totalScore}/{results.length * 100}</p>
            <p className="text-xl font-mono">{feedback}</p>
          </div>
          
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
