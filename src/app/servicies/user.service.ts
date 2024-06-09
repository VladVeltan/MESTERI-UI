import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../types/environment/environment';
import { User } from '../types/user.types';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  http = inject(HttpClient);

  findUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/email/${email}`);
  }
  getHandymen(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/users/handymen`);
  }
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }
  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/users`, user);
  }
  
}
