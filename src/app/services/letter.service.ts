import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { Letter } from "../models/letter.interface";
import { environment } from "../../environments/environment";
import { map } from "rxjs/operators";

const BACKEND_URL = environment.apiUrl + "/letter/";

@Injectable({ providedIn: "root" })
export class LetterService {
  
  private letters: Letter[] = [];
  private letter: Letter;

  private letterFetched = new Subject<Letter>();
  private lettersFetched = new Subject<Letter[]>();

  private letterCreatedListener = new Subject<string>();
  private letterEditedListener = new Subject<boolean>();
  private letterDeletedListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  //Create letter listener
  getLetterUploadedListener() {
    return this.letterCreatedListener.asObservable();
  }

  //Edit letter listener
  getLetterEditedListener() {
    return this.letterEditedListener.asObservable();
  }

  //Get letter listener
  getLetterListener() {
    return this.letterFetched.asObservable();
  }

  //Get letters listener
  getLettersListener() {
    return this.lettersFetched.asObservable();
  }

  //Delete letter listener
  getLetterDeletedListener() {
    return this.letterDeletedListener.asObservable();
  }

  createLetter(company: string, title: string, link: string ) {
      console.log(company);
    const sendData = {
        'company' : company,
        'title' : title,
        'link' : link,
    };
    this.http
      .post<{ id: string }>( BACKEND_URL + 'create-letter', sendData )
      .subscribe(responseData => {
        this.letterCreatedListener.next(responseData.id);
      }, error => {
        this.letterCreatedListener.next('');
    });
  }

  editLetter(company: string, title: string, body: string, id: string, link: string) {
    const sendData = {
        'company' : company,
        'title' : title,
        'body': body,
        'id' : id,
        'link' : link
    };
    this.http
      .post(BACKEND_URL + 'edit-letter', sendData)
      .subscribe(responseData => {
        this.letterEditedListener.next(true);
      }, error => {
        this.letterEditedListener.next(false);
    });
  }

  getLetter(id: string) {
    return this.http.get<{
      _id: string;
      company: string;
      title: string;
      link: string;
      body: string;
      lastModified: string;
    }>(BACKEND_URL + id)
      .subscribe((letter) => {
         this.letter = letter;
         this.letterFetched.next(letter);
    }, error => {
      this.router.navigate(['/']);
    });
  }

  deleteLetter(id: string) {
    return this.http.delete(BACKEND_URL + id)
      .subscribe((card) => {
        this.letterDeletedListener.next(true);
    }, error => {
        this.letterDeletedListener.next(false);
    });
  }

  getLetters() {
    this.http
      .get<{ letters: any;}>(
        BACKEND_URL
      )
      .pipe(
        map(letterData => {
          return {
             letters: letterData.letters.map(letter => {
              return {
                _id: letter._id,
                company: letter.company,
                title: letter.title,
                link: letter.link,
                lastModified: letter.lastModified
              };
            }),
          };
        })
      )
      .subscribe(transformedPostData => {
        this.letters = transformedPostData.letters;
        this.lettersFetched.next(this.letters);
      }, error => {
        console.log('unable to fetch letters');
    });
}

}