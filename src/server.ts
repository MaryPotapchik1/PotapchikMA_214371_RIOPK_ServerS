import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import applicationRoutes from './routes/applicationRoutes';
import infoRoutes from './routes/infoRoutes';
import adminRoutes from './routes/adminRoutes';
import initDb from './config/init-db';

 
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

 
app.use(cors());
app.use(express.json());

 
app.use('/api/applications', applicationRoutes);
app.use('/api/info', infoRoutes);
app.use('/api/admin', adminRoutes);


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'business-service' });
});

 
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Внутренняя ошибка сервера' });
});

 
async function startServer() {
  try {
    console.log('Инициализация базы данных...');
    await initDb();
    console.log('База данных успешно инициализирована');
    
    app.listen(PORT, () => {
      console.log(`Business service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Ошибка при запуске сервера:', error);
    console.error('Убедитесь, что PostgreSQL запущен и доступен с указанными в .env параметрами подключения');
    process.exit(1);
  }
}

 
startServer(); 