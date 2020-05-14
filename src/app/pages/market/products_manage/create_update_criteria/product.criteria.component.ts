import { Component, OnInit } from '@angular/core';
import { SaleService, SaleProductService, SaleDetailsService, MenuService } from '../../_service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingPageService } from 'src/app/theme';
import { MenuItem } from 'primeng/api/menuitem';

@Component({
    selector: 'app-sale-product-criteria',
    templateUrl: './product.criteria.component.html',
    styleUrls: ['./product.criteria.component.scss']
})

export class ProductCriteriaComponent implements OnInit {

    stepsItems: MenuItem[];
    
    constructor(private saleService: SaleService, private saleDetailsService: SaleDetailsService,
        private saleProductService: SaleProductService, private menuService: MenuService,
        private route: ActivatedRoute, private router: Router, private loadingPageService: LoadingPageService) {
        this.stepsItems = this.menuService.getItemsNewSaleSteps();
    }
    
    ngOnInit(): void {
    }
}
