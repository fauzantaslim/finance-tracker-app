import { Application, Router } from 'express';
import { deserializeToken } from '../middlewares/auth.middleware';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../docs/swagger.json';

import authRoutes from './auth.routes';
import authPrivateRoutes from './auth.private.routes';
import userRoutes from './user.routes';
import accountRoutes from './account.routes';
import categoryRoutes from './category.routes';
import transactionRoutes from './transaction.routes';
import transferRoutes from './transfer.routes';
import dashboardRoutes from './dashboard.routes';

export const registerRoutes = (app: Application): void => {
  const publicRouter = Router();
  const privateRouter = Router();

  // Swagger theme setup
  const theme = new SwaggerTheme();
  const swaggerUiOptions = {
    explorer: true,
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DRACULA).toString()
  };

  // Public routes
  publicRouter.use('/auth', authRoutes);

  // API Documentation (Public)
  publicRouter.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, swaggerUiOptions)
  );

  // Private routes middleware
  privateRouter.use(deserializeToken);

  // Register private routes
  privateRouter.use('/auth', authPrivateRoutes);
  privateRouter.use('/users', userRoutes);
  privateRouter.use('/accounts', accountRoutes);
  privateRouter.use('/categories', categoryRoutes);
  privateRouter.use('/transactions', transactionRoutes);
  privateRouter.use('/transfers', transferRoutes);
  privateRouter.use('/dashboard', dashboardRoutes);

  app.use('/api', publicRouter);
  app.use('/api', privateRouter);
};
