# Practice Writing Demo Guide

## 🚀 Quick Start Demo

### 1. Start the Application

```bash
cd frontend
npm run dev
```

Visit: http://localhost:5174

### 2. Navigate to Practice Writing

1. Login/Register (if not already logged in)
2. Click "Writing" in the header menu
3. Select "Practice Writing" from dropdown

### 3. Test Exercise Selection

**VSTEP Section:**

- Click "VSTEP" tab
- See Task 1 (Email) and Task 2 (Essay) sections
- Notice VIP badges on premium exercises
- Click on exercise numbers to enter

**IELTS Section:**

- Click "IELTS" tab
- See Academic and General Training sections
- Notice exercises with image indicators
- Popular exercises section at bottom

### 4. Test Exercise Features

#### Free User Experience:

1. Click on a free exercise (no VIP badge)
2. See exercise prompt and instructions
3. **Test Timer Editing:**
   - Click edit button (✏️) next to timer
   - Change time from 20 to 30 minutes
   - Click save button (✓)
   - Notice timer resets and starts counting from new time

#### Premium Content:

1. Click on a VIP exercise
2. See upgrade alert with professional styling
3. "Upgrade Now" button links to `/plans`

#### IELTS with Images:

1. Go to IELTS Academic section
2. Click on "Exercise 01" or "Exercise 02"
3. See exercise with image/chart display
4. Images are responsive and properly styled

### 5. Test Writing Interface

#### Writing Experience:

1. Enter any free exercise
2. **Timer Features:**
   - See countdown timer
   - Click edit to change time limit
   - Timer pauses during editing
3. **Writing Area:**

   - Type content in textarea
   - Watch word count update in real-time
   - Notice minimum word requirement

4. **Submission:**
   - Try submitting with too few words (error)
   - Write enough content and submit
   - See loading state during submission

### 6. Test Results Page

#### Score Display:

1. After submission, see results page
2. **New Score Display:**
   - Overall score prominently displayed
   - Color-coded score breakdown
   - Performance indicators with emojis
   - Quick stats (word count, time spent)

#### Detailed Feedback:

1. **Premium Users:** See detailed corrections in categories:

   - Grammar Corrections (red theme)
   - Vocabulary Improvements (blue theme)
   - Structure Improvements (purple theme)

2. **Free Users:** See upgrade prompt for detailed corrections

### 7. Test Navigation

1. "Try Another Exercise" → Back to practice selection
2. "View All Scores" → Writing scores history
3. Header navigation works throughout

## 🧪 Test Scenarios

### Scenario 1: Free User Journey

```
1. Visit /practice/writing
2. Select VSTEP Task 1
3. Click Exercise 01 (free)
4. Edit timer to 15 minutes
5. Write 120+ words
6. Submit and see basic results
7. See upgrade prompt for corrections
```

### Scenario 2: Premium Features

```
1. Try clicking VIP exercise
2. See upgrade alert
3. Test "Upgrade Now" button
4. Navigate back and try free exercise
5. Complete and see detailed corrections
```

### Scenario 3: IELTS with Images

```
1. Go to IELTS Academic
2. Select exercise with image
3. Verify image loads and displays
4. Check responsive design on mobile
5. Complete exercise workflow
```

### Scenario 4: Timer Functionality

```
1. Enter any exercise
2. Start timer (default time)
3. Click edit timer
4. Change to custom time (30 min)
5. Verify timer resets and counts correctly
6. Complete exercise to test time tracking
```

## 🐛 Known Demo Limitations

### Current State:

- ✅ All frontend features working
- ✅ API integration functional
- ✅ Error handling in place
- ⏳ Backend practice tracking not implemented
- ⏳ Real image library needed

### Expected Behavior:

1. **Scoring**: Uses existing VSTEP scoring API
2. **Images**: Shows placeholder/demo images
3. **Premium**: Uses localStorage subscription check
4. **History**: Not saved to practice-specific tables yet

### Demo Data:

- ~20 sample exercises across categories
- Mix of free and VIP content
- Sample images for IELTS tasks
- Realistic word limits and time constraints

## 📱 Mobile Testing

### Responsive Features:

1. **Exercise Grid:** Adapts to mobile screens
2. **Timer Interface:** Touch-friendly editing
3. **Image Display:** Scales properly on mobile
4. **Writing Area:** Comfortable mobile typing
5. **Score Display:** Mobile-optimized layout

### Test on:

- iPhone/Android browsers
- Tablet landscape/portrait
- Desktop responsive resizing

## 🎯 Key Demo Points

### Technical Excellence:

- TypeScript type safety throughout
- Professional error handling
- Responsive design patterns
- Clean component architecture

### User Experience:

- Intuitive timer editing
- Clear premium/free distinction
- Professional scoring display
- Seamless navigation flow

### Business Value:

- Premium upgrade opportunities
- Engaging practice interface
- Professional assessment feedback
- Mobile-friendly design

## 🔧 Troubleshooting

### Common Issues:

1. **Timer not updating:** Check if edit mode is active
2. **Images not loading:** Verify imageUrl in JSON data
3. **Scores not displaying:** Check API response format
4. **Navigation issues:** Verify route configuration

### Debug Tools:

- Browser console for errors
- Network tab for API calls
- React DevTools for component state
- Responsive design tools

## 📈 Success Metrics

### Demo Success Indicators:

- [ ] All exercise types selectable
- [ ] Timer editing works smoothly
- [ ] Images display in IELTS tasks
- [ ] Scoring and feedback display correctly
- [ ] Premium prompts appear appropriately
- [ ] Mobile experience is polished
- [ ] No console errors during normal usage

This demo showcases a production-ready practice writing system with professional UX and robust technical implementation!
