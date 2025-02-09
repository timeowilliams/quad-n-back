'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Square, Circle, Triangle, Star } from 'lucide-react';

type StimulusType = 'position' | 'color' | 'audio' | 'shape';
type Shape = 'square' | 'circle' | 'triangle' | 'star';
type Letter = 'B' | 'K' | 'M' | 'P' | 'R' | 'S' | 'T' | 'L';
type Color = 'red' | 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'white';

interface ScoreCategory {
  correct: number;
  incorrect: number;
}

interface GameScore {
  position: ScoreCategory;
  color: ScoreCategory;
  audio: ScoreCategory;
  shape: ScoreCategory;
}

interface SequenceItem {
  position: number;
  color: Color;
  letter: Letter;
  shape: Shape;
}

interface ShapeComponentProps {
  shape: Shape;
  size?: number;
  color?: string;
}

interface FrequencyMap {
  [key: string]: number;
}

const QuadNBackGame: React.FC = () => {
  const [nBack, setNBack] = useState<number>(2);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [sequence, setSequence] = useState<SequenceItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<GameScore>({
    position: { correct: 0, incorrect: 0 },
    color: { correct: 0, incorrect: 0 },
    audio: { correct: 0, incorrect: 0 },
    shape: { correct: 0, incorrect: 0 }
  });
  const [feedback, setFeedback] = useState<string>('');
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  
  const gridSize = 3;
  const colors: Color[] = ['red', 'blue', 'green', 'purple', 'orange', 'pink'];
  const letters: Letter[] = ['B', 'K', 'M', 'P', 'R', 'S', 'T', 'L'];
  const shapes: Shape[] = ['square', 'circle', 'triangle', 'star'];
  const trials = 25;

  const ShapeComponent: React.FC<ShapeComponentProps> = ({ shape, ...props }) => {
    switch (shape) {
      case 'square': return <Square {...props} />;
      case 'circle': return <Circle {...props} />;
      case 'triangle': return <Triangle {...props} />;
      case 'star': return <Star {...props} />;
      default: return null;
    }
  };
  
  const generateSequence = useCallback((): SequenceItem[] => {
    const newSequence: SequenceItem[] = [];
    for (let i = 0; i < trials; i++) {
      newSequence.push({
        position: Math.floor(Math.random() * (gridSize * gridSize)),
        color: colors[Math.floor(Math.random() * colors.length)],
        letter: letters[Math.floor(Math.random() * letters.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)]
      });
    }
    return newSequence;
  }, []);

  const startGame = (): void => {
    setGameStarted(true);
    setIsPaused(false);
    setSequence(generateSequence());
    setCurrentIndex(0);
    setScore({
      position: { correct: 0, incorrect: 0 },
      color: { correct: 0, incorrect: 0 },
      audio: { correct: 0, incorrect: 0 },
      shape: { correct: 0, incorrect: 0 }
    });
    setFeedback('');
  };

  const [totalIncorrect, setTotalIncorrect] = useState<number>(0);

  const checkMatch = (type: StimulusType): void => {
    if (currentIndex < nBack) {
      setFeedback('Too early to check matches');
      return;
    }

    const currentItem = sequence[currentIndex];
    const nBackItem = sequence[currentIndex - nBack];
    let isMatch = false;

    switch (type) {
      case 'position':
        isMatch = currentItem.position === nBackItem.position;
        break;
      case 'color':
        isMatch = currentItem.color === nBackItem.color;
        break;
      case 'audio':
        isMatch = currentItem.letter === nBackItem.letter;
        break;
      case 'shape':
        isMatch = currentItem.shape === nBackItem.shape;
        break;
    }

    setScore(prev => {
      const newScore = {
        ...prev,
        [type]: {
          correct: prev[type].correct + (isMatch ? 1 : 0),
          incorrect: prev[type].incorrect + (isMatch ? 0 : 1)
        }
      };
      
      // Update total incorrect count
      const newTotalIncorrect = 
        newScore.position.incorrect + 
        newScore.color.incorrect + 
        newScore.audio.incorrect + 
        newScore.shape.incorrect;
      
      setTotalIncorrect(newTotalIncorrect);
      return newScore;
    });

    setFeedback(isMatch ? 'Correct!' : 'Incorrect');
  };

  const playLetterSound = useCallback((letter: Letter): void => {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    const frequencies: FrequencyMap = {
      'B': 220,    // A3
      'K': 246.94, // B3
      'M': 261.63, // C4
      'P': 293.66, // D4
      'R': 329.63, // E4
      'S': 349.23, // F4
      'T': 392.00, // G4
      'L': 440.00  // A4
    };
    
    oscillator.frequency.value = frequencies[letter];
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    gainNode.gain.value = 0.1;
    oscillator.start();
    
    setTimeout(() => {
      oscillator.stop();
    }, 200);
  }, [audioContext]);

  useEffect(() => {
    setAudioContext(new (window.AudioContext || window.webkitAudioContext)());
  }, []);

  useEffect(() => {
    if (gameStarted && currentIndex < sequence.length && !isPaused) {
      playLetterSound(sequence[currentIndex].letter);
      
      const timer = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setFeedback('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [gameStarted, currentIndex, sequence.length, playLetterSound, isPaused]); 

  const renderGrid = (): JSX.Element[] => {
    const grid: JSX.Element[] = [];
    const currentItem = sequence[currentIndex];

    for (let i = 0; i < gridSize * gridSize; i++) {
      grid.push(
        <div
          key={i}
          className={`w-24 h-24 border border-gray-300 flex items-center justify-center
            ${currentItem?.position === i ? 'bg-opacity-20' : ''}`}
          style={{
            backgroundColor: currentItem?.position === i ? currentItem.color : 'white' as Color
          }}
        >
          {currentItem?.position === i && (
            <div className="flex flex-col items-center">
              <ShapeComponent 
                shape={currentItem.shape} 
                size={40}
                color={currentItem.color === 'white' ? 'black' : 'white'}
              />
              <span className="mt-1 text-lg font-bold">{currentItem.letter}</span>
            </div>
          )}
        </div>
      );
    }
    return grid;
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Quad {nBack}-Back Game</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            <Button 
              onClick={() => setNBack(prev => Math.max(1, prev - 1))}
              disabled={gameStarted}
            >
              Decrease N
            </Button>
            <span className="text-xl font-bold">N = {nBack}</span>
            <Button 
              onClick={() => setNBack(prev => prev + 1)}
              disabled={gameStarted}
            >
              Increase N
            </Button>
          </div>

          <Button 
            onClick={startGame}
            className="w-full"
            disabled={gameStarted && currentIndex < sequence.length && !isPaused}
          >
            {gameStarted ? 'Restart Game' : 'Start Game'}
          </Button>

          {gameStarted && (
            <Button 
              onClick={() => setIsPaused(!isPaused)}
              className="w-full"
              variant={isPaused ? "destructive" : "secondary"}
            >
              {isPaused ? 'Resume Game' : 'Pause Game'}
            </Button>
          )}

          {gameStarted && (
            <>
              <div className="grid grid-cols-3 gap-2 mt-4">
                {renderGrid()}
              </div>

              <div className="flex flex-wrap gap-4 justify-center mt-4">
                <Button onClick={() => checkMatch('position')}>
                  Position Match (P)
                </Button>
                <Button onClick={() => checkMatch('color')}>
                  Color Match (C)
                </Button>
                <Button onClick={() => checkMatch('audio')}>
                  Sound Match (L)
                </Button>
                <Button onClick={() => checkMatch('shape')}>
                  Shape Match (S)
                </Button>
              </div>

              {feedback && (
                <Alert>
                  <AlertDescription>{feedback}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <h3 className="font-bold">Position</h3>
                  <p>Correct: {score.position.correct}</p>
                  <p>Incorrect: {score.position.incorrect}</p>
                </div>
                <div>
                  <h3 className="font-bold">Color</h3>
                  <p>Correct: {score.color.correct}</p>
                  <p>Incorrect: {score.color.incorrect}</p>
                </div>
                <div>
                  <h3 className="font-bold">Sound</h3>
                  <p>Correct: {score.audio.correct}</p>
                  <p>Incorrect: {score.audio.incorrect}</p>
                </div>
                <div>
                  <h3 className="font-bold">Shape</h3>
                  <p>Correct: {score.shape.correct}</p>
                  <p>Incorrect: {score.shape.incorrect}</p>
                </div>
              </div>

              <div className="text-center mt-4 space-y-2">
                <p>Trial: {currentIndex + 1} / {trials}</p>
                <p className="font-bold">Total Incorrect: {totalIncorrect}</p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuadNBackGame;