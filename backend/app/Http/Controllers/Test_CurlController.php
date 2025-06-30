<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;

use App\Utils\CurlUtil;
use App\Utils\TextMessage;
use Exception;

class Test_CurlController extends Controller
{
    private CurlUtil $my_axios;
    private TextMessage $messager;

    public function __construct()
    {
        $this->my_axios = CurlUtil::getInstance();
        $this->messager = TextMessage::getInstance();
    }

    /**
     * @throws Exception
     */
    public function sendTextMessage(): string
    {
        $response = $this->messager->send(
            'Ivan',
            'Test message from Laravel',
            '00387--------'
        );

        return json_decode($response);
    }

    /**
     * @throws Exception
     */
    public function testGet(): string
    {
        $response = $this->my_axios->get(
            'https://ens5v92x5jg1.x.pipedream.net/data',
            [
                'Authorization' => 'Bearer {token}',
                'X-Custom-Header' => 'Value1'
            ]
        );

        return json_decode($response);
    }

    /**
     * @throws Exception
     */
    public function testPost(): string
    {
        $response = $this->my_axios->post(
            'https://ens5v92x5jg1.x.pipedream.net/users',
            [
                'name' => 'John',
                'email' => 'john@example.com'
            ],
            [
                'Authorization' => 'Bearer {token}',
            ]
        );

        return json_decode($response);
    }

    /**
     * @throws Exception
     */
    public function testPut(): string
    {
        $response = $this->my_axios->put(
            'https://ens5v92x5jg1.x.pipedream.net/users/123',
            [
                'name' => 'Jane',
                'email' => 'jane@example.com'
            ],
            [
                'Authorization' => 'Bearer {token}',
                'Content-Type' => 'application/x-www-form-urlencoded'
            ]
        );

        return json_decode($response);
    }

    /**
     * @throws Exception
     */
    public function testPut2(): string
    {
        $response = $this->my_axios->put(
            'https://ens5v92x5jg1.x.pipedream.net/settings/456',
            [
                'theme' => 'dark',
                'notifications' => 'enabled'
            ],
            [
                'Content-Type: application/json',
                'X-Request-ID: 789'
            ]
        );

        return json_decode($response);
    }

    /**
     * @throws Exception
     */
    public function testPatch(): string
    {
        $response = $this->my_axios->patch(
            'https://ens5v92x5jg1.x.pipedream.net/users/123',
            [
                'status' => 'active',
            ],
            [
                'Authorization' => 'Bearer {token}',
                'User-Agent' => 'MyCustomUserAgent/1.0'
            ]
        );

        return json_decode($response);
    }

    /**
     * @throws Exception
     */
    public function testDelete(): string
    {
        return $this->my_axios->delete(
            'https://ens5v92x5jg1.x.pipedream.net/users/123',
            [
                'Authorization' => 'Bearer {token}',
            ]
        );
    }
}
