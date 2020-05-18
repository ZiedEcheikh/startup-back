import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../_service';
import { MenuItem } from 'primeng/api/menuitem';

@Component({
    selector: 'app-sale-product-pictures',
    templateUrl: './product.pictures.component.html',
    styleUrls: ['./product.pictures.component.scss']
})

export class ProductPicturesComponent implements OnInit {
    stepsItems: MenuItem[];

    constructor(private menuService: MenuService) {
        this.stepsItems = this.menuService.getItemsNewSaleSteps();
    }

    ngOnInit(): void {
    }
}
