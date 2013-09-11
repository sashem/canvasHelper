SERVER_URL="http://calm-meadow-8426.herokuapp.com/";
main = angular.module('principal',['ui.bootstrap']).config(['$routeProvider', function($routeProvider){
	$routeProvider.
	when('/main', {templateUrl: 'views/main.html'}).
	when('/datos', {templateUrl: 'views/datos.html'}).
	when('/proyectos', {templateUrl: 'views/proyectos.html'}).
	when('/canvas1/:id',{templateUrl: 'views/canvas1.html'}).
	when('/canvas2/:id',{templateUrl: 'views/canvas2.html'}).
	otherwise({redirectTo: 'main'});
}]).config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]).config(['$dialogProvider',function($dialogProvider){
	 $dialogProvider.options({backdrop:false, dialogFade: true});
}]);


main.factory("mensajeria", function($rootScope){
	var mensajes=[];
    return mensajes;
});

main.service("session",function(){
	
});

function loginCtrl($scope,$http,mensajeria){
	$scope.user=$.jStorage.get("user")?$.jStorage.get("user"):{};
	if($.jStorage.get("user")){
		$scope.recordar=true;
	}
	if($.cookie("session_key")){
		session_init();
		return;
	}
	else{
		$("#session-menu").hide();
	}
	$scope.login_try = function(){
		$http({method: 'POST', url: SERVER_URL+'users/login', data: {user:$scope.user}}).
		  success(function(data, status, headers, config) {
		    $.cookie("session_key", data.cookie, { expires: 1 });
		    mensajeria.push(data.msge);
		    console.log(data);
		    if(data.cookie!=null){
		    	session_init();
		    	if($scope.recordar){
		    		$.jStorage.set("user",$scope.user);
		    	}
		    	else{
		    		$.jStorage.deleteKey("user");
		    	}
		    }
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
	};
}
function sessionCtrl($scope,mensajeria){
	$scope.session_close = function(){
		$.cookie("session_key","",{expires:0});
		location.href="#inicio"
		location.reload();
	};
}
function mensajesCtrl($scope,mensajeria){
	$scope.mensajes=[];
	$scope.$watch('mensajeria', function() {
        $scope.mensajes=mensajeria;
    });
    $scope.closeAlert = function(index) {
    $scope.mensajes.splice(index, 1);
    mensajeria.splice(index, 1);
 };
}
function session_init(){
	$("#login-form").hide();
	$("#session-menu").show();
}
function session_close(){
}