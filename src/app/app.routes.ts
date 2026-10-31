// import { routes } from './app.routes';
import { Routes } from '@angular/router';
import { BookList } from './pages/book-list/book-list';
import { BookForm } from './pages/book-form/book-form';

// Angular 路由設定使用的是路徑片段，而不是以 / 開頭的網址
export const routes: Routes = [
    {
       path: '',
       redirectTo: 'books',
       pathMatch: 'full'  //要求整個路徑符合空路徑才重新導向 
    },
    {
        path: 'books',
        component: BookList
    },
    {
        path: 'books/new',
        component: BookForm
    },
    {
        path: 'books/edit/:id',
        component: BookForm
    }
];
//因學習改用Router開發而註解此段
// export const routes: Routes = [];

