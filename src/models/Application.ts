import pool from '../config/db';

export interface Application {
  id: number;
  user_id: number;
  application_type: 'housing' | 'education' | 'healthcare' | 'other';
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'completed';
  requested_amount: number;
  approved_amount?: number;
  rejection_reason?: string;
  purpose: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ApplicationComment {
  id: number;
  application_id: number;
  user_id: number;
  is_admin: boolean;
  comment: string;
  created_at: Date;
}

export async function createApplication(
  applicationData: Omit<Application, 'id' | 'status' | 'created_at' | 'updated_at'>
): Promise<Application | null> {
  try {
    const {
      user_id,
      application_type,
      requested_amount,
      purpose,
      description
    } = applicationData;

    const result = await pool.query(
      `INSERT INTO applications 
       (user_id, application_type, requested_amount, purpose, description) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [user_id, application_type, requested_amount, purpose, description]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error creating application:', error);
    return null;
  }
}

export async function getUserApplications(userId: number): Promise<Application[]> {
  try {
    const result = await pool.query(
      'SELECT id, user_id, application_type, status, requested_amount, approved_amount, rejection_reason, purpose, description, created_at, updated_at FROM applications WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    
    return result.rows;
  } catch (error) {
    console.error('Error getting user applications:', error);
    return [];
  }
}

export async function getApplicationById(id: number): Promise<Application | null> {
  try {
    const result = await pool.query('SELECT id, user_id, application_type, status, requested_amount, approved_amount, rejection_reason, purpose, description, created_at, updated_at FROM applications WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error getting application by id:', error);
    return null;
  }
}

export async function updateApplicationStatus(
  id: number,
  status: Application['status'],
  approved_amount?: number,
  rejection_reason?: string
): Promise<Application | null> {
  try {
    let query: string;
    let queryParams: any[];

    if (status === 'rejected') {
      query = 'UPDATE applications SET status = $1, approved_amount = NULL, rejection_reason = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *';
      queryParams = [status, rejection_reason, id];
    } else if (status === 'approved' && approved_amount !== undefined) {
      query = 'UPDATE applications SET status = $1, approved_amount = $2, rejection_reason = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *';
      queryParams = [status, approved_amount, id];
    } else {
      query = 'UPDATE applications SET status = $1, rejection_reason = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *';
      queryParams = [status, id];
    }

    const result = await pool.query(query, queryParams);

    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error updating application status:', error);
    return null;
  }
}

export async function getAllApplications(
  status?: Application['status'],
  limit: number = 20,
  offset: number = 0
): Promise<Application[]> {
  try {
    let query = 'SELECT id, user_id, application_type, status, requested_amount, approved_amount, rejection_reason, purpose, description, created_at, updated_at FROM applications';
    const queryParams: any[] = [];
    
    if (status) {
      query += ' WHERE status = $' + (queryParams.length + 1);
      queryParams.push(status);
    }
    
    query += ' ORDER BY created_at DESC LIMIT $' + (queryParams.length + 1) + ' OFFSET $' + (queryParams.length + 2);
    queryParams.push(limit, offset);
    
    const result = await pool.query(query, queryParams);
    
    return result.rows;
  } catch (error) {
    console.error('Error getting all applications:', error);
    return [];
  }
}

export async function addApplicationComment(
  comment: Omit<ApplicationComment, 'id' | 'created_at'>
): Promise<ApplicationComment | null> {
  try {
    const { application_id, user_id, is_admin, comment: commentText } = comment;
    
    const result = await pool.query(
      'INSERT INTO application_comments (application_id, user_id, is_admin, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [application_id, user_id, is_admin, commentText]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error adding application comment:', error);
    return null;
  }
}

export async function getApplicationComments(applicationId: number): Promise<ApplicationComment[]> {
  try {
    const result = await pool.query(
      'SELECT * FROM application_comments WHERE application_id = $1 ORDER BY created_at',
      [applicationId]
    );
    
    return result.rows;
  } catch (error) {
    console.error('Error getting application comments:', error);
    return [];
  }
} 