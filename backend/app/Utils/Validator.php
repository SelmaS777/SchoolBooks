<?php

namespace App\Utils;

//use App\Http\Services\HaveIBeenPwnedService;
use Exception;
//use libphonenumber\PhoneNumberUtil;
//use libphonenumber\NumberParseException;
//use libphonenumber\PhoneNumberType;
//use Illuminate\Support\Facades\Cache;

class Validator
{
    private const RESERVED_NAMES = ['admin', 'root', 'superuser'];


    /**
     * @throws Exception
     */
    public static function validateRegister(string $fullName, string $username, string $password, string $email, string $phoneNumber): ?array
    {
        $fullNameError = self::validateFullName($fullName);
       // $usernameError = self::username($username);
        $passwordError = self::password($password);
        $emailError = self::email($email);
        $phoneNumberError = self::validatePhoneNumber($phoneNumber);

        $errors = [];

        if ($fullNameError) {
            $errors['fullName'] = $fullNameError;
        }

    

        if ($passwordError) {
            $errors['password'] = $passwordError;
        }

        if ($emailError) {
            $errors['email'] = $emailError;
        }

        if ($phoneNumberError) {
            $errors['phoneNumber'] = $phoneNumberError;
        }

        return count($errors) > 0 ? $errors : null;
    }

    public static function validateTOTPSecret(string $totpSecret): ?string
    {
        /* 
        if (!self::max($totpSecret, 6)) {
            return 'TOTP secret must be at least 6 characters long.';
        }

        if (!self::max($totpSecret, 16)) {
            return 'TOTP secret must be at most 16 characters long.';
        }

        if (!self::isAlphaNumeric($totpSecret)) {
            return 'TOTP secret must contain only alphanumeric characters.';
        }
            */

        return null;
    }


    public static function identifier(string $identifier): ?string
    {
        if (self::email($identifier)) {
            return null;
        }



        return 'Invalid identifier. It must be either a valid email.';
    }

    public static function validateFullName(string $fullName): ?string
    {
        if (!self::min($fullName, 3)) {
            return 'Full name must be at least 3 characters long.';
        }

        if (!self::max($fullName, 100)) {
            return 'Full name must be at most 100 characters long.';
        }

        if (!preg_match("/^[a-zA-Z\s]+$/", $fullName)) {
            return 'Full name must contain only letters and spaces.';
        }

        return null;
    }

 
    /**
     * @throws Exception
     */
    public static function password(string $password): ?string
    {
        if (!self::min($password, 8)) {
            return 'Password must be at least 8 characters long.';
        }

        if (!self::max($password, 30)) {
            return 'Password must be at most 30 characters long.';
        }

        if (!self::validatePasswordStructure($password)) {
            return 'Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character and no spaces.';
        }

      

        return null;
    }

    public static function email(string $email): ?string
    {
        if (!self::validateEmailStructure($email)) {
            return 'Invalid email address.';
        }

       

        return null;
    }

    public static function min(string $value, int $minValue): bool
    {
        return mb_strlen($value) >= $minValue;
    }

    public static function max(string $value, int $maxValue): bool
    {
        return mb_strlen($value) <= $maxValue;
    }

   
    public static function isNotReserved(string $value): bool
    {
        return !in_array(strtolower($value), self::RESERVED_NAMES);
    }

    public static function validateEmailStructure(string $email): bool
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL);
    }


    public static function validatePhoneNumber(string $phoneNumber): ?string // Return string on error
    {
        $length = mb_strlen(preg_replace('/\D/', '', $phoneNumber)); // Count only digits
        if ($length >= 5 && $length <= 20) { // Example: Allow 5-20 digits
             return null; // Passes
        }
        return 'Phone number must have between 5 and 20 digits.'; // Return error string
    }

    public static function validatePasswordStructure(string $password): bool
    {
        return preg_match("/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/", $password);
    }

   
}
