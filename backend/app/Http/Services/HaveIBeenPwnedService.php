<?php

namespace App\Http\Services;

use Exception;
use App\Utils\CurlUtil;

class HaveIBeenPwnedService
{
    private CurlUtil $curl;

    public function __construct()
    {
        $this->curl = CurlUtil::getInstance();
    }

    /**
     * @throws Exception
     */
    public function checkPassword(string $password): bool
    {
        $sha1Password = strtoupper(sha1($password));

        $prefix = substr($sha1Password, 0, 5);
        $suffix = substr($sha1Password, 5);

        $response = $this->curl->get("https://api.pwnedpasswords.com/range/" . $prefix);

        if (!str_contains($response, $suffix)) {
            return true;
        }

        return false;
    }
}
