require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const reservacionesRouter = require('./routes/reservaciones.routes');
const empleadosRouter = require('./routes/empleados.routes');
const inventarioRouter = require('./routes/inventario.routes');

const app = express();
const PORT = process.env.PORT || 4001;

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());

// Root
app.get('/', (req, res) => {
  res.json({ message: 'API Proyecto_F', version: '1.0.0' });
});

// Routers
app.use('/api/reservaciones', reservacionesRouter);
app.use('/api/empleados', empleadosRouter);
app.use('/api/inventario', inventarioRouter);

// Connect DB + start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
})
.catch(err => {
  console.error('DB connection error:', err.message);
});
