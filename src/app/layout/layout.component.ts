import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { SidebarDirective } from "../../@fury/shared/sidebar/sidebar.directive";
import { SidenavService } from "./sidenav/sidenav.service";
import { filter, map, startWith } from "rxjs/operators";
import { ThemeService } from "../../@fury/services/theme.service";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { checkRouterChildsData } from "../../@fury/utils/check-router-childs-data";
import { AuthService } from "../shared/services/auth/auth.service";

@Component({
  selector: "fury-layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.scss"],
})
export class LayoutComponent implements OnInit, OnDestroy {
  @ViewChild("configPanel", { static: true }) configPanel: SidebarDirective;

  sidenavOpen$ = this.sidenavService.open$;
  sidenavMode$ = this.sidenavService.mode$;
  sidenavCollapsed$ = this.sidenavService.collapsed$;
  sidenavExpanded$ = this.sidenavService.expanded$;
  quickPanelOpen: boolean;

  sideNavigation$ = this.themeService.config$.pipe(
    map((config) => config.navigation === "side")
  );
  topNavigation$ = this.themeService.config$.pipe(
    map((config) => config.navigation === "top")
  );
  toolbarVisible$ = this.themeService.config$.pipe(
    map((config) => config.toolbarVisible)
  );
  toolbarPosition$ = this.themeService.config$.pipe(
    map((config) => config.toolbarPosition)
  );
  footerPosition$ = this.themeService.config$.pipe(
    map((config) => config.footerPosition)
  );

  scrollDisabled$ = this.router.events.pipe(
    filter<NavigationEnd>((event) => event instanceof NavigationEnd),
    startWith(null),
    map(() =>
      checkRouterChildsData(
        this.router.routerState.root.snapshot,
        (data) => data.scrollDisabled
      )
    )
  );

  constructor(
    private sidenavService: SidenavService,
    private themeService: ThemeService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.sidenavService.removeItems();

    const menuBase = [
      {
        name: "Cuentas",
        routeOrFunction: "/",
        icon: "dashboard",
        position: 10,
        pathMatchExact: true,
      },
      {
        name: "Favoritos",
        routeOrFunction: "/favorites",
        icon: "assignment",
        // badge: "22",
        badgeColor: "#2196F3",
        position: 15,
      },
      {
        name: "Transferencias",
        routeOrFunction: "/banking-transactions",
        icon: "inbox",
        position: 25,
      },
    ];

    if (this.authService.userType === "admin") {
      menuBase.push({
        name: "Administrar Usuarios",
        routeOrFunction: "/users",
        icon: "mouse",
        position: 40,
      });
      menuBase.push({
        name: "Administrar Cuentas",
        routeOrFunction: "/accounts/global",
        icon: "layers",
        position: 55,
      });
    }

    this.sidenavService.addItems(menuBase);
  }

  openQuickPanel() {
    this.quickPanelOpen = true;
  }

  openConfigPanel() {
    this.configPanel.open();
  }

  closeSidenav() {
    this.sidenavService.close();
  }

  openSidenav() {
    this.sidenavService.open();
  }

  ngOnDestroy(): void {}
}
