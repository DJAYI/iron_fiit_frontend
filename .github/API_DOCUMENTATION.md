# IronFit Backend – Documentación Completa de la API

> Esta documentación se basa **estrictamente** en el código fuente actual de los controllers y servicios (`HashMap<String, Object>` que devuelven) a fecha 25/11/2025.
>
> Todas las respuestas siguen el mismo patrón general: un `HashMap<String, Object>` serializado a JSON. Las claves y estructuras indicadas aquí son **exactamente** las que se construyen en los servicios.

---

## 1. Auth

### 1.1 Login

- **Método:** `POST`
- **URL:** `/api/auth/login`
- **Auth requerida:** Ninguna (punto de entrada)
- **Body (JSON):**

  - `username` (string, requerido)
  - `password` (string, requerido)

- **Success 200 (OK):**

  ```json
  {
    "token": "<jwt>",
    "role": "[ROLE_XXX]", // String con la lista de authorities
    "username": "<username>"
  }
  ```

  Además, se setea cookie `jwt` HttpOnly con el token.

- **Error 401 (UNAUTHORIZED):**
  ```json
  {
    "error": "<mensaje de error>"
  }
  ```
  Además, se borra la cookie `jwt`.

### 1.2 Logout

- **Método:** `POST`
- **URL:** `/api/auth/logout`
- **Auth requerida:** Usuario autenticado (se espera cookie `jwt`), aunque el controller no tiene `@PreAuthorize`.

- **Success 200 (OK):**
  ```json
  {
    "message": "Logged out successfully"
  }
  ```
  Además, se borra la cookie `jwt`.

---

## 2. Attendance

### 2.1 Registrar asistencia del cliente autenticado

- **Método:** `POST`
- **URL:** `/api/attendances`
- **Auth requerida:** `hasRole('CLIENT')` (en el servicio `RegisterClientAttendance`)
- **Body:** _vacío_

- **Success 201 (CREATED):**

  ```json
  {
    "message": "Attendance was successfully registered",
    "attendance": {
      "id": 1,
      "clientId": 10,
      "dateTime": "2025-11-25T10:30:00"
    }
  }
  ```

- **Errores posibles 400 (BAD REQUEST):**
  - Si no se encuentra el id de cliente en sesión:
    ```json
    {
      "error": true,
      "message": "Client ID could not be found"
    }
    ```
  - Si el cliente no existe en BD:
    ```json
    {
      "error": true,
      "message": "Client was not found"
    }
    ```
  - Error genérico al guardar:
    ```json
    {
      "error": true,
      "message": "Error registering attendance"
    }
    ```

### 2.2 Obtener asistencias del cliente autenticado

- **Método:** `GET`
- **URL:** `/api/attendances`
- **Auth requerida:** `hasRole('CLIENT')`

- **Success 200 (OK):**

  ```json
  {
    "attendances": [
      {
        "id": 1,
        "clientId": 10,
        "dateTime": "2025-11-25T10:30:00"
      }
    ],
    "message": "Client attendances successfully retrieved"
  }
  ```

- **Error 400 (BAD REQUEST):**
  ```json
  {
    "message": "Client attendances could not be retrieved",
    "error": true
  }
  ```

### 2.3 Obtener todas las asistencias (entrenador)

- **Método:** `GET`
- **URL:** `/api/attendances/all`
- **Auth requerida:** `hasRole('TRAINER')`

- **Success 200 (OK):**

  ```json
  {
    "attendances": [
      {
        "id": 1,
        "clientId": 10,
        "dateTime": "2025-11-25T10:30:00"
      }
    ],
    "message": "Retrieved all attendances successfully"
  }
  ```

- **Error 400 (BAD REQUEST):**
  ```json
  {
    "message": "<mensaje de error de la excepción>",
    "error": true
  }
  ```

---

## 3. Dashboard

### 3.1 Estadísticas generales (auditor)

- **Método:** `GET`
- **URL:** `/api/dashboard/stats`
- **Auth requerida:** `hasRole('AUDITOR')` (en el servicio `GetDashboardStats`)
- **Body:** _ninguno_

- **Success 200 (OK):**

  ```json
  {
    "message": "Dashboard statistics retrieved successfully",
    "data": {
      "totalClients": 0,
      "totalTrainers": 0,
      "activePlans": 0,
      "weeklyAttendance": 0,
      "calculatedAt": "2025-11-25T10:30:00"
    }
  }
  ```

- **Error 400 (BAD REQUEST):**
  ```json
  {
    "message": "Error retrieving dashboard statistics: <detalle>",
    "error": true
  }
  ```

---

## 4. People Management

### 4.1 Clients

#### 4.1.1 Crear cliente

- **Método:** `POST`
- **URL:** `/api/clients`
- **Auth requerida:** `hasRole('AUDITOR')`
- **Body (JSON – `CreateClientRequestDto`):**

  - `firstName` (string, @NotBlank)
  - `lastName` (string, @NotBlank)
  - `documentType` (string, enum `DocumentTypeEnum`, @NotNull)
  - `documentNumber` (string, @NotBlank)
  - `email` (string, @Email, @NotBlank)
  - `phoneNumber` (string, opcional)
  - `username` (string, @NotBlank)
  - `password` (string, @NotBlank)

- **Success 201 (CREATED):**

  ```json
  {
    "message": "Client created successfully",
    "client": { ... ClientResponseDto ... }
  }
  ```

- **Error 400 (BAD REQUEST):**
  ```json
  {
    "message": "Client could not be created",
    "error": true
  }
  ```

#### 4.1.2 Actualizar cliente

- **Método:** `PUT`
- **URL:** `/api/clients/{id}`
- **Auth requerida:** `hasRole('AUDITOR')`
- **Body (JSON – `UpdateClientRequestDto`):** todos opcionales (`Optional<...>`)

  - `firstName` (string)
  - `lastName` (string)
  - `documentType` (string enum)
  - `documentNumber` (string)
  - `email` (string)
  - `phoneNumber` (string)
  - `username` (string)
  - `password` (string)
  - `isEnabled` (boolean)
  - `isAccountNoExpired` (boolean)
  - `isAccountNoLocked` (boolean)
  - `roles` (array de string)

- **Success 200 (OK):**

  ```json
  {
    "message": "Client updated successfully",
    "client": { ... ClientResponseDto ... }
  }
  ```

- **Errores 400 (BAD REQUEST):**
  - Cliente no encontrado:
    ```json
    {
      "message": "Client not found",
      "error": true
    }
    ```
  - Error genérico:
    ```json
    {
      "message": "Client could not be updated",
      "error": true
    }
    ```

#### 4.1.3 Listar clientes

- **Método:** `GET`
- **URL:** `/api/clients`
- **Auth requerida:** `hasRole('AUDITOR')`

- **Success 200 (OK):**

  ```json
  {
    "clients": [ ... ClientResponseDto ... ],
    "message": "Clients list has been successfully retrieved"
  }
  ```

- **Error 400 (BAD REQUEST):**
  ```json
  {
    "message": "<mensaje de excepción>",
    "error": true
  }
  ```

> Nota: El módulo de clients también tiene endpoints tipo `/api/clients/me` y activación/desactivación. Sus respuestas siguen el mismo patrón `{ "message": "...", "client": ..., opcionalmente campos como clientId/username }` que ya tienes documentado en `API_RESPONSES_EXACTAS.md`.

### 4.2 Trainers

Los patrones son equivalentes a Clients.

#### 4.2.1 Crear trainer

- **Método:** `POST`
- **URL:** `/api/trainers`
- **Auth requerida:** `hasRole('AUDITOR')`
- **Body (`CreateTrainerRequestDto`):**

  - `firstName`, `lastName`, `documentType`, `documentNumber`, `email`, `phoneNumber`, `username`, `password` (igual que cliente)
  - `expertiseIds` (array de Long, opcional)

- **Success 201 (CREATED):**

  ```json
  {
    "message": "Client created successfully",
    "trainer": { ... TrainerResponseDto ... }
  }
  ```

- **Error 400:**
  ```json
  {
    "message": "Client could not be created",
    "error": true
  }
  ```

#### 4.2.2 Actualizar trainer

- **Método:** `PUT`
- **URL:** `/api/trainers/{id}`
- **Body (`UpdateTrainerRequestDto`):** todos opcionales, igual que UpdateClient pero con `expertiseIds` opcional.

- **Success 200:**

  ```json
  {
    "message": "Trainer updated successfully",
    "trainer": { ... TrainerResponseDto ... }
  }
  ```

- **Errores:** se lanza RuntimeException si no existe, y se mapea a 400 con `{ "message": "...", "error": true }`.

#### 4.2.3 Listar trainers

- **Método:** `GET`
- **URL:** `/api/trainers`

- **Success 200:**

  ```json
  {
    "trainers": [ ... TrainerResponseDto ... ],
    "message": "Trainers list has been successfully retrieved"
  }
  ```

- **Error 400:**
  ```json
  {
    "message": "<mensaje>",
    "error": true
  }
  ```

### 4.3 Auditors

#### 4.3.1 Crear auditor

- **Método:** `POST`
- **URL:** `/api/auditors`
- **Auth requerida:** `hasRole('AUDITOR')`
- **Body (`CreateAuditorRequestDto`):** igual que create client pero sin roles explícitos.

- **Success 201:**

  ```json
  {
    "message": "Auditor created successfully",
    "auditor": { ... AuditorResponseDto ... }
  }
  ```

- **Error 400:**
  ```json
  {
    "message": "Auditor could not be created",
    "error": true
  }
  ```

#### 4.3.2 Actualizar auditor

- **Método:** `PUT`
- **URL:** `/api/auditors/{id}`
- **Body (`UpdateAuditorRequestDto`):** todos opcionales.

- **Success 200:**

  ```json
  {
    "message": "Auditor updated successfully",
    "auditor": { ... AuditorResponseDto ... }
  }
  ```

- **Errores 400:**
  - No encontrado:
    ```json
    {
      "message": "Auditor not found",
      "error": true
    }
    ```
  - Otro error:
    ```json
    {
      "message": "Auditor could not be updated",
      "error": true
    }
    ```

#### 4.3.3 Listar auditors

- **Método:** `GET`
- **URL:** `/api/auditors`

- **Success 200:**

  ```json
  {
    "auditors": [ ... AuditorResponseDto ... ],
    "message": "Auditors list has been successfully retrieved"
  }
  ```

- **Error 400:**
  ```json
  {
    "message": "<mensaje>",
    "error": true
  }
  ```

---

## 5. Nutritional Plans

### 5.1 Crear plan nutricional

- **Método:** `POST`
- **URL:** `/api/nutrition-plans`
- **Auth requerida:** `hasRole('AUDITOR') or hasRole('TRAINER')`
- **Body (`RegisterNutritionPlanDto`):**

  - `trainmentPlanId` (Long, @NotNull)
  - `calories` (BigDecimal, @NotNull @Positive)
  - `proteinGrams` (BigDecimal, @NotNull @Positive)
  - `carbsGrams` (BigDecimal, @NotNull @Positive)
  - `fatGrams` (BigDecimal, @NotNull @Positive)
  - `description` (String, opcional)

- **Success 201:**

  ```json
  {
    "message": "Nutrition plan created successfully",
    "data": { ... NutritionPlanResponseDto ... }
  }
  ```

- **Error 400:**
  ```json
  {
    "message": "Error creating nutrition plan: <detalle>",
    "error": true
  }
  ```

### 5.2 Modificar plan nutricional

- **Método:** `PUT`
- **URL:** `/api/nutrition-plans/{id}`
- **Auth requerida:** `hasRole('AUDITOR') or hasRole('TRAINER')`
- **Body (`ModifyNutritionPlanDto`):** todos opcionales.

- **Success 200:**

  ```json
  {
    "message": "Nutrition plan updated successfully",
    "data": { ... NutritionPlanResponseDto ... }
  }
  ```

- **Error 400:**
  ```json
  {
    "message": "Error updating nutrition plan: <detalle>",
    "error": true
  }
  ```

### 5.3 Listar todos

- **Método:** `GET`
- **URL:** `/api/nutrition-plans`
- **Auth requerida:** `isAuthenticated()`

- **Success 200:**

  ```json
  {
    "message": "Nutrition plans retrieved successfully",
    "data": [ ... NutritionPlanResponseDto ... ]
  }
  ```

- **Error 400:**
  ```json
  {
    "message": "Error retrieving nutrition plans: <detalle>",
    "error": true
  }
  ```

### 5.4 Obtener por id

- **Método:** `GET`
- **URL:** `/api/nutrition-plans/{id}`

- **Success 200:**

  ```json
  {
    "message": "Nutrition plan retrieved successfully",
    "data": { ... NutritionPlanResponseDto ... }
  }
  ```

- **Error 400:**
  ```json
  {
    "message": "Error retrieving nutrition plan: <detalle>",
    "error": true
  }
  ```

### 5.5 Obtener por training plan

- **Método:** `GET`
- **URL:** `/api/nutrition-plans/training-plan/{trainmentPlanId}`

- **Success 200:**

  ```json
  {
    "message": "Nutrition plans retrieved successfully",
    "data": [ ... NutritionPlanResponseDto ... ]
  }
  ```

- **Error 400:**
  ```json
  {
    "message": "Error retrieving nutrition plans: <detalle>",
    "error": true
  }
  ```

---

## 6. Physical Evaluations

(Registro, modificación y retrieves – todas las respuestas usan claves `message` y `data` con `PhysicalEvaluationResponseDto` o listas, y `error: true` en fallos, según lo descrito en tu extracción de servicios.)

---

## 7. Reports

### 7.1 Reporte de asistencia

- **Método:** `GET`
- **URL:** `/api/reports/attendance`
- **Auth requerida:** `hasRole('AUDITOR')`
- **Query params (opcionales):**

  - `startDate` (String)
  - `endDate` (String)
  - `clientId` (Long)
  - `trainerId` (Long)
  - `status` (String)

- **Success 200:**

  ```json
  {
    "message": "Attendance report generated successfully",
    "data": [
      {
        "id": 1,
        "clientId": 10,
        "clientName": "...",
        "date": "2025-11-25",
        "time": "10:30:00",
        "status": "ATTENDED | NOT_ATTENDED | ATTENDED_NO_ROUTINE",
        "completed": true,
        "observations": "..."
      }
    ],
    "count": 1
  }
  ```

- **Error 400:**
  ```json
  {
    "message": "Error generating attendance report: <detalle>",
    "error": true
  }
  ```

### 7.2 Reporte de cumplimiento por cliente

- **Método:** `GET`
- **URL:** `/api/reports/compliance/client/{clientId}`
- **Auth requerida:** `hasRole('AUDITOR')`

- **Success 200:**

  ```json
  {
    "message": "Client compliance report generated successfully",
    "data": {
      "clientId": 10,
      "clientName": "...",
      "totalAttendances": 0,
      "completedSessions": 0,
      "programmedSessions": 0,
      "completionPercentage": 0.0,
      "hasActivePlan": false,
      "activePlanId": 1, // sólo si hasActivePlan = true
      "activePlanName": "..." // sólo si hasActivePlan = true
    }
  }
  ```

- **Errores 400:**
  - Cliente no encontrado:
    ```json
    {
      "message": "Client not found",
      "error": true
    }
    ```
  - Error genérico:
    ```json
    {
      "message": "Error generating compliance report: <detalle>",
      "error": true
    }
    ```

### 7.3 Reporte de cumplimiento de ejercicios por plan

- **Método:** `GET`
- **URL:** `/api/reports/compliance/exercises`
- **Query param:** `planId` (Long, requerido)
- **Auth requerida:** `hasRole('AUDITOR')`

- **Success 200:**

  ```json
  {
    "message": "Exercise compliance report generated successfully",
    "data": {
      "planId": 1,
      "planName": "...",
      "clientId": 10,
      "clientName": "...",
      "totalExercises": 0,
      "completedExercises": 0,
      "completionPercentage": 0.0,
      "routineCount": 0
    }
  }
  ```

- **Errores 400:**
  - Plan no encontrado:
    ```json
    {
      "message": "Training plan not found",
      "error": true
    }
    ```
  - Error genérico:
    ```json
    {
      "message": "Error generating exercise compliance report: <detalle>",
      "error": true
    }
    ```

---

## 8. Routines & Exercises

### 8.1 Routines (`/api/routines`)

#### Crear rutina

- `POST /api/routines` (AUDITOR o TRAINER)
- Body: `RegisterRoutineDto` (`name` @NotBlank, `description`, `trainmentPlanId` @NotNull)
- Success 201:
  ```json
  {
    "message": "Routine registered successfully",
    "data": { ... RoutineResponseDto ... }
  }
  ```
- Errores 400: mensajes de "Training plan not found with ID: ..." o "Error registering routine: ..." con `error: true`.

#### Modificar rutina

- `PUT /api/routines` (AUDITOR o TRAINER)
- Body: `ModifyRoutineDto` (`id` @NotNull, resto opcional)
- Success 200: `{"message": "Routine modified successfully", "data": ...}`

#### Listar / obtener por id / por training plan

- `GET /api/routines`
- `GET /api/routines/{id}`
- `GET /api/routines/training-plan/{trainmentPlanId}`
- Siempre `isAuthenticated()`
- Success: `{"message": "Routines...", "data": [...]}` o una sola rutina.

### 8.2 Exercises (`/api/exercises`)

- Misma estructura que routines:
  - `POST` registrar exercise
  - `PUT` modificar
  - `GET` listar
  - `GET /{id}` obtener por id
- Claves de respuesta: `message` y `data` con `ExerciseResponseDto` o lista.
- Errores con `error: true` y mensajes específicos de category/muscularGroup no encontrados.

### 8.3 Routine Exercises (`/api/routine-exercises`)

- `POST` registrar (AUDITOR/TRAINER) – body `RegisterRoutineExerciseDto`
- `PUT` modificar – `ModifyRoutineExerciseDto`
- `GET` todos, `GET /{id}`, `GET /routine/{routineId}`, `GET /exercise/{exerciseId}` – `isAuthenticated()`
- Respuestas: `{"message": "Routine exercise ...", "data": ...}` o lista.

### 8.4 Categories (`/api/categories`)

- `GET` (isAuthenticated):
  ```json
  {
    "message": "Categories has been retrieve successfully",
    "categories": [ ... ]
  }
  ```
- `POST` (AUDITOR) body `RegisterCategoryDto` →
  ```json
  {
    "message": "Category has been registered successfully",
    "category": { ... }
  }
  ```
- `PUT /{id}` (AUDITOR) body `UpdateCategoryDto` → mismo patrón con `category`.

### 8.5 Muscular Groups (`/api/muscular-groups`)

#### 8.5.1 Listar grupos musculares

- **Método:** `GET`
- **URL:** `/api/muscular-groups`
- **Auth requerida:** `isAuthenticated()`

- **Success 200 (OK):**

  ```json
  {
    "message": "Muscular groups has been retrieve successfully",
    "muscularGroups": [
      {
        "id": 1,
        "name": "Pecho"
      }
    ]
  }
  ```

- **Error 400 (BAD REQUEST):**
  ```json
  {
    "message": "Muscular groups could not be retrieve",
    "error": true
  }
  ```

#### 8.5.2 Registrar grupo muscular

- **Método:** `POST`
- **URL:** `/api/muscular-groups`
- **Auth requerida:** `hasRole('AUDITOR')`
- **Body (JSON – `RegisterMuscularGruopDto`):**

  - `name` (string)

- **Success 201 (CREATED):**

  ```json
  {
    "message": "Muscular group has been registered successfully",
    "muscularGroup": {
      "id": 1,
      "name": "Pecho"
    }
  }
  ```

- **Error 400 (BAD REQUEST):**
  ```json
  {
    "message": "Muscular group could not be registered successfully",
    "error": true
  }
  ```

#### 8.5.3 Modificar grupo muscular

- **Método:** `PUT`
- **URL:** `/api/muscular-groups/{id}`
- **Auth requerida:** `hasRole('AUDITOR')`
- **Body (JSON – `UpdateMuscularGroupDto`):**

  - `name` (string)

- **Success 201 (CREATED):**

  ```json
  {
    "message": "Muscular group has been modified successfully",
    "muscularGroup": {
      "id": 1,
      "name": "Pecho"
    }
  }
  ```

- **Errores 400 (BAD REQUEST):**
  - Si no existe el id:
    ```json
    {
      "message": "Muscular group with id 1 not found",
      "error": true
    }
    ```
  - Error genérico:
    ```json
    {
      "message": "Muscular group could not be modified successfully",
      "error": true
    }
    ```

---

## 9. Trainer Expertise (`/api/expertises`)

- `GET` (isAuthenticated):
  ```json
  {
    "message": "Trainment objectives has been retrieve successfully",
    "trainmentObjectives": [ ... ]
  }
  ```
- `POST` (AUDITOR) body `RegisterExpertiseDto` → `{"message": "Trainment objective has been registered successfully", "trainmentObjective": ...}`
- `PUT /{id}` (AUDITOR) body `UpdateExpertiseDto` → `{"message": "Trainment objective has been modified successfully", "trainmentObjective": ...}`

---

## 10. Trainment Plans

### 10.1 Training Plans (`/api/training-plans`)

- `POST` (AUDITOR/TRAINER) body `RegisterTrainmentPlanDto` →
  ```json
  {
    "message": "Training plan registered successfully",
    "data": { ... TrainmentPlanResponseDto ... }
  }
  ```
- `PUT` (AUDITOR/TRAINER) body `ModifyTrainmentPlanDto` → `{"message": "Training plan modified successfully", "data": ...}`
- `GET` (isAuthenticated) → lista en `data`
- `GET /{id}` → uno en `data`
- `GET /client/{clientId}` / `GET /trainer/{trainerId}` → lista en `data`
- Errores: siempre `{"message": "...", "error": true}` con mensajes específicos de client/trainer/objective/state/fechas.

### 10.2 Trainment Plan Objectives (`/api/trainment-plan/objectives`)

- `GET` (isAuthenticated):
  ```json
  {
    "message": "Trainment objectives has been retrieve successfully",
    "trainmentObjectives": [ ... ]
  }
  ```
- `POST` (AUDITOR) body `RegisterTrainmentPlanObjectiveDto`
- `PUT /{id}` (AUDITOR) body `UpdateTrainmentPlanObjectiveDto`
- Respuestas de POST/PUT: `{"message": "Trainment objective has been registered/modified successfully", "trainmentObjective": ...}`.

### 10.3 Trainment Plan States (`/api/trainment-plan/states`)

Mismo patrón que Objectives pero con `TrainmentPlanStateDto`.

### 10.4 Plan Objectives Assignments (`/api/plan-objectives`)

- `POST` (AUDITOR/TRAINER) body `AssignObjectiveDto` →
  ```json
  {
    "message": "Objective assigned successfully",
    "data": { ... AssignmentResponseDto ... }
  }
  ```
- `DELETE /{id}` (AUDITOR/TRAINER) → `{"message": "Assignment deleted successfully"}`
- `DELETE /unassign?trainmentPlanId=&objectiveId=` → `{"message": "Objective unassigned successfully"}`
- `GET` (isAuthenticated) → lista en `data` con mensaje "Assignments retrieved successfully" (idéntico para filtrados por training plan u objective).

---

## 11. Trainment Sessions (`/api/sessions`)

- `POST` (AUDITOR/TRAINER) body `RegisterSessionDto` →
  ```json
  {
    "message": "Session registered successfully",
    "data": { ... SessionResponseDto ... }
  }
  ```
- `PUT` (AUDITOR/TRAINER) body `ModifySessionDto` → `{"message": "Session modified successfully", "data": ...}`
- `GET` (isAuthenticated) → `{"message": "Sessions retrieved successfully", "data": [ ... ]}`
- `GET /{id}` → una sesión en `data`
- `GET /routine/{routineId}` → lista por rutina
- `GET /date-range?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd` → lista en `data`
- Todos los errores: `{"message": "...", "error": true}` con mensajes específicos (session/routine no encontrados, etc.).

---

## 12. Resumen de patrones de respuesta

- **Éxito (CRUD clásico):**
  - Con un elemento: `{ "message": "...", "data": { ... } }` o `{ "message": "...", "<nombreEntidad>": { ... } }`.
  - Con lista: `{ "message": "...", "data": [ ... ] }` o `{ "<pluralEntidad>": [ ... ], "message": "..." }`.
- **Errores:**
  - Siempre incluyen `"error": true` y un `"message"` con el detalle.
  - En algunos casos el `message` viene directamente de `e.getMessage()`.

Esta `COMPLETE_API_DOCUMENTATION.md` cubre todos los controllers y services de las 11 features analizadas, con los cuerpos de request y las estructuras de response que realmente construye el código.
