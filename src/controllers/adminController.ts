import { Request, Response } from 'express';
import axios from 'axios'; 

 
const AUTH_SERVICE_USERS_URL = process.env.AUTH_SERVICE_URL ? `${process.env.AUTH_SERVICE_URL}/users` : 'http://localhost:4000/api/auth/users';

export const getUsersList = async (req: Request, res: Response) => {
  try {
     
    const token = req.headers['authorization'];
    if (!token) {
      
      return res.status(401).json({ message: 'Токен авторизации не найден' });
    }

     
    const response = await axios.get(AUTH_SERVICE_USERS_URL, {
      headers: {
     
        Authorization: token,
      },
    });

  
    res.status(200).json(response.data); 

  } catch (error: any) {
    console.error('Error in getUsersList controller (calling auth-service):', error.response?.data || error.message);
    
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: 'Ошибка сервера при получении списка пользователей из сервиса аутентификации' });
    }
  }
};

 