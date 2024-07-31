import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { SSRContextService } from '../../service/ssr-context.service';
import { TabsHeaderComponent } from '../../components/tabs-header.component';
import { DemoTableComponent } from './demo-table/demo-table.component';

@Component({
  standalone: true,
  selector: 'home-view',
  templateUrl: './home.view.html',
  styleUrls: ['./home.view.scss'],
  imports: [
    CommonModule,
    TabsHeaderComponent,
    DemoTableComponent,
  ],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class HomeView implements OnDestroy {

  private readonly destroy$ = new Subject<void>();

  public readonly ssrContextService = inject(SSRContextService);

  public tab = 'table';

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}