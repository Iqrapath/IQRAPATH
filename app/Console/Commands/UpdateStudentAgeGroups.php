<?php

namespace App\Console\Commands;

use App\Models\StudentProfile;
use Illuminate\Console\Command;

class UpdateStudentAgeGroups extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'students:update-age-groups';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update all student profiles with the correct age_group based on date_of_birth';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Updating student age groups...');
        
        $students = StudentProfile::whereNotNull('date_of_birth')->get();
        $updated = 0;
        
        foreach ($students as $student) {
            $age = $student->date_of_birth->age;
            $ageGroup = $age < 13 ? 'child' : ($age < 18 ? 'teenager' : 'adult');
            
            if ($student->age_group !== $ageGroup) {
                $student->age_group = $ageGroup;
                $student->save();
                $updated++;
            }
        }
        
        $this->info("Updated age_group for {$updated} student profiles.");
        
        // Update any remaining profiles without date_of_birth
        $noDateProfiles = StudentProfile::whereNull('date_of_birth')->whereNull('age_group')->get();
        
        if ($noDateProfiles->count() > 0) {
            $this->info("Found {$noDateProfiles->count()} profiles without date_of_birth.");
            
            foreach ($noDateProfiles as $profile) {
                // Set a default age_group based on education_level if available
                if ($profile->education_level) {
                    switch ($profile->education_level) {
                        case 'Elementary':
                            $profile->age_group = 'child';
                            break;
                        case 'Middle School':
                        case 'High School':
                            $profile->age_group = 'teenager';
                            break;
                        default:
                            $profile->age_group = 'adult';
                            break;
                    }
                } else {
                    // Default to adult if no other information is available
                    $profile->age_group = 'adult';
                }
                
                $profile->save();
                $updated++;
            }
            
            $this->info("Set default age_group for {$noDateProfiles->count()} profiles without date_of_birth.");
        }
        
        $this->info("Total profiles updated: {$updated}");
        
        return 0;
    }
} 