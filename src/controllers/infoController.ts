import { Request, Response } from 'express';
import {
  getInfoMaterials,
  getInfoMaterialById,
  createInfoMaterial,
  updateInfoMaterial,
  deleteInfoMaterial,
  getFAQs,
  getAllFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  createConsultationRequest,
  getConsultationRequests,
  getUserConsultationRequests,
  updateConsultationRequestStatus
} from '../models/InfoMaterial';

 
export const getInfoMaterialsList = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    
    const materials = await getInfoMaterials(category as string | undefined);
    
    res.status(200).json({
      materials
    });
  } catch (error) {
    console.error('Error in getInfoMaterialsList:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

 
export const getInfoMaterialDetails = async (req: Request, res: Response) => {
  try {
    const materialId = parseInt(req.params.id);
    
    if (isNaN(materialId)) {
      return res.status(400).json({ message: 'Неверный идентификатор материала' });
    }
    
    const material = await getInfoMaterialById(materialId);
    
    if (!material) {
      return res.status(404).json({ message: 'Материал не найден' });
    }
    
    res.status(200).json({
      material
    });
  } catch (error) {
    console.error('Error in getInfoMaterialDetails:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

 
export const createInfoMaterialController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Требуется авторизация' });
    }
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }
    
    const { title, content, category } = req.body;
    
    
    if (!title || !content || !category) {
      return res.status(400).json({
        message: 'Пожалуйста, заполните все обязательные поля (заголовок, содержание, категория)'
      });
    }
    
    const newMaterial = await createInfoMaterial({
      title,
      content,
      category
    });
    
    if (!newMaterial) {
      return res.status(500).json({ message: 'Ошибка при создании материала' });
    }
    
    res.status(201).json({
      message: 'Материал успешно создан',
      material: newMaterial
    });
  } catch (error) {
    console.error('Error in createInfoMaterial:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};
 
export const updateInfoMaterialController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Требуется авторизация' });
    }
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }
    
    const materialId = parseInt(req.params.id);
    
    if (isNaN(materialId)) {
      return res.status(400).json({ message: 'Неверный идентификатор материала' });
    }
    
    const { title, content, category } = req.body;
    
  
    const existingMaterial = await getInfoMaterialById(materialId);
    
    if (!existingMaterial) {
      return res.status(404).json({ message: 'Материал не найден' });
    }
    
    const updatedMaterial = await updateInfoMaterial(materialId, {
      title,
      content,
      category
    });
    
    if (!updatedMaterial) {
      return res.status(500).json({ message: 'Ошибка при обновлении материала' });
    }
    
    res.status(200).json({
      message: 'Материал успешно обновлен',
      material: updatedMaterial
    });
  } catch (error) {
    console.error('Error in updateInfoMaterial:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

 
export const deleteInfoMaterialController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Требуется авторизация' });
    }
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }
    
    const materialId = parseInt(req.params.id);
    
    if (isNaN(materialId)) {
      return res.status(400).json({ message: 'Неверный идентификатор материала' });
    }
    
    
    const existingMaterial = await getInfoMaterialById(materialId);
    
    if (!existingMaterial) {
      return res.status(404).json({ message: 'Материал не найден' });
    }
    
    const result = await deleteInfoMaterial(materialId);
    
    if (!result) {
      return res.status(500).json({ message: 'Ошибка при удалении материала' });
    }
    
    res.status(200).json({
      message: 'Материал успешно удален'
    });
  } catch (error) {
    console.error('Error in deleteInfoMaterial:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

 
export const getFAQsList = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    
    const faqs = await getFAQs(category as string | undefined);
    
    res.status(200).json({
      faqs
    });
  } catch (error) {
    console.error('Error in getFAQsList:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

 
export const getAllFAQsList = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Требуется авторизация' });
    }
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }
    
    const { category } = req.query;
    
    const faqs = await getAllFAQs(category as string | undefined);
    
    res.status(200).json({
      faqs
    });
  } catch (error) {
    console.error('Error in getAllFAQsList:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

 
export const createFAQController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Требуется авторизация' });
    }
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }
    
    const { question, answer, category, is_published } = req.body;
    
  
    if (!question || !answer) {
      return res.status(400).json({
        message: 'Пожалуйста, заполните все обязательные поля (вопрос, ответ)'
      });
    }
    
    const newFAQ = await createFAQ({
      question,
      answer,
      category,
      is_published
    });
    
    if (!newFAQ) {
      return res.status(500).json({ message: 'Ошибка при создании FAQ' });
    }
    
    res.status(201).json({
      message: 'FAQ успешно создан',
      faq: newFAQ
    });
  } catch (error) {
    console.error('Error in createFAQ:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

 
export const updateFAQController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Требуется авторизация' });
    }
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }
    
    const faqId = parseInt(req.params.id);
    
    if (isNaN(faqId)) {
      return res.status(400).json({ message: 'Неверный идентификатор FAQ' });
    }
    
    const { question, answer, category, is_published } = req.body;
    
    const updatedFAQ = await updateFAQ(faqId, {
      question,
      answer,
      category,
      is_published
    });
    
    if (!updatedFAQ) {
      return res.status(404).json({ message: 'FAQ не найден' });
    }
    
    res.status(200).json({
      message: 'FAQ успешно обновлен',
      faq: updatedFAQ
    });
  } catch (error) {
    console.error('Error in updateFAQ:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

 
export const deleteFAQController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Требуется авторизация' });
    }
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }
    
    const faqId = parseInt(req.params.id);
    
    if (isNaN(faqId)) {
      return res.status(400).json({ message: 'Неверный идентификатор FAQ' });
    }
    
    const result = await deleteFAQ(faqId);
    
    if (!result) {
      return res.status(404).json({ message: 'FAQ не найден' });
    }
    
    res.status(200).json({
      message: 'FAQ успешно удален'
    });
  } catch (error) {
    console.error('Error in deleteFAQ:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

 
export const createConsultationRequestController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Требуется авторизация' });
    }
    
    const { name, email, phone, subject, message } = req.body;
    
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        message: 'Пожалуйста, заполните все обязательные поля (имя, email, тема, сообщение)'
      });
    }
    
    const newRequest = await createConsultationRequest({
      user_id: req.user.id,
      name,
      email,
      phone,
      subject,
      message
    });
    
    if (!newRequest) {
      return res.status(500).json({ message: 'Ошибка при создании запроса на консультацию' });
    }
    
    res.status(201).json({
      message: 'Запрос на консультацию успешно создан',
      consultationRequest: newRequest
    });
  } catch (error) {
    console.error('Error in createConsultationRequest:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

 
export const getUserConsultationRequestsList = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Требуется авторизация' });
    }
    
    const requests = await getUserConsultationRequests(req.user.id);
    
    res.status(200).json({
      consultationRequests: requests
    });
  } catch (error) {
    console.error('Error in getUserConsultationRequestsList:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

 
export const getAllConsultationRequests = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Требуется авторизация' });
    }
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }
    
    const { status } = req.query;
    
    const requests = await getConsultationRequests(status as 'pending' | 'in_progress' | 'completed' | undefined);
    
    res.status(200).json({
      consultationRequests: requests
    });
  } catch (error) {
    console.error('Error in getAllConsultationRequests:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

 
export const updateConsultationRequestStatusController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Требуется авторизация' });
    }
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }
    
    const requestId = parseInt(req.params.id);
    
    if (isNaN(requestId)) {
      return res.status(400).json({ message: 'Неверный идентификатор запроса' });
    }
    
    const { status } = req.body;
    
    
    if (!status) {
      return res.status(400).json({ message: 'Статус запроса обязателен' });
    }
    
    
    const validStatuses = ['pending', 'in_progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Неверный статус запроса' });
    }
    
    const updatedRequest = await updateConsultationRequestStatus(requestId, status);
    
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Запрос на консультацию не найден' });
    }
    
    res.status(200).json({
      message: 'Статус запроса успешно обновлен',
      consultationRequest: updatedRequest
    });
  } catch (error) {
    console.error('Error in updateConsultationRequestStatus:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

 
export const getAllPublicFAQs = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    
 
    const faqs = await getAllFAQs(category as string | undefined);
    
    res.status(200).json({
      faqs
    });
  } catch (error) {
    console.error('Error in getAllPublicFAQs:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
}; 