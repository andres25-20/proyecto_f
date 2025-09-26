const mongoose = require('mongoose');

const EmpleadoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  cargo: { type: String, required: true },
  telefono: { type: String },
  correo: { type: String, required: true, match: /^\S+@\S+\.\S+$/ },
  salario: { type: Number, required: true, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Empleado', EmpleadoSchema);
