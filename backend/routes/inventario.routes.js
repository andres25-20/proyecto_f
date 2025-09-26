const express = require('express');
const router = express.Router();
const Inventario = require('../models/inventario.model');

// Listar todo el inventario
router.get('/', async (req, res) => {
  try {
    const items = await Inventario.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Inventario.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'No encontrado' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear producto
router.post('/', async (req, res) => {
  try {
    const nuevo = new Inventario(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Actualizar producto
router.put('/:id', async (req, res) => {
  try {
    const actualizado = await Inventario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!actualizado) return res.status(404).json({ message: 'No encontrado' });
    res.json(actualizado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar producto
router.delete('/:id', async (req, res) => {
  try {
    await Inventario.findByIdAndDelete(req.params.id);
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
