import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogService } from '../../../../../shared/services/catalog.service';
import { NotificationService } from '../../../../../shared/services/notification.service';
import { CreateCategoryRequest, UpdateCategoryRequest } from '../../../../../shared/interfaces';

@Component({
  selector: 'app-category-form',
  template: `
    <div class="max-w-2xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold text-gray-900">{{ isEditMode() ? 'Editar Categoría' : 'Nueva Categoría' }}</h1>
        <a [routerLink]="['/admin/catalog/categories']" class="text-gray-600 hover:text-gray-900">← Volver</a>
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
          <a [routerLink]="['/admin/catalog/categories']" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 inline-block">
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
export class CategoryFormComponent implements OnInit {
  private catalogService = inject(CatalogService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private notificationService = inject(NotificationService);

  submitting = signal(false);
  isEditMode = signal(false);
  categoryId = signal<number | null>(null);

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required])
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.categoryId.set(Number(id));
      this.loadCategory(Number(id));
    }
  }

  loadCategory(id: number) {
    this.catalogService.getCategory(id).subscribe({
      next: (response) => {
        this.form.patchValue(response.category);
      },
      error: () => {
        this.notificationService.error('Error al cargar la categoría');
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.submitting.set(true);
    const data = this.form.value as CreateCategoryRequest;

    const request = this.isEditMode()
      ? this.catalogService.updateCategory(this.categoryId()!, data)
      : this.catalogService.createCategory(data);

    request.subscribe({
      next: () => {
        this.notificationService.success(`Categoría ${this.isEditMode() ? 'actualizada' : 'creada'} exitosamente`);
        this.router.navigate(['/admin/catalog/categories']);
        this.submitting.set(false);
      },
      error: () => {
        this.notificationService.error('Error al guardar la categoría');
        this.submitting.set(false);
      }
    });
  }
}
