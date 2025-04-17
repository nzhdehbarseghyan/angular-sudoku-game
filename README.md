# Sudoku Game with Validator

## About This Project

This is a Sudoku game made with Angular. It lets you:

- Play Sudoku on a 9×9 grid
- Check if your answers are correct
- Start a new game with a ready puzzle
- See your solving time

## How to Run

1. Install dependencies:
```bash
 npm install
```

2. Start the development server:
```bash
 npm start
```

3. Open in your browser: http://localhost:4200


## Game Features

### Controls:

- New Game - Starts a pre-made puzzle
- Check    - Shows mistakes in red
- Reset    - Clears the board

### Rules:

- Fill empty squares with numbers 1-9
- No repeating numbers in: any row, any column, any 3×3 box


## Technical Information

### Built with:
- Angular 19
- Reactive Forms
- Standalone Components
- SCSS for styling

### Key features:
- Form validation for Sudoku rules
- Error highlighting
- Timer functionality
- SCSS for styling

### To Modify starting puzzle:
To modify the starting puzzle, edit the array in:
```javascript
// sudoku-board.component.ts
const puzzle = [
  [5,3,0,0,7,0,0,0,0],
  [6,0,0,1,9,0,0,0,0],
  // ... other rows
];
```


## Unit test

Unit tests are written using Jasmine and Angular TestBed. To run tests:
```bash
 ng test
```

The Test Covers:
- Component creation
- Grid initialization (9×9)
- Duplicate detection in: Rows, Columns, 3×3 subgrids
- Reset functionality
- Timer format and start
- New Game board setup and disabled cells


## License
This project is **MIT licensed**.
