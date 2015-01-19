<?php

return array(
    'guest'=> array(
        // Static pages
		'home',
		'languages',
		'freelancer',
		'contact',
		'order',
		'privacy',
		'terms',
    ),
    'admin'=> array(
		// Static pages
		'home',
		'languages',
		'freelancer',
		'contact',
		'order',
		'privacy',
		'terms',
		
		// Login
		'login\index',
		'forgotpassword\index',
		'login\social',
		
        // Dashboard Panel
		'dashboard\index',
		// -- Task
		'task\index',
        // -- Project
		'project\index',
		'project\new',
		'project\quote', // Quotes in menu
		// -- Freelancer
		'freelancer\index',
		'freelancer\new',
		// -- Employer (Client)
		'employer\list',
		'employer\new',
		'employer\profile',
		// -- Staff
		'staff\index',
		'staff\new',
		// -- Email
		'email\index',
		'email\new',
		// -- Profile
		'papertask\profile',
    ),
);
