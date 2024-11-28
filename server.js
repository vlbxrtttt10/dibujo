const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = 3000;

// Configuración para almacenar los archivos
const storage = multer.diskStorage({
destination: (req, file, cb) => {
    cb(null, 'uploads/');
},
filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Usa un nombre único
}
});

const upload = multer({ storage });

// Crea una carpeta "uploads" si no existe
const fs = require('fs');
if (!fs.existsSync('uploads')) {
fs.mkdirSync('uploads');
}

// Ruta para subir los archivos
app.post('/upload', upload.array('files'), (req, res) => {
const files = req.files.map(file => ({
    name: file.originalname,
    url: `http://localhost:${PORT}/uploads/${file.filename}`
}));
  res.json(files); // Devuelve las URLs de los archivos subidos
});

// Servir los archivos subidos
app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
