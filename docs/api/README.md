# IQRAPATH Mobile API Documentation

This document provides information for mobile developers on how to integrate with the IQRAPATH API.

## API Overview

The IQRAPATH API follows RESTful principles and uses standard HTTP methods. All responses are in JSON format.

Base URL: `https://api.iqrapath.com/api/v1`

## Authentication

The API uses Laravel Sanctum for token-based authentication.

### Authentication Flow

1. **Login to obtain token**:
   ```
   POST /auth/login
   ```
   
   Request body:
   ```json
   {
     "email": "student@example.com",
     "password": "password123",
     "device_name": "iPhone 13"
   }
   ```
   
   Response:
   ```json
   {
     "success": true,
     "data": {
       "user": {
         "id": 1,
         "name": "John Doe",
         "email": "student@example.com",
         "role": "student"
       },
       "token": "1|5XCtV5jKsEGw3c0sHGJZKWvDxpzRSi8r9KbKQqwe",
       "abilities": ["student"]
     }
   }
   ```

2. **Using the token**:
   Include the token in all subsequent requests in the Authorization header:
   ```
   Authorization: Bearer 1|5XCtV5jKsEGw3c0sHGJZKWvDxpzRSi8r9KbKQqwe
   ```

3. **Logout**:
   ```
   POST /auth/logout
   ```
   
   Response:
   ```json
   {
     "success": true,
     "message": "Successfully logged out"
   }
   ```

## Student Dashboard Endpoints

### Get Student Stats

Retrieves statistics about classes for the authenticated student.

```
GET /student/stats
```

Response:
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalClasses": 7,
      "completedClasses": 5,
      "upcomingClasses": 2
    }
  }
}
```

### Get Upcoming Classes

Retrieves a list of upcoming classes for the authenticated student.

```
GET /student/upcoming-classes
```

Response:
```json
{
  "success": true,
  "data": {
    "upcomingClasses": [
      {
        "id": "123",
        "title": "Tajweed - Intermediate",
        "teacher": "Ustadh Ahmed Abdullah",
        "date": "Monday, March 18, 2025",
        "timeRange": "4:00 PM - 5:00 PM",
        "status": "confirmed",
        "image": "/assets/images/classes/tajweed.png"
      },
      {
        "id": "124",
        "title": "Fiqh - Introduction to Islamic Jurisprudence",
        "teacher": "Ustadh Ahmed Abdullah",
        "date": "Tuesday, March 19, 2025",
        "timeRange": "3:00 PM - 4:00 PM",
        "status": "pending",
        "image": "/assets/images/classes/fiqh.png"
      }
    ]
  }
}
```

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "error": {
    "message": "Human-readable error message",
    "details": "Technical details about the error"
  }
}
```

HTTP status codes are used appropriately:
- 200: Success
- 400: Bad request
- 401: Unauthorized
- 403: Forbidden
- 404: Not found
- 422: Validation error
- 500: Server error

## Sample Mobile App Integration

Here's a sample code snippet using Dart/Flutter to connect to the API:

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class ApiService {
  static const String baseUrl = 'https://api.iqrapath.com/api/v1';
  String? _token;
  
  Future<void> login(String email, String password, String deviceName) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'password': password,
        'device_name': deviceName
      }),
    );
    
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      if (data['success']) {
        _token = data['data']['token'];
      } else {
        throw Exception(data['error']['message']);
      }
    } else {
      throw Exception('Failed to login');
    }
  }
  
  Future<Map<String, dynamic>> getStudentStats() async {
    if (_token == null) {
      throw Exception('Not authenticated');
    }
    
    final response = await http.get(
      Uri.parse('$baseUrl/student/stats'),
      headers: {
        'Authorization': 'Bearer $_token',
        'Content-Type': 'application/json'
      },
    );
    
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      if (data['success']) {
        return data['data']['stats'];
      } else {
        throw Exception(data['error']['message']);
      }
    } else {
      throw Exception('Failed to get stats');
    }
  }
  
  Future<void> logout() async {
    if (_token == null) {
      return;
    }
    
    await http.post(
      Uri.parse('$baseUrl/auth/logout'),
      headers: {
        'Authorization': 'Bearer $_token',
        'Content-Type': 'application/json'
      },
    );
    
    _token = null;
  }
}
```

## Further Documentation

For more detailed API documentation, refer to the OpenAPI specification:
- [Student API OpenAPI Spec](./student-api.yaml)

## Support

For API support, please contact:
- Email: api-support@iqrapath.com 