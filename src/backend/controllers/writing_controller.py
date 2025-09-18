from flask import jsonify, request
from ..models import WritingScore, CombinedWritingScore, db, UserCredits
from ..schemas import writing_score_schema, writing_scores_schema
from flask_jwt_extended import jwt_required, get_jwt_identity
from openai import OpenAI
import json
import re
import sys
from ..config.config import Config

client = OpenAI(api_key=Config.OPENAI_API_KEY)

CREDITS_PER_ANALYSIS = 1  # Define how many credits each analysis costs

def ielts_round(score):

    if score is None:
        return 0.0
        
    # Get the integer and decimal parts
    integer_part = int(score)
    decimal_part = score - integer_part
    
    # Round to 2 decimal places to handle floating point precision
    decimal_part = round(decimal_part, 2)
    
    # Apply IELTS rounding rules
    if decimal_part == 0.0 or decimal_part == 0.5:
        # No change needed
        return float(integer_part + decimal_part)
    elif decimal_part == 0.25:
        # Round up to .5
        return float(integer_part + 0.5)
    elif decimal_part == 0.75:
        # Round up to next whole number
        return float(integer_part + 1.0)
    elif decimal_part in [0.2, 0.3]:
        # Round down to .0
        return float(integer_part)
    elif decimal_part in [0.7, 0.8]:
        # Round up to .5
        return float(integer_part + 0.5)
    elif decimal_part < 0.25:
        # Round down to .0 (for values like .1, .15)
        return float(integer_part)
    elif decimal_part < 0.5:
        # Round up to .5 (for values like .35, .4, .45)
        return float(integer_part + 0.5)
    elif decimal_part < 0.75:
        # Round down to .5 (for values like .55, .6, .65)
        return float(integer_part + 0.5)
    else:
        # Round up to next whole number (for values like .85, .9, .95)
        return float(integer_part + 1.0)

def calculate_overall_score(scores):
    if not scores or len(scores) == 0:
        return 0.0
    
    average_score = sum(scores) / len(scores)
    return ielts_round(average_score)

def calculate_word_count_penalty(word_count, task_type):
    min_words = 150 if task_type == 'task1' else 250
    if word_count >= min_words:
        return 0.0
    
    # Calculate penalty: 0.5 points for every 25 words short
    words_short = min_words - word_count
    penalty = (words_short / 25) * 0.5
    return min(penalty, 2.0)  # Maximum penalty of 2.0 points

def calculate_time_penalty(time_spent, task_type):
    """Calculate penalty for exceeding time limit."""
    if not time_spent:
        return 0.0
    
    # Time limits in minutes
    time_limit = 20 if task_type == 'task1' else 40  # 20 min for task1, 40 min for task2
    time_limit_seconds = time_limit * 60
    
    if time_spent <= time_limit_seconds:
        return 0.0
    
    # Calculate penalty: 0.1 points for every minute over
    minutes_over = (time_spent - time_limit_seconds) / 60
    penalty = minutes_over * 0.1
    return min(penalty, 1.0)  # Maximum penalty of 1.0 point

def find_text_positions(essay_text, corrections):
    """Find positions of corrections in the essay text for highlighting."""
    highlighted_corrections = {
        'grammar': [],
        'vocabulary': [],
        'structure': []
    }
    
    for category in ['grammar', 'vocabulary', 'structure']:
        if category in corrections:
            for correction in corrections[category]:
                original_text = correction.get('original', '')
                if original_text and category != 'structure':  # Structure corrections don't have specific text positions
                    # Find all occurrences of the original text
                    positions = []
                    start = 0
                    while True:
                        pos = essay_text.find(original_text, start)
                        if pos == -1:
                            break
                        positions.append({
                            'start': pos,
                            'end': pos + len(original_text),
                            'text': original_text
                        })
                        start = pos + 1
                    
                    if positions:
                        correction_with_positions = correction.copy()
                        correction_with_positions['positions'] = positions
                        highlighted_corrections[category].append(correction_with_positions)
                    else:
                        highlighted_corrections[category].append(correction)
                else:
                    highlighted_corrections[category].append(correction)
    
    return highlighted_corrections

def analyze_essay(essay_text, task_type, prompt=None, context=None, instructions=None, source=None):
    """Analyze essay using GPT-4 and return scores, feedback, and corrections with highlighting."""
    
    # Setup file logging
    import datetime
    log_file = f"backend/logs/gpt_analysis_{datetime.datetime.now().strftime('%Y%m%d')}.log"
    import os
    os.makedirs(os.path.dirname(log_file), exist_ok=True)
    
    def log_to_file(message):
        with open(log_file, 'a', encoding='utf-8') as f:
            timestamp = datetime.datetime.now().strftime('%H:%M:%S')
            f.write(f"[{timestamp}] {message}\n")
    
    log_to_file(f"=== ANALYZE_ESSAY START ===")
    log_to_file(f"Task Type: {task_type}")
    log_to_file(f"Prompt: {prompt}")
    log_to_file(f"Essay Length: {len(essay_text)} chars")
    log_to_file(f"Context: {context}")
    log_to_file(f"Instructions: {instructions}")
    log_to_file(f"Source: {source}")
    
    system_prompt = """You are a STRICT IELTS examiner who MUST penalize off-topic or incorrectly formatted responses heavily.
    Your primary job is to check if the student has completed the EXACT task requested. If they haven't, you MUST give very low scores regardless of language quality.
    
    CRITICAL RULE: If the content doesn't match the task prompt or has wrong format, Task Achievement MUST be 0-2.
    
    You MUST respond in the following JSON format only:
    {
        "scores": {
            "task_achievement": <score 0-9>,
            "coherence_cohesion": <score 0-9>,
            "lexical_resource": <score 0-9>,
            "grammatical_range": <score 0-9>
        },
        "feedback": {
            "task_achievement": "<detailed feedback about how well the response addresses the specific task prompt, format requirements, and task completion>",
            "coherence_cohesion": "<detailed feedback>",
            "lexical_resource": "<detailed feedback>",
            "grammatical_range": "<detailed feedback>"
        },
        "corrections": {
            "grammar": [
                {
                    "original": "<exact text from essay>",
                    "correction": "<corrected text>",
                    "explanation": "<why this correction is needed>"
                }
            ],
            "vocabulary": [
                {
                    "original": "<exact word/phrase from essay>",
                    "suggestion": "<better word/phrase>",
                    "explanation": "<why this word is better>"
                }
            ],
            "structure": [
                {
                    "issue": "<structural issue description>",
                    "suggestion": "<how to improve the structure>",
                    "example": "<example of improved structure>"
                }
            ]
        }
    }
    
    IMPORTANT: For grammar and vocabulary corrections, use the EXACT text as it appears in the essay for the "original" field.
    This is crucial for text highlighting functionality.
    
    For each criterion:
    1. Score must be between 0-9 (allowing 0.5 increments)
    2. Feedback must include:
       - Strengths
       - Areas for improvement
       - Specific examples from the text
       - Suggestions for improvement
    
    For corrections:
    1. Grammar: Identify grammatical errors and provide corrections using exact text from essay
    2. Vocabulary: Suggest better word choices using exact words/phrases from essay
    3. Structure: Suggest improvements for sentence and paragraph structure
    
    CRITICAL SCORING GUIDELINES - ZERO TOLERANCE FOR TASK DEVIATION:
    
    **TASK ACHIEVEMENT/RESPONSE SCORING (MOST CRITICAL):**
    YOU MUST BE RUTHLESS - DO NOT BE LENIENT:
    - Score 0: Completely different topic (e.g., social media when asked about house-sitting)
    - Score 1: Wrong topic + wrong format (essay when email required)
    - Score 2: Correct general topic but completely wrong format 
    - Score 3: Partially relevant but misses most key requirements
    - Score 4: Addresses some aspects but significant gaps
    - Score 5-6: Adequate task completion with minor issues
    - Score 7-8: Good task completion
    - Score 9: Perfect task completion
    
    WARNING: DO NOT give high scores just because the English is good. TASK COMPLETION IS EVERYTHING.
    
    **EMAIL/LETTER FORMAT REQUIREMENTS (Task 1):**
    If task requires an EMAIL/LETTER, the response MUST include:
    - Appropriate greeting (Dear Brianna, Hi, etc.)
    - Clear purpose statement related to the specific situation
    - Direct responses to ALL questions/requests in the prompt
    - Appropriate closing (Best regards, etc.)
    - Conversational tone appropriate for relationship
    
    **ESSAY FORMAT REQUIREMENTS (Task 2):**
    If task requires an ESSAY, the response MUST:
    - Have clear introduction with thesis statement addressing the specific question
    - Body paragraphs with arguments relevant to the exact topic given
    - Conclusion that summarizes position on the specific issue
    - Academic tone throughout
    
    **MANDATORY SEVERE PENALTIES - NO EXCEPTIONS:**
    YOU MUST APPLY THESE PENALTIES STRICTLY:
    - Content about completely different topic = Task Achievement 0 (MANDATORY)
    - Wrong topic + wrong format = Task Achievement 0-1 (MANDATORY)
    - Correct topic but wrong format = Task Achievement 1-2 (MANDATORY)
    - Missing major prompt requirements = Task Achievement maximum 3 (MANDATORY)
    - Generic content not addressing specific context = Task Achievement maximum 3 (MANDATORY)
    
    **REAL EXAMPLES - APPLY THESE EXACT SCORES:**
    - Task: "Write email to Brianna about house-sitting" + Response: "Essay about social media regulation" = Task Achievement 0
    - Task: "Write email about travel plans" + Response: "Academic essay about education" = Task Achievement 0
    - Task: "Discuss music bringing people together" + Response: "Essay about technology impact" = Task Achievement 0
    - Task: "Write informal email" + Response: "Formal business letter format" = Task Achievement 2-3
    
    REMEMBER: Perfect grammar cannot save a response that fails the basic task. BE RUTHLESS.
    """

    # Build comprehensive user prompt with task context
    user_prompt_parts = [f"Please analyze this IELTS Writing {task_type} essay and respond in the required JSON format:"]
    
    # Add task information if available
    if prompt:
        user_prompt_parts.append(f"\n**TASK PROMPT:**\n{prompt}")
    
    if context:
        user_prompt_parts.append(f"\n**TASK CONTEXT:**\n{context}")
    
    if instructions:
        user_prompt_parts.append(f"\n**INSTRUCTIONS:**\n{instructions}")
    
    if source:
        user_prompt_parts.append(f"\n**SOURCE:** {source}")
    
    # Add the actual essay
    user_prompt_parts.append(f"\n**STUDENT'S ESSAY:**\n{essay_text}")
    
    # Add specific analysis instruction
    analysis_requirements = "\n**ANALYSIS REQUIREMENTS:**\n\n"
    analysis_requirements += "FIRST AND MOST IMPORTANT: Check if the student's response addresses the EXACT task prompt above.\n\n"
    analysis_requirements += "**TASK COMPLIANCE CHECK:**\n"
    analysis_requirements += "1. Does the content match the topic in the task prompt? (If prompt is about house-sitting but response is about social media = MAJOR PENALTY)\n"
    analysis_requirements += "2. Is the format correct? (Email vs Essay vs Letter as requested)\n"
    analysis_requirements += "3. Does it respond to ALL specific questions/requests in the prompt?\n"
    analysis_requirements += "4. Is the tone appropriate for the context? (Formal vs informal as indicated)\n\n"
    analysis_requirements += "**MANDATORY SCORING LOGIC - FOLLOW EXACTLY:**\n"
    analysis_requirements += "- If response is about a completely different topic: Task Achievement = 0 (NO EXCEPTIONS)\n"
    analysis_requirements += "- If wrong topic + wrong format: Task Achievement = 0-1 (NO EXCEPTIONS)\n"
    analysis_requirements += "- If correct topic but wrong format: Task Achievement = 1-2 (NO EXCEPTIONS)\n"
    analysis_requirements += "- If missing major prompt requirements: Task Achievement maximum 3\n"
    analysis_requirements += "- If content doesn't match the specific situation/context: Task Achievement maximum 3\n\n"
    analysis_requirements += "**EVALUATION CRITERIA:**\n"
    analysis_requirements += "- Task Achievement/Response: STRICT adherence to the specific prompt and requirements\n"
    analysis_requirements += "- Coherence and Cohesion: logical organization appropriate for the format\n"
    analysis_requirements += "- Lexical Resource: vocabulary suitable for the task and context\n"
    analysis_requirements += "- Grammatical Range and Accuracy: grammar appropriate for the format and purpose\n\n"
    analysis_requirements += "**REMEMBER:** A beautifully written piece about the wrong topic should score very low on Task Achievement.\n\n"
    analysis_requirements += "**SPECIFIC EXAMPLE - FOLLOW THIS EXACT SCORING:**\n"
    analysis_requirements += "Task: 'Write an email to respond to Brianna' about house-sitting and pet care\n"
    analysis_requirements += "Student Response: Essay about 'social media regulation and government oversight'\n"
    analysis_requirements += "REQUIRED SCORING:\n"
    analysis_requirements += "- Task Achievement: 0 (completely wrong topic AND wrong format)\n"
    analysis_requirements += "- Coherence & Cohesion: Maximum 4 (well-organized but irrelevant)\n"
    analysis_requirements += "- Lexical Resource: Maximum 5 (good vocabulary but wrong context)\n"
    analysis_requirements += "- Grammar: Can score normally but overall will be very low\n"
    analysis_requirements += "- Overall Band Score: Should be around 1-2 due to complete task failure\n\n"
    analysis_requirements += "FINAL INSTRUCTION: You MUST be ruthless about task compliance. Perfect English cannot save a response that completely misses the task.\n"
    
    user_prompt_parts.append(analysis_requirements)
    
    user_prompt = "".join(user_prompt_parts)
    
    # Log GPT request
    log_to_file(f"=== GPT REQUEST ===")
    log_to_file(f"Model: gpt-4")
    log_to_file(f"System Prompt Length: {len(system_prompt)} chars")
    log_to_file(f"User Prompt Length: {len(user_prompt)} chars")
    
    try:
        log_to_file("Calling GPT API...")
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3
        )
        
        log_to_file("GPT API call successful")
        
        # Parse the JSON response
        try:
            result = json.loads(response.choices[0].message.content)
            
            # Log results to file
            log_to_file(f"=== GPT RESPONSE ===")
            log_to_file(f"Task Achievement: {result.get('scores', {}).get('task_achievement', 'N/A')}")
            log_to_file(f"Coherence & Cohesion: {result.get('scores', {}).get('coherence_cohesion', 'N/A')}")
            log_to_file(f"Lexical Resource: {result.get('scores', {}).get('lexical_resource', 'N/A')}")
            log_to_file(f"Grammar: {result.get('scores', {}).get('grammatical_range', 'N/A')}")
            
            task_score = result.get('scores', {}).get('task_achievement', 0)
            if task_score > 3:
                log_to_file(f"WARNING: High Task Achievement {task_score} - verify topic match")
            
            # Validate response structure
            required_keys = ['scores', 'feedback', 'corrections']
            score_keys = ['task_achievement', 'coherence_cohesion', 'lexical_resource', 'grammatical_range']
            
            if not all(key in result for key in required_keys):
                raise ValueError("Invalid response format: missing required keys")
            
            if not all(key in result['scores'] for key in score_keys):
                raise ValueError("Invalid response format: missing score keys")
            
            if not all(key in result['feedback'] for key in score_keys):
                raise ValueError("Invalid response format: missing feedback keys")
            
            if 'corrections' not in result:
                raise ValueError("Invalid response format: missing corrections")
            
            # Add text highlighting positions
            result['corrections'] = find_text_positions(essay_text, result['corrections'])
            
            log_to_file(f"=== ANALYSIS COMPLETE ===")
            log_to_file(f"Final scores logged successfully")
            
            return result
        except json.JSONDecodeError as e:
            log_to_file(f"ERROR: Failed to parse GPT response as JSON - {str(e)}")
            raise ValueError("Failed to parse GPT response as JSON")
        except Exception as e:
            log_to_file(f"ERROR: Invalid response format - {str(e)}")
            raise ValueError(f"Invalid response format: {str(e)}")

    except Exception as e:
        log_to_file(f"FATAL ERROR in analyze_essay: {str(e)}")
        import traceback
        log_to_file(f"Traceback: {traceback.format_exc()}")
        raise Exception(f"Failed to analyze essay: {str(e)}")

def check_and_deduct_credits(user_id):
    """Check if user has enough credits and deduct them."""
    user_credits = UserCredits.query.filter_by(user_id=user_id).first()
    
    if not user_credits:
        raise ValueError("User credits not found")
    
    if user_credits.available_credits < CREDITS_PER_ANALYSIS:
        raise ValueError("Insufficient credits")
    
    user_credits.available_credits -= CREDITS_PER_ANALYSIS
    db.session.commit()

def score_essay(user_id, data):
    """Score a writing task and provide feedback with penalties and highlighting."""
    try:
        # Validate request data
        if not data or 'essay_text' not in data or 'task_type' not in data:
            raise ValueError("Missing required fields")
        
        essay_text = data['essay_text']
        task_type = data['task_type']
        time_spent = data.get('time_spent')  # Optional time tracking
        
        # Extract additional context information for better analysis
        prompt = data.get('prompt')  # The task prompt/question
        context = data.get('context')  # Additional context (for emails, scenarios)
        instructions = data.get('instructions')  # Specific instructions
        source = data.get('source')  # Source information
        
        # Calculate word count
        word_count = len(essay_text.strip().split())
        
        # Check and deduct credits before processing
        check_and_deduct_credits(user_id)
            
        # Analyze essay using GPT-4 with task context
        analysis = analyze_essay(essay_text, task_type, prompt, context, instructions, source)
        
        # Apply IELTS rounding to individual criterion scores
        task_achievement = ielts_round(analysis['scores']['task_achievement'])
        coherence_cohesion = ielts_round(analysis['scores']['coherence_cohesion'])
        lexical_resource = ielts_round(analysis['scores']['lexical_resource'])
        grammatical_range = ielts_round(analysis['scores']['grammatical_range'])
        
        # Calculate base overall score using rounded individual scores
        base_scores = [task_achievement, coherence_cohesion, lexical_resource, grammatical_range]
        overall_score = calculate_overall_score(base_scores)
        
        # Calculate penalties
        word_count_penalty = calculate_word_count_penalty(word_count, task_type)
        time_penalty = calculate_time_penalty(time_spent, task_type)
        
        # Calculate adjusted score with IELTS rounding
        adjusted_score_raw = max(0.0, overall_score - word_count_penalty - time_penalty)
        adjusted_score = ielts_round(adjusted_score_raw)
        
        # Create new writing score record
        writing_score = WritingScore(
            user_id=user_id,
            task_type=task_type,
            essay_text=essay_text,
            word_count=word_count,
            time_spent=time_spent,
            task_achievement=task_achievement,
            coherence_cohesion=coherence_cohesion,
            lexical_resource=lexical_resource,
            grammatical_range=grammatical_range,
            overall_score=overall_score,
            word_count_penalty=word_count_penalty,
            time_penalty=time_penalty,
            adjusted_score=adjusted_score,
            task_achievement_feedback=analysis['feedback']['task_achievement'],
            coherence_cohesion_feedback=analysis['feedback']['coherence_cohesion'],
            lexical_resource_feedback=analysis['feedback']['lexical_resource'],
            grammatical_range_feedback=analysis['feedback']['grammatical_range'],
            corrections=json.dumps(analysis['corrections'])  # Store corrections with positions as JSON string
        )
        
        # Save to database
        db.session.add(writing_score)
        db.session.commit()
        
        # Check for combined score calculation
        calculate_combined_score(user_id, writing_score)
        
        # Return the created record with corrections
        result = writing_score_schema.dump(writing_score)
        result['corrections'] = json.loads(writing_score.corrections) if writing_score.corrections else {}
        return result
        
    except Exception as e:
        db.session.rollback()
        if isinstance(e, ValueError):
            raise e
        raise Exception(f"Failed to score essay: {str(e)}")

def calculate_combined_score(user_id, new_score):
    """Calculate combined score when both Task 1 and Task 2 are available."""
    try:
        # Get the most recent scores for both tasks
        task1_score = WritingScore.query.filter_by(
            user_id=user_id, 
            task_type='task1'
        ).order_by(WritingScore.created_at.desc()).first()
        
        task2_score = WritingScore.query.filter_by(
            user_id=user_id, 
            task_type='task2'
        ).order_by(WritingScore.created_at.desc()).first()
        
        if task1_score and task2_score:
            # Calculate combined score: Task 1 (1/3) + Task 2 (2/3) with IELTS rounding
            combined_score_raw = (task1_score.adjusted_score * 1/3) + (task2_score.adjusted_score * 2/3)
            combined_score = ielts_round(combined_score_raw)
            
            # Check if combined score already exists for these specific scores
            existing_combined = CombinedWritingScore.query.filter_by(
                user_id=user_id,
                task1_score_id=task1_score.id,
                task2_score_id=task2_score.id
            ).first()
            
            if not existing_combined:
                # Create new combined score record
                combined_writing_score = CombinedWritingScore(
                    user_id=user_id,
                    task1_score_id=task1_score.id,
                    task2_score_id=task2_score.id,
                    combined_score=combined_score
                )
                
                db.session.add(combined_writing_score)
                db.session.commit()
                
    except Exception as e:
        # Don't raise error as this is not critical to the main scoring process
        pass

def get_user_scores(user_id):
    """Get all writing scores for the current user."""
    try:
        scores = WritingScore.query.filter_by(user_id=user_id).order_by(WritingScore.created_at.desc()).all()
        return writing_scores_schema.dump(scores)
    except Exception as e:
        raise e

def get_score(score_id, user_id):
    """Get a specific writing score."""
    try:
        score = WritingScore.query.filter_by(id=score_id, user_id=user_id).first()
        if not score:
            raise ValueError("Score not found")
        return writing_score_schema.dump(score)
    except Exception as e:
        raise e

def get_combined_scores(user_id):
    """Get all combined writing scores for the current user."""
    try:
        combined_scores = CombinedWritingScore.query.filter_by(user_id=user_id).order_by(CombinedWritingScore.created_at.desc()).all()
        return [score.to_dict() for score in combined_scores]
    except Exception as e:
        raise e 