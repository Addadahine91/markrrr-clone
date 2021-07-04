import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'idDate'
})
export class IdDatePipe implements PipeTransform {

  transform(objectId: string | string, format: string = 'MMM dd, yyyy'): string {

    let datePipe: any;
    if(objectId.length === 13) {
      //input is a timestamp
      const date = new Date(parseInt(objectId));
      datePipe = new DatePipe('en-UK').transform(date, format);
    } else {
      //input is a mongoDB Object ID
      const timestamp = objectId.toString().substring(0,8)
      const date = new Date( parseInt( timestamp, 16 ) * 1000 )
      datePipe = new DatePipe('en-UK').transform(date, format);
    }

    return datePipe;
  }
}