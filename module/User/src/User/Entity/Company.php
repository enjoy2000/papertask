<?php
/**
 * Created by PhpStorm.
 * User: antiprovn
 * Date: 9/28/14
 * Time: 11:50 AM
 */

namespace User\Entity;

use Doctrine\ORM\Mapping as ORM;

use Common\Entity;

/** @ORM\Entity */
class Company extends Entity{

    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @ORM\Column(type="integer")
     */
    protected $id;

    /** @ORM\Column(type="string") */
    protected $name;

    /** @ORM\Column(type="string") */
    protected $telephone = '';

    /** @ORM\Column(type="string") */
    protected $fax = '';

    /** @ORM\Column(type="string") */
    protected $address = '';

    /** @ORM\Column(type="string") */
    protected $city;

    /** @ORM\Column(type="string",nullable=true) */
    protected $country = null;

    /** @ORM\Column(type="string") */
    protected $website;
	/** @ORM\Column(type="string") */
    protected $note='';

    public function getData(){
        return array(
            'id' => $this->id,
            'name' => $this->name,
			'telephone' => $this->telephone,
			'fax' => $this->fax,
			'address' => $this->address,
			'city' => $this->city,
			'country' => $this->country,
            'website' => $this->website,
			'note' => $this->note
        );
    }

    public function getId(){
        return $this->id;
    }
}