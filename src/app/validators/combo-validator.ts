import { FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable()
export class ComboValidator {
  constructor() {}

  static requiredSelected(control: FormControl) {
    const comboValue = control.value as string;

    if (comboValue === '0') {
      return { requiredSelected: true };
    }

    return null;
  }
}
