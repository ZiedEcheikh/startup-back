import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { SaleDetails } from '../_models';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.details.component.html',
  styleUrls: ['./sale.details.component.scss']
})

export class SaleDetailsComponent implements OnInit {
  items: MenuItem[];
  menus: MenuItem[];
  private data = [
    {
      id: 1,
      label: 'Documents',
      data: 'Documents Folder',
      expandedIcon: 'pi pi-folder-open',
      collapsedIcon: 'pi pi-folder',
      children: [{
        id: 2,
        label: 'Work',
        data: 'Work Folder',
        expandedIcon: 'pi pi-folder-open',
        collapsedIcon: 'pi pi-folder',
        children: [{ id: 3, label: 'Expenses.doc', icon: 'pi pi-file', data: 'Expenses Document',
       },
        { id: 4, label: 'Resume.doc', icon: 'pi pi-file', data: 'Resume Document' }]
      },
      {
        id: 5,
        label: 'Home',
        data: 'Home Folder',
        expandedIcon: 'pi pi-folder-open',
        collapsedIcon: 'pi pi-folder',
        children: [{ id: 6, label: 'Invoices.txt', icon: 'pi pi-file', data: 'Invoices for this month' }]
      }]
    }
  ];

  saleDetails: SaleDetails[];
  selectedDetail: SaleDetails;
  display = false;

  constructor(private router: Router) {
    this.items = [
      { label: 'Vente' },
      { label: 'Affiche' },
      { label: 'Détails' },
      { label: 'Récap' }
    ];

    this.menus = [
      {
          label: 'File',
          items: [{
                  label: 'New', 
                  icon: 'pi pi-fw pi-plus',
                  items: [
                      {label: 'Project'},
                      {label: 'Other',  command: (event: Event) =>
                      {this.router.navigateByUrl('administrator/market/sale-manage/' + this.selectedDetail.id); } },
                  ]
              },
              {label: 'Open'},
              {label: 'Quit'}
          ]
      },
      {
          label: 'Edit',
          icon: 'pi pi-fw pi-plus',
          items: [
              {label: 'Delete', icon: 'pi pi-fw pi-trash'},
              {label: 'Refresh', icon: 'pi pi-fw pi-refresh'}
          ]
      }
  ];
  }

  ngOnInit() {
    this.saleDetails = this.data;
  }

  nodeSelect(event: any) {
    console.log('node slected');
    this.display = true;
    // this.router.navigateByUrl('administrator/market/sale-manage/' + this.selectedDetail.id);
  }
  contextMenu(event: any) {
    if ( false ) {
      console.log('selectrf');
      }
    }
}
