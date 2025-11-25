import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../../../../shared/services/catalog.service';
import { NotificationService } from '../../../../../shared/services/notification.service';
import { Category } from '../../../../../shared/interfaces';

@Component({
    selector: 'app-category-list',
    template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">Categorías de Ejercicios</h1>
        <a [routerLink]="['/admin/catalog/categories/new']" class="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 inline-block">
          + Nueva Categoría
        </a>
      </div>

      @if (loading()) {
        <div class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-600"></div>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for(category of categories(); track category.id) {
            <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ category.name }}</h3>
              <p class="text-gray-600 text-sm mb-4">{{ category.description }}</p>
              <div class="flex justify-end space-x-3">
                <a [routerLink]="['/admin/catalog/categories/edit', category.id]" class="text-orange-600 hover:text-orange-900 text-sm font-medium">
                  Editar
                </a>
                <button (click)="deleteCategory(category.id)" class="text-red-600 hover:text-red-900 text-sm font-medium">
                  Eliminar
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
    imports: [RouterLink]
})
export class CategoryListComponent implements OnInit {
    private catalogService = inject(CatalogService);
    private notificationService = inject(NotificationService);

    categories = signal<Category[]>([]);
    loading = signal(false);

    ngOnInit() {
        this.loadCategories();
    }

    loadCategories() {
        this.loading.set(true);
        this.catalogService.getAllCategories().subscribe({
            next: (response) => {
                this.categories.set(response.categories);
                this.loading.set(false);
            },
            error: () => {
                this.notificationService.error('Error al cargar las categorías');
                this.loading.set(false);
            }
        });
    }

    deleteCategory(id: number) {
        if (!confirm('¿Está seguro de eliminar esta categoría?')) return;

        this.catalogService.deleteCategory(id).subscribe({
            next: () => {
                this.notificationService.success('Categoría eliminada');
                this.loadCategories();
            },
            error: () => {
                this.notificationService.error('Error al eliminar la categoría');
            }
        });
    }
}
