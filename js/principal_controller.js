SERVER_URL="http://calm-meadow-8426.herokuapp.com/";
//SERVER_URL="http://localhost:3000/";
main = angular.module('principal',['ui.bootstrap','ngResource']).config(['$routeProvider', function($routeProvider){
	$routeProvider.
	when('/inicio', {templateUrl: 'views/main.html'}).
	when('/datos', {templateUrl: 'views/datos.html'}).
	when('/proyectos', {templateUrl: 'views/proyectos.html'}).
	when('/canvas1/:id',{templateUrl: 'views/canvas1.html'}).
	when('/canvas2/:id',{templateUrl: 'views/canvas2.html'}).
	otherwise({redirectTo: 'inicio'});
}]).config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]).config(['$dialogProvider',function($dialogProvider){
	 $dialogProvider.options({backdrop:false, dialogFade: true});
}]);

main.factory("mensajeria", function($rootScope){
	mensajes=[];
    return mensajes;
});

//################################# DRAG AND DROP ############################################################

main.factory("session",function($rootScope){
	var session_check={};
	return session_check;
});

main.directive('draggable', function() {
    return {
    	//scope:{ngClick:'&',ngModel:'='},
    	link:function(scope, element) {
        // this gives us the native JS object
        var el = element[0];

        el.draggable = true;

        el.addEventListener('dragstart',function(e) {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('Text', this.id);
                this.classList.add('drag');
                //scope.$apply('ngClick()');
                return false;
            },
            false);
        el.addEventListener('dragend',function(e) {
                this.classList.remove('drag');
                return false;
            },false);
    	}
    };
});
main.directive('droppable', function() {
  return {
    scope: {drop:'&'},
    //transclude: 'element',
    //priority: 3000,
    //last:true,
    //compile: function (element, attrs) {},
    link: function(scope, element, attributes) {
      var el = element[0];
      el.addEventListener('dragover', function(e) {
        e.dataTransfer.dropEffect = 'move';
        if (e.preventDefault) e.preventDefault(); // allows us to drop
        this.classList.add('over');
        return false;
      }, false);

      el.addEventListener('dragenter', function(e) {
        this.classList.add('over');
        return false;
      }, false);

      el.addEventListener('dragleave', function(e) {
        this.classList.remove('over');
        return false;
      }, false);

      el.addEventListener('drop', function(e) {
        if (e.stopPropagation) e.stopPropagation(); // Stops some browsers from redirecting.
        this.classList.remove('over');
        //var item = document.getElementById(e.dataTransfer.getData('Text'));
        //this.appendChild(item);
        scope.$apply('drop()');
        return false;
      }, false);
      }
  };
});

//################################# FUNCIONES LOGIN ############################################################

function loginCtrl($scope,$http,mensajeria,session){
	$scope.user=$.jStorage.get("user")?$.jStorage.get("user"):{};
	if($.jStorage.get("user")){
		$scope.recordar=true;
	}
	else{
	}
	
	$scope.login_try = function(){
		//$event=$event?$event:{};
		//if($event.keyCode==13 || $event=={}){
			$http({method: 'POST', url: SERVER_URL+'users/login', data: {user:$scope.user}}).
			  success(function(data, status, headers, config) {
			    $.cookie("session_key", data.cookie, { expires: 1 }); 
			    mensajeria.push(data.msge);
			    if(data.cookie!=null){
			    	session["state"]=true;
			    	location.href="#proyectos";
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
		  //}
	};
}
function sessionCtrl($scope,mensajeria,session){
	$scope.$watch('session', function() {
    });
    
	if($.cookie("session_key")){
		session["state"]=true;
	}else{
		
	}
	
	$scope.check_session=function(){
		if(session["state"]) return "session-true";
		else return "session-false";
	};
	$scope.check_active=function(seccion){
		if(location.href.indexOf(seccion)!=-1){return "active";}
	};
	
	$scope.session_close = function(){
		$.cookie("session_key","",{expires:0});
		location.href="#inicio";
		location.reload();
	};
}
function mensajesCtrl($scope,mensajeria,$timeout){
	$scope.mensajes=mensajeria;
	$scope.mensajes_a_borrar=[];
	length_i=0;
	$scope.$watchCollection('mensajes', function() {
        if($scope.mensajes.length>0){
        	//length_i=$scope.mensajes.length;
	        $timeout(function(){
	        	$scope.closeAlert(0);
	        	},1800);
        }
    });
    $scope.closeAlert = function(index) {
    	mensajeria.splice(index,1)[0];
    	};
   	
}