import { ValidationService } from './../../../core/services/validation.service';
import { AuthService } from './../../../core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SignInModel } from './../../../core/models/auth/sign-in.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  private returnUrl: string;
  public form: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private validationService: ValidationService,
  ) { 
    this.form = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [ Validators.required]],
    });
  }

  public ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  public submit(): void {
    if (this.form.valid) {
      const signIn = SignInModel.adapt(this.form.value);
      this.authService.signIn(signIn).subscribe(_ => {
        localStorage.setItem('token', _.token);
        this.router.navigateByUrl('/');
      });
    } else {
      this.validationService.validateAllFormFields(this.form);
    }
  }
}
