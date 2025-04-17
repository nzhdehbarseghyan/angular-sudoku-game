import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-sudoku-board',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sudoku-board.component.html',
  styleUrls: ['./sudoku-board.component.scss']
})

export class SudokuBoardComponent implements OnInit {
  sudokuForm: FormGroup;
  invalidCells: Set<string> = new Set();
  timer: number = 0;
  timerInterval: any;
  isGameStarted: boolean = false;
  successMessage: string = '';
  isSolved: boolean = false;
  isTimerRunning: boolean = false;


  constructor(private fb: FormBuilder) {
    this.sudokuForm = this.createSudokuForm();
  }

  ngOnInit() {
    this.newGame();
  }

  createSudokuForm(): FormGroup {
    const formGroup = this.fb.group({});
    const grid = this.fb.array([]);

    for (let row = 0; row < 9; row++) {
      const rowArray: any = this.fb.array([]);

      for (let col = 0; col < 9; col++) {
        rowArray.push(this.fb.control('', [
          Validators.min(1),
          Validators.max(9),
          Validators.pattern(/^[1-9]$/)
        ]));
      }

      grid.push(rowArray);
    }

    formGroup.addControl('grid', grid);
    return formGroup;
  }

  get grid(): FormArray {
    return this.sudokuForm.get('grid') as FormArray;
  }

  getRow(row: number): FormArray {
    return this.grid.at(row) as FormArray;
  }

  getRowControls(row: number): FormControl[] {
    return (this.grid.at(row) as FormArray).controls as FormControl[];
  }

  getCell(row: number, col: number): FormControl {
    return this.getRow(row).at(col) as FormControl;
  }

  checkSudoku(): void {
    this.invalidCells.clear();
    const gridValues = this.getGridValues();

    this.checkDuplicates(gridValues, 'row');
    this.checkDuplicates(gridValues, 'column');
    this.checkDuplicates(gridValues, 'subgrid');
    this.checkIfSolved();
  }

  getGridValues(): number[][] {
    const values: number[][] = [];

    for (let row = 0; row < 9; row++) {
      values[row] = [];
      for (let col = 0; col < 9; col++) {
        const value = this.getCell(row, col).value;

        if (value > 9) {
          this.invalidCells.add(`${row},${col}`);
        }

        values[row][col] = value ? parseInt(value, 10) : 0;
      }
    }

    return values;
  }

  checkIfSolved(): void {
    let allFilled = true;

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cellValue = this.getCell(row, col).value;
        if (!cellValue || isNaN(Number(cellValue))) {
          allFilled = false;
          break;
        }
      }
      if (!allFilled) break;
    }

    if (allFilled && this.invalidCells.size === 0) {
      this.isSolved = true;
      this.successMessage = '🎉 Congratulations! You solved the puzzle!';
      this.stopTimer();
    } else if (!allFilled && this.invalidCells.size === 0 ) {
      this.successMessage = 'All correct! Keep going!';
    } else {
      this.successMessage = '';
    }
  }

  checkDuplicates(grid: number[][], type: 'row' | 'column' | 'subgrid'): void {
    for (let i = 0; i < 9; i++) {
      const seen = new Set<number>();
      const duplicates = new Set<number>();

      for (let j = 0; j < 9; j++) {
        let value: number;
        let row: number, col: number;

        if (type === 'row') {
          row = i;
          col = j;
          value = grid[row][col];
        } else if (type === 'column') {
          row = j;
          col = i;
          value = grid[row][col];
        } else { // subgrid
          const startRow = Math.floor(i / 3) * 3;
          const startCol = (i % 3) * 3;
          row = startRow + Math.floor(j / 3);
          col = startCol + (j % 3);
          value = grid[row][col];
        }

        if (value !== 0) {
          if (seen.has(value)) {
            duplicates.add(value);
          } else {
            seen.add(value);
          }
        }
      }

      // To mark all duplicates
      duplicates.forEach(dupValue => {
        for (let j = 0; j < 9; j++) {
          let row: number, col: number;

          if (type === 'row') {
            row = i;
            col = j;
          } else if (type === 'column') {
            row = j;
            col = i;
          } else { // subgrid
            const startRow = Math.floor(i / 3) * 3;
            const startCol = (i % 3) * 3;
            row = startRow + Math.floor(j / 3);
            col = startCol + (j % 3);
          }

          if (grid[row][col] === dupValue) {
            this.invalidCells.add(`${row},${col}`);
          }
        }
      });
    }
  }

  isCellInvalid(row: number, col: number): boolean {
    return this.invalidCells.has(`${row},${col}`);
  }

  isSubgridInvalid(row: number, col: number): boolean {
    const subgridRow = Math.floor(row / 3);
    const subgridCol = Math.floor(col / 3);

    for (let r = subgridRow * 3; r < subgridRow * 3 + 3; r++) {
      for (let c = subgridCol * 3; c < subgridCol * 3 + 3; c++) {
        if (this.invalidCells.has(`${r},${c}`)) {
          return true;
        }
      }
    }

    return false;
  }

  resetBoard(): void {
    this.sudokuForm = this.createSudokuForm();
    this.invalidCells.clear();
    this.resetTimer();
    this.isGameStarted = false;
    this.isSolved = false;
    this.successMessage = '';
    this.renderStartingPuzzle();
    this.startTimer();
  }

  newGame(): void {
    this.resetBoard();
    this.renderStartingPuzzle();

    this.startTimer();
    this.isGameStarted = true;
  }

  renderStartingPuzzle () {
    // Hardcoded starting puzzle
    const puzzle = [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 0, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ];

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (puzzle[row][col] !== 0) {
          this.getCell(row, col).setValue(puzzle[row][col]);
          this.getCell(row, col).disable();
        }
      }
    }
  }

  startTimer(): void {
    if (!this.isTimerRunning) {
      this.isTimerRunning = true;
      this.timerInterval = setInterval(() => {
        if (this.isTimerRunning) {
          this.timer++;
        }
      }, 1000);
    }
  }

  stopTimer(): void {
    this.isTimerRunning = false;
  }

  resetTimer(): void {
    clearInterval(this.timerInterval);
    this.isTimerRunning = false;
    this.timer = 0;
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  onKeyPress(event: KeyboardEvent): boolean {
    if (this.isSolved) {
      return false;
    }

    const charCode = event.key || event.code;

    // Allow only numbers 1-9 and backspace/delete
    if ((charCode >= '1' && charCode <= '9') ||
      (charCode >= 'Digit1' && charCode <= 'Digit9') ||
      charCode === 'Backspace' || charCode === 'Delete') {
      if (this.successMessage) {
        this.successMessage = '';
      }

      return true;
    }

    event.preventDefault();
    return false;
  }
}
