import express from 'express';
import { authenticateToken, authorizeAdmin } from '../middlewares/authMiddleware'; 
import { getUsersList } from '../controllers/adminController';

const router = express.Router();
 
router.get('/users', authenticateToken, authorizeAdmin, getUsersList); 

 

export default router; 