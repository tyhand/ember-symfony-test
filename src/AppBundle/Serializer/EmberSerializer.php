<?php

namespace AppBundle\Serializer;

use League\Fractal\Serializer\DataArraySerializer;

class EmberSerializer extends DataArraySerializer
{
    /**
     * Data key name
     *
     * @var string
     */
    protected $dataKeyName;

    /**
     * Constructor
     *
     * @param string $dataKeyName Data key name
     */
    public function __construct($dataKeyName)
    {
        $this->dataKeyName = $dataKeyName;
    }

    /**
     * Serialize a collection.
     *
     * @param string $resourceKey
     * @param array  $data
     *
     * @return array
     */
    public function collection($resourceKey, array $data)
    {
        return [$this->dataKeyName => $data];
    }
    /**
     * Serialize an item.
     *
     * @param string $resourceKey
     * @param array  $data
     *
     * @return array
     */
    public function item($resourceKey, array $data)
    {
        return [$this->dataKeyName => $data];
    }
}
