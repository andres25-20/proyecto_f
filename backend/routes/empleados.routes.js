const express = require('express');
const router = express.Router();
const Reservacion = require('../models/empleado.model');

// Listar todas
router.get('/', async (req, res) => {
  try {
    const items = await Reservacion.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Obtener por ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Reservacion.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'No encontrado' });
    res.json(item);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Crear
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    // Validación simple de fechas
    if (new Date(data.fecha_entrada) >= new Date(data.fecha_salida)) {
      return res.status(400).json({ message: 'fecha_entrada debe ser anterior a fecha_salida' });
    }
    const nuevo = new Reservacion(data);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// Actualizar
router.put('/:id', async (req, res) => {
  try {
    const updated = await Reservacion.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'No encontrado' });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// Eliminar
router.delete('/:id', async (req, res) => {
  try {
    await Reservacion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Empleado eliminada' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000); // se borra en 3 segundos
}

module.exports = router;
