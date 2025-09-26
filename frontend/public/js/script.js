const API_BASE = 'http://localhost:4001/api';
const API_ENTITY = 'reservaciones';
const API_URL = `${API_BASE}/${API_ENTITY}`;

function qs(sel){ return document.querySelector(sel); }
function qsa(sel){ return Array.from(document.querySelectorAll(sel)); }

// --- Navegación entre pestañas (simple) ---
qsa('.tabs button').forEach(btn => {
  btn.addEventListener('click', () => {
    qsa('.tabs button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const target = btn.dataset.target;
    qsa('.panel').forEach(p => p.classList.remove('active'));
    qs(`#${target}`).classList.add('active');
  });
});

// --- Utilidades ---
function formatDate(iso){
  if(!iso) return '';
  return new Date(iso).toLocaleDateString('es-CO');
}

// --- API fetch helpers ---
async function getAll(){
  const res = await fetch(API_URL);
  if(!res.ok) throw new Error('Error al obtener');
  return res.json();
}
async function createOne(data){
  const res = await fetch(API_URL, {
    method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)
  });
  if(!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Error al crear');
  }
  return res.json();
}
async function updateOne(id, data){
  const res = await fetch(`${API_URL}/${id}`, {
    method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)
  });
  if(!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Error al actualizar');
  }
  return res.json();
}
async function deleteOne(id){
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if(!res.ok) throw new Error('Error al eliminar');
}

// --- Render tabla ---
function renderRow(item){
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${item.nombre}</td>
    <td>${item.apellido}</td>
    <td>${item.telefono}</td>
    <td>${item.habitacion}</td>
    <td>${formatDate(item.fecha_entrada)}</td>
    <td>${formatDate(item.fecha_salida)}</td>
    <td>$${item.precio}</td>
    <td>
      <button class="edit" data-id="${item._id}">Editar</button>
      <button class="delete" data-id="${item._id}">Eliminar</button>
    </td>
  `;
  return tr;
}

async function loadTable(){
  const tbody = qs('#tabla-reservaciones tbody');
  tbody.innerHTML = '';
  try {
    const items = await getAll();
    items.forEach(i => tbody.appendChild(renderRow(i)));
    attachTableListeners();
  } catch (e) {
    alert('No se pudieron cargar reservaciones.');
    console.error(e);
  }
}

// --- Formulario ---
const form = qs('#form-reservacion');

function clearForm(){
  form.reset();
  form.querySelector('input[name="_id"]').value = '';
  form.querySelector('button[type="submit"]').textContent = 'Guardar';
}

function fillForm(data){
  form.querySelector('input[name="_id"]').value = data._id || '';
  form.querySelector('input[name="nombre"]').value = data.nombre || '';
  form.querySelector('input[name="apellido"]').value = data.apellido || '';
  form.querySelector('input[name="telefono"]').value = data.telefono || '';
  form.querySelector('input[name="habitacion"]').value = data.habitacion || '';
  if(data.fecha_entrada) form.querySelector('input[name="fecha_entrada"]').value = new Date(data.fecha_entrada).toISOString().slice(0,10);
  if(data.fecha_salida) form.querySelector('input[name="fecha_salida"]').value = new Date(data.fecha_salida).toISOString().slice(0,10);
  form.querySelector('input[name="precio"]').value = data.precio || '';
  form.querySelector('button[type="submit"]').textContent = 'Actualizar';
}

function validar(){
  const nombre = form.querySelector('input[name="nombre"]').value.trim();
  const apellido = form.querySelector('input[name="apellido"]').value.trim();
  const telefono = form.querySelector('input[name="telefono"]').value.trim();
  const habitacion = form.querySelector('input[name="habitacion"]').value.trim();
  const fechaEntrada = form.querySelector('input[name="fecha_entrada"]').value;
  const fechaSalida = form.querySelector('input[name="fecha_salida"]').value;
  const precio = Number(form.querySelector('input[name="precio"]').value);

  if(!nombre || !apellido || !telefono || !habitacion || !fechaEntrada || !fechaSalida || !precio) {
    alert('Completa todos los campos correctamente.');
    return false;
  }
  if (isNaN(precio) || precio <= 0) {
    alert('Precio debe ser número positivo.');
    return false;
  }
  if(new Date(fechaEntrada) >= new Date(fechaSalida)){
    alert('Fecha entrada debe ser anterior a fecha salida.');
    return false;
  }
  return true;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if(!validar()) return;
  const id = form.querySelector('input[name="_id"]').value;
  const data = Object.fromEntries(new FormData(form));
  delete data._id;
  data.precio = Number(data.precio);
  try {
    if(id) {
      await updateOne(id, data);
      alert('Actualizado');
    } else {
      await createOne(data);
      alert('Creado');
    }
    clearForm();
    loadTable();
  } catch (err) {
    alert(err.message || 'Error');
    console.error(err);
  }
});

// --- botones editar/eliminar en la tabla ---
function attachTableListeners(){
  qsa('#tabla-reservaciones .delete').forEach(b => {
    b.addEventListener('click', async () => {
      if(!confirm('¿Eliminar registro?')) return;
      try { await deleteOne(b.dataset.id); loadTable(); } catch (e) { alert('No se pudo eliminar'); }
    });
  });

  qsa('#tabla-reservaciones .edit').forEach(b => {
    b.addEventListener('click', async () => {
      const id = b.dataset.id;
      try {
        const res = await fetch(`${API_URL}/${id}`);
        const data = await res.json();
        fillForm(data);
        // cambia a vista de Reservaciones si estás en otra tab
        qsa('.tabs button').forEach(btn => { btn.classList.toggle('active', btn.dataset.target === 'reservaciones'); });
        qsa('.panel').forEach(p => p.classList.toggle('active', p.id === 'reservaciones'));
      } catch (e) { alert('No se pudo cargar'); }
    });
  });
}

// --- Inicializar ---
document.addEventListener('DOMContentLoaded', () => {
  loadTable();
});
