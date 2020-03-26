import { Component, OnInit } from '@angular/core';
import { AppAdministratorComponent } from '../../pages/app.administrator.component';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[];

    constructor(public app: AppAdministratorComponent) {}

    ngOnInit() {
        this.model = [
            {label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/administrator/dashboard']}
        ];
    }

    onMenuClick() {
        this.app.menuClick = true;
    }
}
