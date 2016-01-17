
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

    authApp.controller('mainController', function($scope) {
        if(authData){
            $scope.uid = authData.uid;
        };

        $scope.redirectTest = function() {
            alert('button working');
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

    	//check if repeat password input matches
    	$scope.checkMatch = function(){
    		if($scope.password != $scope.repeatPassword){
    			$scope.passwordMatch = false;
    		} else {
    			$scope.passwordMatch = true;
    		}
    	};

    	//form validator - disables register button upon true
    	//need to add email validator
    	$scope.formCheck = function(){
    		if($scope.passwordMatch && $scope.password.length > 5){
    			return false;
    		} else {
    			return true;
    		}
    	};

        $scope.register = function() {
            ref.$createUser({
              email: $scope.email,
              password: $scope.password
            }).then(function(userData) {
              alert("User " + userData.uid + " created successfully!");

              return $scope.authObj.$authWithPassword({
                email: $scope.email,
                password: $scope.password
              });
            }).then(function(authData) {
              alert("Logged in as:", authData.uid);
              window.location.assign(domain + '/#profile');
              window.location.reload();
            }).catch(function(error) {
              alert("Error: ", error);
            });
        };

    });

    //routes
    authApp.config(function($routeProvider) {
        $routeProvider

            .when('/', {
                templateUrl : 'pages/dashboard.html',
                controller  : 'mainController'
            })

            .when('/login', {
                templateUrl : 'pages/login.html',
                controller : 'loginController'
            })

            .when('/profile', {
                templateUrl : 'pages/profile.html',
                controller : 'profileController'
            })

            .when('/register', {
                templateUrl : 'pages/register.html',
                controller : 'registerController'
            })
    });