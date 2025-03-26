const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const assignmentsRoutes = require('./routes/assignments');
const uploadRoutes = require('./routes/xmlUpload');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

app.use('/api/assignments', assignmentsRoutes);
app.use('/api/upload-xml', uploadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
