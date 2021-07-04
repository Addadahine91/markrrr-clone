import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { Snippet } from "../models/snippet.interface";
import { environment } from "../../environments/environment";
import { map } from "rxjs/operators";

const BACKEND_URL = environment.apiUrl + "/snippet/";

@Injectable({ providedIn: "root" })
export class SnippetService {
  
  private snippets: Snippet[] = [];
  private snippet: Snippet;

  private snippetFetched = new Subject<Snippet>();
  private snippetsFetched = new Subject<Snippet[]>();

  private snippetCreatedListener = new Subject<string>();
  private snippetEditedListener = new Subject<boolean>();
  private snippetDeletedListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  //Create letter listener
  getSnippetCreatedListener() {
    return this.snippetCreatedListener.asObservable();
  }

  //Edit letter listener
  getSnippetEditedListener() {
    return this.snippetEditedListener.asObservable();
  }

  //Get letter listener
  getSnippetListener() {
    return this.snippetFetched.asObservable();
  }

  //Get letters listener
  getSnippetsListener() {
    return this.snippetsFetched.asObservable();
  }

  //Delete letter listener
  getSnippetDeletedListener() {
    return this.snippetDeletedListener.asObservable();
  }

  createSnippet(content: string) {
      console.log(content);
    const sendData = {
        'content' : content,
    };
    this.http
      .post<{ id: string }>( BACKEND_URL, sendData )
      .subscribe(responseData => {
        this.snippetCreatedListener.next(responseData.id);
      }, error => {
        this.snippetCreatedListener.next('');
    });
  }

  editSnippet(content: string, id: string) {
    const sendData = {
        'content' : content,
        'id' : id
    };
    this.http
      .post(BACKEND_URL + 'edit-snippet', sendData)
      .subscribe(responseData => {
        this.snippetEditedListener.next(true);
      }, error => {
        this.snippetEditedListener.next(false);
    });
  }

  getSnippet(id: string) {
    return this.http.get<{
      _id: string;
      content: string;
    }>(BACKEND_URL + id)
      .subscribe((snippet) => {
         this.snippet = snippet;
         this.snippetFetched.next(snippet);
    }, error => {
      this.router.navigate(['/404/']);
    });
  }

  delete(id: string) {
    return this.http.delete(BACKEND_URL + id)
      .subscribe((card) => {
        this.snippetDeletedListener.next(true);
    }, error => {
        this.snippetDeletedListener.next(false);
    });
  }

  getSnippets() {
    this.http
      .get<{ snippets: any;}>(
        BACKEND_URL
      )
      .pipe(
        map(snippetData => {
          return {
             snippets: snippetData.snippets.map(snippet => {
              return {
                _id: snippet._id,
                content: snippet.content,
              };
            }),
          };
        })
      )
      .subscribe(transformedPostData => {
        this.snippets = transformedPostData.snippets;
        this.snippetsFetched.next(this.snippets);
      }, error => {
        console.log('unable to fetch letters');
    });
}

}