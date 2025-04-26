import express from 'express';
import { authenticateToken, authorizeAdmin } from '../middlewares/authMiddleware';
import {
  getInfoMaterialsList,
  getInfoMaterialDetails,
  createInfoMaterialController,
  updateInfoMaterialController,
  deleteInfoMaterialController,
  getFAQsList,
  getAllFAQsList,
  getAllPublicFAQs,
  createFAQController,
  updateFAQController,
  deleteFAQController,
  createConsultationRequestController,
  getUserConsultationRequestsList,
  getAllConsultationRequests,
  updateConsultationRequestStatusController
} from '../controllers/infoController';

const router = express.Router();

 
router.get('/materials', getInfoMaterialsList);
router.get('/materials/:id', getInfoMaterialDetails);
router.post('/materials', authenticateToken, authorizeAdmin, createInfoMaterialController);
router.put('/materials/:id', authenticateToken, authorizeAdmin, updateInfoMaterialController);
router.delete('/materials/:id', authenticateToken, authorizeAdmin, deleteInfoMaterialController);

 
router.get('/faq', getFAQsList);
router.get('/faq/all', authenticateToken, authorizeAdmin, getAllFAQsList);
router.get('/faq/all/public', getAllPublicFAQs);
router.post('/faq', authenticateToken, authorizeAdmin, createFAQController);
router.put('/faq/:id', authenticateToken, authorizeAdmin, updateFAQController);
router.delete('/faq/:id', authenticateToken, authorizeAdmin, deleteFAQController);

 
router.post('/consultation-requests', authenticateToken, createConsultationRequestController);
router.get('/consultation-requests/my', authenticateToken, getUserConsultationRequestsList);
router.get('/consultation-requests', authenticateToken, authorizeAdmin, getAllConsultationRequests);
router.put('/consultation-requests/:id/status', authenticateToken, authorizeAdmin, updateConsultationRequestStatusController);

export default router; 