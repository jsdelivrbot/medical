// =========================================================================
// CONFIGURATION ROUTE
// =========================================================================

'use strict';
angular.module('blankonConfig', [])

    // Setup global settings
    .factory('settings', ['$rootScope', function($rootScope) {
        var baseURL = "", // Setting base url app
            settings = {
                baseURL                 : baseURL,
                pluginPath              : baseURL+'/assets/global/plugins/bower_components',
                pluginCommercialPath    : baseURL+'/assets/commercial/plugins',
                globalImagePath         : baseURL+'/img',
                adminImagePath          : baseURL+'/assets/admin/img',
                cssPath                 : baseURL+'/assets/admin/css',
                dataPath                : baseURL+'/production/admin/angularjs/data'
        };
        $rootScope.settings = settings;
        return settings;
    }])

    // Configuration angular loading bar
    .config(function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = true;
    })

    // Configuration event, debug and cache
    .config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            events: true,
            debug: true,
            cache:false,
            cssFilesInsertBefore: 'ng_load_plugins_before',
            modules:[
                {
                    name: 'blankonApp.core.demo',
                    files: ['js/modules/core/demo.js']
                }
            ]
        });
    }])

    // Configuration ocLazyLoad with ui router
    .config(function($stateProvider, $locationProvider, $urlRouterProvider) {
        // Redirect any unmatched url
        $urlRouterProvider.otherwise('page-error-404');

        $stateProvider

            // =========================================================================
            // SIGN IN
            // =========================================================================
            .state('nurse-security', {
                url: '/nurse-security',
                templateUrl: 'views/sign/nurse-security.html',
                data: {
                    pageTitle: 'Security'
                },
                controller: 'SecurityCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', 'settings', function($ocLazyLoad, settings) {

                        var cssPath = settings.cssPath, // Create variable css path
                            pluginPath = settings.pluginPath; // Create variable plugin path

                        // you can lazy load files for an existing module
                        return $ocLazyLoad.load(
                            [
                                {
                                    insertBefore: '#load_css_before',
                                    files: [
                                        cssPath+'/pages/sign.css'
                                    ]
                                },
                                {
                                    files: [
                                        pluginPath+'/jquery-validation/dist/jquery.validate.min.js'
                                    ]
                                },
                                {
                                    name: 'blankonApp.account.signin',
                                    files: [
                                        'js/modules/sign/signin.js'
                                    ]
                                }
                            ]
                        );
                    }]
                }
            })
            .state('doctor-security', {
                url: '/doctor-security',
                templateUrl: 'views/sign/doctor-security.html',
                data: {
                    pageTitle: 'Security'
                },
                controller: 'SecurityCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', 'settings', function($ocLazyLoad, settings) {

                        var cssPath = settings.cssPath, // Create variable css path
                            pluginPath = settings.pluginPath; // Create variable plugin path

                        // you can lazy load files for an existing module
                        return $ocLazyLoad.load(
                            [
                                {
                                    insertBefore: '#load_css_before',
                                    files: [
                                        cssPath+'/pages/sign.css'
                                    ]
                                },
                                {
                                    files: [
                                        pluginPath+'/jquery-validation/dist/jquery.validate.min.js'
                                    ]
                                },
                                {
                                    name: 'blankonApp.account.signin',
                                    files: [
                                        'js/modules/sign/signin.js'
                                    ]
                                }
                            ]
                        );
                    }]
                }
            })
            // =========================================================================
            // SIGN UP
            // =========================================================================
            .state('pool-new-diagnosis', {
                url: '/pool-new-diagnosis',
                controller: 'PoolListCtrl',
                templateUrl: 'views/doctor/public-pool.html',
                data: {
                    pageTitle: 'New Diagnosis',
                    pageHeader: {
                        icon: 'fa fa-home',
                        title: 'New Diagnosis',
                        subtitle: 'New Diagnosis'
                    }
                }
            })
            .state('create-diagnose', {
                url: '/create-diagnose',
                controller: 'CreateDiagnoseCtrl',
                templateUrl: 'views/nurse/create-diagnosis.html',
                data: {
                    pageTitle: 'Create Diagnosis',
                    pageHeader: {
                        icon: 'fa fa-home',
                        title: 'Create Diagnosis',
                        subtitle: 'Create Diagnosis'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad', 'settings', function($ocLazyLoad, settings) {

                        var pluginPath = settings.pluginPath; // Create variable plugin path

                        return $ocLazyLoad.load( // You can lazy load files for an existing module
                            [
                                {
                                    files: [
                                        pluginPath+'/chosen_v1.2.0/chosen.jquery.min.js',
                                        pluginPath+'/jquery-mockjax/jquery.mockjax.js',
                                        pluginPath+'/jquery-validation/dist/jquery.validate.min.js'
                                    ]
                                }
                            ]
                        );
                    }]
                }
            })
            .state('pool-timeouts', {
                url: '/pool-timeouts',
                controller: 'PoolListCtrl',
                templateUrl: 'views/doctor/public-pool.html',
                data: {
                    pageTitle: 'Time Outs',
                    pageHeader: {
                        icon: 'fa fa-home',
                        title: 'Time Outs',
                        subtitle: 'Time Outs'
                    }
                }
            })
            .state('list-assigned', {
                url: '/list-assigned',
                controller: 'DoctorDiagnosisCtrl',
                templateUrl: 'views/doctor/my-list.html',
                data: {
                    pageTitle: 'Assigned Diagnosis',
                    pageHeader: {
                        icon: 'fa fa-home',
                        title: 'Assigned Diagnosis',
                        subtitle: 'Assigned Diagnosis'
                    }
                }
            })
            .state('list-completed', {
                url: '/list-completed',
                controller: 'DoctorDiagnosisCtrl',
                templateUrl: 'views/doctor/my-list.html',
                data: {
                    pageTitle: 'Completed Diagnosis',
                    pageHeader: {
                        icon: 'fa fa-home',
                        title: 'Completed Diagnosis',
                        subtitle: 'Completed Diagnosis'
                    }
                }
            })
            .state('list-timeout', {
                url: '/list-timeout',
                controller: 'DoctorDiagnosisCtrl',
                templateUrl: 'views/doctor/my-list.html',
                data: {
                    pageTitle: 'Time Outs',
                    pageHeader: {
                        icon: 'fa fa-home',
                        title: 'Time Outs',
                        subtitle: 'Time Outs'
                    }
                }
            })
            .state('doctor-notifications-all', {
                url: '/notifications-all',
                controller: 'DoctorNotificationCtrl',
                templateUrl: 'views/doctor/notifications.html',
                data: {
                    pageTitle: 'All Notifications',
                    pageHeader: {
                        icon: 'fa fa-home',
                        title: 'All Notifications',
                        subtitle: 'All Notifications'
                    }
                }
            })
            .state('doctor-notifications-unread', {
                url: '/notifications-unread',
                controller: 'DoctorNotificationCtrl',
                templateUrl: 'views/doctor/notifications.html',
                data: {
                    pageTitle: 'UnRead Notifications',
                    pageHeader: {
                        icon: 'fa fa-home',
                        title: 'UnRead Notifications',
                        subtitle: 'UnRead Notifications'
                    }
                }
            })
            .state('doctor-notifications-archived', {
                url: '/doctor-notifications-archived',
                controller: 'DoctorNotificationCtrl',
                templateUrl: 'views/doctor/notifications.html',
                data: {
                    pageTitle: 'Notifications Archived',
                    pageHeader: {
                        icon: 'fa fa-home',
                        title: 'Notifications Archived',
                        subtitle: 'Notifications Archived'
                    }
                }
            })
            
            // =========================================================================
            // START NURSE MENU HERE
            // =========================================================================

            .state('diagnosis-unassignednew', {
                url: '/diagnosis-unassignednew',
                controller: 'NurseDiagnosisCtrl',
                templateUrl: 'views/nurse/diagnosis.html',
                data: {
                    pageTitle: 'Unassigned/New Diagnosis',
                    pageHeader: {
                        icon: 'fa fa-home',
                        title: 'Unassigned/New Diagnosis',
                        subtitle: 'Unassigned/New Diagnosis'
                    }
                }
            })
            .state('diagnosis-assigned', {
                url: '/diagnosis-assigned',
                controller: 'NurseDiagnosisCtrl',
                templateUrl: 'views/nurse/diagnosis.html',
                data: {
                    pageTitle: 'Assigned Diagnosis',
                    pageHeader: {
                        icon: 'fa fa-home',
                        title: 'Assigned Diagnosis',
                        subtitle: 'Assigned Diagnosis'
                    }
                }
            })
            .state('diagnosis-completed', {
                url: '/diagnosis-completed',
                controller: 'NurseDiagnosisCtrl',
                templateUrl: 'views/nurse/diagnosis.html',
                data: {
                    pageTitle: 'Completed Diagnosis',
                    pageHeader: {
                        icon: 'fa fa-home',
                        title: 'Completed Diagnosis',
                        subtitle: 'Completed Diagnosis'
                    }
                }
            })
            .state('diagnosis-timeout', {
                url: '/diagnosis-timeout',
                controller: 'NurseDiagnosisCtrl',
                templateUrl: 'views/nurse/diagnosis.html',
                data: {
                    pageTitle: 'Timed Out Diagnosis',
                    pageHeader: {
                        icon: 'fa fa-home',
                        title: 'Timed Out Diagnosis',
                        subtitle: 'Timed Out Diagnosis'
                    }
                }
            })
            .state('nurse-notifications-all', {
                url: '/nurse-notifications-all',
                controller: 'NurseNotificationCtrl',
                templateUrl: 'views/nurse/notifications.html',
                data: {
                    pageTitle: 'All Notifications',
                    pageHeader: {
                        icon: 'fa fa-home',
                        title: 'All Notifications',
                        subtitle: 'All Notifications'
                    }
                }
            })
            .state('nurse-notifications-unread', {
                url: '/nurse-notifications-unread',
                controller: 'NurseNotificationCtrl',
                templateUrl: 'views/nurse/notifications.html',
                data: {
                    pageTitle: 'UnRead Notifications',
                    pageHeader: {
                        icon: 'fa fa-home',
                        title: 'UnRead Notifications',
                        subtitle: 'UnRead Notifications'
                    }
                }
            })
            .state('nurse-notifications-archived', {
                url: '/nurse-notifications-archived',
                controller: 'NurseNotificationCtrl',
                templateUrl: 'views/nurse/notifications.html',
                data: {
                    pageTitle: 'Archived Notifications',
                    controller: 'NurseNotificationCtrl',
                    pageHeader: {
                        icon: 'fa fa-home',
                        title: 'Archived Notifications',
                        subtitle: 'Archived Notifications'
                    }
                }
            })

            // =========================================================================
            // LOST PASSWORD
            // =========================================================================
            .state('lostPassword', {
                url: '/lost-password',
                templateUrl: 'views/sign/lost-password.html',
                data: {
                    pageTitle: 'LOST PASSWORD'
                },
                resolve: {
                    deps: ['$ocLazyLoad', 'settings', function($ocLazyLoad, settings) {

                        var cssPath = settings.cssPath; // Create variable css path

                        // you can lazy load files for an existing module
                        return $ocLazyLoad.load(
                            [
                                {
                                    insertBefore: '#load_css_before',
                                    files: [
                                        cssPath+'/pages/sign.css'
                                    ]
                                }
                            ]
                        );
                    }]
                }
            })

            // =========================================================================
            // LOCK SCREEN
            // =========================================================================
            .state('lockScreen', {
                url: '/lock-screen',
                templateUrl: 'views/sign/lock-screen.html',
                data: {
                    pageTitle: 'LOCK SCREEN'
                },
                resolve: {
                    deps: ['$ocLazyLoad', 'settings', function($ocLazyLoad, settings) {

                        var cssPath = settings.cssPath; // Create variable css path

                        // you can lazy load files for an existing module
                        return $ocLazyLoad.load(
                            [
                                {
                                    insertBefore: '#load_css_before',
                                    files: [
                                        cssPath+'/pages/sign.css'
                                    ]
                                }
                            ]
                        );
                    }]
                }
            })

            // =========================================================================
            // DASHBOARD
            // =========================================================================
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'views/dashboard.html',
                data: {
                    pageTitle: 'DASHBOARD',
                    pageHeader: {
                        icon: 'fa fa-home',
                        title: 'Dashboard',
                        subtitle: 'dashboard & statistics'
                    }
                },
                controller: 'DashboardCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', 'settings', function($ocLazyLoad, settings) {

                        var pluginPath = settings.pluginPath; // Create variable plugin path

                        return $ocLazyLoad.load( // you can lazy load files for an existing module
                            [
                                {
                                    insertBefore: '#load_css_before',
                                    files: [
                                        pluginPath+'/dropzone/downloads/css/dropzone.css',
                                        pluginPath+'/jquery.gritter/css/jquery.gritter.css'
                                    ]
                                },
                                {
                                    name: 'blankonApp.dashboard',
                                    files: [
                                        pluginPath+'/bootstrap-session-timeout/dist/bootstrap-session-timeout.min.js',
                                        pluginPath+'/flot/jquery.flot.pack.js',
                                        pluginPath+'/dropzone/downloads/dropzone.min.js',
                                        pluginPath+'/jquery.gritter/js/jquery.gritter.min.js',
                                        pluginPath+'/skycons-html5/skycons.js',
                                        'js/modules/dashboard.js'
                                    ]
                                },
                                {
                                    name: 'ui.bootstrap',
                                    files: [
                                        pluginPath+'/angular-bootstrap/ui-bootstrap-tpls.min.js'
                                    ]
                                },
                                {
                                    name: 'ui.bootstrap.accordion',
                                    files: ['js/modules/bootstrap/accordion.js']
                                }
                            ]
                        );
                    }]
                }
            })

            .state('request-diagnosis', {
                url: '/request-diagnosis',
                templateUrl: 'views/medishare/request-diagnosis.html',
                data: {
                    pageTitle: 'DIAGNOSIS',
                    pageHeader: {
                        icon: 'fa fa-home',
                        title: 'Add Disgnosis',
                        subtitle: 'add diagnosis'
                    }
                },
                controller: 'DashboardCtrl'
            })

            .state('enrolled-diagnosis', {
                url: '/enrolled-diagnosis',
                templateUrl: 'views/medishare/enrolled-diagnosis.html',
                data: {
                    pageTitle: 'Your Diagnosis',
                    pageHeader: {
                        icon: 'fa fa-home',
                        title: 'Your Diagnosis',
                        subtitle: 'Your Diagnosis'
                    }
                },
                controller: 'DashboardCtrl'
            })

            
            // =========================================================================
            // COMPONENTS MODALS
            // =========================================================================
            .state('componentModals', {
                url: '/component-modals',
                templateUrl: 'views/components/component-modals.html',
                data: {
                    pageTitle: 'MODALS',
                    pageHeader: {
                        icon: 'fa fa-circle-o-notch',
                        title: 'Modals',
                        subtitle: 'general ui components'
                    },
                    breadcrumbs: [
                        {title: 'Components'},{title: 'Modals'}
                    ]
                },
                controller: 'AccordionCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', 'settings', function($ocLazyLoad, settings) {

                        var pluginPath = settings.pluginPath; // Create variable plugin path

                        return $ocLazyLoad.load( // you can lazy load files for an existing module
                            [
                                {
                                    name: 'ui.bootstrap',
                                    files: [
                                        pluginPath+'/angular-bootstrap/ui-bootstrap-tpls.min.js'
                                    ]
                                },
                                {
                                    name: 'ui.bootstrap.accordion',
                                    files: ['js/modules/bootstrap/accordion.js']
                                }
                            ]
                        );
                    }]
                }
            })
            // =========================================================================
            // WIDGET MISC
            // =========================================================================
            .state('widgetMisc', {
                url: '/widget-misc',
                templateUrl: 'views/widget/widget-misc.html',
                data: {
                    pageTitle: 'MISC WIDGET',
                    pageHeader: {
                        icon: 'fa fa-puzzle-piece',
                        title: 'Misc Widget',
                        subtitle: 'miscellanous widget and more'
                    },
                    breadcrumbs: [
                        {title: 'Widget'},{title: 'Misc'}
                    ]
                }
            });

    })

    // Init app run
    .run(["$rootScope", "settings", "$state", function($rootScope, settings, $state, $location) {
        $rootScope.$state = $state; // state to be accessed from view
        $rootScope.$location = $location; // location to be accessed from view
        $rootScope.settings = settings; // global settings to be accessed from view
        if (window.localStorage.currentUser) {
            $rootScope.currentUser  =  JSON.parse(window.localStorage.currentUser);    
        };

        $rootScope.state = $state;
        $rootScope.isFullPage = function(){
            return $state.is(securityRefs.nurse) || $state.is(securityRefs.doctor);
        };
        $rootScope.checkLoggedInUserPerm = function(type){
            if ($rootScope.currentUser.type == type) {
                return true;
            }
            return false;
        }
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
           if ($rootScope.refereshCounter) {
                $rootScope.refereshCounter();
           };
            if ($(".modal.fade").length > 0) {
                $(".modal.fade").remove();
            }
           $rootScope.isThereFullPage = ($state.is(securityRefs.nurse) || $state.is(securityRefs.doctor));
           var stateName = $state.current.name;
           if (window.localStorage.currentUser) {
                var userLoggedIn = JSON.parse(window.localStorage.currentUser).Email;
                if (!userLoggedIn && stateName !== securityRefs.nurse && stateName !== securityRefs.doctor) {
                    $state.go(securityRefs.nurse);
                }
            }
            else{
                if (stateName !== securityRefs.nurse && stateName !== securityRefs.doctor){
                   $state.go(securityRefs.nurse);
                }
            };
           if(!$rootScope.$$phase) {
               $rootScope.$apply();
           };
           $rootScope.logOutFromMedi = function(){
            var userLoggedIn = JSON.parse(window.localStorage.currentUser).type;
            window.localStorage.clear();
            if (userLoggedIn == 1) {
                $state.go(securityRefs.doctor);
            }
            else if(userLoggedIn == 2){
                 $state.go(securityRefs.nurse);
            }
           }
        });
    }]);
   