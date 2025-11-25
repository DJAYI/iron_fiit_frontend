import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogService } from '../../../../../shared/services/catalog.service';
import { NotificationService } from '../../../../../shared/services/notification.service';
import { CreateMuscleGroupRequest } from '../../../../../shared/interfaces';

@Component({
  selector: 'app-muscle-group-form',
  template: `
    <div class="max-w-2xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold text-gray-900">{{ isEditMode() ? 'Editar Grupo Muscular' : 'Nuevo Grupo Muscular' }}</h1>
        <a [routerLink]="['/admin/catalog/muscle-groups']" class="text-gray-600 hover:text-gray-900">← Volver</a>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input formControlName="name" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea formControlName="description" rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea>
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <a [routerLink]="['/admin/catalog/muscle-groups']" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 inline-block">
            Cancelar
          </a>
          <button type="submit" [disabled]="form.invalid || submitting()" class="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50">
            {{ submitting() ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </form>
    </div>
  `,
  imports: [ReactiveFormsModule, RouterLink]
})
export class MuscleGroupFormComponent implements OnInit {
  private catalogService = inject(CatalogService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private notificationService = inject(NotificationService);

  submitting = signal(false);
  isEditMode = signal(false);
  groupId = signal<number | null>(null);

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required])
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.groupId.set(Number(id));
      this.loadGroup(Number(id));
    }
  }

  loadGroup(id: number) {
    this.catalogService.getMuscleGroup(id).subscribe({
      next: (response) => {
        this.form.patchValue(response.trainmentObjective);
      },
      error: () => {
        this.notificationService.error('Error al cargar el grupo muscular');
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.submitting.set(true);
    const data = this.form.value as CreateMuscleGroupRequest;

    const request = this.isEditMode()
      ? this.catalogService.updateMuscleGroup(this.groupId()!, data)
      : this.catalogService.createMuscleGroup(data);

    request.subscribe({
      next: () => {
        this.notificationService.success(`Grupo muscular ${this.isEditMode() ? 'actualizado' : 'creado'} exitosamente`);
        this.router.navigate(['/admin/catalog/muscle-groups']);
        this.submitting.set(false);
      },
      error: () => {
        this.notificationService.error('Error al guardar el grupo muscular');
        this.submitting.set(false);
      }
    });
  }
}
