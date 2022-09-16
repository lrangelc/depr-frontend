import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
  name: 'formErrorHandler'
})
export class FormErrorHandlerPipe implements PipeTransform {

  /**
   * Validate the formControl error generated and
   * return the translation code for the message
   * @param value FormControl for the evaluation
   * @returns Translation key for error<String>
   */
  transform(value: AbstractControl): any {
    let errorCode = '';
    if (value.hasError('required')) {
      errorCode = 'error.form.required';
    } else if (value.hasError('email')) {
      errorCode = 'error.form.email';
    } else if (value.hasError('minlength')) {
      errorCode = 'error.form.minlength';
    }
    return errorCode;
  }

}
