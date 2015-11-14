<?php
namespace AppBundle\Entity;
use Doctrine\ORM\Mapping as ORM;
use Mesd\UserBundle\Entity\User as BaseUser;
/**
 * @ORM\Entity
 * @ORM\Table(name="auth_user")
 */
class User extends BaseUser
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
     * @ORM\ManyToMany(targetEntity="Role")
     * @ORM\JoinTable(name="auth_user__role",
     *      joinColumns={@ORM\JoinColumn(name="user_id", referencedColumnName="id")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="role_id", referencedColumnName="id")}
     * )
     **/
    protected $role;
    /**
     * Constructor
     */
    public function __construct()
    {
        // Construct the superclass
        parent::__construct();
        $this->role = new \Doctrine\Common\Collections\ArrayCollection();
    }
}
