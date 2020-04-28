import { Component, OnDestroy } from '@angular/core';
import { LoadingService } from './app.loading.service';
import { Subscription } from 'rxjs';
@Component({
    selector: 'app-laoding',
    templateUrl: './app.loading.component.html'
})
export class AppLodingComponent  {

    subscription: Subscription;
    loadingEl = false;

    constructor(public loadingService: LoadingService) {
        this.subscription = loadingService.loadingHandler.subscribe(response => {
            this.loadingEl = response;
        });
    }
}