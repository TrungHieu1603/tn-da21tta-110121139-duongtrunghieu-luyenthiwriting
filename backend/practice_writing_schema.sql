-- Practice Writing Feature Database Schema

-- Table for storing practice exercises
CREATE TABLE practice_exercises (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    exercise_type ENUM('vstep_task1', 'vstep_task2', 'ielts_academic', 'ielts_general') NOT NULL,
    difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'intermediate',
    is_vip BOOLEAN DEFAULT FALSE,
    exercise_number INT NOT NULL, -- Exercise number for display (01, 02, 03...)
    prompt TEXT NOT NULL, -- The exercise prompt/question
    context TEXT, -- Additional context or email content for task 1
    instructions TEXT, -- Specific instructions for the exercise
    time_limit INT DEFAULT 20, -- Time limit in minutes
    min_words INT DEFAULT 120, -- Minimum word count
    max_words INT DEFAULT 250, -- Maximum word count  
    total_attempts INT DEFAULT 0, -- Track popularity
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_exercise (exercise_type, exercise_number),
    INDEX idx_exercise_type (exercise_type),
    INDEX idx_is_vip (is_vip),
    INDEX idx_difficulty (difficulty_level)
);

-- Table for storing user practice submissions
CREATE TABLE practice_submissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    exercise_id INT NOT NULL,
    content TEXT NOT NULL, -- User's written response
    word_count INT NOT NULL,
    time_spent INT, -- Time spent in seconds
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES practice_exercises(id) ON DELETE CASCADE,
    INDEX idx_user_submissions (user_id, submitted_at),
    INDEX idx_exercise_submissions (exercise_id)
);

-- Table for storing AI scores and feedback for practice submissions
CREATE TABLE practice_scores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    submission_id INT NOT NULL,
    user_id INT NOT NULL,
    exercise_id INT NOT NULL,
    
    -- Scores (0-10 scale)
    task_fulfillment_score DECIMAL(3,1),
    organization_score DECIMAL(3,1), 
    vocabulary_score DECIMAL(3,1),
    grammar_score DECIMAL(3,1),
    overall_score DECIMAL(3,1),
    
    -- AI Feedback
    task_fulfillment_feedback TEXT,
    organization_feedback TEXT,
    vocabulary_feedback TEXT,
    grammar_feedback TEXT,
    overall_feedback TEXT,
    
    -- Corrections (JSON format)
    grammar_corrections JSON,
    vocabulary_suggestions JSON,
    structure_improvements JSON,
    
    -- Timestamps
    scored_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (submission_id) REFERENCES practice_submissions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES practice_exercises(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_submission_score (submission_id),
    INDEX idx_user_scores (user_id, scored_at)
);

-- Insert sample data for testing
INSERT INTO practice_exercises (title, exercise_type, is_vip, exercise_number, prompt, context, instructions, time_limit, min_words, max_words) VALUES

-- VSTEP Task 1 (Email) exercises
('Asking for Information', 'vstep_task1', FALSE, 1, 'Write an email to respond to Brianna.', 'Great to hear that you are going to visit Dubai! I''m sure you will have a wonderful time there. Don''t worry, I''ll look after your house and your pet while you are away. I just want to know the time you leave for Dubai and when you will be back. I don''t have a lot of experience looking after animals, so tell me how to care for your pet. Also, are there any other household duties I am supposed to do?\n\nLots of love,\nBrianna', 'You should write at least 120 words. Do not include your name. Your response will be evaluated in terms of Task Fulfillment, Organization, Vocabulary and Grammar.', 20, 120, 250),

('Job Application Follow-up', 'vstep_task1', TRUE, 2, 'Write an email to follow up on your job application.', 'Dear Candidate,\n\nThank you for your interest in the Marketing Manager position at our company. We have received your application and are currently reviewing all submissions. Due to the high volume of applications, the selection process may take longer than initially expected.\n\nWe will contact shortlisted candidates within the next two weeks. Please do not hesitate to contact us if you have any questions.\n\nBest regards,\nHR Department', 'Write a professional follow-up email. You should write at least 120 words. Do not include your name.', 20, 120, 250),

-- VSTEP Task 2 (Essay) exercises  
('Online Learning vs Traditional Learning', 'vstep_task2', FALSE, 1, 'Some people believe that online learning is more effective than traditional classroom learning, while others disagree. Discuss both views and give your own opinion.', NULL, 'You should write at least 250 words. Your response will be evaluated in terms of Task Fulfillment, Organization, Vocabulary and Grammar.', 40, 250, 400),

('Environmental Protection', 'vstep_task2', TRUE, 2, 'Many people believe that environmental protection is the responsibility of governments, while others think individuals should take action. Discuss both views and give your opinion.', NULL, 'You should write at least 250 words. Support your arguments with relevant examples.', 40, 250, 400),

-- IELTS Academic exercises
('Chart Description', 'ielts_academic', FALSE, 1, 'The chart below shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.', NULL, 'You should write at least 150 words. You should spend about 20 minutes on this task.', 20, 150, 200),

('Process Diagram', 'ielts_academic', TRUE, 2, 'The diagram below shows the process of recycling plastic bottles. Summarize the information by selecting and reporting the main features.', NULL, 'You should write at least 150 words. You should spend about 20 minutes on this task.', 20, 150, 200),

-- IELTS General Training exercises
('Complaint Letter', 'ielts_general', FALSE, 1, 'You recently bought a piece of equipment for your kitchen but it did not work. You phoned the shop but no action was taken. Write a letter to the shop manager.', NULL, 'In your letter:\n- Describe the problem with the equipment\n- Explain what happened when you phoned the shop\n- Say what you would like the manager to do\n\nYou should write at least 150 words.', 20, 150, 200),

('Thank You Letter', 'ielts_general', TRUE, 2, 'You stayed at your friend''s house when you participated in a business seminar in Australia. You left a file with important documents in your room. Write a letter to your friend.', NULL, 'In your letter:\n- Thank your friend for the stay\n- Describe the file that you left\n- Ask your friend to return it\n\nYou should write at least 150 words.', 20, 150, 200);