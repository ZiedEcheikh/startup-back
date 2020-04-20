import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class StepService {

    private stepSource = new Subject<number>();

    stepHandler = this.stepSource.asObservable();

    changeStep(key: number) {
        this.stepSource.next(key);
    }
}
