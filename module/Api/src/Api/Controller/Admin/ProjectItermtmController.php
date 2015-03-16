<?php
namespace Api\Controller\Admin;

use Zend\View\Model\JsonModel;
use Zend\Paginator\Paginator;

use DoctrineORMModule\Paginator\Adapter\DoctrinePaginator as DoctrineAdapter;
use Doctrine\ORM\Tools\Pagination\Paginator as ORMPaginator;

use Admin\Model\Helper;
use Api\Controller\AbstractRestfulJsonController;
use User\Entity\Iterm;
use User\Entity\Itermdtpmac;
use User\Entity\Itermdtppc;
use User\Entity\Itermengineering;
use User\Entity\Iterminterpreting;
use User\Entity\Itermtm;
use User\Entity\Itermnotm;

use User\Entity\Project;

use User\Entity\UserGroup;
use User\Entity\Task;

class ProjectItermtmController extends AbstractRestfulJsonController
{
    /**
     * Clean data from angular
     * @param $data
     */
    protected function cleanData(&$data){
       
    }

    public function create($data)
    {
		
    }

    public function getList(){
        $entityManager = $this->getEntityManager();
        $projectId = $this->getRequest()->getQuery('projectId');
        $project = $entityManager->getRepository('\User\Entity\Project')->find( $projectId );
        $Itermtm = $entityManager->getRepository('\User\Entity\Itermtm')->findBy(array('project'=>$project));
        $Itermtms = array();
        foreach( $Itermtm as $k => $v ) 
        {
            $Itermtms[$k] = $v->getData();
        }
        return new JsonModel(['Itermtms'=>$Itermtms]);
    }

    public function get($id){
		//error_reporting(E_ALL);
		//ini_set('display_errors', 1);
		$entityManager = $this->getEntityManager();
        $project = $this->find('User\Entity\Itermnotm', $id);
        $Itermnotm = $entityManager->getRepository('\User\Entity\Itermnotm')->findBy(array('project'=>$project));
        $Itermnotms = array();
        foreach( $Itermnotm as $k => $v ) 
        {
            $Itermnotms[$k] = $v->getData();
        }
		var_dump($Itermnotms);exit;
		return new JsonModel([
            'project' => $project->getData(),
			'itermnotms' => $Itermnotms,
			
        ]);
    }

    public function delete($id){
        /** @var \User\Entity\Project $project */
        $project = $this->find('\User\Entity\Project', $id);
        $project->setData([
            'is_deleted' => true
        ]);
        $project->save($this->getEntityManager());
        return new JsonModel([
            'project' => $project->getData(),
        ]);
    }

    public function update($id, $data){
		$entityManager = $this->getEntityManager();
		if($data['file']['id'])
			 $file = $this->find('\User\Entity\File', $data['file']['id']);
        $itermtm = $entityManager->find('\User\Entity\Itermtm', $id);
        $itermtm->setData([
				'name' => $data['name'],
				'rate' => $data['rate'],
				'sourcebawu' => $data['sourcebawu'],
				'sourcejiuwu' => $data['sourcejiuwu'],
				'sourcenomatch' => $data['sourcenomatch'],
				'sourceqiwu' => $data['sourceqiwu'],
				'sourcerepetitions' => $data['sourcerepetitions'],
				'sourcewushi' => $data['sourcewushi'],
				'sourceyibai' => $data['sourceyibai'],
				'total' => $data['total'],
           ]);
           
        $itermtm->save($entityManager);
           
        return new JsonModel([
               'itermtm' => $itermtm->getData(),
           ]);
    }
}