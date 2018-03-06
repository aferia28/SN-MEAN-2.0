import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

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

    constructor( private _route: ActivatedRoute, private _router: Router, private _userService: UserService, private _uf: FormBuilder ){
      this.section_title = 'Register'
      this.email_pattern_regex = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

      this.createRegisterForm();
    }

    ngOnInit() {
      console.log('Component register loaded')
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
          console.log(response)
          this.registerForm.reset();
        },
        error => {
          console.log(<any>error)
        }
      );
    }
}
