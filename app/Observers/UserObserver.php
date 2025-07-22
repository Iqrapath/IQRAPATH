<?php

namespace App\Observers;

use App\Models\User;
use App\Models\StudentProfile;
use App\Models\TeacherProfile;
use App\Models\GuardianProfile;

class UserObserver
{
    /**
     * Handle the User "created" event.
     */
    public function created(User $user): void
    {
        // Create the appropriate profile based on user role
        switch ($user->role) {
            case 'student':
                // Create minimal student profile
                StudentProfile::create([
                    'user_id' => $user->id,
                ]);
                break;

            case 'teacher':
                // Create minimal teacher profile
                TeacherProfile::create([
                    'user_id' => $user->id,
                ]);
                break;

            case 'guardian':
                // Create minimal guardian profile
                GuardianProfile::create([
                    'user_id' => $user->id,
                ]);
                break;
        }
    }
}
