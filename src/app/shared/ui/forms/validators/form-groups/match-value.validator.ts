import {
  ValidatorFn,
  FormGroup,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
interface MatchValueValidatorOptions {
  targetControlName: string;
  etalonControlName: string;
  message?: string;
}
export function matchValueValidator(
  options: MatchValueValidatorOptions
): ValidatorFn {
  const { etalonControlName, targetControlName } = options;
  const message = options.message || 'Passwords do not match.';
  return (form: AbstractControl): ValidationErrors | null => {
    const errorId = 'matchValueValidator';
    const target: string = form.get(targetControlName)?.value;
    const etalon: string = form.get(etalonControlName)?.value;
    const error = target === etalon ? null : { [errorId]: [message] };
    const targetControl = form.get(targetControlName);
    if (error) {
     const targetErrors = targetControl?.errors || {};
      targetControl?.setErrors({...targetErrors, ...error})
    } else {
    const targetErrors = targetControl?.errors;
     if (targetErrors) {
        delete targetErrors[errorId];
        targetControl?.setErrors({...targetErrors})
     }
    }
        return null
  };
}
