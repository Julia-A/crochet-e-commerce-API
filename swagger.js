const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Crochet E-commerce API',
      version: '1.0.0',
      description: 'Backend API for a crochet e-commerce store'
    },
    servers: [
      {
        url: 'https://crochet-e-commerce-api.onrender.com',
        description: 'Local dev server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js']
};



module.exports = swaggerJSDoc(options);