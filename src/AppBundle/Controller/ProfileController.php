<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

use Nelmio\ApiDocBundle\Annotation\ApiDoc;

use League\Fractal;
use AppBundle\Transformer\ProfileTransformer;
use AppBundle\Serializer\EmberSerializer;

class ProfileController extends Controller
{

    /**
    * Get information for the current authenticated user
    *
    * @Route("/api/profiles")
    * @Method({"GET"})
    *
    * @ApiDoc(
    * 		resource=true,
    * 		description="Get information for the current authenticated user"
    * )
    */
    public function profileAction(Request $request)
    {
        // Get the current user
        $user = $this->get('security.context')->getToken()->getUser();

        // Transform to api json output
        $fractal = new Fractal\Manager();
        $fractal->setSerializer(new EmberSerializer('profiles'));
        $resource = new Fractal\Resource\Collection([$user], new ProfileTransformer($this->get('router')));
        return new JsonResponse($fractal->createData($resource)->toArray());
    }
}
