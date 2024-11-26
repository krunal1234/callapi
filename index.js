import express from 'express';
import 'dotenv/config';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Swagger Configuração
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API - Flex Test',
      version: '1.0.0',
      description: 'Documentação com Swagger'
    },
  },
  apis: ['/src/docs/swagger/**/*.yaml']
}

const swaggerSpec = swaggerJSDoc(options);
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css"

app.use('/api-swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss:
    '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
  customCssUrl: CSS_URL,
}));

// Start server
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});


export default app;
