import {
  AsyncPipe,
  CommonModule,
  NgIf,
  NgTemplateOutlet,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ValidationMessagesPipe } from '../../../shared/ui/forms/pipes/validation-messages.pipe';
import { strongPasswordValidator } from '../../../shared/ui/forms/validators/controls/strong-password.validator';
import { matchValueValidator } from '../../../shared/ui/forms/validators/form-groups/match-value.validator';
import {
  BehaviorSubject,
  combineLatest,
  delay,
  map,
  merge,
  Observable,
  Subject,
  tap,
} from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    NgIf,
    NgTemplateOutlet,
    MatCardModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    ValidationMessagesPipe,
  ],
  templateUrl: 'signup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  public commonError: WritableSignal<string> = signal<string>('');
  public readonly fg = new FormGroup(
    {
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        strongPasswordValidator({ minLength: 6 }),
      ]),
      repeatPassword: new FormControl(null, [Validators.required]),
    },
    [
      matchValueValidator({
        targetControlName: 'repeatPassword',
        etalonControlName: 'password',
      }),
    ]
  );

  //! I would not use this approach in real world but its required by the task

  // The form should be done as a one, big Rx stream. Like fromEvent , combine
  // events from a few inputs, and then combine them into a new stream, which
  // will go further if all conditions passed, and in the end we should add side
  // effect that will enable signup button.

  private readonly _interaction$ = new Subject<void>();
  private readonly _isFormTouched$ = new BehaviorSubject<boolean>(false);
  private readonly _isFormValid$ = new BehaviorSubject<boolean>(false);
  private readonly _isFormEmpty$ = new BehaviorSubject<boolean>(true);
  private readonly _reset$ = new Subject<void>();

  public readonly formChanges$ = merge(
    this.fg.valueChanges,
    this._reset$,
    this._interaction$
  ).pipe(
    tap((_) => this._isFormEmpty$.next(this.isFormEmpty())),
    tap((_) => this._isFormValid$.next(this.fg.valid)),
    tap((_) => this._isFormTouched$.next(this.fg.touched)),
    takeUntilDestroyed()
  );

  public cantSignup = toSignal(
    combineLatest([this._isFormTouched$, this._isFormValid$]).pipe(
      map(([touched, valid]) => !touched || !valid)
    )
  );
  public cantReset = toSignal(this._isFormEmpty$);
  constructor() {
    this.formChanges$.pipe(takeUntilDestroyed()).subscribe();
  }

  signup(): void {
    this.commonError.set('');
    try {
      this.sendToServer();
    } catch (error) {
      this.commonError.set((error as Error).message);
    }
  }

  reset(): void {
    this.fg.reset();
    this.commonError.set('');
    this._reset$.next();
  }
  regInteraction(): void {
    this._interaction$.next();
  }
  private isFormEmpty(): boolean {
    return !Object.values(this.fg.value).some((value) => value !== null);
  }

  private sendToServer(): void {
    throw new Error('Server error');
  }
}
