<?php
namespace AppBundle\Entity;
use Doctrine\ORM\Mapping as ORM;
use Mesd\UserBundle\Entity\Role as BaseRole;
/**
 * @ORM\Entity
 * @ORM\Table(name="auth_role")
 */
class Role extends BaseRole
{
    /**
     * Database Id
     *
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     * @var int
     */
    protected $id;
    /**
     * Constructor
     */
    public function __construct()
    {
        // Call the super constructor
        parent::__construct();
    }
}
