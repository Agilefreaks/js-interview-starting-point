import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class CoffeeShopsService {

  constructor(private http: HttpClient,
              private ngxLogger: NGXLogger) {
  }

  getToken(): Observable<any> {
    return this.http.post(`https://blue-bottle-api-test.herokuapp.com/v1/tokens`, {});
  }

  getCoffeeShops(token: string): Observable<any> {
    return this.http.get(`https://blue-bottle-api-test.herokuapp.com/v1/coffee_shops?token=${token}`,
      { headers: new HttpHeaders({ 'Accept': 'application/json' }) })
      .pipe(catchError((err: HttpErrorResponse): Observable<null> => {
      this.ngxLogger.error('Error message: ', err.message);
      console.log(`Error message: ${err.message}`);
      return throwError(() => err);
    }));
  }
}
