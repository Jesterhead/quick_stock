import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkSubject = new BehaviorSubject<boolean>(
    localStorage.getItem('theme') === 'dark'
  );
  isDark$ = this.isDarkSubject.asObservable();

  toggle() {
    const newValue = !this.isDarkSubject.value;
    this.isDarkSubject.next(newValue);
    localStorage.setItem('theme', newValue ? 'dark' : 'light');
  }

  isDark(): boolean {
    return this.isDarkSubject.value;
  }
}