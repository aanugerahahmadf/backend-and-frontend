<?php

namespace App\Services;

use App\Repositories\CctvRepository;

class CctvService extends BaseService
{
    protected $cctvRepository;

    public function __construct(CctvRepository $cctvRepository)
    {
        parent::__construct($cctvRepository);
        $this->cctvRepository = $cctvRepository;
    }

    public function getCctvsByRoomId(int $roomId)
    {
        return $this->cctvRepository->getByRoomId($roomId);
    }

    public function getStreamUrl(int $id)
    {
        return $this->cctvRepository->getStreamUrl($id);
    }
}
