import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { getMockPerson, MockPerson } from '@zetiko8/slo-id';
import { Subject, startWith, takeUntil } from 'rxjs';
import { CheckboxGroupComponent } from '../../../components/checkbox-group/checkbox-group.component';
import { TabsHeaderComponent } from '../../../components/tabs-header.component';
import { SSRContextService } from '../../../service/ssr-context.service';

const opts = {
  name: true,
  firstName: false,
  surname: false,
  isoBirthDate: false,
  birthDate: true,
  age: true,
  email: true,
  mobileNumber: true,
  gender: true,
  address: true,
  street: false,
  city: false,
  zipCode: false,
  iban: true,
  vat: true,
};

const CACHE_KEY = '@zetiko/slo-id-opts';

@Component({
  standalone: true,
  selector: 'demo-table',
  templateUrl: './demo-table.component.html',
  styleUrls: ['./demo-table.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CheckboxGroupComponent,
    TabsHeaderComponent,
  ],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DemoTableComponent implements OnDestroy {

  private readonly destroy$ = new Subject<void>();

  public readonly ssrContextService = inject(SSRContextService);

  public persons: MockPerson[] = [];

  public generatePerson() {
    this.persons = [...this.persons, getMockPerson()];
  }

  public downloadJson () {
    JSONToCSVConvertor(this.persons, 'slo-id', true);
  }

  public downloadCsv () {
    JSONToCSVConvertor(this.persons, 'slo-id', true);
  }

  public columns = new FormControl(opts);

  public options = Object.keys(opts)
    .map(o => ({ label: o, value: o }));

  public tab = 'table';

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
        .pipe(
          startWith(this.columns.value),
          takeUntil(this.destroy$),
        )
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

function JSONToCSVConvertor (
  JSONData: string | object,
  ReportTitle: string,
  ShowLabel: boolean,
) {

  //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
  const arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
  let CSV = '';
  //This condition will generate the Label/Header
  if (ShowLabel) {
    let row = '';

    //This loop will extract the label from 1st index of on array
    for (const index in arrData[0]) {
      //Now convert each value to string and comma-seprated
      row += index + ',';
    }
    row = row.slice(0, -1);
    //append Label row with line break
    CSV += row + '\r\n';
  }

  //1st loop is to extract each row
  for (let i = 0; i < arrData.length; i++) {
    let row = '';
    //2nd loop will extract each column and convert it in string comma-seprated
    for (const index in arrData[i]) {
      row += '"' + arrData[i][index] + '",';
    }
    row.slice(0, row.length - 1);
    //add a line break after each row
    CSV += row + '\r\n';
  }

  if (CSV == '') {
    alert('Invalid data');
    return;
  }

  //this trick will generate a temp "a" tag
  const link = document.createElement('a');
  link.id = 'lnkDwnldLnk';

  //this part will append the anchor tag and remove it after automatic click
  document.body.appendChild(link);

  const csv = CSV;
  const blob = new Blob([csv], { type: 'text/csv' });
  const csvUrl = window.webkitURL.createObjectURL(blob);
  const filename =  (ReportTitle || 'UserExport') + '.csv';
  const $el = document.getElementById(link.id);
  if ($el) {
    $el.setAttribute('href', csvUrl);
    $el.setAttribute('download', filename);
    $el.click();
  }

  document.body.removeChild(link);
}