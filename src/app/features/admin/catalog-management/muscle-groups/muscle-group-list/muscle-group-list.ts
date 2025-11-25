import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../../../../shared/services/catalog.service';
import { NotificationService } from '../../../../../shared/services/notification.service';
import { MuscleGroup } from '../../../../../shared/interfaces';

@Component({
  selector: 'app-muscle-group-list',
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">Grupos Musculares</h1>
        <a [routerLink]="['/admin/catalog/muscle-groups/new']" class="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 inline-block">
          + Nuevo Grupo Muscular
        </a>
      </div>

      @if (loading()) {
        <div class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-600"></div>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for(group of muscleGroups(); track group.id) {
            <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ group.name }}</h3>
              <p class="text-gray-600 text-sm mb-4">{{ group.description }}</p>
              <div class="flex justify-end space-x-3">
                <a [routerLink]="['/admin/catalog/muscle-groups/edit', group.id]" class="text-orange-600 hover:text-orange-900 text-sm font-medium">
                  Editar
                </a>
                <button (click)="deleteGroup(group.id)" class="text-red-600 hover:text-red-900 text-sm font-medium">
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
export class MuscleGroupListComponent implements OnInit {
  private catalogService = inject(CatalogService);
  private notificationService = inject(NotificationService);

  muscleGroups = signal<MuscleGroup[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.loadGroups();
  }

  loadGroups() {
    this.loading.set(true);
    this.catalogService.getAllMuscleGroups().subscribe({
      next: (response) => {
        this.muscleGroups.set(response.muscularGroups);
        this.loading.set(false);
      },
      error: () => {
        this.notificationService.error('Error al cargar los grupos musculares');
        this.loading.set(false);
      }
    });
  }

  deleteGroup(id: number) {
    if (!confirm('¿Está seguro de eliminar este grupo muscular?')) return;

    this.catalogService.deleteMuscleGroup(id).subscribe({
      next: () => {
        this.notificationService.success('Grupo muscular eliminado');
        this.loadGroups();
      },
      error: () => {
        this.notificationService.error('Error al eliminar el grupo muscular');
      }
    });
  }
}
