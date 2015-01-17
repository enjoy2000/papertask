<?php
/**
 * Created by PhpStorm.
 * User: antiprovn
 * Date: 10/1/14
 * Time: 6:21 AM
 */

namespace Common;


class Entity {

    /**
     * @param \Doctrine\ORM\EntityManager $entityManager
     */
    public function save($entityManager){
        $entityManager->persist($this);
        $entityManager->flush();
    }

    /**
     * @param array $data
     * @param array $keys
     * @param \Doctrine\ORM\EntityManager $entityManager
     */
    public function updateManyToOne($data, $keys, $entityManager){
		error_reporting(E_ERROR | E_PARSE);
        foreach($keys as $key){
		if($key){
				$ids = $data[$key];
				$ids = array_unique($ids);
				/** @var \Doctrine\ORM\PersistentCollection $relation */
				$relation = $this->$key;
				if($relation)
				{
					$relationKeys = $relation->getKeys();
					foreach($relationKeys as $relationKey){
						$value = $relation->get($relationKey);
						$valueId = $value->getId();
						// if new item already exists
						if($index = array_search($valueId, $ids)){
							array_splice($ids, $index, 1);  # remove it from adding
						} else {
							$relation->remove($relationKey);
						}
					}
					if($ids){
						$relationTarget = $relation->getTypeClass()->getName();
						$newValues = $entityManager->getRepository($relationTarget)->findBy([
							'id' => $ids
						]);
						foreach($newValues as $newValue){
							$relation->add($newValue);
						}
					}
				}
			}
		}
    }

    /**
     * @param array $arr
     */
    public function setData(array $arr){
        foreach($arr as $k => $v){
            $this->$k = $v;
        }
    }

    public function getData(){
        throw new \Exception("Not implemented");
    }

    public function formatPrice($price){
        if($price === null){
            return $price;
        }
        return sprintf("%0.2f", $price);
    }

    public function getArrayData($collection){
        return $collection->map(function($obj){
            /** @var \User\Entity\Resource $obj */
            return $obj->getData();
        })->toArray();
    }
} 