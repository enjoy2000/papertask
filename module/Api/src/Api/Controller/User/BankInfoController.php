<?php
/**
 * Created by PhpStorm.
 * User: antiprovn
 * Date: 9/27/14
 * Time: 9:19 PM
 */
namespace Api\Controller\User;

use Zend\View\Model\JsonModel;

use Application\Controller\AbstractRestfulController;
use Admin\Model\Helper;
use User\Entity\BankInfo;

class BankInfoController extends AbstractRestfulController
{
    public function get($id){
        if($id){
            $user = $this->getUserById($id);
        } else {
            $user = $this->getCurrentUser();
        }
        
        $bankInfo = $this->getEntityManager()->getRepository('\User\Entity\BankInfo')->findOneBy(['user' => $user]);

        return new JsonModel([
            'bankInfo' => $bankInfo->getData(),
        ]);
    }

    public function update($id, $data){
        $entityManager = $this->getEntityManager();
        if($id){
            $user = $this->getUserById($id);
        } else {
            $user = $this->getCurrentUser();
        }

        $bankInfo = $entityManager->find('\User\Entity\BankInfo', (int)$data['id']);
        $data['user'] = $user;
        $bankInfo->setData($data);
        $bankInfo->save($entityManager);

        return new JsonModel(['updated' => true]);
    }

    public function create($data){
        $entityManager = $this->getEntityManager();
        $bankInfo = new BankInfo();
        if($data['user_id']){
            $data['user'] = $this->getUserById((int)$data['user_id']);
        } else {
            $data['user'] = $this->getCurrentUser();
        }

        $bankInfo->setData($data);
        $bankInfo->save($entityManager);

        return new JsonModel(['created' => true]);
    }
}
