import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { StepService } from '../_service/StepService';
@Component({
  selector: 'app-sale',
  templateUrl: './poster.upload.component.html',
  styleUrls: ['./poster.upload.component.scss']
})
export class PosterUploadComponent implements OnInit {

  constructor(private stepService: StepService) {

  }

  ngOnInit() {
    this.stepService.changeStep(1);
  }


}
