import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Subscription } from 'rxjs';
import { Letter } from '../models/letter.interface';
import { AuthService } from '../services/auth.service';
import { LetterService } from '../services/letter.service';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css'],
  providers: [DatePipe]
})
export class PreviewComponent implements OnInit {

  loaded = false;
  lastModified = '';
  company ='';
  title ='';
  link ='';
  body ='';
  
  id = '';
  placeHolder = "<p>%4<br><br><br>Dear %1,<br><br>It is with enthusiasm that I am applying for the %2 at %1. I've spent [X] years as a [CURRENT TITLE] and I am really excited about [SOMETHING ABOUT COMPANY OR PRODUCT].<br><br>The job description for %2 mentioned you were looking for the following:</p>&#10;<ol>&#10;<li>[REQUIREMENT FROM JOB POSTING REQUIREMENTS SECTION]</li>&#10;<li>[REQUIREMENT FROM JOB POSTING REQUIREMENTS SECTION]</li>&#10;<li>[REQUIREMENT FROM JOB POSTING REQUIREMENTS SECTION]</li>&#10;</ol>&#10;<p>As you can see from my resume, I have:</p>&#10;<ul>&#10;<li>[SHORT BLURB ON HOW YOU MEET REQUIREMENT 1 ABOVE</li>&#10;<li>[SHORT BLURB ON HOW YOU MEET REQUIREMENT 2 ABOVE</li>&#10;<li>[SHORT BLURB ON HOW YOU MEET REQUIREMENT 3 ABOVE</li>&#10;</ul>&#10;<p>I feel that my qualifications are a solid match for the %2 position and would look forward to talking to you about how I can help you hit your [DEPARTMENT NAME] goals.<br><br><br>Sincerely,<br><br>%3</p>";
  // line1 = "Dear Apperfect";
  // line2 = "It is with enthusiasm that I am applying for the Director, Production Finance Lead Disney+ EMEA role at Apperfect. I've spent [X] years as a [CURRENT TITLE] and I am really excited about [SOMETHING ABOUT COMPANY OR PRODUCT].";
  // line3 = "The job description for Director, Production Finance Lead Disney+ EMEA mentioned you were looking for the following:";
  // line5 = "As you can see from my resume, I have:";
  // line7 = "I feel that my qualifications are a solid match for the Director, Production Finance Lead Disney+ EMEA position and would look forward to talking to you about how I can help you hit your [DEPARTMENT NAME] goals.";
  // line8 = "Sincerely,";
  // line9 = "Sam Addadahine";

  // replaced = '';

  replaced = '';
  myDate = new Date();
  dateString = '';

  line2New = '';
  getSub: Subscription;

  @ViewChild('export', { static: true }) couponPage: ElementRef;

  
  constructor(public authService: AuthService, private datePipe: DatePipe,public letterService: LetterService, public router: Router, public route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    });
   }

  ngOnInit(): void {
    //this.line2New = this.line2.replace('[CURRENT TITLE]','Finance Analyst');
    this.getLetter();
  }

//   public testFunction(){
//     return `${this.line1}
//             ${this.line2}
//             ${this.line3}`;
// }

getLetter() {
  this.letterService.getLetter(this.id);
  this.getSub = this.letterService.getLetterListener()
  .subscribe((letter: Letter) => {
    this.getSub.unsubscribe();
    this.loaded = true;
    if (letter) {
      this.company = letter.company;
      this.title = letter.title;
      this.link = letter.link;
      this.lastModified = letter.lastModified;
      this.loaded = true;

      if (letter.body) {
        this.body = letter.body
      } else {
        this.dateString = this.datePipe.transform(this.myDate, 'MMM dd, yyyy')
        const items = [letter.company, letter.title, this.authService.getAuthData().fName + ' ' + this.authService.getAuthData().lName, this.dateString];
        this.replaced = this.placeHolder.replace(/%(\d+)/g, (_, n) => items[+n-1]);
        this.body = this.replaced;
      }

      // this.replaced = letter.body;
    } else {
      console.log('unable to fetch letter');
    }
  });
}

generatePdf(){

window.print();

  // const raw = this.body.replace(/<[^>]*>/g, '');
  // //console.log(this.body.replace(/<[^>]*>/g, ''));

  // console.log(this.body);
  // const documentDefinition = { content: [raw]};
  // pdfMake.createPdf(documentDefinition).download();
 }

public captureScreen()  
  {  
    var data = document.getElementById('export'); // You can pass the id here for your signature
    html2canvas(data).then(canvas => {      
      var imgWidth = 200;
      var pageHeight = 100;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 10;
      pdf.addImage(contentDataURL, 'PNG', 3, position, imgWidth, imgHeight);
      pdf.save(this.authService.getAuthData().fName + ' '+this.authService.getAuthData().lName+'.pdf'); // Generated PDF
    });  
  }  

edit() {
  this.router.navigate(['/edit'], {
    queryParams: {
      id: this.id
    }
  });
}
delete(id: string) {
  this.router.navigate(['/delete-letter'], {
    queryParams: {
      id: this.id
    }
  });
}
}
