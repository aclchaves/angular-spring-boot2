import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Product } from '../dto/product';
import { Observable, BehaviorSubject, throwError, pipe } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  headers = new HttpHeaders();

  readonly API: string;

  private productSubject$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>(null);
  
  private loaded: boolean = false;


  constructor(private http: HttpClient) {
    this.API = 'http://localhost:8080/products';
   }

   httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    })
  };

  findAll(): Observable<Product[]> {
    if(!this.loaded){
      return this.http.get<Product[]>(this.API);
    }    
  }
  
  findById(id) {
    return this.http.get(`${this.API}/${id}`);
  }
  
  insert(product: Product): Observable<Product> {
    return this.http.post<Product>(this.API, product, this.httpOptions);
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do client
      errorMessage = error.error.message;
    } else {
      // Erro ocorreu no lado do servidor
      errorMessage = `Código do erro: ${error.status}, ` + `menssagem: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  };
}
