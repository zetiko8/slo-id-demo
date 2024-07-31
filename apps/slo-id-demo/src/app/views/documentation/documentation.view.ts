import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { getMockPerson, MockPerson } from '@zetiko8/slo-id';
import { CheckboxGroupComponent } from '../../components/checkbox-group/checkbox-group.component';
import { Subject, startWith } from 'rxjs';
import { SSRContextService } from '../../service/ssr-context.service';

const opts = {
  name: true,
  birthDate: true,
  age: true,
  email: true,
  mobileNumber: true,
  gender: true,
  address: true,
  iban: true,
  vat: true,
};

const CACHE_KEY = '@zetiko/slo-id-opts';

@Component({
  standalone: true,
  selector: 'documentation-view',
  templateUrl: './documentation.view.html',
  styleUrls: ['./documentation.view.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CheckboxGroupComponent,
  ],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DocumentationView implements OnDestroy {

  private readonly destroy$ = new Subject<void>();

  public readonly ssrContextService = inject(SSRContextService);

  public persons: MockPerson[] = [];

  public generatePerson() {
    this.persons = [...this.persons, getMockPerson()];
  }

  public columns = new FormControl(opts);

  public options = Object.keys(opts)
    .map(o => ({ label: o, value: o }));

  constructor () {
    if (this.ssrContextService.isClientSide) {
      try {
        const cachedOpts = localStorage.getItem(CACHE_KEY);
        if (cachedOpts) {
          this.columns.setValue(JSON.parse(cachedOpts));
        }
      } catch (error) {
        //
      }

      this.columns.valueChanges
        .pipe(startWith(this.columns.value))
        .subscribe(value => {
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(value));
          } catch (error) {
            //
          }
        });

      this.generatePerson();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
