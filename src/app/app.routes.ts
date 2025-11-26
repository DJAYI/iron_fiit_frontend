import { Routes } from '@angular/router';
import { authenticationGuard } from './features/auth/guards/authentication-guard';
import { authorizationGuard } from './features/auth/guards/authorization-guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then(m => m.LoginPageComponent)
    },
    {
        path: 'admin',
        loadComponent: () => import('./layouts/dashboard/dashboard').then(m => m.DashboardLayoutComponent),

        data: { requiredRole: 'AUDITOR' },
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboardComponent)
            },
            // Gestión de Usuarios - Clientes
            {
                path: 'users/clients',
                loadComponent: () => import('./features/admin/user-management/client-list/client-list').then(m => m.ClientListComponent)
            },
            {
                path: 'users/clients/create',
                loadComponent: () => import('./features/admin/user-management/client-form/client-form').then(m => m.ClientFormComponent)
            },
            {
                path: 'users/clients/edit/:id',
                loadComponent: () => import('./features/admin/user-management/client-form/client-form').then(m => m.ClientFormComponent)
            },
            // Gestión de Usuarios - Entrenadores
            {
                path: 'users/trainers',
                loadComponent: () => import('./features/admin/user-management/trainer-list/trainer-list').then(m => m.TrainerListComponent)
            },
            {
                path: 'users/trainers/new',
                loadComponent: () => import('./features/admin/user-management/trainer-form/trainer-form').then(m => m.TrainerFormComponent)
            },
            {
                path: 'users/trainers/edit/:id',
                loadComponent: () => import('./features/admin/user-management/trainer-form/trainer-form').then(m => m.TrainerFormComponent)
            },
            // Gestión de Usuarios - Auditores
            {
                path: 'users/auditors',
                loadComponent: () => import('./features/admin/user-management/auditor-list/auditor-list').then(m => m.AuditorListComponent)
            },
            {
                path: 'users/auditors/new',
                loadComponent: () => import('./features/admin/user-management/auditor-form/auditor-form').then(m => m.AuditorFormComponent)
            },
            {
                path: 'users/auditors/edit/:id',
                loadComponent: () => import('./features/admin/user-management/auditor-form/auditor-form').then(m => m.AuditorFormComponent)
            },
            // Catálogos - Categorías
            {
                path: 'catalog/categories',
                loadComponent: () => import('./features/admin/catalog-management/categories/category-list/category-list').then(m => m.CategoryListComponent)
            },
            {
                path: 'catalog/categories/new',
                loadComponent: () => import('./features/admin/catalog-management/categories/category-form/category-form').then(m => m.CategoryFormComponent)
            },
            {
                path: 'catalog/categories/edit/:id',
                loadComponent: () => import('./features/admin/catalog-management/categories/category-form/category-form').then(m => m.CategoryFormComponent)
            },
            // Catálogos - Grupos Musculares
            {
                path: 'catalog/muscle-groups',
                loadComponent: () => import('./features/admin/catalog-management/muscle-groups/muscle-group-list/muscle-group-list').then(m => m.MuscleGroupListComponent)
            },
            {
                path: 'catalog/muscle-groups/new',
                loadComponent: () => import('./features/admin/catalog-management/muscle-groups/muscle-group-form/muscle-group-form').then(m => m.MuscleGroupFormComponent)
            },
            {
                path: 'catalog/muscle-groups/edit/:id',
                loadComponent: () => import('./features/admin/catalog-management/muscle-groups/muscle-group-form/muscle-group-form').then(m => m.MuscleGroupFormComponent)
            },
            // Catálogos - Ejercicios
            {
                path: 'catalog/exercises',
                loadComponent: () => import('./features/admin/catalog-management/exercises/exercise-list/exercise-list').then(m => m.ExerciseListComponent)
            },
            {
                path: 'catalog/exercises/new',
                loadComponent: () => import('./features/admin/catalog-management/exercises/exercise-form/exercise-form').then(m => m.ExerciseFormComponent)
            },
            {
                path: 'catalog/exercises/edit/:id',
                loadComponent: () => import('./features/admin/catalog-management/exercises/exercise-form/exercise-form').then(m => m.ExerciseFormComponent)
            },
            // Catálogos - Objetivos de Planes de Entrenamiento
            {
                path: 'catalog/objectives',
                loadComponent: () => import('./features/admin/catalog-management/objectives/objective-list').then(m => m.ObjectiveListComponent)
            },
            {
                path: 'catalog/objectives/form',
                loadComponent: () => import('./features/admin/catalog-management/objectives/objective-form').then(m => m.ObjectiveFormComponent)
            },
            // Catálogos - Estados de Planes de Entrenamiento
            {
                path: 'catalog/states',
                loadComponent: () => import('./features/admin/catalog-management/states/state-list').then(m => m.StateListComponent)
            },
            {
                path: 'catalog/states/form',
                loadComponent: () => import('./features/admin/catalog-management/states/state-form').then(m => m.StateFormComponent)
            },
            // Planes y Rutinas
            {
                path: 'routines/training-plans',
                loadComponent: () => import('./features/admin/routines-management/training-plan-list/training-plan-list').then(m => m.TrainingPlanListComponent)
            },
            {
                path: 'routines/training-plans/new',
                loadComponent: () => import('./features/admin/routines-management/training-plan-form/training-plan-form').then(m => m.TrainingPlanFormComponent)
            },
            {
                path: 'routines/training-plans/edit/:id',
                loadComponent: () => import('./features/admin/routines-management/training-plan-form/training-plan-form').then(m => m.TrainingPlanFormComponent)
            },
            {
                path: 'routines/routines',
                loadComponent: () => import('./features/admin/routines-management/routine-list/routine-list').then(m => m.RoutineListComponent)
            },
            {
                path: 'routines/routines/new',
                loadComponent: () => import('./features/admin/routines-management/routine-form/routine-form').then(m => m.RoutineFormComponent)
            },
            {
                path: 'routines/routines/edit/:id',
                loadComponent: () => import('./features/admin/routines-management/routine-form/routine-form').then(m => m.RoutineFormComponent)
            },
            {
                path: 'routines/routines/:id/exercises',
                loadComponent: () => import('./features/trainers/trainer-routines/routine-exercises/routine-exercises').then(m => m.RoutineExercisesComponent)
            },
            {
                path: 'routines/routines/:id/sessions',
                loadComponent: () => import('./features/admin/routines-management/session-management/session-management').then(m => m.SessionManagementComponent)
            },
            // Reportes
            {
                path: 'reports/attendance',
                loadComponent: () => import('./features/admin/reports/attendance-report/attendance-report').then(m => m.AttendanceReportComponent)
            },
            {
                path: 'reports/compliance',
                loadComponent: () => import('./features/admin/reports/compliance-report/compliance-report').then(m => m.ComplianceReportComponent)
            },
            {
                path: 'reports/progress',
                loadComponent: () => import('./features/admin/reports/progress-report/progress-report').then(m => m.ProgressReportComponent)
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'trainer',
        loadComponent: () => import('./layouts/dashboard/dashboard').then(m => m.DashboardLayoutComponent),

        data: { requiredRole: 'TRAINER' },
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./features/trainers/trainer-dashboard/trainer-dashboard').then(m => m.TrainerDashboardComponent)
            },
            {
                path: 'clients',
                loadComponent: () => import('./features/trainers/trainer-clients/trainer-clients-list/trainer-clients-list').then(m => m.TrainerClientsListComponent)
            },
            {
                path: 'training-plans',
                loadComponent: () => import('./features/trainers/trainer-trainment-plans/plan-list/plan-list').then(m => m.PlanListComponent)
            },
            {
                path: 'routines',
                loadComponent: () => import('./features/trainers/trainer-routines/routine-list/routine-list').then(m => m.RoutineListComponent)
            },
            {
                path: 'routines/:id/exercises',
                loadComponent: () => import('./features/trainers/trainer-routines/routine-exercises/routine-exercises').then(m => m.RoutineExercisesComponent)
            },
            {
                path: 'attendance',
                loadComponent: () => import('./features/trainers/attendance/trainer-attendance/trainer-attendance').then(m => m.TrainerAttendanceComponent)
            },
            {
                path: 'evaluations',
                loadComponent: () => import('./features/trainers/physical-evaluation/physical-evaluation-list').then(m => m.PhysicalEvaluationListComponent)
            },
            {
                path: 'evaluations/new',
                loadComponent: () => import('./features/trainers/physical-evaluation/physical-evaluation-form').then(m => m.PhysicalEvaluationFormComponent)
            },
            {
                path: 'evaluations/:id',
                loadComponent: () => import('./features/trainers/physical-evaluation/physical-evaluation-detail').then(m => m.PhysicalEvaluationDetailComponent)
            },
            {
                path: 'evaluations/edit/:id',
                loadComponent: () => import('./features/trainers/physical-evaluation/physical-evaluation-form').then(m => m.PhysicalEvaluationFormComponent)
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'client',
        loadComponent: () => import('./layouts/dashboard/dashboard').then(m => m.DashboardLayoutComponent),

        data: { requiredRole: 'CLIENT' },
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./features/clients/client-dashboard/client-dashboard').then(m => m.ClientDashboardComponent)
            },
            {
                path: 'profile',
                loadComponent: () => import('./features/clients/client-profile/client-profile').then(m => m.ClientProfileComponent)
            },
            {
                path: 'training-plan',
                loadComponent: () => import('./features/clients/client-trainment-plan/client-plan-view/client-plan-view').then(m => m.ClientPlanViewComponent)
            },
            {
                path: 'routines',
                loadComponent: () => import('./features/clients/client-routines/client-routines-list/client-routines-list').then(m => m.ClientRoutinesListComponent)
            },
            {
                path: 'progress',
                loadComponent: () => import('./features/clients/client-progress/client-progress-view/client-progress-view').then(m => m.ClientProgressViewComponent)
            },
            {
                path: 'evaluations',
                loadComponent: () => import('./features/clients/client-progress/client-evaluations/client-evaluations').then(m => m.ClientEvaluationsComponent)
            },
            {
                path: 'attendance',
                loadComponent: () => import('./features/clients/client-attendance/client-attendance').then(m => m.ClientAttendanceComponent)
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: '**',
        loadComponent: () => import('./layouts/page-not-found/page-not-found').then(m => m.PageNotFoundComponent)
    }
];
