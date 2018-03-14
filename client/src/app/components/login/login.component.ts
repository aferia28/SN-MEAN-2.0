import { Component, OnInit } from "@angular/core";

import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global'

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  providers: [UserService],
  styleUrls: ['login.component.css']
})

export class LoginComponent implements OnInit{
    public section_title:string;
    public loginForm: FormGroup;
    public isValidFormSubmitted:boolean;
    public loginStatus:object;
    public email_pattern_regex:string;
    public identity:any;
    public token:string;

    constructor( private _router: Router, private _userService: UserService, private _lf: FormBuilder ){
      this.section_title = 'Please, Login'
      this.email_pattern_regex = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
      this.createLoginForm();
    }

    ngOnInit(){
      this.loginStatus = {
        status: null,
        message: null,
        nextUrl: null,
        next: null
      }
    }

    createLoginForm() {
      this.loginForm = this._lf.group({
        email: ['',[ Validators.required, Validators.pattern(this.email_pattern_regex)]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      })
    }

    onSubmit() {
      this.isValidFormSubmitted = false;
      if (this.loginForm.invalid) {
        return;
      }
      this.isValidFormSubmitted = true;

      let email = this.loginForm.get('email').value;
      let password = this.loginForm.get('password').value;

      this._userService.login(email, password).subscribe(
        response => {
          console.log(response)
          this.identity = response.user;
          this.token = response.token;

          if (this.identity) {
            this.loginStatus = {
              status: 'success',
              message: "You are logged in."
            }

            setTimeout(()=>{
              this._router.navigate(['/']);
            }, 1000)
          }
        },
        error => {
          //TODO: manage response when error occurs.
          this.loginStatus = {
            status: 'danger',
            message: error.error.message
          };
          console.log(<any>error.error);
        }
      );
    }
}
