
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

    authApp.controller('loginController', function($scope) {

        $scope.username = "";
        $scope.password = "";

        $scope.login = function(){
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


    authApp.controller("profileController", ["$scope", "$firebaseObject",

      function($scope, $firebaseObject) {
        
        $scope.profile = $firebaseObject(ref.child('Users').child(authData.uid));
      }

    ]);

    authApp.controller("registerController", function($scope) {
        
        $scope.email = "";
    	$scope.password = "";
    	$scope.repeatPassword = "";
    	$scope.passwordMatch = true;

    	$scope.checkMatch = function(){
    		if($scope.password = $scope.repeatPassword){
    			$scope.passwordMatch = true;
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