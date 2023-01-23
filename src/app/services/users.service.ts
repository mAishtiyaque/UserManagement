import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators'
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private options = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private optionsPost = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient) { }

  fetchAllUsers(extpath: string = '') {
    return this.http.get('https://dummyjson.com/users/' + extpath, this.options).
      pipe(retry(3), catchError(this.errorHandler))
  }
  addNewUser(fName='',lName='') {
    return this.http.post('https://dummyjson.com/users/add',JSON.stringify({
      firstName: fName,
      lastName: lName
    }), this.optionsPost).
      pipe(retry(3), catchError(this.errorHandler))
  }
  removeUser(id=0){
       return this.http.delete('https://dummyjson.com/users/' + id, this.options).
      pipe(retry(3), catchError(this.errorHandler))
  }
  updateUser(fName='',lName='',id=0) {
    return this.http.put('https://dummyjson.com/users/'+id,JSON.stringify({
      firstName: fName,
      lastName: lName
    }), this.optionsPost).
      pipe(retry(3), catchError(this.errorHandler))
  }
  private errorHandler(error: HttpErrorResponse) {
    console.log(error.error.message)
    return throwError(() => error)
  }

}
