import express, { Response, Request, Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { registerRoutes } from './routes';
import { errorMiddleware } from './middlewares/error.middleware';

const app: Application = express();

app.set('trust proxy', 1);

const corsOptions = {
  origin: ['http://localhost:3001', 'http://localhost:5173'],
  methods: 'GET,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'Content-Type']
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json('Welcome to SIM Service');
});

// Register routes
registerRoutes(app);

// Error handling middleware
app.use(errorMiddleware);

app.use((req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({
    status_code: StatusCodes.NOT_FOUND,
    message: ReasonPhrases.NOT_FOUND
  });
});

export default app;
