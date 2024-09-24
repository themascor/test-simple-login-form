import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
export interface StrongPasswordValidatorOptions {
  minLength?: number;
}
export function strongPasswordValidator(
  options?: StrongPasswordValidatorOptions
): ValidatorFn {
  const minLength = options?.minLength || 6;
  function checkLength(pwd: string | null, minLength: number): boolean {
    return pwd === null ? false : pwd.length >= minLength;
  }
  return (control: AbstractControl): ValidationErrors | null => {
    const pwd = control.value;
    const messages: string[] = [];
    !checkLength(pwd, minLength) &&
      messages.push(
        `Password is not long enough (${minLength} characters minimum).`
      );
    return messages.length > 0 ? { StrongPasswordValidator: messages } : null;
  };
}
