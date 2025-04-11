// Function to generate a random color
export const getRandomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Converts hex to RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

// Calculate color difference (Delta E) - simplified version
export const calculateColorDifference = (color1: string, color2: string): number => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 100; // Maximum difference if conversion fails
  
  // Euclidean distance in RGB space (simplified)
  const rDiff = rgb1.r - rgb2.r;
  const gDiff = rgb1.g - rgb2.g;
  const bDiff = rgb1.b - rgb2.b;
  
  // Normalize to 0-100 scale (0 = identical, 100 = maximum difference)
  const distance = Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
  
  // Max possible distance is √(255² + 255² + 255²) ≈ 441.67
  return Math.min(100, Math.round((distance / 441.67) * 100));
};

// Calculate score based on color difference
export const calculateScore = (difference: number): number => {
  // If difference is 0, score is 100
  if (difference === 0) return 100;
  
  // Otherwise, calculate inverted score (lower difference = higher score)
  // We'll use a decay function to reward accuracy
  return Math.max(0, Math.round(100 - difference * 1.2));
};

// Generate feedback based on total score
export const generateFeedback = (totalScore: number, maxPossibleScore: number): string => {
  const scorePercentage = (totalScore / maxPossibleScore) * 100;
  
  if (scorePercentage >= 95) return "¡IMPRESIONANTE! ¿Trabajas para Pantone o qué?";
  if (scorePercentage >= 85) return "EXCELENTE OJO CROMÁTICO. Podrías ser diseñador.";
  if (scorePercentage >= 75) return "BUEN TRABAJO. Tu percepción del color es superior a la media.";
  if (scorePercentage >= 60) return "NO ESTÁ MAL. Hay potencial en tu ojo para el color.";
  if (scorePercentage >= 45) return "MEJORABLE. ¿Quizás necesitas calibrar tu monitor?";
  if (scorePercentage >= 30) return "PREOCUPANTE. ¿Has considerado hacerte una prueba de daltonismo?";
  
  return "¿ERES DISEÑADOR O DALTÓNICO? No lo tengo claro.";
};
