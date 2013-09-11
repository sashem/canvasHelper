function proyectosCtrl($scope, $dialog, $http, mensajeria){
	$scope.proyectos=[];
	$scope.canvas=[];
	$scope.proyecto_actualizable={};
	$scope.user;
	$scope.opcion="1";
	proyecto={};
	SERVER_URL="http://calm-meadow-8426.herokuapp.com/";
	$http({method: 'POST', url: SERVER_URL+'proyectos/fetch', data:{cookie:$.cookie("session_key")}}).
		  success(function(data, status, headers, config) {
			$scope.proyectos=data.proyectos;
			if(data.proyectos){$scope.fetch_canvas(0);}
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
	
	
	$scope.fetch_canvas=function(i){
		$http({method: 'POST', url: SERVER_URL+'canvas/fetch', data:{proyecto_id:$scope.proyectos[i].id,cookie:$.cookie("session_key")}}).
		  success(function(data, status, headers, config) {
			$scope.canvas=data.canvas;
			$scope.cargar_proyecto(i);
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
	};
	$scope.crear_proyecto=function(){
		$http({method: 'POST', url: SERVER_URL+'proyectos/create', data:{proyecto:$scope.proyecto,cookie:$.cookie("session_key")}}).
		  success(function(data, status, headers, config) {
		    mensajeria.push(data.msge);
		    aux=$scope.proyectos.push(data.proyecto);
		    $scope.fetch_canvas(aux-1);
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
	};
	$scope.crear_canva=function(){
		$http({method: 'POST', url: SERVER_URL+'canvas/create', data:{proyecto_id:$scope.target.id,canva:$scope.canva,cookie:$.cookie("session_key")}}).
		  success(function(data, status, headers, config) {
		    mensajeria.push(data.msge);
		    $scope.canvas.push(data.canva);
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
	};
	$scope.borrar_proyecto=function(id){
		bootbox.confirm("¿Estás seguro que quieres borrar eso?", function(result) {
			if(result){
				$http({method: 'POST', url: SERVER_URL+'proyectos/delete', data:{id:id,cookie:$.cookie("session_key")}}).
				  success(function(data, status, headers, config) {
				    mensajeria.push(data.msge);
				    $scope.proyectos=data.proyectos;
				 }).
				  error(function(data, status, headers, config) {
				    // called asynchronously if an error occurs
				    // or server returns response with an error status.
				 });
			 }
		});
	};
	$scope.borrar_canva=function(id){
		bootbox.confirm("¿Estás seguro que quieres borrar eso?", function(result) {
			if(result){
				$http({method: 'POST', url: SERVER_URL+'canvas/delete', data:{id:id,cookie:$.cookie("session_key")}}).
				  success(function(data, status, headers, config) {
				    mensajeria.push(data.msge);
				    $scope.canvas=data.canvas;
				}).
				  error(function(data, status, headers, config) {
				    // called asynchronously if an error occurs
				    // or server returns response with an error status.
				});
			}
		});
	};
	$scope.cargar_proyecto=function(i){
		$scope.target=$scope.proyectos[i];
	};
	$scope.cargar_canva=function(i){
		$scope.target_canva=$scope.canvas[i];
	};
	$scope.actualizar_proyecto=function(){
		$http({method: 'POST', url: SERVER_URL+'proyectos/update', data:{id:$scope.target.id,proyecto:$scope.proyectoactualizable,cookie:$.cookie("session_key")}}).
		  success(function(data, status, headers, config) {
		    mensajeria.push(data.msge);
		    $scope.proyectos=data.proyectos;
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
	};
	$scope.actualizar_canva=function(){
		$http({method: 'POST', url: SERVER_URL+'canvas/update', data:{id:$scope.target_canva.id,canva:$scope.canvaactualizable,cookie:$.cookie("session_key")}}).
		  success(function(data, status, headers, config) {
		    mensajeria.push(data.msge);
		    $scope.canvas=data.canvas;
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
	};
};
