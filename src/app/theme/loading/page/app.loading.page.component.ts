import { Component, OnDestroy } from '@angular/core';
import { LoadingPageService } from './app.loading.page.service';
import { Subscription } from 'rxjs';
@Component({
    selector: 'app-page-laoding',
    templateUrl: './app.loading.page.component.html'
})
export class AppLodingPageComponent {

    subscription: Subscription;
    loadingEl = false;

    constructor(public loadingPageService: LoadingPageService) {
        this.subscription = loadingPageService.loadingHandler.subscribe(response => {
            this.loadingEl = response;
        });
    }
}
