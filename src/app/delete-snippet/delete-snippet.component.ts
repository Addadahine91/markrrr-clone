import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { SnippetService } from '../services/snippet.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Snippet } from '../models/snippet.interface';

@Component({
  selector: 'app-delete-snippet',
  templateUrl: './delete-snippet.component.html',
  styleUrls: ['./delete-snippet.component.css']
})
export class DeleteSnippetComponent implements OnInit {

  id = '';
  getSub: Subscription;
  deleteSub: Subscription;
  string = '';
  jobTitle = 'title goes here';
  constructor(
    private _snackBar: MatSnackBar,
    public router: Router,
    public route: ActivatedRoute,
    public snippetService: SnippetService,
    private location: Location,
  ) {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    });
  }

  ngOnInit(): void {

    this.getSnippet();
  }

  delete() {
    this.snippetService.delete(this.id);
    this.snippetService.getSnippetDeletedListener()
    .subscribe((result) => {
      if (result) {
        this.openSnackBar('Snippet Deleted', '');
        this.location.back();
      } else {
        this.openSnackBar('Unable to delete snippet, please try again or contact support', '');
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  cancel() {
    this.location.back();
  }
    getSnippet() {
      this.snippetService.getSnippet(this.id);
      this.getSub = this.snippetService.getSnippetListener()
      .subscribe((snippet: Snippet) => {
        if (snippet) {
          this.string = 'Are you sure you want to delete the snippet "' +snippet.content+ '"?';
        } else {
          console.log('unable to fetch snippet');
        }
      });
    }
}
