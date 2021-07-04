import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { FormBuilder, Validators } from '@angular/forms';
import { SnippetService } from '../services/snippet.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Snippet } from '../models/snippet.interface';

@Component({
  selector: 'app-create-snippet',
  templateUrl: './create-snippet.component.html',
  styleUrls: ['./create-snippet.component.css']
})
export class CreateSnippetComponent implements OnInit {

  content = '';
  id = '';
  form = this.fb.group({
    "content": [null, Validators.required]
  });
  createSub: Subscription;
  editSub: Subscription;
  getSub: Subscription;

  constructor(
    public route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    public snippetService: SnippetService,
    public fb: FormBuilder, 
    private location: Location,
  ) {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    });
   }

  ngOnInit(): void {
    this.getSnippet();
  }

  save() {

    if (this.form.invalid) {
      console.log('form invalid');
      return
    }

    if (this.id !== undefined) {
      //edit
      console.log(this.id);
      this.editSnippet();
    } else {
      console.log('create');
      this.createSnippet();
    }
  }

  createSnippet() {
    console.log(this.form.value.content);
    this.snippetService.createSnippet(this.form.value.content);
    this.createSub = this.snippetService.getSnippetCreatedListener()
    .subscribe((id: string) => {
      this.createSub.unsubscribe();
      if (id !== '') {
        this.location.back();
        this.openSnackBar('Snippet Created', '');
        
      } else {
        this.openSnackBar('Unable to create snippet', '');
      }
    });
  }

  getSnippet() {
    this.snippetService.getSnippet(this.id);
    this.getSub = this.snippetService.getSnippetListener()
    .subscribe((snippet: Snippet) => {
      this.getSub.unsubscribe();
      if (snippet) {
        this.content = snippet.content;
        this.form.controls['content'].setValue(snippet.content);
      } else {
        console.log('unable to fetch snippet');
      }
    });
  }

  editSnippet() {
    this.snippetService.editSnippet(this.form.value.content, this.id);
    this.editSub = this.snippetService.getSnippetEditedListener()
    .subscribe((result) => {
      this.editSub.unsubscribe();
      if (result) {
        this.openSnackBar('Snippet Updated', '');
        this.location.back();
      } else {
        this.openSnackBar('Unable to update snippet', '');
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
