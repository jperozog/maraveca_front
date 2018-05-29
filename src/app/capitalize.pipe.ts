import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize2'
})
export class CapitalizePipe2 implements PipeTransform {
  transform(value:any, words:boolean) {

      if (value) {
        if (words) {
          return value.replace(/\b\w/g, first => first.toLocaleUpperCase());
        } else {
          return value.charAt(0).toUpperCase() + value.slice(1);
        }
      }

      return value;
    }
}

@Pipe({name: 'stringToDate'})
export class StringToDatePipe implements PipeTransform {
    /**
     * Constructor
     */
    constructor() {
    }
    /**
     * Transform a date that is passed as string into a date
     * @param value The date passed as string
     * @returns {Date} The Date object
     */
    transform(value: string): Date {
        let reggie = /(\d{4})-(\d{2})-(\d{2})/;
        let dateArray = reggie.exec(value);
        let dateObject = new Date(
            (+dateArray[1]),
            ((+dateArray[2])) - 1, // Careful, month starts at 0!
            (+dateArray[3])
        );
        return dateObject;
    }
}
