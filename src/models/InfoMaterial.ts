import pool from '../config/db';

export interface InfoMaterial {
  id: number;
  title: string;
  content: string;
  category: string;
  created_at: Date;
  updated_at: Date;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category?: string;
  is_published: boolean;
  created_at: Date;
}

export interface ConsultationRequest {
  id: number;
  user_id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'pending' | 'in_progress' | 'completed';
  created_at: Date;
}

export async function getInfoMaterials(category?: string): Promise<InfoMaterial[]> {
  try {
    let query = 'SELECT * FROM info_materials';
    const queryParams = [];
    
    if (category) {
      query += ' WHERE category = $1';
      queryParams.push(category);
    }
    
    query += ' ORDER BY updated_at DESC';
    
    const result = await pool.query(query, queryParams);
    return result.rows;
  } catch (error) {
    console.error('Error getting info materials:', error);
    return [];
  }
}

export async function getInfoMaterialById(id: number): Promise<InfoMaterial | null> {
  try {
    const result = await pool.query('SELECT * FROM info_materials WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error getting info material by id:', error);
    return null;
  }
}

export async function createInfoMaterial(infoMaterial: Omit<InfoMaterial, 'id' | 'created_at' | 'updated_at'>): Promise<InfoMaterial | null> {
  try {
    const { title, content, category } = infoMaterial;
    
    const result = await pool.query(
      'INSERT INTO info_materials (title, content, category) VALUES ($1, $2, $3) RETURNING *',
      [title, content, category]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error creating info material:', error);
    return null;
  }
}

export async function updateInfoMaterial(
  id: number,
  infoMaterial: Partial<Omit<InfoMaterial, 'id' | 'created_at' | 'updated_at'>>
): Promise<InfoMaterial | null> {
  try {
    // Получаем текущие данные материала
    const currentMaterial = await getInfoMaterialById(id);
    if (!currentMaterial) {
      return null;
    }
    
 
    const updatedMaterial = {
      title: infoMaterial.title ?? currentMaterial.title,
      content: infoMaterial.content ?? currentMaterial.content,
      category: infoMaterial.category ?? currentMaterial.category
    };
    
    const result = await pool.query(
      'UPDATE info_materials SET title = $1, content = $2, category = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [updatedMaterial.title, updatedMaterial.content, updatedMaterial.category, id]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error updating info material:', error);
    return null;
  }
}

export async function deleteInfoMaterial(id: number): Promise<boolean> {
  try {
    const result = await pool.query('DELETE FROM info_materials WHERE id = $1', [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  } catch (error) {
    console.error('Error deleting info material:', error);
    return false;
  }
}

export async function getFAQs(category?: string): Promise<FAQ[]> {
  try {
    let query = 'SELECT * FROM faq WHERE is_published = TRUE';
    const queryParams = [];
    
    if (category) {
      query += ' AND category = $1';
      queryParams.push(category);
    }
    
    query += ' ORDER BY id ASC';
    
    const result = await pool.query(query, queryParams);
    return result.rows;
  } catch (error) {
    console.error('Error getting FAQs:', error);
    return [];
  }
}

export async function getAllFAQs(category?: string): Promise<FAQ[]> {
  try {
    let query = 'SELECT * FROM faq';
    const queryParams = [];
    
    if (category) {
      query += ' WHERE category = $1';
      queryParams.push(category);
    }
    
    query += ' ORDER BY id ASC';
    
    const result = await pool.query(query, queryParams);
    return result.rows;
  } catch (error) {
    console.error('Error getting all FAQs:', error);
    return [];
  }
}

export async function createFAQ(faq: Omit<FAQ, 'id' | 'created_at'>): Promise<FAQ | null> {
  try {
    const { question, answer, category, is_published } = faq;
    
    const result = await pool.query(
      'INSERT INTO faq (question, answer, category, is_published) VALUES ($1, $2, $3, $4) RETURNING *',
      [question, answer, category, is_published !== undefined ? is_published : true]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return null;
  }
}

export async function updateFAQ(
  id: number,
  faq: Partial<Omit<FAQ, 'id' | 'created_at'>>
): Promise<FAQ | null> {
  try {
  
    const currentFAQ = await pool.query('SELECT * FROM faq WHERE id = $1', [id]);
    
    if (currentFAQ.rows.length === 0) {
      return null;
    }
    
    const { question, answer, category, is_published } = currentFAQ.rows[0];
    
    
    const updatedFAQ = {
      question: faq.question ?? question,
      answer: faq.answer ?? answer,
      category: faq.category ?? category,
      is_published: faq.is_published !== undefined ? faq.is_published : is_published
    };
    
    const result = await pool.query(
      'UPDATE faq SET question = $1, answer = $2, category = $3, is_published = $4 WHERE id = $5 RETURNING *',
      [updatedFAQ.question, updatedFAQ.answer, updatedFAQ.category, updatedFAQ.is_published, id]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return null;
  }
}

export async function deleteFAQ(id: number): Promise<boolean> {
  try {
    const result = await pool.query('DELETE FROM faq WHERE id = $1', [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return false;
  }
}

export async function createConsultationRequest(
  request: Omit<ConsultationRequest, 'id' | 'status' | 'created_at'>
): Promise<ConsultationRequest | null> {
  try {
    const { user_id, name, email, phone, subject, message } = request;
    
    const result = await pool.query(
      'INSERT INTO consultation_requests (user_id, name, email, phone, subject, message) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [user_id, name, email, phone, subject, message]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error creating consultation request:', error);
    return null;
  }
}

export async function getConsultationRequests(
  status?: ConsultationRequest['status']
): Promise<ConsultationRequest[]> {
  try {
    let query = 'SELECT * FROM consultation_requests';
    const queryParams = [];
    
    if (status) {
      query += ' WHERE status = $1';
      queryParams.push(status);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, queryParams);
    return result.rows;
  } catch (error) {
    console.error('Error getting consultation requests:', error);
    return [];
  }
}

export async function getUserConsultationRequests(userId: number): Promise<ConsultationRequest[]> {
  try {
    const result = await pool.query(
      'SELECT * FROM consultation_requests WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    
    return result.rows;
  } catch (error) {
    console.error('Error getting user consultation requests:', error);
    return [];
  }
}

export async function updateConsultationRequestStatus(
  id: number,
  status: ConsultationRequest['status']
): Promise<ConsultationRequest | null> {
  try {
    const result = await pool.query(
      'UPDATE consultation_requests SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error updating consultation request status:', error);
    return null;
  }
} 