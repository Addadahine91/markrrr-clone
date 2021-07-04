import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Letter } from '../models/letter.interface';
import { LetterService } from '../services/letter.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  letters: Letter[] = [];
  arr = new Array(20);
  getSub: Subscription;
  constructor(public router: Router, public letterService: LetterService) { }

  ngOnInit(): void {
    this.fetchLetters();
  }

  fetchLetters() {
    this.letterService.getLetters();
    this.getSub = this.letterService.getLettersListener()
    .subscribe((letters: Letter[]) => {
      this.getSub.unsubscribe();
      if (letters) {
        this.letters = letters;
      } else {
        console.log('no letters');
      }
    });
  }

  edit(id: string) {
    this.router.navigate(['/edit'], {
      queryParams: {
        id: id
      }
    });
  }

  preview(id: string) {
    this.router.navigate(['/preview'], {
      queryParams: {
        id: id
      }
    });
  }

  delete(id: string) {
    this.router.navigate(['/delete-letter'], {
      queryParams: {
        id: id
      }
    });
  }
  
}
