# Tablero Kanban · DOM Traversing

Proyecto 6 del Grupo Front I (CESDE - Comfama), Momento 2: DOM Traversing.

Tablero con tres columnas (Por hacer, En progreso, Hecho). Cada tarea se puede crear, editar, eliminar y mover a la columna siguiente o anterior, usando solo HTML, CSS y JavaScript puro.

## Cómo verlo

Abrir `index.html` en el navegador.

## Traversing usado

- `closest("button")`, `closest(".tarea")`, `closest(".columna")`: subir desde el botón hasta su tarjeta y su columna.
- `nextElementSibling` / `previousElementSibling`: pasar a la columna de al lado.
- `firstElementChild` y `querySelector(".lista-tareas")`: bajar a la primera columna y a su lista.
- Un solo `addEventListener("click")` en `#tablero` (delegación de eventos).
