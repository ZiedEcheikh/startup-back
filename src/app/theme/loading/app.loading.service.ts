import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class LoadingService {

    private loadingSource = new Subject<boolean>();

    loadingHandler = this.loadingSource.asObservable();

    dismiss() {
        this.loadingSource.next(false);
    }

    present() {
        this.loadingSource.next(true);
    }
}