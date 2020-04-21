import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Constants } from './constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = `${Constants.apiUrl}/user`;

  constructor(private httpClient: HttpClient) {}

  login(args: any): Observable<any> {
    const url = `${this.baseUrl}/login`;

    return this.httpClient.post<any>(url, args).pipe(
      map((body: any) => body),
      catchError(() => of('Error. Something went wrong.'))
    );
  }

  signup(args: any): Observable<any> {
    const url = `${this.baseUrl}/signup`;

    return this.httpClient.post<any>(url, args).pipe(
      map((body: any) => body),
      catchError(() => of('Error. Something went wrong.'))
    );
  }

  logout() {
    localStorage.removeItem('token');
  }

  public get loggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }
}
