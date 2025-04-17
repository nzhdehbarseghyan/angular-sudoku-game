import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SudokuBoardComponent } from './sudoku-board.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('SudokuBoardComponent', () => {
  let component: SudokuBoardComponent;
  let fixture: ComponentFixture<SudokuBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, SudokuBoardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SudokuBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize a 9x9 grid', () => {
    expect(component.grid.length).toBe(9);
    component.grid.controls.forEach((row: any) => {
      expect(row.controls.length).toBe(9);
    });
  });

  it('should detect duplicate in a row', () => {
    const row = 0;
    component.getCell(row, 0).setValue('5');
    component.getCell(row, 1).setValue('5'); // duplicate
    component.checkSudoku();

    expect(component.invalidCells.has(`${row},0`)).toBeTrue();
    expect(component.invalidCells.has(`${row},1`)).toBeTrue();
  });

  it('should detect duplicate in a column', () => {
    const col = 0;
    component.getCell(0, col).setValue('3');
    component.getCell(1, col).setValue('3'); // duplicate
    component.checkSudoku();

    expect(component.invalidCells.has(`0,${col}`)).toBeTrue();
    expect(component.invalidCells.has(`1,${col}`)).toBeTrue();
  });

  it('should detect duplicate in a subgrid', () => {
    // Top-left subgrid: set same value at two different positions
    component.getCell(0, 0).setValue('9');
    component.getCell(1, 1).setValue('9');
    component.checkSudoku();

    expect(component.invalidCells.has(`0,0`)).toBeTrue();
    expect(component.invalidCells.has(`1,1`)).toBeTrue();
  });

  it('should reset the board', () => {
    component.getCell(0, 0).setValue('5');
    component.invalidCells.add('0,0');

    component.resetBoard();

    expect(component.getCell(0, 0).value).toBe('');
    expect(component.invalidCells.size).toBe(0);
    expect(component.timer).toBe(0);
  });

  it('should format time as MM:SS', () => {
    expect(component.formatTime(65)).toBe('01:05');
    expect(component.formatTime(5)).toBe('00:05');
    expect(component.formatTime(0)).toBe('00:00');
  });

  it('should increment timer when started', fakeAsync(() => {
    component.startTimer();
    tick(2000); // advance 2 seconds
    expect(component.timer).toBeGreaterThanOrEqual(2);
    component.resetTimer();
  }));

  it('should populate puzzle and disable preset cells on newGame', () => {
    component.newGame();
    const disabledCell = component.getCell(0, 0);
    expect(disabledCell.disabled).toBeTrue();
    expect(disabledCell.value).toBe(5);
    expect(component.isGameStarted).toBeTrue();
  });
});
