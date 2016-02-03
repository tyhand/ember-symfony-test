<?php

namespace AppBundle\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ProfileControllerTest extends WebTestCase
{
    public function testProfileAction()
    {
        $client = static::createClient();

        $crawler = $client->request('GET', '/api/profiles');

        // Test before authentication
        $this->assertEquals(401, $client->getResponse()->getStatusCode());
    }
}
