# Band Boost - IELTS AI Platform

## 📋 Tổng quan dự án

Band Boost là một nền tảng AI chuyên dụng cho việc luyện thi IELTS, cung cấp các công cụ chấm điểm tự động, phản hồi chi tiết và gợi ý cải thiện cho bài viết IELTS. Hệ thống được xây dựng với kiến trúc microservices, bao gồm backend API và frontend React hiện đại.

## 🚀 Công nghệ Backend

### Core Framework

- **Flask 3.0.0**: Framework web Python chính
  - Sử dụng để xây dựng RESTful API
  - Ví dụ: `app = Flask(__name__)` trong `backend/__init__.py`
  - Quản lý routing và request handling

### Database & ORM

- **SQLAlchemy 3.1.1**: ORM (Object-Relational Mapping)
  - Quản lý models và database relationships
  - Ví dụ: `User`, `Essay`, `WritingScore` models trong `backend/models.py`
- **Flask-Migrate 4.0.5**: Database migration tool
  - Quản lý schema changes và version control
- **PyMySQL 1.1.0**: MySQL database connector
  - Kết nối với MySQL database

### Authentication & Security

- **Flask-JWT-Extended 4.5.3**: JWT (JSON Web Token) authentication
  - Quản lý user sessions và authentication
  - Ví dụ: `@jwt_required()` decorator trong controllers
- **bcrypt 4.0.1**: Password hashing
  - Bảo mật mật khẩu người dùng
- **python-jose 3.3.0**: JWT token handling

### API Development

- **Marshmallow 3.20.1**: Serialization/Deserialization
  - Chuyển đổi Python objects thành JSON và ngược lại
  - Ví dụ: `essay_schema.dump(essay)` trong controllers
- **Flask-CORS 4.0.0**: Cross-Origin Resource Sharing
  - Cho phép frontend truy cập API từ domain khác

### AI Integration

- **OpenAI 1.3.7**: Integration với OpenAI GPT models
  - Phân tích và chấm điểm bài viết IELTS
  - Ví dụ: `client = OpenAI(api_key=Config.OPENAI_API_KEY)` trong `writing_controller.py`

### HTTP & Networking

- **httpx 0.24.1**: Modern HTTP client
  - Gọi external APIs
- **requests 2.31.0**: HTTP library cho API calls

### Configuration & Environment

- **python-dotenv 1.0.0**: Environment variable management
  - Quản lý configuration từ file .env

## 🎨 Công nghệ Frontend

### Core Framework

- **React 19.0.0**: JavaScript library cho UI
  - Xây dựng component-based user interface
  - Ví dụ: `WritingSubmission.tsx`, `PracticeWriting.tsx`
- **TypeScript 5.7.2**: Type-safe JavaScript
  - Đảm bảo type safety và developer experience

### Build Tools & Development

- **Vite 6.3.1**: Modern build tool và dev server
  - Fast development và optimized production builds
- **ESLint 9.22.0**: Code linting và formatting

### Routing & Navigation

- **React Router DOM 6.30.0**: Client-side routing
  - Quản lý navigation giữa các pages
  - Ví dụ: `BrowserRouter`, `Routes`, `Route` trong `App.tsx`

### HTTP Client

- **Axios 1.9.0**: HTTP client cho API calls
  - Giao tiếp với backend API
  - Ví dụ: `apiClient.post('/api/writing/score', data)` trong services

### UI/UX Libraries

- **Framer Motion 12.9.4**: Animation library
  - Smooth animations và transitions
  - Ví dụ: `motion.div` với `AnimatePresence` trong practice pages
- **Chart.js 4.4.9 & React-Chartjs-2 5.3.0**: Data visualization
  - Hiển thị charts và graphs cho analytics

### File Handling

- **docx 9.4.1**: Microsoft Word document generation
  - Export bài viết thành file .docx
- **file-saver 2.0.5**: File download handling
  - Download files từ browser

### Utilities

- **crypto-js 4.2.0**: Cryptographic functions
  - Encryption/decryption cho sensitive data
- **qs 6.14.0**: Query string parsing
  - Parse URL parameters

## 🎯 Các chức năng chính

### 1. **Hệ thống Authentication & Authorization**

- Đăng ký, đăng nhập, đăng xuất
- JWT token-based authentication
- Role-based access control (User/Admin)
- Password hashing với bcrypt

### 2. **Chấm điểm IELTS Writing tự động**

- Phân tích bài viết Task 1 và Task 2
- Chấm điểm theo 4 tiêu chí IELTS:
  - Task Achievement (TA)
  - Coherence & Cohesion (CC)
  - Lexical Resource (LR)
  - Grammatical Range & Accuracy (GRA)
- Tính toán overall band score
- Penalty cho word count và time limit

### 3. **Phản hồi chi tiết & Gợi ý cải thiện**

- Highlight lỗi grammar, vocabulary, structure
- Gợi ý cải thiện cụ thể cho từng lỗi
- Feedback chi tiết cho từng tiêu chí chấm điểm
- Suggestions cho cải thiện writing skills

### 4. **Practice Writing System**

- Bài tập luyện viết theo format IELTS/VSTEP
- Timer và word counter
- Progress tracking
- Exercise categories và difficulty levels

### 5. **Chat tương tác với AI**

- AI chat assistant cho hỗ trợ học tập
- Context-aware responses
- Chat history management

### 6. **Export & Integration**

- Export bài viết thành PDF/DOCX
- File download functionality
- Integration với external services

### 7. **Subscription & Payment System**

- Multiple subscription plans (Free, Student, Pro, Unlimited)
- Credit-based system
- Payment integration (Stripe, MoMo, VNPay)
- Payment callback handling

### 8. **Admin Dashboard**

- User management
- Order management
- Statistics và analytics
- System configuration

## 🔍 Chức năng tiêu biểu: IELTS Writing Scoring System

### Input

- **Essay text**: Nội dung bài viết của user
- **Task type**: 'task1' hoặc 'task2'
- **Time spent**: Thời gian viết bài (tính bằng giây)
- **Prompt**: Câu hỏi/chủ đề của bài viết
- **Context**: Thông tin bổ sung (nếu có)

### Output

- **Band scores**: Điểm cho 4 tiêu chí IELTS
- **Overall score**: Điểm tổng hợp
- **Detailed feedback**: Phản hồi chi tiết cho từng tiêu chí
- **Corrections**: Danh sách lỗi và gợi ý sửa
- **Penalties**: Penalty cho word count và time limit

### Luồng xử lý chi tiết

#### Bước 1: Input Validation & Preprocessing

```python
# Trong writing_controller.py
def score_essay():
    data = request.json
    # Validate required fields
    if not data or 'task_type' not in data or 'essay_text' not in data:
        return jsonify({'message': 'Missing required fields'}), 400

    # Extract data
    task_type = data['task_type']
    essay_text = data['essay_text']
    time_spent = data.get('time_spent', 0)
```

#### Bước 2: Word Count & Time Analysis

```python
# Calculate word count
word_count = len(essay_text.split())

# Calculate penalties
word_count_penalty = calculate_word_count_penalty(word_count, task_type)
time_penalty = calculate_time_penalty(time_spent, task_type)
```

#### Bước 3: OpenAI API Integration - Chi tiết Request/Response

**📤 Request gửi đến GPT API:**

```python
# System Prompt - Định nghĩa vai trò và format response
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
        "task_achievement": "<detailed feedback>",
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

CRITICAL SCORING GUIDELINES - ZERO TOLERANCE FOR TASK DEVIATION:

**TASK ACHIEVEMENT/RESPONSE SCORING (MOST CRITICAL):**
- Score 0: Completely different topic (e.g., social media when asked about house-sitting)
- Score 1: Wrong topic + wrong format (essay when email required)
- Score 2: Correct general topic but completely wrong format
- Score 3: Partially relevant but misses most key requirements
- Score 4: Addresses some aspects but significant gaps
- Score 5-6: Adequate task completion with minor issues
- Score 7-8: Good task completion
- Score 9: Perfect task completion

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

REMEMBER: Perfect grammar cannot save a response that fails the basic task. BE RUTHLESS.
"""

# User Prompt - Thông tin cụ thể về bài viết và yêu cầu
user_prompt = f"""Please analyze this IELTS Writing {task_type} essay and respond in the required JSON format:

**TASK PROMPT:**
{prompt}

**TASK CONTEXT:**
{context}

**INSTRUCTIONS:**
{instructions}

**SOURCE:**
{source}

**STUDENT'S ESSAY:**
{essay_text}

**ANALYSIS REQUIREMENTS:**

FIRST AND MOST IMPORTANT: Check if the student's response addresses the EXACT task prompt above.

**TASK COMPLIANCE CHECK:**
1. Does the content match the topic in the task prompt? (If prompt is about house-sitting but response is about social media = MAJOR PENALTY)
2. Is the format correct? (Email vs Essay vs Letter as requested)
3. Does it respond to ALL specific questions/requests in the prompt?
4. Is the tone appropriate for the context? (Formal vs informal as indicated)

**MANDATORY SCORING LOGIC - FOLLOW EXACTLY:**
- If response is about a completely different topic: Task Achievement = 0 (NO EXCEPTIONS)
- If wrong topic + wrong format: Task Achievement = 0-1 (NO EXCEPTIONS)
- If correct topic but wrong format: Task Achievement = 1-2 (NO EXCEPTIONS)
- If missing major prompt requirements: Task Achievement maximum 3
- If content doesn't match the specific situation/context: Task Achievement maximum 3

**EVALUATION CRITERIA:**
- Task Achievement/Response: STRICT adherence to the specific prompt and requirements
- Coherence and Cohesion: logical organization appropriate for the format
- Lexical Resource: vocabulary suitable for the task and context
- Grammatical Range and Accuracy: grammar appropriate for the format and purpose

**REMEMBER:** A beautifully written piece about the wrong topic should score very low on Task Achievement.

FINAL INSTRUCTION: You MUST be ruthless about task compliance. Perfect English cannot save a response that completely misses the task.
"""

# API Call Configuration
response = client.chat.completions.create(
    model="gpt-4",                    # Sử dụng GPT-4 model
    messages=[
        {"role": "system", "content": system_prompt},  # Định nghĩa vai trò và rules
        {"role": "user", "content": user_prompt}       # Thông tin bài viết và yêu cầu
    ],
    temperature=0.3                   # Low temperature để đảm bảo consistency
)
```

**🤖 GPT nhận được gì:**

1. **System Message**: Định nghĩa GPT như một IELTS examiner nghiêm khắc với:

   - Vai trò: STRICT IELTS examiner
   - Format response bắt buộc: JSON structure cụ thể
   - Scoring guidelines: Zero tolerance cho task deviation
   - Format requirements: Email vs Essay requirements
   - Mandatory penalties: Rules cứng cho việc chấm điểm

2. **User Message**: Thông tin chi tiết về bài viết:
   - Task prompt: Câu hỏi/chủ đề cụ thể
   - Task context: Bối cảnh (nếu có)
   - Instructions: Hướng dẫn đặc biệt
   - Source: Nguồn bài tập
   - Student's essay: Nội dung bài viết của học sinh
   - Analysis requirements: Yêu cầu phân tích chi tiết

**🧠 GPT xử lý như thế nào:**

1. **Task Compliance Check**: GPT kiểm tra đầu tiên xem bài viết có đúng chủ đề và format không
2. **Content Analysis**: Phân tích nội dung theo 4 tiêu chí IELTS
3. **Error Detection**: Tìm lỗi grammar, vocabulary, structure
4. **Scoring Application**: Áp dụng scoring guidelines nghiêm khắc
5. **JSON Generation**: Tạo response theo format JSON đã định nghĩa

**📊 Mô hình GPT-4 hoạt động:**

- **Model**: GPT-4 (latest version)
- **Temperature**: 0.3 (thấp để đảm bảo consistency)
- **Context Window**: ~8K tokens cho system + user prompt
- **Processing**:
  - Tokenization của input text
  - Attention mechanism phân tích context
  - Generation theo JSON schema
  - Validation internal của response format

**📤 Output từ GPT:**

```json
{
  "scores": {
    "task_achievement": 6.5,
    "coherence_cohesion": 7.0,
    "lexical_resource": 6.0,
    "grammatical_range": 6.5
  },
  "feedback": {
    "task_achievement": "The response adequately addresses the task requirements...",
    "coherence_cohesion": "The essay demonstrates good logical organization...",
    "lexical_resource": "Vocabulary is generally appropriate but could be more varied...",
    "grammatical_range": "Grammar is mostly accurate with some minor errors..."
  },
  "corrections": {
    "grammar": [
      {
        "original": "The government should to implement",
        "correction": "The government should implement",
        "explanation": "Remove 'to' after 'should' - modal verb + base form"
      }
    ],
    "vocabulary": [
      {
        "original": "big problem",
        "suggestion": "significant issue",
        "explanation": "More formal and academic vocabulary"
      }
    ],
    "structure": [
      {
        "issue": "Paragraph lacks clear topic sentence",
        "suggestion": "Start with a clear topic sentence that introduces the main idea",
        "example": "One of the primary benefits of this approach is..."
      }
    ]
  }
}
```

#### Bước 4: Response Parsing & Score Calculation

```python
# Parse OpenAI response
ai_response = response.choices[0].message.content

# Parse JSON response từ GPT
try:
    result = json.loads(ai_response)

    # Validate response structure
    required_keys = ['scores', 'feedback', 'corrections']
    score_keys = ['task_achievement', 'coherence_cohesion', 'lexical_resource', 'grammatical_range']

    if not all(key in result for key in required_keys):
        raise ValueError("Invalid response format: missing required keys")

    if not all(key in result['scores'] for key in score_keys):
        raise ValueError("Invalid response format: missing score keys")

    # Extract individual scores
    ta_score = result['scores']['task_achievement']
    cc_score = result['scores']['coherence_cohesion']
    lr_score = result['scores']['lexical_resource']
    gra_score = result['scores']['grammatical_range']

    # Apply IELTS rounding to individual scores
    task_achievement = ielts_round(ta_score)
    coherence_cohesion = ielts_round(cc_score)
    lexical_resource = ielts_round(lr_score)
    grammatical_range = ielts_round(gra_score)

    # Calculate base overall score using rounded individual scores
    base_scores = [task_achievement, coherence_cohesion, lexical_resource, grammatical_range]
    overall_score = calculate_overall_score(base_scores)

    # Log results for monitoring
    log_to_file(f"Task Achievement: {task_achievement}")
    log_to_file(f"Coherence & Cohesion: {coherence_cohesion}")
    log_to_file(f"Lexical Resource: {lexical_resource}")
    log_to_file(f"Grammar: {grammatical_range}")
    log_to_file(f"Overall Score: {overall_score}")

    # Warning for high task achievement scores
    if task_achievement > 3:
        log_to_file(f"WARNING: High Task Achievement {task_achievement} - verify topic match")

except json.JSONDecodeError as e:
    log_to_file(f"ERROR: Failed to parse GPT response as JSON - {str(e)}")
    raise ValueError("Failed to parse GPT response as JSON")
except Exception as e:
    log_to_file(f"ERROR: Invalid response format - {str(e)}")
    raise ValueError(f"Invalid response format: {str(e)}")
```

**🔍 Chi tiết xử lý Response:**

1. **JSON Parsing**: Parse response từ GPT thành Python dictionary
2. **Structure Validation**: Kiểm tra đầy đủ các keys cần thiết
3. **Score Extraction**: Trích xuất điểm từng tiêu chí
4. **IELTS Rounding**: Áp dụng quy tắc làm tròn IELTS cho từng điểm
5. **Overall Calculation**: Tính điểm tổng hợp
6. **Logging & Monitoring**: Ghi log để theo dõi và debug
7. **Error Handling**: Xử lý lỗi parsing và validation

#### Bước 5: Corrections & Feedback Processing

```python
# Extract corrections from parsed result
corrections = result['corrections']

# Find text positions for highlighting in the original essay
highlighted_corrections = find_text_positions(essay_text, corrections)

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
```

**🔍 Chi tiết xử lý Corrections:**

1. **Corrections Extraction**: Trích xuất corrections từ GPT response
2. **Text Position Finding**: Tìm vị trí chính xác của lỗi trong bài viết
3. **Position Mapping**: Map corrections với vị trí trong text để highlight
4. **Category Organization**: Tổ chức corrections theo categories (grammar, vocabulary, structure)
5. **Position Validation**: Đảm bảo positions được tìm thấy chính xác

#### Bước 6: Database Storage

```python
# Create WritingScore record
writing_score = WritingScore(
    user_id=current_user.id,
    task_type=task_type,
    essay_text=essay_text,
    word_count=word_count,
    time_spent=time_spent,
    task_achievement=ta_score,
    coherence_cohesion=cc_score,
    lexical_resource=lr_score,
    grammatical_range=gra_score,
    overall_score=overall_score,
    adjusted_score=adjusted_score,
    word_count_penalty=word_count_penalty,
    time_penalty=time_penalty,
    corrections=json.dumps(corrections),
    # ... other fields
)

db.session.add(writing_score)
db.session.commit()
```

#### Bước 7: Response Generation

```python
# Return structured response
return jsonify({
    'id': writing_score.id,
    'task_achievement': task_achievement,
    'coherence_cohesion': coherence_cohesion,
    'lexical_resource': lexical_resource,
    'grammatical_range': grammatical_range,
    'overall_score': overall_score,
    'adjusted_score': adjusted_score,
    'word_count': word_count,
    'time_spent': time_spent,
    'corrections': highlighted_corrections,
    'feedback': {
        'task_achievement': result['feedback']['task_achievement'],
        'coherence_cohesion': result['feedback']['coherence_cohesion'],
        'lexical_resource': result['feedback']['lexical_resource'],
        'grammatical_range': result['feedback']['grammatical_range']
    }
}), 201
```

**📋 Tổng kết luồng xử lý GPT API:**

| Bước  | Hoạt động              | Input                 | Output                  | Chi tiết                            |
| ----- | ---------------------- | --------------------- | ----------------------- | ----------------------------------- |
| **1** | Input Validation       | Request data          | Validated data          | Kiểm tra required fields            |
| **2** | Word/Time Analysis     | Essay text, time      | Penalties               | Tính word count và time penalties   |
| **3** | GPT API Call           | System + User prompts | JSON response           | Gọi GPT-4 với strict guidelines     |
| **4** | Response Parsing       | GPT JSON              | Parsed scores           | Parse và validate response          |
| **5** | Corrections Processing | Corrections data      | Highlighted corrections | Tìm positions cho text highlighting |
| **6** | Database Storage       | All processed data    | Database record         | Lưu kết quả vào database            |
| **7** | Response Generation    | Final data            | API response            | Trả về kết quả cho frontend         |

**🎯 Đặc điểm nổi bật của hệ thống GPT:**

1. **Strict Task Compliance**: Zero tolerance cho việc lệch chủ đề
2. **Comprehensive Scoring**: 4 tiêu chí IELTS với detailed feedback
3. **Text Highlighting**: Tự động highlight lỗi trong bài viết
4. **IELTS Rounding**: Áp dụng đúng quy tắc làm tròn IELTS
5. **Penalty System**: Penalty cho word count và time limit
6. **Logging & Monitoring**: Ghi log chi tiết để debug và monitor
7. **Error Handling**: Xử lý lỗi robust cho mọi trường hợp

### Frontend Integration

#### Bước 1: User Input

```typescript
// Trong WritingSubmission.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const requestData: ScoreEssayRequest = {
    task_type: taskType,
    essay_text: essayText,
    time_spent: timeSpent,
    prompt: currentPrompt,
  };

  setIsAnalyzing(true);
  try {
    const result = await writingService.scoreEssay(requestData);
    setAnalysisResult(result);
    setShowAnalysis(true);
  } catch (error) {
    setError("Analysis failed. Please try again.");
  } finally {
    setIsAnalyzing(false);
  }
};
```

#### Bước 2: API Call

```typescript
// Trong writing.service.ts
async scoreEssay(data: ScoreEssayRequest): Promise<WritingScore> {
    const response = await apiClient.post('/api/writing/score', data);
    return response.data;
}
```

#### Bước 3: Result Display

```typescript
// Trong WritingAnalysis.tsx
const WritingAnalysis: React.FC<WritingAnalysisProps> = ({
  isLoading,
  essayText,
  taskType,
  timeSpent,
  analysisResult,
}) => {
  // Display scores, feedback, and corrections
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Score display */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <ScoreCard
          title="Task Achievement"
          score={analysisResult.task_achievement}
        />
        <ScoreCard
          title="Coherence & Cohesion"
          score={analysisResult.coherence_cohesion}
        />
        <ScoreCard
          title="Lexical Resource"
          score={analysisResult.lexical_resource}
        />
        <ScoreCard
          title="Grammatical Range"
          score={analysisResult.grammatical_range}
        />
      </div>

      {/* Overall score */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-blue-600">
          Overall Band Score: {analysisResult.overall_score}
        </h3>
      </div>

      {/* Corrections and feedback */}
      <CorrectionsDisplay corrections={analysisResult.corrections} />
      <FeedbackDisplay feedback={analysisResult.feedback} />
    </div>
  );
};
```

## 🛠️ Cài đặt và chạy dự án

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # Windows
pip install -r requirements.txt
python run.py
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Database Setup

```bash
# Tạo database MySQL
mysql -u root -p
CREATE DATABASE ielts_ai_platform;

# Chạy migrations
cd backend
flask db upgrade
```

## 📁 Cấu trúc dự án

```
band_boost/
├── backend/                 # Flask API server
│   ├── controllers/         # Business logic
│   ├── models.py           # Database models
│   ├── routes/             # API endpoints
│   ├── config/             # Configuration files
│   ├── extensions.py       # Flask extensions
│   └── requirements.txt    # Python dependencies
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── contexts/      # React contexts
│   │   └── types/         # TypeScript types
│   └── package.json       # Node.js dependencies
└── README.md              # Project documentation
```

## 🔧 Environment Variables

### Backend (.env)

```
DATABASE_URL=mysql+pymysql://username:password@localhost/ielts_ai_platform
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
OPENAI_API_KEY=your-openai-api-key
STRIPE_SECRET_KEY=your-stripe-secret
```

### Frontend (.env)

```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

## 📊 Database Schema

Hệ thống sử dụng MySQL với các bảng chính:

- **Users**: Thông tin người dùng
- **Essays**: Bài viết của user
- **WritingScores**: Kết quả chấm điểm
- **Subscriptions**: Gói đăng ký
- **Payments**: Lịch sử thanh toán
- **AIChats**: Lịch sử chat với AI

## 🚀 Deployment

### Backend Deployment

- Sử dụng WSGI server (Gunicorn)
- Nginx reverse proxy
- MySQL database
- Environment variables configuration

### Frontend Deployment

- Build production với Vite
- Serve static files qua Nginx
- CDN cho assets optimization

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Band Boost** - Nâng tầm kỹ năng IELTS với AI
