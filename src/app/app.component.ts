import { Component, OnInit } from '@angular/core';

import {LoadingService} from './theme/loading/app.loading.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    constructor(private loadingService: LoadingService) {

    }
    ngOnInit(): void {
      this.loadingService.present();
    }
}
