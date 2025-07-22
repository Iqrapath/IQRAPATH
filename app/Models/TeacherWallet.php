<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TeacherWallet extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'balance',
        'currency',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'balance' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * Get the user that owns the wallet.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the transactions for the wallet.
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(WalletTransaction::class, 'wallet_id');
    }

    /**
     * Credit the wallet with the specified amount.
     *
     * @param float $amount
     * @param string $description
     * @param string|null $reference
     * @param array|null $metadata
     * @return WalletTransaction
     */
    public function credit(float $amount, string $description, ?string $reference = null, ?array $metadata = null): WalletTransaction
    {
        $balanceBefore = $this->balance;
        $this->balance += $amount;
        $this->save();

        return $this->transactions()->create([
            'amount' => $amount,
            'balance_before' => $balanceBefore,
            'balance_after' => $this->balance,
            'type' => 'credit',
            'status' => 'completed',
            'description' => $description,
            'reference' => $reference,
            'metadata' => $metadata,
        ]);
    }

    /**
     * Debit the wallet with the specified amount.
     *
     * @param float $amount
     * @param string $description
     * @param string|null $reference
     * @param array|null $metadata
     * @return WalletTransaction|bool
     */
    public function debit(float $amount, string $description, ?string $reference = null, ?array $metadata = null)
    {
        if ($this->balance < $amount) {
            return false;
        }

        $balanceBefore = $this->balance;
        $this->balance -= $amount;
        $this->save();

        return $this->transactions()->create([
            'amount' => $amount,
            'balance_before' => $balanceBefore,
            'balance_after' => $this->balance,
            'type' => 'debit',
            'status' => 'completed',
            'description' => $description,
            'reference' => $reference,
            'metadata' => $metadata,
        ]);
    }
}
