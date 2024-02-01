import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable,catchError,map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  url: string = "http://localhost:3000/user/";

  constructor(private http: HttpClient) { }
  

  public login(credentials: any): Observable<any> {
    return this.http.get<any[]>(this.url).pipe(
      map(users => {
        const matchingUser = users.find(user =>
          user.email === credentials.email && user.password === credentials.password
        );
        return matchingUser;
      }),
      catchError(this.errorHandler)
    );
  }
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
