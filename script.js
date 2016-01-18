
    //globals
    var domain = 'http://localhost/auth-module';
    var firebaseUrl = "https://crackling-inferno-9685.firebaseio.com/";
    var authApp = angular.module('authApp', ['ngRoute', 'firebase']);
    var ref = new Firebase(firebaseUrl);
    var authData = ref.getAuth();

    //logout function
    authApp.run(function($rootScope){
        $rootScope.logout = function(){
            ref.unauth();
            window.location.assign(domain + '/#login');
            window.location.reload();
        };
    });

    //controllers
    authApp.controller('headerController', function($scope) {
        if(authData){
            $scope.loginStatus = "Logout";
        } else {
            $scope.loginStatus = "Login";
        };
    });

    //user authentication controller
    authApp.controller('loginController', function($scope) {

    	//set data for h1
    	$scope.pageData = {
    		heading : 'Login'
    	};

    	//variables to be passed to firebase
        $scope.username = "";
        $scope.password = "";

        //function for logging in
        $scope.login = function(){
        	//create firebase auth object
            ref.authWithPassword({
              "email": $scope.username,
              "password": $scope.password
            }, function(error, authData) {
              if (error) {
                alert("Login Failed!", error);
              } else {
                alert("Login Successful");
                window.location.assign(domain + '/#profile');
                window.location.reload();
              }
            });
        };   
    });

    //profile controller for editing user info
    authApp.controller("profileController", ["$scope", "$firebaseObject",

	    function($scope, $firebaseObject) {
	    	//creates three way bind with view
	        $scope.profile = $firebaseObject(ref.child('Users').child(authData.uid));

	        $scope.pageData = {
	    		heading : 'My Profile'
	    	};
	    }

    ]);

    //create new user controller - only deals with email and password - other info dealt with in profile
    authApp.controller("registerController", function($scope) {

    	$scope.pageData = {
    		heading : 'Register'
    	};
        
        //set variables for login and password match
        $scope.email = "";
    	$scope.password = "";
    	$scope.repeatPassword = "";
    	//upon false - warning message will show
    	$scope.passwordMatch = true;
    	$scope.emailValid = true;

    	//check if repeat password input matches
    	$scope.checkMatch = function(){
    		if($scope.password != $scope.repeatPassword){
    			$scope.passwordMatch = false;
    		} else {
    			$scope.passwordMatch = true;
    		}
    	};

    	//regex email validation checker for warning box
    	$scope.checkEmail = function() {
    		var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    		if(re.test($scope.email)) {
    			$scope.emailValid = true;
    		} else {
    			$scope.emailValid = false;
    		}
		};

    	//form validator - disables register button upon true
    	//need to add email validator
    	$scope.formCheck = function(){
    		if($scope.passwordMatch && $scope.password.length > 5  && $scope.emailValid && $scope.email.length > 1 && $scope.repeatPassword.length > 5){
    			return false;
    		} else {
    			return true;
    		}
    	};

        $scope.register = function(){
        	//create firebase auth object
            ref.createUser({
              "email": $scope.email,
              "password": $scope.password
            }, function(error, authData) {
              if (error) {
                alert("There was an issue, please try again.", error);
              } else {
                alert("User created");
                window.location.assign(domain + '/#login');
                window.location.reload();
              }
            });
        }; 

    });

    //routes
    authApp.config(function($routeProvider) {
        $routeProvider

            .when('/', {
                templateUrl : 'pages/profile.html',
                controller  : 'profileController'
            })

            .when('/login', {
                templateUrl : 'pages/login.html',
                controller : 'loginController'
            })

            .when('/profile', {
                templateUrl : 'pages/profile.html',
                controller : 'profileController',
            })

            .when('/register', {
                templateUrl : 'pages/register.html',
                controller : 'registerController'
            })
    });