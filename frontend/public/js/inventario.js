const API_URL = "http://localhost:4001/api/inventario";
const form = document.getElementById("formInventario");
const tbody = document.getElementById("tblInventario");

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
async function cargarInventario() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    tbody.innerHTML = "";
    data.forEach(item => {
      tbody.innerHTML += `
        <tr>
          <td>${item.nombre}</td>
          <td>${item.cantidad}</td>
          <td>$${item.precioUnitario}</td>
          <td>${item.proveedor}</td>
          <td>
            <button onclick="editarItem('${item._id}')">Editar</button>
            <button onclick="eliminarItem('${item._id}')">Eliminar</button>
          </td>
        </tr>
      `;
    });
  } catch (err) {
    showToast("Error al cargar inventario", "error");
    console.error(err);
  }
}

// --- Crear / Actualizar ---
form.addEventListener("submit", async e => {
  e.preventDefault();
  const item = {
    nombre: form.nombre.value,
    cantidad: form.cantidad.value,
    precioUnitario: form.precioUnitario.value,
    proveedor: form.proveedor.value
  };

  const id = form.dataset.id;
  const method = id ? "PUT" : "POST";
  const url = id ? `${API_URL}/${id}` : API_URL;

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item)
    });

    if (res.ok) {
      showToast(
        id ? "Producto actualizado correctamente" : "Producto agregado correctamente",
        "success"
      );
    } else {
      showToast("Error al guardar producto", "error");
    }

    form.reset();
    form.dataset.id = "";
    cargarInventario();
  } catch (err) {
    showToast("Error al guardar producto", "error");
    console.error(err);
  }
});

// --- Editar ---
async function editarItem(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const i = await res.json();
    form.nombre.value = i.nombre;
    form.cantidad.value = i.cantidad;
    form.precioUnitario.value = i.precioUnitario;
    form.proveedor.value = i.proveedor;
    form.dataset.id = id;
    showToast("Modo edición activado", "info");
  } catch (err) {
    showToast("Error al cargar producto", "error");
    console.error(err);
  }
}

// --- Eliminar ---
async function eliminarItem(id) {
  if (confirm("¿Eliminar producto?")) {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Producto eliminado", "success");
      } else {
        showToast("No se pudo eliminar", "error");
      }
      cargarInventario();
    } catch (err) {
      showToast("Error al eliminar producto", "error");
      console.error(err);
    }
  }
}

cargarInventario();
