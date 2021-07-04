import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Subscription } from 'rxjs';
import { Letter } from '../models/letter.interface';
import { AuthService } from '../services/auth.service';
import { LetterService } from '../services/letter.service';
import { DatePipe } from '@angular/common';
import { Snippet } from '../models/snippet.interface';
import { SnippetService } from '../services/snippet.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [DatePipe]
})
export class EditComponent implements OnInit {

  company ='';
  title ='';
  link ='';
  body ='';

  snippets: Snippet[] = [];
  editSub: Subscription;
  getSub: Subscription;
  id: string;
  arr = new Array(1);
  placeHolder = "<p>%4<br><br><br>Dear %1,<br><br>It is with enthusiasm that I am applying for the %2 at %1. I've spent [X] years as a [CURRENT TITLE] and I am really excited about [SOMETHING ABOUT COMPANY OR PRODUCT].<br><br>The job description for %2 mentioned you were looking for the following:</p>&#10;<ol>&#10;<li>[REQUIREMENT FROM JOB POSTING REQUIREMENTS SECTION]</li>&#10;<li>[REQUIREMENT FROM JOB POSTING REQUIREMENTS SECTION]</li>&#10;<li>[REQUIREMENT FROM JOB POSTING REQUIREMENTS SECTION]</li>&#10;</ol>&#10;<p>As you can see from my resume, I have:</p>&#10;<ul>&#10;<li>[SHORT BLURB ON HOW YOU MEET REQUIREMENT 1 ABOVE</li>&#10;<li>[SHORT BLURB ON HOW YOU MEET REQUIREMENT 2 ABOVE</li>&#10;<li>[SHORT BLURB ON HOW YOU MEET REQUIREMENT 3 ABOVE</li>&#10;</ul>&#10;<p>I feel that my qualifications are a solid match for the %2 position and would look forward to talking to you about how I can help you hit your [DEPARTMENT NAME] goals.<br><br><br>Sincerely,<br><br>%3</p>";
  replaced = '';

  myDate = new Date();
  dateString = '';

  form = this.fb.group({
    "company": [null, Validators.required],
    "title": [null, Validators.required],
    "body": [null, Validators.required],
    "link": [null],
  });
  
  constructor(
    public snippetService: SnippetService,
    private datePipe: DatePipe,
    public authService: AuthService,
    public letterService: LetterService,
    public route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    public fb: FormBuilder, 
  ) {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    });
   }

  ngOnInit(): void {
    this.getLetter();
    this.getSnippets();
  }

  getSnippets() {
    this.snippetService.getSnippets();
    this.getSub = this.snippetService.getSnippetsListener()
    .subscribe((snippets: Snippet[]) => {
      if (snippets) {
        this.snippets = snippets;
      } else {
        console.log('no letters');
      }
    });
  }

  getLetter() {
    this.letterService.getLetter(this.id);
    this.getSub = this.letterService.getLetterListener()
    .subscribe((letter: Letter) => {
      if (letter) {
        this.company = letter.company;
        this.title = letter.title;
        this.link = letter.link;
        this.body = letter.body;

        this.form.controls['company'].setValue(letter.company);
        this.form.controls['title'].setValue(letter.title);
        this.form.controls['link'].setValue(letter.link);

        if (letter.body) {
          this.form.controls['body'].setValue(letter.body);
        } else {
          this.dateString = this.datePipe.transform(this.myDate, 'MMM dd, yyyy')
          const items = [letter.company, letter.title, this.authService.getAuthData().fName + ' ' + this.authService.getAuthData().lName, this.dateString];
          this.replaced = this.placeHolder.replace(/%(\d+)/g, (_, n) => items[+n-1]);
          this.form.controls['body'].setValue(this.replaced);
        }

      } else {
        console.log('unable to fetch letter');
      }
    });
  }

  save() {

    if (this.form.invalid) {
      console.log('form invalid');
      return
    }

    this.letterService.editLetter(this.form.value.company, this.form.value.title, this.form.value.body, this.id, this.form.value.link);
    this.letterService.getLetterEditedListener()
    .subscribe((result) => {
      if (result) {
        console.log('letter edited');
        this.router.navigate(['preview'], {
          queryParams: {
            id: this.id
          }
        });
      } else {
        console.log('unable to edit letter');
      }
    })
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '600px',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
    ]
};

  editSnippet(id: string) {
    this.router.navigate(['/edit-snippet'], {
      queryParams: {
        id: id
      }
    })
  }

  deleteSnippet(id: string) {
    this.router.navigate(['/delete-snippet'], {
      queryParams: {
        id: id
      }
    })
  }

  copy(text: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = text;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.openSnackBar('Text Copied!','');
  }
}
