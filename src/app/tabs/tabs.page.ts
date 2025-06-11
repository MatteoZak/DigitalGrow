import { Component, EnvironmentInjector, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonTabs, IonTabBar, IonTabButton, IonFabButton, IonFab } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonFab, IonFabButton, IonTabs, IonTabBar, IonTabButton],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);
  private _router = inject(Router);

  constructor() {
  }

  goToTab3() {
    this._router.navigate(['/tabs/tab3']);
  }
}
