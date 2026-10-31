import { Component, effect, inject, input, signal } from '@angular/core';
import { Book } from '../../models/book';
import { BookService } from '../../services/book-service';
import { BookRequest } from '../../models/book-request';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { validate } from '@angular/forms/signals';

@Component({
  selector: 'app-book-form',
  imports: [ReactiveFormsModule],  //學習把表單欄位的值與驗證改由 Reactive Forms 管理, ReactiveFormsModule 讓 HTML 可以使用 [formGroup]、formControlName 等表單指令。
  templateUrl: './book-form.html',
  styleUrl: './book-form.css',
})
export class BookForm {
  book = signal<Book | undefined>(undefined);
  // book = input<Book>();  改從路由取得id
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookService = inject(BookService);

  title = signal('');
  author = signal('');
  imageUrl = signal('');
  price = signal(0);
  publishDate = signal('');
  bookStatus = signal('');

  errorMessage = signal('');
  isSaving = signal(false);

  // //學習把表單欄位的值與驗證改由 Reactive Forms 管理
  // form = new FormGroup ({  //FormGroup 管理整份表單
  //   title: new FormControl('', {  //FormControl 管理單一欄位的值與驗證狀態
  //     nonNullable: true,  //表示這些控制項的型別不包含 null，讀取欄位值時比較方便。
  //     validators: [Validators.required]  //Validators 使用 Angular 提供的驗證規則，不必自行建立每個欄位的錯誤 Signal。
  //   }),
  //   author: new FormControl('', {
  //     nonNullable: true,
  //     validators: [Validators.required]
  //   }),
  //   imageUrl: new FormControl('', {
  //     nonNullable: true
  //   }),
  //   price: new FormControl(0, {
  //     nonNullable: true,
  //     validators: [Validators.min(0)]
  //   }),
  //   publishDate: new FormControl('', {
  //     nonNullable: true
  //   }),
  //   bookStatus: new FormControl('', {
  //     nonNullable: true
  //   })
  // });

  constructor() {
    //使用路由取得id及調用Service取得書籍內容
    //不使用 const id = this.route.snapshot.paramMap.get('id'); 
    //避免如果路由設定與 Angular 的路由重用行為符合預期，而且元件實例沒有被重新建立，constructor() 就不會再次執行，原本載入的書籍也不會自動變成第二本，如直接呼叫this.router.navigate(['/books/edit/2']);
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if(id) {
       this.bookService.getBook(Number(id)).subscribe(book => {
          this.book.set(book);
        });        
      }
      else {
        this.book.set(undefined);
      }
    });

    effect(()=> {
      const currentBook = this.book();

      if(currentBook){
        //UPDATE mode
        this.title.set(currentBook.title);
        this.author.set(currentBook.author);
        this.imageUrl.set(currentBook.imageUrl);
        this.price.set(currentBook.price);
        this.publishDate.set(currentBook.publishDate);
        this.bookStatus.set(currentBook.bookStatus);
      } else {
        //CREATE mode
        this.title.set('');
        this.author.set('');
        this.imageUrl.set('');
        this.price.set(0);
        this.publishDate.set('');
        this.bookStatus.set('');
      }
    });
  };
  
  save() {
    this.errorMessage.set('');  //清除上一次的錯誤訊息
    //手動驗證欄位
    if (!this.title().trim()){
      this.errorMessage.set('請輸入書名!!');
      return;
    }
    if (!this.author().trim()){
      this.errorMessage.set('請輸入作者!!');
      return;
    }

    this.isSaving.set(true);  //標記目前正在儲存
    
    const currentBook = this.book();
    const request: BookRequest = {
      title: this.title(),
      author: this.author(),
      imageUrl: this.imageUrl(),
      price: this.price(),
      publishDate: this.publishDate(),
      bookStatus: this.bookStatus()
    };

    if(currentBook){
      this.bookService.updateBook(currentBook.id, request)
      .subscribe({
        next:(result) => {
          this.bookService.books.update(books =>
            books.map(book =>
              book.id === result.id ? result : book)
          );

          this.isSaving.set(false);
          //使用Router成功時返回列表
          this.router.navigate(['/books']);
        },
        error: (err) => {
          console.error('更新書籍失敗，請稍後再試!!', err);
          this.errorMessage.set('更新書籍失敗，請稍後再試!!');
          this.isSaving.set(false);
        }
      }
      //改用 next: 搭配 error: 回傳錯誤訊息
      // (result) => {
      //     this.bookService.books.update(books =>
      //       books.map(book =>
      //         book.id === result.id ? result : book)
      //     );

      //     //使用Router成功時返回列表
      //     this.router.navigate(['/books']);
      // }
      );
    } else {
      this.bookService.createBook(request)
      .subscribe({
        next: (result) => {
          this.bookService.books.update(books =>
            [...books, result]
          );

          this.isSaving.set(false);
          //使用Router成功時返回列表
          this.router.navigate(['/books']);
        },
        error: (err) => {
          console.error('新增書籍失敗，請稍後再試!!', err);
          this.errorMessage.set('新增書籍失敗，請稍後再試!!');
          this.isSaving.set(false);
        }
      }
      //改用 next: 搭配 error: 回傳錯誤訊息
      //   (result) => {
      //   this.bookService.books.update(books =>
      //     [...books, result]
      //   );

      //   //使用Router成功時返回列表
      //   this.router.navigate(['/books']);
      //  }
      );
    }
  }
}
