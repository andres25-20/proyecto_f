const API_URL = "http://localhost:4001/api/empleados";
const form = document.getElementById("formEmpleado");
const tbody = document.getElementById("tblEmpleados");

// --- Función para mostrar toast ---
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return; // por si no existe el div

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000); // se elimina automáticamente
}

// --- Listar ---
async function cargarEmpleados() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    tbody.innerHTML = "";
    data.forEach(emp => {
      tbody.innerHTML += `
        <tr>
          <td>${emp.nombre}</td>
          <td>${emp.apellido}</td>
          <td>${emp.cargo}</td>
          <td>${emp.correo}</td>
          <td>$${emp.salario}</td>
          <td>
            <button onclick="editarEmpleado('${emp._id}')">Editar</button>
            <button onclick="eliminarEmpleado('${emp._id}')">Eliminar</button>
          </td>
        </tr>
      `;
    });
  } catch (err) {
    showToast("Error al cargar empleados", "error");
    console.error(err);
  }
}

// --- Crear / Actualizar ---
form.addEventListener("submit", async e => {
  e.preventDefault();
  const empleado = {
    nombre: form.nombre.value,
    apellido: form.apellido.value,
    cargo: form.cargo.value,
    correo: form.correo.value,
    salario: form.salario.value
  };

  const id = form.dataset.id;
  const method = id ? "PUT" : "POST";
  const url = id ? `${API_URL}/${id}` : API_URL;

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(empleado)
    });

    if (res.ok) {
      showToast(
        id ? "Empleado actualizado correctamente" : "Empleado creado correctamente",
        "success"
      );
    } else {
      showToast("Error al guardar empleado", "error");
    }

    form.reset();
    form.dataset.id = "";
    cargarEmpleados();
  } catch (err) {
    showToast("Error al guardar empleado", "error");
    console.error(err);
  }
});

// --- Editar ---
async function editarEmpleado(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const e = await res.json();
    form.nombre.value = e.nombre;
    form.apellido.value = e.apellido;
    form.cargo.value = e.cargo;
    form.correo.value = e.correo;
    form.salario.value = e.salario;
    form.dataset.id = id;
    showToast("Modo edición activado", "info");
  } catch (err) {
    showToast("Error al cargar empleado", "error");
    console.error(err);
  }
}

// --- Eliminar ---
async function eliminarEmpleado(id) {
  if (confirm("¿Eliminar empleado?")) {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Empleado eliminado", "success");
      } else {
        showToast("No se pudo eliminar", "error");
      }
      cargarEmpleados();
    } catch (err) {
      showToast("Error al eliminar empleado", "error");
      console.error(err);
    }
  }
}

cargarEmpleados();
