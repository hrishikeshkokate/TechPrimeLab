import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,HttpClientModule,RouterOutlet,RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  isUpdatebtn: boolean = false;
  queryValue: string | null = null;
  public passwordType: string = 'password';
  isInvalidCredentials:boolean=false;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.route.paramMap.subscribe((x) => {
      this.queryValue = x.get('email');
    });

    if (this.queryValue !== "" && this.queryValue !== null) {
      alert(this.queryValue)
    }

    this.isUpdatebtn = false;
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  loginUser() {
    const credentials = this.loginForm.value;
    this.loginService.login(credentials).subscribe(
      matchingUser => {
        if (matchingUser) {
          // Authentication successful, navigate to the desired route
          this.router.navigate(['/create-project']);
        } else {
          // Authentication failed, display an error message
          //alert('Invalid credentials. Please try again.');
          this.isInvalidCredentials = true;
        }
      },
      error => {
        console.error(error);  // Log any errors to the console
        //alert('An error occurred. Please try again.');
        this.isInvalidCredentials = true;
      }
    );
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  isPasswordVisible() {
    return this.showPassword ? 'text' : 'password';
  }
  
}
