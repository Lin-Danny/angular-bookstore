import { Component, signal } from '@angular/core';
import { BookList } from "./pages/book-list/book-list";
import { BookCreate } from "./pages/book-create/book-create";
import { Book } from './models/book';
import { BookForm } from "./pages/book-form/book-form";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  selectedBook = signal<Book | undefined>(undefined);
  onEdit(book: Book) {
    this.selectedBook.set({...book});
  }
  
  onCreate() {
   this.selectedBook.set(undefined);
  }
  
  onDelete() {
    this.selectedBook.set(undefined);
  }
}
