import { Injectable } from '@angular/core';
import { Constants } from './constants';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  baseUrl = `${Constants.apiUrl}/test`;

  constructor(private httpClient: HttpClient) {}

  saveTest(args: any, file: File): Observable<any> {
    const url = `${this.baseUrl}/`;

    const formData: FormData = new FormData();
    formData.append('image', file, 'filename.jpg');

    for (let arg of Object.keys(args)) {
      formData.append(arg, args[arg]);
    }

    return this.httpClient.post<any>(url, formData).pipe(
      map((body: any) => body),
      catchError(() => of('Error, Something went wrong.'))
    );
  }

  getTests(): Observable<any> {
    const url = `${this.baseUrl}/`;

    return this.httpClient.get<any>(url).pipe(
      map((body: any) => body),
      catchError(() => of('Error, Something went wrong.'))
    );
  }
}
