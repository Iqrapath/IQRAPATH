<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SeedSubscriptionData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:seed-subscription-data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Seed subscription and payment data for the revenue chart';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Seeding subscription data...');

        // Only run the SubscriptionSeeder
        $this->call('db:seed', [
            '--class' => 'Database\\Seeders\\SubscriptionSeeder',
        ]);

        $this->info('Subscription data seeded successfully!');

        return Command::SUCCESS;
    }
}
