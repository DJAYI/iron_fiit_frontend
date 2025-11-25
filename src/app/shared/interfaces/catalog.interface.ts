export interface Exercise {
    id: number;
    name: string;
    description: string;
    categoryId: number;
    muscularGroupId: number;
}

export interface Category {
    id: number;
    name: string;
    description: string;
}

export interface MuscleGroup {
    id: number;
    name: string;
    description: string;
}

export interface CreateExerciseRequest {
    name: string;
    description: string;
    categoryId: number;
    muscularGroupId: number;
}

export interface UpdateExerciseRequest {
    id: number;
    name: string;
    description: string;
    categoryId: number;
    muscularGroupId: number;
}

export interface CreateCategoryRequest {
    name: string;
    description: string;
}

export interface UpdateCategoryRequest {
    name: string;
    description: string;
}

export interface CreateMuscleGroupRequest {
    name: string;
    description: string;
}

export interface UpdateMuscleGroupRequest {
    name: string;
    description: string;
}

export interface ExercisesListResponse {
    data: Exercise[];
    message: string;
}

export interface ExerciseResponse {
    data: Exercise;
    message: string;
}

export interface CategoriesListResponse {
    categories: Category[];
    message: string;
}

export interface CategoryResponse {
    category: Category;
    message: string;
}

export interface MuscleGroupsListResponse {
    muscularGroups: MuscleGroup[];
    message: string;
}

export interface MuscleGroupResponse {
    trainmentObjective: MuscleGroup;
    message: string;
}
