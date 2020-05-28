import { Component, OnInit } from '@angular/core';
import { AppAdministratorComponent } from '../../pages/app.administrator.component';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[];

    constructor(public app: AppAdministratorComponent) { }

    ngOnInit() {
        this.model = [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/administrator/dashboard'] },
            {
                label: 'Ventes', icon: 'pi pi-fw pi-star', routerLink: ['/administrator/market'],
                items: [
                    { label: 'Consultation', icon: 'pi pi-fw pi-th-large', routerLink: ['/administrator/market/sales-consult'] },
                    { label: 'Ajout', icon: 'pi pi-fw pi-th-large', routerLink: ['/administrator/market/sale-add'] }
                ]
            }
        ];
    }

    onMenuClick() {
        this.app.menuClick = true;
    }
}
