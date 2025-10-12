import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActionsSubject, Store } from '@ngrx/store';
import { loginAction, signupAction, signupSuccessAction } from '../store/auth.action';
import { DialogModal } from '../../components/dialog-modal/dialog-modal';
import { Actions, ofType } from '@ngrx/effects';
import { map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../constants';

@Component({
  selector: 'app-auth',
  imports: [CommonModule, ReactiveFormsModule, DialogModal],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
  standalone: true,
})
export class Auth implements OnInit {
  isLoginMode = false;
  testForm!: FormGroup;
  modalDescription: string = '';
  showModal = signal(false);

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store,
    private fb: FormBuilder,
    private action$: Actions,
    private http: HttpClient
  ) {}
  ngOnInit(): void {
    this.setMode();
    this.intializeForm();
    this.handleSuccessEvent();
  }
  intializeForm() {
    this.testForm = this.fb.group({
      username: [''],
      email: [''],
      password: [''],
    });
  }

  onModeSwitch() {
    this.isLoginMode = !this.isLoginMode;
    this.setMode();
  }

  onLogin() {
    console.log(this.testForm.value);
    this.store.dispatch(loginAction(this.testForm.value));
  }

  onSignUp() {
    // this.http.post(`${BASE_URL}/refresh`, {}, { withCredentials: true }).subscribe();
    this.store.dispatch(signupAction(this.testForm.value));
  }

  onModalClose() {
    this.showModal.update(() => false);
  }

  private handleSuccessEvent() {
    this.action$.pipe(ofType(signupSuccessAction)).subscribe({
      next: (res) => {
        this.modalDescription = `${res.message} Plase login !` || 'Signup successful!';
        this.showModal.update(() => true);
      },
    });
  }

  private setMode() {
    this.router.navigate(['/auth'], {
      relativeTo: this.activatedRoute,
      queryParams: { mode: this.isLoginMode ? 'login' : 'signup' },
    });
  }

  test() {
    this.http.post(`${BASE_URL}/refresh`, {}, { withCredentials: true }).subscribe();
  }
}
