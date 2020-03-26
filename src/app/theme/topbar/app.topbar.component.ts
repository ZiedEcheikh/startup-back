import {Component} from '@angular/core';
import {AppAdministratorComponent} from '../../pages/app.administrator.component';

@Component({
    selector: 'app-topbar',
    template: `
        <div class="layout-topbar">
			<div class="layout-topbar-wrapper">
                <div class="layout-topbar-left">
					<div class="layout-topbar-logo-wrapper">
						<a href="#" class="layout-topbar-logo">
							<img src="assets/layout/images/logo-mirage@2x.png" alt="mirage-layout" />
							<span class="app-name">Startup</span>
						</a>
					</div>

					<a href="#" class="sidebar-menu-button" (click)="app.onMenuButtonClick($event)">
						<i class="pi pi-bars"></i>
					</a>

					<a href="#" class="topbar-menu-mobile-button" (click)="app.onTopbarMobileMenuButtonClick($event)">
						<i class="pi pi-ellipsis-v"></i>
					</a>

					<div class="layout-megamenu-wrapper">
					</div>
                </div>
                <div class="layout-topbar-right fadeInDown">
					<ul class="layout-topbar-actions">
						<li #search class="search-item topbar-item" [ngClass]="{'active-topmenuitem': app.activeTopbarItem === search}">
							<a href="#" class="topbar-search-mobile-button" (click)="app.onTopbarItemClick($event,search)">
								<i class="topbar-icon pi pi-search"></i>
							</a>
							<ul class="search-item-submenu fadeInDown" (click)="app.topbarItemClick = true">
								<li>
                                    <span class="md-inputfield search-input-wrapper">
                                        <input pInputText placeholder="Search..."/>
                                        <i class="pi pi-search"></i>
                                    </span>
                                </li>
                            </ul>
                        </li>
						<li #calendar class="topbar-item" [ngClass]="{'active-topmenuitem': app.activeTopbarItem === calendar}">
							<a href="#" (click)="app.onTopbarItemClick($event,calendar)">
								<i class="topbar-icon pi pi-calendar"></i>
							</a>
							<ul class="fadeInDown" (click)="app.topbarItemClick = true">
								<li class="layout-submenu-header">
									<h1>Calendar</h1>
								</li>
								<li class="calendar">
                                    <p-calendar [inline]="true"></p-calendar>
								</li>
							</ul>
						</li>
						<li #profile class="topbar-item profile-item" [ngClass]="{'active-topmenuitem': app.activeTopbarItem === profile}">
							<a href="#" (click)="app.onTopbarItemClick($event,profile)">
                            <span class="profile-image-wrapper">
                                <img src="assets/layout/images/topbar/zied.jpg" alt="mirage-layout" />
                            </span>
								<span class="profile-info-wrapper">
                                <h3>Zied ECHEIKH</h3>
                                <span>CEO</span>
                            </span>
							</a>
							<ul class="profile-item-submenu fadeInDown">
								<li class="profile-submenu-header">
									<div class="profile">
										<img src="assets/layout/images/topbar/asma.jpg" alt="mirage-layout"
														width="40" />
										<h1>Asma GHARBI</h1>
										<span>COO</span>
									</div>
								</li>
								<li class="layout-submenu-footer">
									<button class="signout-button">Sign Out</button>
								</li>
							</ul>
						</li>
                    </ul>

					<ul class="profile-mobile-wrapper">
						<li #mobileProfile class="topbar-item profile-item" [ngClass]="{'active-topmenuitem': app.activeTopbarItem === mobileProfile}">
							<a href="#" (click)="app.onTopbarItemClick($event,mobileProfile)">
                            <span class="profile-image-wrapper">
                                <img src="assets/layout/images/topbar/zied.jpg" alt="mirage-layout" />
                            </span>
								<span class="profile-info-wrapper">
                                <h3>Zied ECHEIKH</h3>
                                <span>CEO</span>
                            </span>
							</a>
							<ul class="fadeInDown">
								<li class="profile-submenu-header">
									<div class="profile">
										<img src="assets/layout/images/topbar/asma.jpg" alt="mirage-layout" width="45" />
										<h1>Asma GHARBI</h1>
										<span>COO</span>
									</div>
								</li>
								<li class="layout-submenu-footer">
									<button class="signout-button">Sign Out</button>
								</li>
							</ul>
						</li>
					</ul>
                </div>
            </div>
        </div>
    `
})
export class AppTopBarComponent {

    activeItem: number;

    constructor(public app: AppAdministratorComponent) {}

    mobileMegaMenuItemClick(index) {
        this.app.megaMenuMobileClick = true;
        this.activeItem = this.activeItem === index ? null : index;
    }

}
