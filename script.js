// ===== Referencias a los elementos que ya existen en el HTML =====
const formulario = document.querySelector("#form-tarea");
const inputTarea = document.querySelector("#input-tarea");
const tablero = document.querySelector("#tablero");

// ===== Crear un botón de acción =====
// "accion" se guarda en data-accion para saber, más adelante, qué botón se presionó
function crearBoton(texto, clase, accion) {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "btn " + clase;
  boton.dataset.accion = accion; // queda como data-accion="..."
  boton.textContent = texto;
  return boton;
}

// ===== Crear una tarea (un <li class="tarea">) =====
function crearTarea(texto) {
  const tarea = document.createElement("li");
  tarea.className = "tarea";

  // Texto del usuario: usamos textContent (no innerHTML) para que no se ejecute código
  const span = document.createElement("span");
  span.className = "tarea-texto";
  span.textContent = texto;

  // Contenedor de los 4 botones de la tarea
  const acciones = document.createElement("div");
  acciones.className = "tarea-acciones";
  acciones.append(
    crearBoton("◀", "btn-mover", "anterior"),
    crearBoton("▶", "btn-mover", "siguiente"),
    crearBoton("Editar", "btn-editar", "editar"),
    crearBoton("Eliminar", "btn-eliminar", "eliminar")
  );

  // Armamos la tarjeta: el span y el div quedan como hijos del li (hermanos entre sí)
  tarea.append(span, acciones);
  return tarea;
}

// ===== CREATE: agregar una tarea desde el formulario =====
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault(); // evita que la página se recargue

  const texto = inputTarea.value.trim(); // quitamos espacios al inicio y al final

  // Si el texto está vacío, no hacemos nada
  if (texto === "") {
    return;
  }

  // TRAVERSING: la primera columna es el primer hijo del tablero ("Por hacer")
  const primeraColumna = tablero.firstElementChild;
  // TRAVERSING: bajamos desde la columna hasta su lista de tareas
  const lista = primeraColumna.querySelector(".lista-tareas");

  // READ: la tarea aparece en la lista con su texto
  lista.append(crearTarea(texto));

  // Limpiamos el campo y dejamos el cursor listo para escribir otra
  inputTarea.value = "";
  inputTarea.focus();
});

// ===== UN SOLO addEventListener en el contenedor (delegación de eventos) =====
// Todos los clics de todas las tareas llegan aquí, aunque la tarea se haya creado después
tablero.addEventListener("click", function (evento) {
  // TRAVERSING: desde lo que se clicó subimos hasta el botón más cercano
  const boton = evento.target.closest("button");

  // Si el clic no fue en un botón (por ejemplo, en el título), no hacemos nada
  if (boton === null) {
    return;
  }

  // TRAVERSING: desde el botón subimos hasta SU tarea (no otra)
  const tarea = boton.closest(".tarea");
  const accion = boton.dataset.accion; // lee data-accion del botón

  if (accion === "eliminar") {
    eliminarTarea(tarea);
  } else if (accion === "editar") {
    editarTarea(tarea, boton);
  } else if (accion === "guardar") {
    guardarTarea(tarea, boton);
  } else if (accion === "siguiente" || accion === "anterior") {
    moverTarea(tarea, accion);
  }
});

// ===== ACCIÓN PROPIA: mover la tarea a la columna siguiente o anterior =====
function moverTarea(tarea, direccion) {
  // TRAVERSING: desde la tarea subimos hasta SU columna
  const columnaActual = tarea.closest(".columna");

  // TRAVERSING: las columnas son hermanas, nos movemos de lado
  let columnaDestino;
  if (direccion === "siguiente") {
    columnaDestino = columnaActual.nextElementSibling;     // la de la derecha
  } else {
    columnaDestino = columnaActual.previousElementSibling; // la de la izquierda
  }

  // Caso límite: en la primera o última columna no hay hermana, el resultado es null
  if (columnaDestino === null) {
    return;
  }

  // TRAVERSING: bajamos desde la columna destino hasta su lista
  const listaDestino = columnaDestino.querySelector(".lista-tareas");

  // append MUEVE la tarea (no la copia): sale de su lista y entra en la nueva
  listaDestino.append(tarea);
}

// ===== DELETE: borra solo la tarea que recibió el clic =====
function eliminarTarea(tarea) {
  tarea.remove();
}

// ===== UPDATE (parte 1): cambiar el texto por un campo =====
function editarTarea(tarea, boton) {
  // TRAVERSING: el span del texto es el primer hijo de la tarea
  const span = tarea.firstElementChild;

  // Creamos un input con el texto actual
  const input = document.createElement("input");
  input.type = "text";
  input.className = "tarea-input";
  input.value = span.textContent;

  // Cambiamos el span por el input en el mismo lugar
  span.replaceWith(input);
  input.focus();

  // El botón "Editar" ahora sirve para guardar
  boton.textContent = "Guardar";
  boton.dataset.accion = "guardar";
}

// ===== UPDATE (parte 2): guardar el texto editado =====
function guardarTarea(tarea, boton) {
  // TRAVERSING: ahora el primer hijo de la tarea es el input
  const input = tarea.firstElementChild;
  const texto = input.value.trim();

  // Si quedó vacío, no guardamos: el usuario sigue editando
  if (texto === "") {
    input.focus();
    return;
  }

  // Volvemos a crear el span con el texto nuevo (textContent, no innerHTML)
  const span = document.createElement("span");
  span.className = "tarea-texto";
  span.textContent = texto;

  // Cambiamos el input por el span
  input.replaceWith(span);

  // El botón vuelve a ser "Editar"
  boton.textContent = "Editar";
  boton.dataset.accion = "editar";
}
