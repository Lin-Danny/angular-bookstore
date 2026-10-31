import { JsonPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { BookService } from '../../services/book-service';
import { BookForm } from "../book-form/book-form";

@Component({
  selector: 'app-book-create',
  imports: [JsonPipe, BookForm],
  templateUrl: './book-create.html',
  styleUrl: './book-create.css',
})
export class BookCreate {
  private bookService = inject(BookService);

  title = signal('');
  author = signal('');
  imageUrl = signal('');
  price = signal(0);
  publishDate = signal('');
  bookStatus = signal('');

  book = computed(() => ({
      title: this.title(),
      author: this.author(),
      imageUrl: this.imageUrl(),
      price: this.price(),
      publishDate: this.publishDate(),
      bookStatus: this.bookStatus()
    })
  );

  save() {
    this.bookService.createBook(this.book())
    .subscribe(result => {
      console.log("新增成功", result);
      this.bookService.books.update(books =>
        [...books, result]
      );
    });
  }
}
