import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { User } from '../../models/user';

import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global'

@Component({
  selector: 'register',
  templateUrl: 'register.component.html',
  providers: [UserService],
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit{
    public section_title:string;
    public email_pattern_regex:string;
    public registerForm: FormGroup;
    public isValidFormSubmitted:boolean;
    public registerStatus:object;

    constructor( private _route: ActivatedRoute, private _router: Router, private _userService: UserService, private _uf: FormBuilder ){
      this.section_title = 'Register'
      this.email_pattern_regex = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

      this.createRegisterForm();
    }

    ngOnInit() {
      this.registerStatus = {
        status: null,
        message: null,
        nextUrl: null,
        next: null
      }
    }

    createRegisterForm() {
      this.registerForm = this._uf.group({
        name: ['', Validators.required],
        surname: [''],
        email: ['',[ Validators.required, Validators.pattern(this.email_pattern_regex)]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      })
    }

    onSubmit() {
      this.isValidFormSubmitted = false;
      if (this.registerForm.invalid) {
        return;
      }
      this.isValidFormSubmitted = true;

      let user: User = this.registerForm.value;
      this._userService.register(user).subscribe(
        response => {
          if (response.user && response.user._id) {
            this.registerStatus = {
              status: 'success',
              message: response.message,
              nextUrl: GLOBAL.login_path,
              next: "Login here."
            };
          }

          this.resetFormStatus()
          this.registerForm.reset();
        },
        error => {
          //TODO: manage response when error occurs.
          this.registerStatus = {
            status: 'danger',
            message: error.error.message
          };
          console.log(<any>error.error);
        }
      );
    }

    resetFormStatus() {
      setTimeout(() => {
        this.registerStatus = {
          status: null,
          message: null
        }
      }, 5000)
    }
}
