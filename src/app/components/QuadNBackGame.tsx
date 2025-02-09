'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Square, Circle, Triangle, Star } from 'lucide-react';

const QuadNBackGame = () => {
  const [nBack, setNBack] = useState(2);
  const [gameStarted, setGameStarted] = useState(false);
  const [sequence, setSequence] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState({
    position: { correct: 0, incorrect: 0 },
    color: { correct: 0, incorrect: 0 },
    audio: { correct: 0, incorrect: 0 },
    shape: { correct: 0, incorrect: 0 }
  });
  const [feedback, setFeedback] = useState('');
  
  const gridSize = 3;
  const colors = ['red', 'blue', 'green', 'purple', 'orange', 'pink'];
  const letters = ['C', 'H', 'K', 'L', 'Q', 'R', 'S', 'T'];
  const shapes = ['square', 'circle', 'triangle', 'star'];
  const trials = 25;

  const ShapeComponent = ({ shape, ...props }) => {
    switch (shape) {
      case 'square': return <Square {...props} />;
      case 'circle': return <Circle {...props} />;
      case 'triangle': return <Triangle {...props} />;
      case 'star': return <Star {...props} />;
      default: return null;
    }
  };
  
  const generateSequence = useCallback(() => {
    const newSequence = [];
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

  const startGame = () => {
    setGameStarted(true);
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

  const checkMatch = (type) => {
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

    setScore(prev => ({
      ...prev,
      [type]: {
        correct: prev[type].correct + (isMatch ? 1 : 0),
        incorrect: prev[type].incorrect + (isMatch ? 0 : 1)
      }
    }));

    setFeedback(isMatch ? 'Correct!' : 'Incorrect');
  };

  useEffect(() => {
    if (gameStarted && currentIndex < sequence.length) {
      const timer = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setFeedback('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [gameStarted, currentIndex, sequence.length]);

  const renderGrid = () => {
    const grid = [];
    const currentItem = sequence[currentIndex];

    for (let i = 0; i < gridSize * gridSize; i++) {
      grid.push(
        <div
          key={i}
          className={`w-24 h-24 border border-gray-300 flex items-center justify-center
            ${currentItem?.position === i ? 'bg-opacity-20' : 'bg-white'}`}
          style={{
            backgroundColor: currentItem?.position === i ? currentItem.color : 'white'
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
            disabled={gameStarted && currentIndex < sequence.length}
          >
            {gameStarted ? 'Restart Game' : 'Start Game'}
          </Button>

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
                  Letter Match (L)
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
                  <h3 className="font-bold">Letter</h3>
                  <p>Correct: {score.audio.correct}</p>
                  <p>Incorrect: {score.audio.incorrect}</p>
                </div>
                <div>
                  <h3 className="font-bold">Shape</h3>
                  <p>Correct: {score.shape.correct}</p>
                  <p>Incorrect: {score.shape.incorrect}</p>
                </div>
              </div>

              <div className="text-center mt-4">
                <p>Trial: {currentIndex + 1} / {trials}</p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuadNBackGame;