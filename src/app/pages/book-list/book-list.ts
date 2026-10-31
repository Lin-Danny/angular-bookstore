import { Component, computed, inject, OnInit, output, signal } from '@angular/core';
import { BookService } from '../../services/book-service';
import { Book } from '../../models/book';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-book-list',
  imports: [RouterLink],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookList implements OnInit{
  private bookService = inject(BookService);

  // books = signal<Book[]>([]);
  books = this.bookService.books;
  searchKeyword = signal('');
  filteredBooks = computed(() => {
    const keyword = this.searchKeyword().toLowerCase();
    return this.books().filter(book => 
      book.title.toLowerCase().includes(keyword)
    );
  });

  //改從路由導向
  // edit = output<Book>();
  // create = output();
  // delete = output();

  ngOnInit(): void {
    this.bookService.getBooks().subscribe(data => {
        this.books.set(data);  //改變books指向Service.books 則不用 this.bookService.books.set(data);        
      }
    );
  }
  // onSearch(event: Event){
  //   const input = event.target as HTMLInputElement;
  //   this.searchKeyword.set(input.value);
  // }

  //改從routerLink導向
  // editBook(book: Book){
  //   this.edit.emit(book);
  // }
  
  //改從routerLink導向
  // createBook(){
  //   this.create.emit();
  // }

  deleteBook(id: number) {
    this.bookService.deleteBook(id)
    .subscribe(result => {
      console.log('刪除成功', result);
      this.books.update(books =>
        books.filter(book =>
          book.id !== id
        )
      );

      // 改從路由導向
      // this.delete.emit();
    });
  }
  //測試學習調用this.bookService.getBook(id)
  // getBook(id: number) {
  //   this.bookService.getBook(id)
  //   .subscribe(result => {
  //     console.log('取得這本書籍資料', result);
  //   });
  // }
}
