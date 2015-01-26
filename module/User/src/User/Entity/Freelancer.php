<?php
/**
 * Created by PhpStorm.
 * User: antiprovn
 * Date: 10/1/14
 * Time: 6:17 AM
 */

namespace User\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection as ArrayCollection;
use Common\Entity;
use Common\Func;

/** @ORM\Entity */
class Freelancer extends Entity{

    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @ORM\Column(type="integer")
     */
    protected $id;

    /**
     * @var \Doctrine\ORM\PersistentCollection
     * @ORM\ManyToMany(targetEntity="Resource")
     */
    protected $Resources = null;
	

    /**
     * @var \Doctrine\ORM\PersistentCollection
     * @ORM\ManyToMany(targetEntity="CatTool")
     * @ORM\JoinTable(name="UserDesktopCatTools")
     */
    protected $DesktopCatTools = null;
	
    /**
     * @var \Doctrine\ORM\PersistentCollection
     * @ORM\ManyToMany(targetEntity="OperatingSystem")
     * @ORM\JoinTable(name="UserOperatingSystem")
     */
    protected $DesktopOperatingSystems = null;
	
    /**
     * @var \Doctrine\ORM\PersistentCollection
     * @ORM\ManyToMany(targetEntity="Specialism")
     * @ORM\JoinTable(name="UserInterpretingSpecialisms")
     */
    protected $InterpretingSpecialisms = null;
	
    /**
     * @var \Doctrine\ORM\PersistentCollection
     * @ORM\ManyToMany(targetEntity="CatTool")
     * @ORM\JoinTable(name="UserTranslationCatTools")
     */
    protected $TranslationCatTools = null;
	
    /**
     * @var \Doctrine\ORM\PersistentCollection
     * @ORM\ManyToMany(targetEntity="Specialism")
     * @ORM\JoinTable(name="UserTranslationSpecialisms")
     */
    protected $TranslationSpecialisms = null;
    protected $Rating = null;

    /**
     * @ORM\Column(type="boolean")
     */
    protected $isSenior = false;
	
	
	public function __construct() {
		//PAPERTASK
		$this->DesktopCatTools = new ArrayCollection();
		$this->Resources = new ArrayCollection();
		$this->DesktopOperatingSystems = new ArrayCollection();
		$this->InterpretingSpecialisms = new ArrayCollection();
		$this->TranslationCatTools = new ArrayCollection();
		$this->TranslationSpecialisms = new ArrayCollection();
		//RATING
		$this->Rating = new ArrayCollection();
	}

    public function getData(){
        return array(
            'id' => $this->id,
            'DesktopCatTools' => Func::getReferenceIds($this->DesktopCatTools),
            'DesktopOperatingSystems' => Func::getReferenceIds($this->DesktopOperatingSystems),
            'InterpretingSpecialisms' => Func::getReferenceIds($this->InterpretingSpecialisms),
            'Resources' => Func::getReferenceIds($this->Resources),
            'TranslationCatTools' => Func::getReferenceIds($this->TranslationCatTools),
            'TranslationSpecialisms' => Func::getReferenceIds($this->TranslationSpecialisms),
			
            'Rating' => Func::getReferenceIds($this->Rating),
            'isSenior' => $this->isSenior
        );
    }

    /**
     * @param array $data
     * @param \Doctrine\ORM\EntityManager $entityManager
     */
    public function updateData($data, $entityManager){
        $keys = array(
            'DesktopCatTools',
            'DesktopOperatingSystems',
            'InterpretingSpecialisms',
            'Resources',
            'TranslationCatTools',
            'TranslationSpecialisms',
			
            'Rating',
        );
        return $this->updateManyToOne($data, $keys, $entityManager);
    }
	
	
	 public function updateSenior(array $arr){
        $keys = array(
            'isSenior'
        );

        foreach($keys as $key){
            if(isset($arr[$key])){
                $this->$key = $arr[$key];
            }
        }

        return $this;
    }
    public function getId(){
        return $this->id;
    }
} 