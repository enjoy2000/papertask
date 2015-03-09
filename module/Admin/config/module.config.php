<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonAdmin for the canonical source repository
 * @copyright Copyright (c) 2005-2014 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */
namespace Admin;
return array(
    'router' => array(
        'routes' => array(
            // The following is a route to simplify getting started creating
            // new controllers and actions without needing to create a new
            // module. Simply drop new controllers in, and you can access them
            // using the path /admin/:controller/:action
            'admin' => array(
                'type'    => 'Segment',
                'options' => array(
                    'route'    => '/:lang/admin/[:controller[/[:action[/]]]]',
                    'defaults' => array(
                        '__NAMESPACE__' => 'Admin\Controller',
                        'controller'    => 'Dashboard',
                        'action'        => 'index',
                        'lang'=>'en-US'
                    ),
                    'constraints' => array(
                        'controller' => '[a-zA-Z][a-zA-Z0-9_-]*',
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                ),
            ),
        ),
    ),
    'service_manager' => array(
        'abstract_factories' => array(
            'Zend\Cache\Service\StorageCacheAbstractServiceFactory',
            'Zend\Log\LoggerAbstractServiceFactory',
        ),
        'aliases' => array(
            'translator' => 'MvcTranslator',
        ),
    ),
	'translator' => array(
        'locale' => 'en-US',
        'translation_file_patterns' => array(
            array(
                'type'     => 'gettext',
                'base_dir' => __DIR__ . '/../language',
                'pattern'  => '%s.mo',
				'text_domain' => __NAMESPACE__,
            ),
        ),
    ),
    'controllers' => array(
        'invokables' => array(
            'Admin\Controller\Dashboard' => 'Admin\Controller\DashboardController',
            'Admin\Controller\Email' => 'Admin\Controller\EmailController',
            'Admin\Controller\Employer' => 'Admin\Controller\EmployerController',
            'Admin\Controller\Freelancer' => 'Admin\Controller\FreelancerController',
            'Admin\Controller\Papertask' => 'Admin\Controller\PapertaskController',
            'Admin\Controller\Project' => 'Admin\Controller\ProjectController',
            'Admin\Controller\Quote' => 'Admin\Controller\QuoteController',
            'Admin\Controller\Staff' => 'Admin\Controller\StaffController',
            'Admin\Controller\Task' => 'Admin\Controller\TaskController',
            'Admin\Controller\ResetPassword' => 'Admin\Controller\ResetPasswordController',
        ),
    ),
    'view_manager' => array(
        'display_not_found_reason' => true,
        'display_exceptions'       => true,
        'doctype'                  => 'HTML5',
        'not_found_template'       => 'error/404',
        'exception_template'       => 'error/index',
        'template_map' => array(
            'admin/dashboard/index' => __DIR__ . '/../view/admin/dashboard/index.phtml',
            'admin/email/edit' => __DIR__ . '/../view/admin/email/edit.phtml',
            'admin/email/index' => __DIR__ . '/../view/admin/email/index.phtml',
            'admin/email/new' => __DIR__ . '/../view/admin/email/new.phtml',
            'admin/employer/detail' => __DIR__ . '/../view/admin/employer/details.phtml',
            'admin/employer/list' => __DIR__ . '/../view/admin/employer/list.phtml',
            'admin/employer/new' => __DIR__ . '/../view/admin/employer/new.phtml',
            'admin/employer/profile' => __DIR__ . '/../view/admin/employer/edit-profile.phtml',
            'admin/freelancer/edit-payment-info' => __DIR__ . '/../view/admin/freelancer/edit-payment-info.phtml',
            'admin/freelancer/edit-profile' => __DIR__ . '/../view/admin/freelancer/edit-profile.phtml',
            'admin/freelancer/finish-registration' => __DIR__ . '/../view/admin/freelancer/finish-registration.phtml',
            'admin/freelancer/index' => __DIR__ . '/../view/admin/freelancer/index.phtml',
            'admin/freelancer/new' => __DIR__ . '/../view/admin/freelancer/new.phtml',
            'admin/freelancer/update-info' => __DIR__ . '/../view/admin/freelancer/finish-registration.phtml',
            'admin/freelancer/view' => __DIR__ . '/../view/admin/freelancer/view.phtml',
            'admin/freelancer/detail' => __DIR__ . '/../view/admin/freelancer/details.phtml',
            'admin/project/detail' => __DIR__ . '/../view/admin/project/detail.phtml',
            'admin/project/index' => __DIR__ . '/../view/admin/project/index.phtml',
            'admin/project/new' => __DIR__ . '/../view/admin/project/new.phtml',
			'admin/project/quoteprint' => __DIR__ . '/../view/admin/project/quoteprint.phtml',
			'admin/project/invoiceprint' => __DIR__ . '/../view/admin/project/invoiceprint.phtml',
			
            'admin/quote/detail' => __DIR__ . '/../view/admin/quote/detail.phtml',
            'admin/staff/edit-payment-info' => __DIR__ . '/../view/admin/freelancer/edit-payment-info.phtml',
            'admin/staff/edit-profile' => __DIR__ . '/../view/admin/staff/edit-profile.phtml',
            'admin/staff/index' => __DIR__ . '/../view/admin/staff/index.phtml',
            'admin/staff/new' => __DIR__ . '/../view/admin/staff/new.phtml',
            'admin/staff/view' => __DIR__ . '/../view/admin/staff/view.phtml',
            'admin/task/new' => __DIR__ . '/../view/admin/task/new.phtml',
        ),
        'layout' => 'layout/admin',
        'template_path_stack' => array(
            __DIR__ . '/../view',
        ),
    ),
    // Placeholder for console routes
    'console' => array(
        'router' => array(
            'routes' => array(
            ),
        ),
    ),

    // Doctrine
    'doctrine' => array(
        'driver' => array(
            'admin_entities' => array(
                'class' => 'Doctrine\ORM\Mapping\Driver\AnnotationDriver',
                'cache' => 'array',
                'paths' => array(__DIR__ . '/../src/Admin/Entity')
            ),
            'orm_default' => array(
                'drivers' => array(
                    'Admin\Entity' => 'admin_entities'
                )
            ))),
);
