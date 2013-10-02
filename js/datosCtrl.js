function datosCtrl($scope,$http,mensajeria){
	$("input").prop('disabled', true);
	$http.defaults.headers.post["Content-Type"] = "application/json";
	$scope.user={};
	$scope.user.dato_attributes=[];
	$http({method: 'POST',headers: {'Content-Type': 'application/json'}, url: SERVER_URL+'users/fetch', data: {cookie:$.cookie("session_key")}}).
		  success(function(data, status, headers, config) {
		    if(data.msge!=null) mensajeria.push(data.msge);
		    if(data.user==null) window.location="#/inicio"
		    $scope.user=data["user"];
		  }).
		  error(function(data, status, headers, config) {
		  });
	$scope.enable_edit=function(){
		$("input").prop('disabled', false);
	};
	$scope.update_datos=function(){
		delete $scope.user["id"];
		$http({method: 'POST', url: SERVER_URL+'users/update_datos.json', data: {user:$scope.user,cookie:$.cookie("session_key")}}).
		  success(function(data, status, headers, config) {
		    if(data.msge!=null)mensajeria.push(data.msge);
		    $("input").prop('disabled', true);
		  }).
		  error(function(data, status, headers, config) {
			
		  });
	};
}