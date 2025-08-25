# Security Check API

A Python Flask backend API for detecting:
- Link authenticity
- Email spam
- Email data breaches

## Features

- **Link Authenticity Check**: Validates URLs and checks for suspicious patterns
- **Email Spam Detection**: Analyzes email content for spam indicators
- **Email Breach Check**: Uses HaveIBeenPwned API to check for data breaches
- **Combined Checks**: Single endpoint for all security checks

## API Endpoints

### 1. Check Link Authenticity
```
POST /api/check-link
Content-Type: application/json

{
  "url": "https://example.com"
}
```

### 2. Check Email Spam
```
POST /api/check-email-spam
Content-Type: application/json

{
  "email": "user@example.com",
  "subject": "Email subject (optional)",
  "content": "Email content (optional)"
}
```

### 3. Check Email Breach
```
POST /api/check-email-breach
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### 4. Combined Check
```
POST /api/check-all
Content-Type: application/json

{
  "url": "https://example.com",
  "email": "user@example.com",
  "subject": "Email subject",
  "content": "Email content"
}
```

### 5. Health Check
```
GET /api/health
```

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Get HaveIBeenPwned API Key** (Optional but recommended):
   - Sign up at https://haveibeenpwned.com/API/Key
   - Replace `your-api-key-here` in the code with your actual API key

3. **Run the Server**:
   ```bash
   python app.py
   ```

4. **Test the API**:
   ```bash
   python test_api.py
   ```

## Response Format

All endpoints return JSON responses with this structure:

```json
{
  "success": true,
  "data": {
    // Specific check results
  },
  "timestamp": 1234567890.123
}
```

## Security Features

### Link Checking
- URL format validation
- Suspicious pattern detection
- URL shortener identification
- IP address detection
- Accessibility verification

### Spam Detection
- Keyword analysis
- Suspicious domain detection
- Content pattern analysis
- Subject line analysis
- Capital letter ratio checking

### Breach Detection
- HaveIBeenPwned API integration
- Fallback domain checking
- Historical breach data

## Notes

- The API includes basic security checks that work offline
- For production use, consider getting proper API keys for external services
- Rate limiting is handled by external APIs
- CORS is enabled for frontend integration

## Example Frontend Integration

```javascript
// Check link authenticity
const checkLink = async (url) => {
  const response = await fetch('http://localhost:5000/api/check-link', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url })
  });
  
  const result = await response.json();
  return result;
};

// Check email spam
const checkEmailSpam = async (email, subject, content) => {
  const response = await fetch('http://localhost:5000/api/check-email-spam', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, subject, content })
  });
  
  const result = await response.json();
  return result;
};
```

## Error Handling

The API provides detailed error messages and appropriate HTTP status codes:
- 400: Bad Request (missing or invalid data)
- 500: Internal Server Error
- 200: Success

All responses include success/error indicators and descriptive messages.