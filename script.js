// html
const tareaForm = document.getElementById("tarea-form");
const modal = document.getElementById("modal");
const btnAbrirTareaForm = document.getElementById("btn-abrir-tarea-form");
const btnCerrarTareaForm = document.getElementById("btn-cerrar-tarea-form");
const btnAgregarActualizarTarea = document.getElementById("btn-agregar-actualizar-tarea");
const btnCancelar = document.getElementById("btn-cancelar");
const btnDescartar = document.getElementById("btn-descartar");
const contenedorTareas = document.getElementById("contenedor-tareas");
const inputTitulo = document.getElementById("input-titulo");
const inputFecha = document.getElementById("input-fecha");
const inputDescripcion = document.getElementById("input-descripcion");
const filtroT = document.getElementById("filtro-tareas");
const ordenarTareas = document.getElementById("ordenar-tareas");
const btnEliminrCompletds = document.getElementById("btn-eliminar-tareas");
const btnEliminrTods = document.getElementById("btn-eliminar-todas-tareas");

// cargar el localStorage o empezar en vacio
let datosDTareas = JSON.parse(localStorage.getItem("data")) || [];
let tareaActual = {};

// caracteres especiales
const elimCaracSpe = (str) => {
  return str.trim().replace(/[^A-Za-z0-9\-\s]/g, '');
};

// agregar o actualizar una tarea
const agreTareaOactualizr = () => {
  if (!inputTitulo.value.trim()) {
    alert("Por favor, proporciona un título");
    return;
  }

  const fechaActual = new Date().toISOString().split('T')[0];
  const fechaTarea = inputFecha.value || (tareaActual.id ? tareaActual.date : fechaActual);
  
  const indiceDatos = datosDTareas.findIndex((item) => item.id === tareaActual.id);

  const objetoTarea = {
    id: tareaActual.id || `${elimCaracSpe(inputTitulo.value).toLowerCase().split(" ").join("-")}-${Date.now()}`,
    title: elimCaracSpe(inputTitulo.value),
    date: fechaTarea,
    description: elimCaracSpe(inputDescripcion.value),
    completada: tareaActual.completada || false
  };

  if (indiceDatos === -1) {
    datosDTareas.unshift(objetoTarea);
  } else {
    datosDTareas[indiceDatos] = objetoTarea;
  }

  localStorage.setItem("data", JSON.stringify(datosDTareas));
  actualizrContndr();
  reiniciar();
};

//actualizar el contenedor
const actualizrContndr = () => {
  contenedorTareas.innerHTML = "";

  datosDTareas.forEach(({ id, title, date, description, completada }) => {
    const descripcionCorta = description.length > 60;
    contenedorTareas.innerHTML += `
      <div class="tarea" id="${id}">
        <p><strong>Título:</strong> ${title}</p>
        <p><strong>Fecha:</strong> ${date}</p>
        <p class="descripcion"><strong>Descripción:</strong> ${description}</p>
        ${descripcionCorta ? '<button onclick="toggleDescripcion(this)" type="button" class="btn">Leer más</button>' : ''}
        <div id="acomdr-btns">
          <button onclick="editarTarea(this)" type="button" class="btn">Editar</button>
          <button onclick="eliminarTarea(this)" type="button" class="btn">Eliminar</button>
          <button onclick="markrCompltda(this)" type="button" class="btn">${completada ? "completa ✅" : "le falta❌"}</button>
        </div>
        </div>
    `;
  });
};

// eliminar
const eliminarTarea = (btnEste) => {
  const indiceDatos = datosDTareas.findIndex((item) => item.id === btnEste.parentElement.parentElement.id);

  btnEste.parentElement.parentElement.remove();

  datosDTareas.splice(indiceDatos, 1);

  localStorage.setItem("data", JSON.stringify(datosDTareas));
};

// editar
const editarTarea = (btnEste) => {
  const indiceDatos = datosDTareas.findIndex((item) => item.id === btnEste.parentElement.parentElement.id);

  tareaActual = datosDTareas[indiceDatos];

  inputTitulo.value = tareaActual.title;
  inputFecha.value = tareaActual.date;
  inputDescripcion.value = tareaActual.description;

  btnAgregarActualizarTarea.innerText = "Actualizar";

  tareaForm.classList.toggle("oculto");
};


const reiniciar = () => {
  btnAgregarActualizarTarea.innerText = "Agregar";
  inputTitulo.value = "";
  inputFecha.value = "";
  inputDescripcion.value = "";
  tareaForm.classList.toggle("oculto");
  tareaActual = {};
};

// Si hay datos, actualizar el contenedor
if (datosDTareas.length) {
  actualizrContndr();
}

//abrir el formulario
btnAbrirTareaForm.addEventListener("click", () => tareaForm.classList.toggle("oculto"));

// cerrar el formulario
btnCerrarTareaForm.addEventListener("click", () => {

  const tareaFormContieneValores = inputTitulo.value || inputFecha.value || inputDescripcion.value;
  
  const valoresTareaFormActualizados = inputTitulo.value !== tareaActual.title || inputFecha.value !== tareaActual.date || inputDescripcion.value !== tareaActual.description;

  if (tareaFormContieneValores && valoresTareaFormActualizados) {
    modal.showModal();
  } else {
    reiniciar();
  }
});

//cancelar el cierre del formulario
btnCancelar.addEventListener("click", () => modal.close());

// descartar los cambios
btnDescartar.addEventListener("click", () => {
  modal.close();
  reiniciar();
});

// submit
tareaForm.addEventListener("submit", (e) => {
  e.preventDefault();

  agreTareaOactualizr();
});

// Eliminar completas
btnEliminrCompletds.addEventListener("click", () => {
  datosDTareas = datosDTareas.filter(tarea => !tarea.completada);
  localStorage.setItem("data", JSON.stringify(datosDTareas));
  actualizrContndr();
});

// Eliminar todoo del localstor
btnEliminrTods.addEventListener("click", () => {
  datosDTareas.length = 0; 
  localStorage.setItem("data", JSON.stringify(datosDTareas));
  actualizrContndr();
});

// Marcar como completada
const markrCompltda = (btnEste) => {
  const indiceDatos = datosDTareas.findIndex((item) => item.id === btnEste.parentElement.parentElement.id);
  datosDTareas[indiceDatos].completada = !datosDTareas[indiceDatos].completada;
  localStorage.setItem("data", JSON.stringify(datosDTareas));
  actualizrContndr();
};

// Filtrar
filtroT.addEventListener("change", () => {
  const filtro = filtroT.value;
  const tareasChidas = JSON.parse(localStorage.getItem("data")) || [];
  
  switch(filtro) {
    case "pendientes":
      datosDTareas.length = 0;
      tareasChidas.filter(tarea => !tarea.completada).forEach(tarea => datosDTareas.push(tarea));
      break;
    case "completadas":
      datosDTareas.length = 0;
      tareasChidas.filter(tarea => tarea.completada).forEach(tarea => datosDTareas.push(tarea));
      break;
    default:
      datosDTareas.length = 0;
      tareasChidas.forEach(tarea => datosDTareas.push(tarea));
  }
  
  actualizrContndr();
});

// Ordenar tareas
ordenarTareas.addEventListener("change", () => {
  const orden = ordenarTareas.value;
  
  switch(orden) {
    case "fecha-ascendente":
      datosDTareas.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      break;
    case "fecha-descendente":
      datosDTareas.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      break;
    default:
      break;
  }
  
  actualizrContndr();
});

// Toggle Descripcion
const toggleDescripcion = (btnEste) => {
  const descripcion = btnEste.previousElementSibling;
  descripcion.classList.toggle("expandida");
  btnEste.innerText = descripcion.classList.contains("expandida") ? "Leer menos" : "Leer más";
};

//description retractil