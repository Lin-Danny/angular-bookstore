import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../models/book';
import { BookRequest } from '../models/book-request';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/books';

  books = signal<Book[]>([]);

  getBooks(): Observable<Book[]>{
    return this.http.get<Book[]>(this.apiUrl);
  }

  createBook(book: BookRequest): Observable<Book>{
    return this.http.post<Book>(this.apiUrl, book);
  }

  updateBook(id: number, book: BookRequest): Observable<Book>{
    return this.http.put<Book>(`${this.apiUrl}/${id}`, book);
  }

  deleteBook(id: number): Observable<Book>{
    return this.http.delete<Book>(`${this.apiUrl}/${id}`);
  }

  getBook(id: number): Observable<Book>{
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }
}
