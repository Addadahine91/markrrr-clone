import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Letter } from '../models/letter.interface';
import { LetterService } from '../services/letter.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  createSub: Subscription;
  form = this.fb.group({
    "company": [null, Validators.required],
    "title": [null, Validators.required],
    "link": [null]
  });
  
  constructor(
    public router: Router,
    public ls: LetterService,
    public fb: FormBuilder, 
  ) { }

  ngOnInit(): void {
  }

  create() {
    if (this.form.invalid) {
      console.log('invalid form');
      return;
    }

    this.ls.createLetter(this.form.value.company,this.form.value.title,this.form.value.link);
    this.createSub = this.ls.getLetterUploadedListener()
    .subscribe((id: string) => {
      if (id !== '') {
        console.log('letter created with id: '+id);
        this.router.navigate(['/edit'], {
          queryParams: {
            'id' : id
          }
        });
      } else {
        console.log('letter not created');
      }
    });
  }
}
