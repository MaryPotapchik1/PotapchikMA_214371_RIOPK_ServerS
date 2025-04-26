import { Request, Response } from 'express';
import axios from 'axios';
import {
  createApplication,
  getUserApplications,
  getApplicationById,
  updateApplicationStatus,
  getAllApplications,
  addApplicationComment,
  getApplicationComments,
  Application
} from '../models/Application';

 
const AUTH_SERVICE_PROFILE_URL = process.env.AUTH_SERVICE_URL ? `${process.env.AUTH_SERVICE_URL}/profile/my` : 'http://localhost:4000/api/profile/my';

 
export const createNewApplication = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Требуется авторизация' });
    }

    const {
      application_type,
      requested_amount,
      purpose,
      description
    } = req.body;

    
    if (!application_type || !requested_amount || !purpose) {
      return res.status(400).json({
        message: 'Пожалуйста, заполните все обязательные поля (тип заявки, запрашиваемая сумма, цель)'
      });
    }

   
    const token = req.headers['authorization'];
    if (!token) {
      
      return res.status(401).json({ message: 'Токен авторизации не предоставлен' });
    }

    // let userProfileData;
    // try {
    //   const profileResponse = await axios.get(AUTH_SERVICE_PROFILE_URL, {
    //     headers: { Authorization: token }
    //   });
    //   userProfileData = profileResponse.data;  
    // } catch (profileError: any) {
    //   console.error('Error fetching user profile from auth-service:', profileError.response?.data || profileError.message);
    //   return res.status(500).json({ message: 'Не удалось получить данные профиля для проверки' });
    // }

    // const { profile, familyMembers } = userProfileData;

    // if (!profile || !familyMembers || familyMembers.length === 0) {
    //     return res.status(400).json({ message: 'Пожалуйста, сначала полностью заполните информацию о семье в вашем профиле.' });
    // }
 
    // if (!profile.housing_type || !profile.living_area || !profile.ownership_status) {
    //     return res.status(400).json({ message: 'Пожалуйста, сначала полностью заполните информацию о жилищных условиях в вашем профиле.' });
    // }
   

   
    const newApplication = await createApplication({
      user_id: req.user.id,
      application_type,
      requested_amount,
      purpose,
      description
    });

    if (!newApplication) {
      return res.status(500).json({ message: 'Ошибка при создании заявки' });
    }

    res.status(201).json({
      message: 'Заявка успешно создана',
      application: newApplication
    });
  } catch (error) {
    console.error('Error in createNewApplication:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

 
export const getUserApplicationsList = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Требуется авторизация' });
    }

    const applications = await getUserApplications(req.user.id);

    res.status(200).json({
      applications
    });
  } catch (error) {
    console.error('Error in getUserApplicationsList:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

 
export const getApplicationDetails = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Требуется авторизация' });
    }

    const applicationId = parseInt(req.params.id);
    
    if (isNaN(applicationId)) {
      return res.status(400).json({ message: 'Неверный идентификатор заявки' });
    }

    const application = await getApplicationById(applicationId);

    if (!application) {
      return res.status(404).json({ message: 'Заявка не найдена' });
    }

   
    if (application.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

   
    const comments = await getApplicationComments(applicationId);

 
    let userProfile = null;
    let familyMembers = [];
    if (req.user.role === 'admin') {
      try {
        const token = req.headers['authorization'];
        
        const targetUserId = application.user_id;
       
        const authServiceBaseUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:4000/api/auth';
        const profileUrl = `${authServiceBaseUrl}/profile/${targetUserId}`;
        
        console.log(`Запрос профиля для админа: ${profileUrl}`);  
        
        const profileResponse = await axios.get(profileUrl, { 
          headers: { Authorization: token }
        });
      
        userProfile = profileResponse.data.profile || null;
        familyMembers = profileResponse.data.familyMembers || [];
      } catch (profileError: any) {
        console.error(`Error fetching profile for user ${application.user_id} from auth-service:`, profileError.response?.data || profileError.message);
    
      }
    }
 

 
    res.status(200).json({
      application,
      comments,
      user_profile: userProfile,
      family_members: familyMembers
    });
  } catch (error) {
    console.error('Error in getApplicationDetails:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

 
const AUTH_SERVICE_ALL_PROFILES_URL = process.env.AUTH_SERVICE_URL 
    ? `${process.env.AUTH_SERVICE_URL}/users/profiles` 
    : 'http://localhost:4000/api/auth/users/profiles';

 
export const getAllApplicationsList = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    const { status, limit, offset } = req.query;

    const applications = await getAllApplications(
      status as Application['status'] | undefined,
      limit ? parseInt(limit as string) : undefined,
      offset ? parseInt(offset as string) : undefined
    );

  
    const userIds = [...new Set(applications.map(app => app.user_id))];  
    let profilesMap = new Map();

    if (userIds.length > 0) {
      try {
        const token = req.headers['authorization'];
         
        const profilesResponse = await axios.get(AUTH_SERVICE_ALL_PROFILES_URL, {
          headers: { Authorization: token },
      
        });
        
 
        if (profilesResponse.data && profilesResponse.data.profiles) {
            profilesResponse.data.profiles.forEach((profile: any) => {
                if (profile && profile.user_id) {
                    profilesMap.set(profile.user_id, profile);
                }
            });
        }
      } catch (profilesError: any) {
        console.error('Error fetching user profiles from auth-service for admin list:', profilesError.response?.data || profilesError.message);
         
      }
    }

    
    const applicationsWithProfiles = applications.map(app => ({
      ...app,
      user_profile: profilesMap.get(app.user_id) || null  
    }));
    

    res.status(200).json({
      applications: applicationsWithProfiles  
    });
  } catch (error) {
    console.error('Error in getAllApplicationsList:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

 
export const addApplicationCommentController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Требуется авторизация' });
    }

    const applicationId = parseInt(req.params.id);
    
    if (isNaN(applicationId)) {
      return res.status(400).json({ message: 'Неверный идентификатор заявки' });
    }

    const { comment } = req.body;

  
    if (!comment) {
      return res.status(400).json({ message: 'Текст комментария обязателен' });
    }

  
    const application = await getApplicationById(applicationId);
    
    if (!application) {
      return res.status(404).json({ message: 'Заявка не найдена' });
    }
 
    if (application.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

 
    const newComment = await addApplicationComment({
      application_id: applicationId,
      user_id: req.user.id,
      is_admin: req.user.role === 'admin',
      comment
    });

    if (!newComment) {
      return res.status(500).json({ message: 'Ошибка при добавлении комментария' });
    }

    res.status(201).json({
      message: 'Комментарий успешно добавлен',
      comment: newComment
    });
  } catch (error) {
    console.error('Error in addApplicationComment:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

 
export const updateApplicationStatusController = async (req: Request, res: Response) => {
  try {
   
    const applicationId = parseInt(req.params.id);
    
    if (isNaN(applicationId)) {
      return res.status(400).json({ message: 'Неверный идентификатор заявки' });
    }

    const { status, approved_amount, rejection_reason } = req.body;

  
    if (!status) {
      return res.status(400).json({ message: 'Статус заявки обязателен' });
    }

    
    const validStatuses: Application['status'][] = ['pending', 'reviewing', 'approved', 'rejected', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Неверный статус заявки' });
    }

   
    const currentApplication = await getApplicationById(applicationId);
    
    if (!currentApplication) {
      return res.status(404).json({ message: 'Заявка не найдена' });
    }
 
    const updatedApplication = await updateApplicationStatus(
      applicationId,
      status,
      status === 'approved' ? approved_amount : undefined,  
      status === 'rejected' ? rejection_reason : undefined  
    );

    if (!updatedApplication) {
      
      return res.status(500).json({ message: 'Ошибка при обновлении статуса заявки' });
    }

    res.status(200).json({
      message: 'Статус заявки успешно обновлен',
      application: updatedApplication
    });
  } catch (error) {
    console.error('Error in updateApplicationStatusController:', error);
     
    const errorMessage = (error instanceof Error && (error as any).message) ? (error as any).message : 'Внутренняя ошибка сервера';
    res.status(500).json({ message: errorMessage });
  }
};
 