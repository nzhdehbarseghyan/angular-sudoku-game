import { Component } from '@angular/core';
import { SudokuBoardComponent } from './components/sudoku-board/sudoku-board.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ SudokuBoardComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Sudoku Validator';
}
