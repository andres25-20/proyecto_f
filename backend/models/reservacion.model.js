const mongoose = require('mongoose');

const ReservacionSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  telefono: { type: String, required: true },
  habitacion: { type: String, required: true },
  fecha_entrada: { type: Date, required: true },
  fecha_salida: { type: Date, required: true },
  precio: { type: Number, required: true, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Reservacion', ReservacionSchema);
