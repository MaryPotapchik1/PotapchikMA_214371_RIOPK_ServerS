import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:4000/api/auth';

interface User {
  id: number;
  email: string;
  role: 'user' | 'admin';
}

 
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      return res.status(401).json({ message: 'Требуется авторизация' });
    }
    
    
    try {
      const response = await axios.get(`${AUTH_SERVICE_URL}/verify`, {
        headers: {
          Authorization: authHeader
        }
      });
      
      req.user = response.data.user;
      next();
    } catch (error: any) {
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      }
      
      return res.status(500).json({ message: 'Ошибка проверки авторизации' });
    }
  } catch (error) {
    console.error('Error in authenticateToken middleware:', error);
    return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Требуется авторизация' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Доступ запрещен' });
  }
  
  next();
}; 