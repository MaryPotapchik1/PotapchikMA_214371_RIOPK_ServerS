import pool from './db';

async function initDb(): Promise<void> {
  try {
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        application_type VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        requested_amount NUMERIC NOT NULL,
        approved_amount NUMERIC,
        purpose TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

   
    await pool.query(`
      CREATE TABLE IF NOT EXISTS application_documents (
        id SERIAL PRIMARY KEY,
        application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
        document_name VARCHAR(255) NOT NULL,
        document_path TEXT NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS application_comments (
        id SERIAL PRIMARY KEY,
        application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL,
        is_admin BOOLEAN NOT NULL DEFAULT FALSE,
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

   
    await pool.query(`
      CREATE TABLE IF NOT EXISTS info_materials (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
 
    await pool.query(`
      CREATE TABLE IF NOT EXISTS faq (
        id SERIAL PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        category VARCHAR(100),
        is_published BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
  
    await pool.query(`
      CREATE TABLE IF NOT EXISTS consultation_requests (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

   
    const infoCount = await pool.query('SELECT COUNT(*) FROM info_materials');
    if (infoCount.rows[0].count === '0') {
      await pool.query(`
        INSERT INTO info_materials (title, content, category) VALUES 
        ('Материнский капитал в Республике Беларусь', 'Материнский капитал - это государственная программа поддержки семей с детьми...', 'general_info'),
        ('Получение материнского капитала', 'Для получения материнского капитала необходимо подать заявление...', 'how_to_get'),
        ('Использование материнского капитала на улучшение жилищных условий', 'Материнский капитал можно использовать для улучшения жилищных условий...', 'housing'),
        ('Использование материнского капитала на образование', 'Материнский капитал можно использовать для оплаты образования детей...', 'education'),
        ('Использование материнского капитала на лечение', 'Материнский капитал можно использовать для оплаты медицинских услуг...', 'healthcare'),
        ('Законодательство о материнском капитале', 'Основным законом, регулирующим программу материнского капитала, является...', 'legislation')
      `);
      console.log('Добавлены информационные материалы');
    }
 
    const faqCount = await pool.query('SELECT COUNT(*) FROM faq');
    if (faqCount.rows[0].count === '0') {
      await pool.query(`
        INSERT INTO faq (question, answer, category) VALUES 
        ('Кто имеет право на получение материнского капитала?', 'Право на получение материнского капитала имеют семьи, в которых родился или был усыновлен второй ребенок, начиная с 1 января 2015 года.', 'eligibility'),
        ('Какова сумма материнского капитала?', 'Сумма материнского капитала составляет 10 000 долларов США в эквиваленте.', 'amount'),
        ('Когда можно использовать материнский капитал?', 'Материнский капитал можно использовать после того, как ребенку, в связи с рождением которого возникло право на материнский капитал, исполнится 3 года.', 'timeframe'),
        ('Можно ли использовать материнский капитал на покупку автомобиля?', 'Нет, действующее законодательство не предусматривает возможность использования материнского капитала на покупку автомобиля.', 'usage'),
        ('Можно ли получить материнский капитал наличными?', 'Нет, материнский капитал нельзя получить наличными. Средства перечисляются безналичным путем на целевые нужды.', 'disbursement'),
        ('Нужно ли платить налог с материнского капитала?', 'Нет, материнский капитал не облагается налогом на доходы физических лиц.', 'taxes')
      `);
      console.log('Добавлены FAQ');
    }

    console.log('База данных инициализирована успешно');
  } catch (error) {
    console.error('Ошибка инициализации базы данных:', error);
    throw error;
  }
}

export default initDb; 