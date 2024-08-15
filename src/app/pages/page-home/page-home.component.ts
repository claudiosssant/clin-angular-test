import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RoutesEnum } from 'src/app/enums/routes.enum';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-page-home',
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.scss']
})
export class PageHomeComponent {

  constructor(
    private route: Router, 
    private authService: AuthService,
    private toastService: ToastService,
  ){}

  form: FormGroup = new FormGroup({
    identifier: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  login() {
    const { identifier: cpf, password } = this.form.value;
  
    this.authService.login(cpf, password)
    .subscribe({
      next: (value: any) => {
        this.authService.setToken(value.accessToken);
        this.route.navigate([RoutesEnum.SESSION_LIST]);
      },
      error: (err: any) => {
        this.toastService.showError(err?.error?.message);
      },
    });
  }

}
