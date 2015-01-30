<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link       for the canonical source repository
 * @copyright Copyright (c) 2005-2014 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */
namespace User;
return array(
    'router' => array(
        'routes' => array(
            // The following is a route to simplify getting started creating
            // new controllers and actions without needing to create a new
            // module. Simply drop new controllers in, and you can access them
            // using the path /user/:controller/:action
            'user' => array(
                'type'    => 'Segment',
                'options' => array(
                    'route'    => '/:lang/user',
                    'defaults' => array(
                        '__NAMESPACE__' => 'User\Controller',
                        'controller'    => 'Index',
                        'action'        => 'index',
                        'lang'=>'en-US'
                    ),
                ),
                'may_terminate' => true,
                'child_routes' => array(
                    'default' => array(
                        'type'    => 'Segment',
                        'options' => array(
                            'route'    => '/[:controller[/[:action[/]]]]',
                            'constraints' => array(
                                'controller' => '[a-zA-Z][a-zA-Z0-9_-]*',
                                'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                                
                            ),
                            'defaults' => array(
                            ),
                        ),
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
            'User\Controller\Index' => 'User\Controller\IndexController',
            'User\Controller\Register' => 'User\Controller\RegisterController',
            'User\Controller\Login' => 'User\Controller\LoginController',
            'User\Controller\Logout' => 'User\Controller\LogoutController',
            'User\Controller\ForgotPassword' => 'User\Controller\ForgotPasswordController',
            'User\Controller\Dashboard' => 'User\Controller\DashboardController',
        ),
    ),
    'view_manager' => array(
        'display_not_found_reason' => true,
        'display_exceptions'       => true,
        'doctype'                  => 'HTML5',
        'not_found_template'       => 'error/404',
        'exception_template'       => 'error/index',
        'template_map' => array(
            'layout/layout' => __DIR__ . '/../../Application/view/layout/layout.phtml',
            'user/index/index' => __DIR__ . '/../view/user/index/index.phtml',
            'user/register/index' => __DIR__ . '/../view/user/register/index.phtml',
            'user/register/freelancer' => __DIR__ . '/../view/user/register/form.phtml',
            'user/register/employer' => __DIR__ . '/../view/user/register/form.phtml',
            'user/register/confirm' => __DIR__ . '/../view/user/register/confirm.phtml',
            'user/login/index' => __DIR__ . '/../view/user/login/form.phtml',
            'user/login/social' => __DIR__ . '/../view/user/register/index.phtml',
            'user/forgot-password/index' => __DIR__ . '/../view/user/forgotPassword/form.phtml',
            'user/forgot-password/reset' => __DIR__ . '/../view/user/forgotPassword/reset.phtml',
            'user/dashboard/index' => __DIR__ . '/../view/user/dashboard/index.phtml',
            'error/404'               => __DIR__ . '/../../Application/view/error/404.phtml',
            'error/index'             => __DIR__ . '/../../Application/view/error/index.phtml',
        ),
        'layout' => 'layout/layout',
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
            'user_entities' => array(
                'class' => 'Doctrine\ORM\Mapping\Driver\AnnotationDriver',
                'cache' => 'array',
                'paths' => array(__DIR__ . '/../src/User/Entity')
            ),
            'orm_default' => array(
                'drivers' => array(
                    'User\Entity' => 'user_entities'
                )
            ))),

    'application_config' => [
        'staff_types' => [
            [1 => 'Admin', 2 => 'General Manager'],
            [3 => 'Financial Manager'],
            [4 => 'Sales Director', 5 => 'Sales'],
            [6 => 'Operation Manager', 7 => 'Project Manager'],
            [8 => 'In-house Translator', 9 => 'In-house Editor/proofreader', 10 => 'In-house DTP',
                11 => 'In-house Engineering'],
        ],
    ],
);