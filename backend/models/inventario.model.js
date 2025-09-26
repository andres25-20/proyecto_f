const mongoose = require('mongoose');

const InventarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  cantidad: { type: Number, required: true, min: 0 },
  precioUnitario: { type: Number, required: true, min: 0 },
  proveedor: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Inventario', InventarioSchema);
