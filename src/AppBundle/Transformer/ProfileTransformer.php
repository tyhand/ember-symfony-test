<?php

namespace AppBundle\Transformer;

use AppBundle\Entity\User;
use League\Fractal;
use Symfony\Bundle\FrameworkBundle\Routing\Router;

/**
 * Fractal transformer for the user object to profile info
 */
class ProfileTransformer extends Fractal\TransformerAbstract
{
    /**
     * Symfony routing component
     *
     * @var Router
     */
    protected $router;

    /**
     * Constructor
     *
     * @param Router $router Symfony Routing Component
     */
    public function __construct(Router $router)
    {
        $this->router = $router;
    }

    /**
     * Transform a user to an array
     *
     * @param  User  $user User
     *
     * @return array       Array for fractal
     */
    public function transform(User $user)
    {
        return [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'username' => $user->getUsername(),
            'links' => [
            ]
        ];
    }
}
