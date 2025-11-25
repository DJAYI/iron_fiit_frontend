import { Component, signal } from "@angular/core";
import { DashboardSidebarComponent } from "./sidebar";
import { DashboardHeaderComponent } from "./header";
import { RouterOutlet } from "@angular/router";

@Component({
    selector: 'app-dashboard-layout',
    template: `
      <div class="min-h-screen bg-gray-50">
        <app-dashboard-sidebar [open]="sidebarOpen()"></app-dashboard-sidebar>
      
        <div class="flex-1 flex flex-col transition-all duration-300 ease-in-out" [class.ml-64]="sidebarOpen()">
            <app-dashboard-header (handleSidebar)="toggleSidebar()"></app-dashboard-header>

            <!-- Main Content -->
            <main class="p-6 flex-1">
                <router-outlet></router-outlet>
            </main>

            <!-- Footer -->
            <footer class="bg-white border-t border-gray-200 py-4 px-6 text-center text-sm text-gray-600">
                <p>&copy; 2024 Iron Fit. Todos los derechos reservados.</p>
            </footer>
        </div>
      </div>
    `,
    imports: [DashboardSidebarComponent, DashboardHeaderComponent, RouterOutlet]
})

export class DashboardLayoutComponent {
    sidebarOpen = signal(true);

    toggleSidebar() {
        this.sidebarOpen.update(value => !value);
    }
}