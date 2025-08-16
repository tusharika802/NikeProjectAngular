import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = 'https://localhost:7106/api/Products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
    );
  }
   getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // (Optional) Add to bag (future use)
  addToBag(productId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${productId}/bag`, {});
  }

  // (Optional) Add to favourites (future use)
  addToFavourite(productId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${productId}/favourite`, {});
  }
}


//   private handleError(error: HttpErrorResponse) {
//     let errorMessage = 'An error occurred';
//     if (error.error instanceof ErrorEvent) {
//       // Client-side error
//       errorMessage = error.error.message;
//     } else {
//       // Server-side error
//       errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
//     }
//     console.error(errorMessage);
//     return throwError(() => new Error(errorMessage));
//   }
// }