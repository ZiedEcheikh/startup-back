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
import { TableModule } from 'primeng/table';
import { ContextMenuModule } from 'primeng/contextmenu';
import { LightboxModule } from 'primeng/lightbox';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelModule } from 'primeng/panel';
import { MessageModule } from 'primeng/message';
import {GalleriaModule} from 'primeng/galleria';

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
  ContextMenuModule,
  TableModule,
  LightboxModule,
  OverlayPanelModule,
  PanelModule,
  MessageModule
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