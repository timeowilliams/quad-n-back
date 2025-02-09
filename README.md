# Quad N-Back Game

A cognitive training game that challenges your working memory by asking you to remember and match four different types of stimuli that occurred N positions back in the sequence.

## What is N-Back?

N-Back is a cognitive training exercise that challenges your working memory. In this game, you are presented with a sequence of stimuli and must identify when the current stimulus matches the one that appeared N positions back in the sequence.

The "Quad" in Quad N-Back means you need to track four different types of stimuli simultaneously:
1. Position: Location on a 3x3 grid
2. Color: The background color of the active square
3. Sound: A musical note associated with a specific letter
4. Shape: A geometric shape displayed in the active square

## How to Play

### Getting Started
1. Choose your N-level using the "Decrease N" and "Increase N" buttons
   - Start with N=2 if you're new to N-Back training
   - Increase N as you improve
2. Click "Start Game" to begin

### During the Game
- Every 3 seconds, you'll be presented with a new combination of:
  - A colored square on the 3x3 grid
  - A musical note
  - A shape inside the colored square
  - A letter (visual representation of the sound)

### Controls
- Press buttons to indicate matches when you recognize them:
  - "Position Match (P)": Current position matches the position from N steps ago
  - "Color Match (C)": Current color matches the color from N steps ago
  - "Letter Match (L)": Current sound/letter matches the one from N steps ago
  - "Shape Match (S)": Current shape matches the shape from N steps ago

### Scoring
- Correct matches increase your score for that category
- Incorrect guesses count against your score
- Each type of match (position, color, sound, shape) is scored separately
- Your performance is tracked for each stimulus type independently

### Sound Reference
Each letter corresponds to a specific musical note:
- B: A3 (220 Hz)
- K: B3 (246.94 Hz)
- M: C4 (261.63 Hz)
- P: D4 (293.66 Hz)
- R: E4 (329.63 Hz)
- S: F4 (349.23 Hz)
- T: G4 (392.00 Hz)
- L: A4 (440.00 Hz)

## Tips for Success

1. **Start Simple**
   - Begin with N=2 until you're comfortable
   - Focus on just one or two types of matches initially
   - Gradually add more match types as you improve

2. **Verbal Strategies**
   - Try creating a verbal sequence in your mind
   - For example, with N=2: "current, previous, target"
   - Update this sequence with each new stimulus

3. **Practice Regularly**
   - Short, focused sessions are better than long, fatiguing ones
   - Try to practice at the same time each day
   - Gradually increase difficulty as you improve

4. **Pay Attention to Patterns**
   - Look for patterns in how you process different types of stimuli
   - Notice which combinations are easier or harder for you
   - Use this information to guide your practice

## Installation

```bash
# Clone the repository
git clone [repository-url]

# Navigate to the project directory
cd quad-n-back

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Development

This game is built using:
- Next.js
- React
- Tailwind CSS
- Web Audio API
- shadcn/ui components

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.