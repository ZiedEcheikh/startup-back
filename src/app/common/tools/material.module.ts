import { NgModule } from '@angular/core';

// PrimeNG Components for demos
import { TabViewModule } from 'primeng/tabview';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { CheckboxModule } from 'primeng/checkbox';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { FileUploadModule } from 'primeng/fileupload';
import { StepsModule } from 'primeng/steps';
import { TreeModule } from 'primeng/tree';
import { DialogModule } from 'primeng/dialog';
import {SelectButtonModule} from 'primeng/selectbutton';

const PRIME_THEME_COMPONENTS = [
  TabViewModule,
  CalendarModule,
  InputTextModule,
  DropdownModule,
  InputTextareaModule,
  ToggleButtonModule,
  CheckboxModule,
  BreadcrumbModule,
  FileUploadModule,
  StepsModule,
  TreeModule,
  DialogModule,
  SelectButtonModule
];

@NgModule({
  imports: [
    ...PRIME_THEME_COMPONENTS
  ],
  exports: [
    ...PRIME_THEME_COMPONENTS
  ],
  declarations: []
})
export class MaterialModule { }