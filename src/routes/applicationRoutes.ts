import express from 'express';
import { authenticateToken, authorizeAdmin } from '../middlewares/authMiddleware';
import {
  createNewApplication,
  getUserApplicationsList,
  getApplicationDetails,
  updateApplicationStatusController,
  getAllApplicationsList,
  addApplicationCommentController
} from '../controllers/applicationController';

const router = express.Router();

 
router.post('/', authenticateToken, createNewApplication);
router.get('/my', authenticateToken, getUserApplicationsList);
router.get('/:id', authenticateToken, getApplicationDetails);
router.post('/:id/comments', authenticateToken, addApplicationCommentController);

 
router.get('/', authenticateToken, authorizeAdmin, getAllApplicationsList);
router.put('/:id/status', authenticateToken, authorizeAdmin, updateApplicationStatusController);

export default router; 