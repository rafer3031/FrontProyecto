import { Component, signal } from '@angular/core';
import { LoginCard } from '../login-card/login-card';
import RegisterCard from '../register-card/register-card';

@Component({
  selector: 'left-content',
  imports: [LoginCard, RegisterCard],
  templateUrl: './left-content.html',
  styleUrl: './left-content.scss',
})
export class LeftContent {
  isLoginMode = signal(true);
  toggleLoginMode(){
    this.isLoginMode.set(false)
  }
  toggleRegisterMode(){
    this.isLoginMode.set(true)
  }
}
