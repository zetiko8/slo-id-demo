import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'tabs-header',
  template: `
    <div role="tablist">
      <div
        *ngFor="let tab of tabs"
        role="tab"
        (click)="tabSelected.emit(tab.id)"
        [class.active]="selectedTab === tab.id"
        [attr.data-test]="'tab-' + tab.id"
      >
        <i
          *ngIf="tab.icon"
          [ngClass]="tab.icon"
        ></i>
        <h5>
          {{ tab.label }}
        </h5>
      </div>
    </div>
  `,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  //   host: { class: 'avatar' },
  styles: [':host { display: block; }'],
})
export class TabsHeaderComponent {
  @Input() tabs: {
    id: string;
    label: string;
    icon?: string;
  }[] = [];
  @Input() selectedTab = '';
  @Output() tabSelected = new EventEmitter<string>();
}
