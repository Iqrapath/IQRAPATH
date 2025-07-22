# Student Registration Flow Documentation

This document explains the process of registering new students in the IQRAPATH Islamic education platform.

## Overview

The student registration flow is a multi-step process that collects various pieces of information:

1. **User Form**: Basic personal information about the student
2. **Learning Preferences**: Educational preferences and scheduling
3. **Subscription**: Payment plan and billing information

## Frontend Components

### AddStudentFlow (`resources/js/components/dashboard/add-student-flow.tsx`)

This is the main component that orchestrates the entire registration flow. It:

- Manages state across the three form steps
- Handles API communication
- Provides feedback to the user via toast notifications

### Form Components

1. **UserFormModal**: Collects personal details (name, email, phone_number, location)
2. **LearningPreferencesModal**: Gathers educational preferences (subjects, teaching mode, schedules)
3. **SubscriptionModal**: Sets up payment plan and billing dates

## Backend Components

### Web Route

The endpoint for student registration is defined in `routes/web.php`:

```php
Route::post('/students', [StudentController::class, 'store'])->name('students.store');
Route::get('/students/{id}', [StudentController::class, 'show'])->name('students.show');
```

### StudentController (`app/Http/Controllers/StudentController.php`)

The controller handles:

1. **Validation**: Ensures all required fields are present and correctly formatted
2. **Database Transaction**: Ensures all-or-nothing database operations
3. **Data Mapping**: Maps frontend form fields to database schema
4. **Error Handling**: Provides appropriate error responses

## Database Schema

The student registration flow writes to the following tables:

1. **users**: Basic user information (name, email, role, status, registration_date)
2. **student_profiles**: Student-specific profile data (phone_number, location, date_of_birth)
3. **learning_preferences**: Educational preferences and scheduling needs
4. **subscription_plans**: Available subscription options
5. **subscriptions**: User subscription information

## Form to Database Mapping

### User Form Fields to Database Columns

| Form Field        | Database Table | Database Column   |
|-------------------|---------------|-------------------|
| name              | users         | name              |
| email             | users         | email             |
| phone_number      | student_profiles | phone_number   |
| location          | student_profiles | location       |
| role              | users         | role              |
| status            | users         | status            |
| registration_date | users         | registration_date |

### Learning Preferences Form Fields to Database Columns

| Form Field            | Database Table       | Database Column         |
|-----------------------|----------------------|-------------------------|
| preferredSubjects     | learning_preferences | preferred_subjects      |
| teachingMode          | learning_preferences | teaching_mode           |
| studentAgeGroup       | learning_preferences | student_age_group       |
| preferredLearningTimes| learning_preferences | preferred_learning_times|
| additionalNotes       | learning_preferences | additional_notes        |

### Subscription Form Fields to Database Columns

| Form Field        | Database Table       | Database Column         |
|-------------------|----------------------|-------------------------|
| activePlan        | subscription_plans   | name                    |
| startDate         | subscriptions        | start_date              |
| endDate           | subscriptions        | end_date                |
| status            | subscriptions        | status                  |
| additionalNotes   | subscriptions        | notes                   |

## Helper Functions

The controller includes several helper methods:

- `extractPriceFromPlanName()`: Parses the price from the plan name
- `estimateDateOfBirthFromAgeGroup()`: Converts age group to date of birth
- `mapAgeGroupToEducationLevel()`: Maps age group to educational level

## Data Flow

1. User fills out the three-step form on the frontend
2. Data is submitted to the `/students` endpoint
3. Controller validates the data
4. Database transaction begins
5. User record is created
6. Student profile is created
7. Learning preferences are saved
8. Subscription plan is found or created
9. Subscription is created
10. Transaction is committed
11. Success response is returned to the frontend

## Error Handling

If any part of the process fails:

1. The database transaction is rolled back
2. An error response is returned to the frontend
3. The frontend displays an error toast notification with specific error details

## Case Sensitivity Notes

1. The database stores status values in lowercase (`active`, `inactive`, etc.)
2. The frontend displays status values with first letter capitalized (`Active`, `Inactive`, etc.)
3. When saving data, the controller converts status values to lowercase before storing them
4. When retrieving data, the controller capitalizes the first letter of status values for the frontend

## Testing

The `StudentControllerTest` provides test coverage for:

1. Successful student registration
2. Validation error handling 
