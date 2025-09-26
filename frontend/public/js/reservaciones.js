const API_URL = "http://localhost:4001/api/reservaciones";
const form = document.getElementById("formReservacion");
const tbody = document.getElementById("tblReservaciones");

// --- Función para mostrar toast ---
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// --- Listar ---
async function cargarReservaciones() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    tbody.innerHTML = "";
    data.forEach(r => {
      tbody.innerHTML += `
        <tr>
          <td>${r.nombre}</td>
          <td>${r.apellido}</td>
          <td>${r.telefono}</td>
          <td>${r.habitacion}</td>
          <td>${new Date(r.fecha_entrada).toLocaleDateString()}</td>
          <td>${new Date(r.fecha_salida).toLocaleDateString()}</td>
          <td>$${r.precio}</td>
          <td>
            <button onclick="editarReservacion('${r._id}')">Editar</button>
            <button onclick="eliminarReservacion('${r._id}')">Eliminar</button>
          </td>
        </tr>
      `;
    });
  } catch (err) {
    showToast("Error al cargar reservaciones", "error");
    console.error(err);
  }
}

// --- Crear / Actualizar ---
form.addEventListener("submit", async e => {
  e.preventDefault();
  const reservacion = {
    nombre: form.nombre.value,
    apellido: form.apellido.value,
    telefono: form.telefono.value,
    habitacion: form.habitacion.value,
    fecha_entrada: form.fecha_entrada.value,
    fecha_salida: form.fecha_salida.value,
    precio: form.precio.value
  };

  const id = form.dataset.id;
  const method = id ? "PUT" : "POST";
  const url = id ? `${API_URL}/${id}` : API_URL;

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reservacion)
    });

    if (res.ok) {
      showToast(
        id ? "Reservación actualizada correctamente" : "Reservación creada con éxito",
        "success"
      );
    } else {
      showToast("Error al guardar reservación", "error");
    }

    form.reset();
    form.dataset.id = "";
    cargarReservaciones();
  } catch (err) {
    showToast("Error al guardar reservación", "error");
    console.error(err);
  }
});

// --- Editar ---
async function editarReservacion(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const r = await res.json();
    form.nombre.value = r.nombre;
    form.apellido.value = r.apellido;
    form.telefono.value = r.telefono;
    form.habitacion.value = r.habitacion;
    form.fecha_entrada.value = r.fecha_entrada.split("T")[0];
    form.fecha_salida.value = r.fecha_salida.split("T")[0];
    form.precio.value = r.precio;
    form.dataset.id = id;
    showToast("Modo edición activado", "info");
  } catch (err) {
    showToast("Error al cargar reservación", "error");
    console.error(err);
  }
}

// --- Eliminar ---
async function eliminarReservacion(id) {
  if (confirm("¿Eliminar reservación?")) {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Reservación eliminada", "success");
      } else {
        showToast("No se pudo eliminar", "error");
      }
      cargarReservaciones();
    } catch (err) {
      showToast("Error al eliminar reservación", "error");
      console.error(err);
    }
  }
}

cargarReservaciones();
