import express from 'express';
import dotenv from 'dotenv';

import swaggerRoutes from './docs/swagger.js';

//Création de l'application express
const app = express();
dotenv.config();

import authRoutes from './routes/auth.js';

app.use('/api/auth', authRoutes);
app.use('/api/docs', swaggerRoutes);
//Start the server
app.listen(process.env.PORT, () => {
  console.log(`Demarrage sur le port ${process.env.PORT}`);
});

// https://blog.logrocket.com/documenting-express-js-api-swagger/
