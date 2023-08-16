import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const router = express.Router();

const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'E-commerce Express API ',
      version: '0.1.0',
      description:
        'This is a E-commerce API application made with Express and documented with Swagger',
      license: {
        name: 'FATIHOUNE',
        url: 'https://dev.fatihoune.com',
      },
      contact: {
        name: 'E-commerce',
        url: 'https://ww.ecommerce.com',
        email: 'info@email.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: ['./models/*.js', './routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

router.use(
  '/',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);

export default router;
