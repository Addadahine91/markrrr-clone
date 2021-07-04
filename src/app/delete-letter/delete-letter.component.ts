import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router';
import { LetterService } from '../services/letter.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Letter } from '../models/letter.interface';

@Component({
  selector: 'app-delete-letter',
  templateUrl: './delete-letter.component.html',
  styleUrls: ['./delete-letter.component.css']
})
export class DeleteLetterComponent implements OnInit {

  getSub: Subscription;
  id: string;
  string = '';
  jobTitle = 'title goes here';
  deleteSub: Subscription;
  constructor(
    private _snackBar: MatSnackBar,
    public route: ActivatedRoute,
    public letterService: LetterService,
    private router: Router,
    private location: Location,
  ) {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    });
   }

  ngOnInit(): void {
    this.getLetter();
  }

  delete() {
    this.letterService.deleteLetter(this.id);
    this.letterService.getLetterDeletedListener()
    .subscribe((result) => {
      if (result) {
        this.openSnackBar('Letter Deleted', '');
        this.router.navigate(['/']);
      } else {
        this.openSnackBar('Unable to delete letter, please try again or contact support', '');
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

  getLetter() {
    this.letterService.getLetter(this.id);
    this.getSub = this.letterService.getLetterListener()
    .subscribe((letter: Letter) => {
      if (letter) {
        this.string = 'Are you sure you want to delete the cover letter "' +letter.title+ '"?';
      } else {
        console.log('unable to fetch letter');
      }
    });
  }
}
