<?php

namespace App\Utils;

use Exception;

class CurlUtil
{
    private static CurlUtil $instance;
    private mixed $curl;

    public const BASE_HEADERS = [
        'Content-Type: application/json'
    ];

    private function __construct($curl = null)
    {
        $this->curl = $curl ?: curl_init();
    }

    public function __destruct()
    {
        if ($this->curl !== null) {
            curl_close($this->curl);
        }
    }

    public static function getInstance($curl = null): CurlUtil
    {
        if (!isset(self::$instance)) {
            self::$instance = new self($curl ?: curl_init());
        }
        return self::$instance;
    }

    /**
     * @throws Exception
     */
    public function get($url, $headers = []): string
    {
        $formattedHeaders = $this->formatHeaders($headers);

        curl_setopt_array(
            $this->curl,
            [
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'GET',
                CURLOPT_HTTPHEADER => $formattedHeaders
            ]
        );

        $response = curl_exec($this->curl);
        if ($response === false) {
            $errorMessage = curl_error($this->curl);
            throw new Exception("cURL error: $errorMessage");
        }

        return $response;
    }

    /**
     * @throws Exception
     */
    public function post($url, $data, $headers = []): string
    {
        $formattedHeaders = $this->formatHeaders($headers);

        curl_setopt_array(
            $this->curl,
            [
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => json_encode($data),
                CURLOPT_HTTPHEADER => $formattedHeaders
            ]
        );

        $response = curl_exec($this->curl);
        if ($response === false) {
            $errorMessage = curl_error($this->curl);
            throw new Exception("cURL error: $errorMessage");
        }

        return $response;
    }

    /**
     * @throws Exception
     */
    public function put($url, $data, $headers = []): string
    {
        $formattedHeaders = $this->formatHeaders($headers);

        curl_setopt_array(
            $this->curl,
            [
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'PUT',
                CURLOPT_POSTFIELDS => json_encode($data),
                CURLOPT_HTTPHEADER => $formattedHeaders
            ]
        );

        $response = curl_exec($this->curl);
        if ($response === false) {
            $errorMessage = curl_error($this->curl);
            throw new Exception("cURL error: $errorMessage");
        }

        return $response;
    }

    /**
     * @throws Exception
     */
    public function patch($url, $data, $headers = []): string
    {
        $formattedHeaders = $this->formatHeaders($headers);

        curl_setopt_array(
            $this->curl,
            [
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'PATCH',
                CURLOPT_POSTFIELDS => json_encode($data),
                CURLOPT_HTTPHEADER => $formattedHeaders
            ]
        );

        $response = curl_exec($this->curl);
        if ($response === false) {
            $errorMessage = curl_error($this->curl);
            throw new Exception("cURL error: $errorMessage");
        }

        return $response;
    }

    /**
     * @throws Exception
     */
    public function delete($url, $headers = [])
    {
        $formattedHeaders = $this->formatHeaders($headers);

        curl_setopt_array(
            $this->curl,
            [
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'DELETE',
                CURLOPT_HTTPHEADER => $formattedHeaders
            ]
        );

        $response = curl_exec($this->curl);
        if ($response === false) {
            $errorMessage = curl_error($this->curl);
            throw new Exception("cURL error: $errorMessage");
        }

        $httpCode = curl_getinfo($this->curl, CURLINFO_HTTP_CODE);

        if ($httpCode == 200) {
            return json_decode($response, true);
        } else {
            throw new Exception("Delete request failed with status code: $httpCode");
        }
    }

    /**
     * @throws Exception
     */
    public function encodedPost($url, $data, $headers = []): bool|string
    {
        curl_setopt_array($this->curl, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => 'PUT',
            CURLOPT_POSTFIELDS => http_build_query($data),
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/x-www-form-urlencoded'
            ]
        ]);

        $response = curl_exec($this->curl);
        if ($response === false) {
            $errorMessage = curl_error($this->curl);
            throw new Exception("cURL error: $errorMessage");
        }

        return $response;
    }

    private function formatHeaders($headers): array
    {
        $allHeaders = array_merge(self::BASE_HEADERS, $headers);

        $formattedHeaders = [];
        foreach ($allHeaders as $key => $value) {
            $formattedHeaders[] = "$key: $value";
        }

        return $formattedHeaders;
    }
}
