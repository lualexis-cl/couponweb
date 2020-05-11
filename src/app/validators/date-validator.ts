import { FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
@Injectable()
export class DateValidator {

  constructor() {
  }

  static date(control: FormControl) {
    const dateValue = control.value as string;
    const dateMoment = moment(dateValue, ['YYYY-MM-DD', 'YYYY/MM/DD']);

    // Because it's already validated with required
    if (dateValue === '') {
      return null;
    }

    if (!dateMoment.isValid()) {
      return { date: true };
    }

    return null;
  }

  static dateMin(control: FormControl) {
    const dateValue = control.value as string;
    const dateMoment = moment(dateValue, ['YYYY-MM-DD', 'YYYY/MM/DD']);
    const momentToDay = moment();
    const now = moment(momentToDay.format('YYYY-MM-DD'), 'YYYY-MM-DD');

    if (dateMoment < now) {
      return { dateMin: true };
    }

    return null;
  }

  static dateMax(control: FormControl) {
    const dateValue = control.value as string;
    const dateMoment = moment(dateValue, ['YYYY-MM-DD', 'YYYY/MM/DD']);
    const momentPlusYear = moment();
    momentPlusYear.add(1, 'y');

    if (dateMoment > momentPlusYear) {
      return { dateMax: true };
    }

    return null;
  }
}
