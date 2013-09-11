function canvasCtrl($scope, $dialog, $http, mensajeria,$routeParams){
		   /* ################# INICIALIZACIÓN DE VARIABLES ######################## */
		  SERVER_URL="http://calm-meadow-8426.herokuapp.com/";
		  historial_id="historial"+$routeParams.id;
		  $scope.actualizable={};
		  $scope.active_color="";
		  $scope.active_color2="";
		  result=false;
		  
		  $scope.historial=$.jStorage.get(historial_id)?$.jStorage.get(historial_id):[];
		  $scope.colors={color1:"#FFCCCC",color2:"#D1D8FF",color3:"#CEFFC9",color4:"#FFFEBF",color5:"#B5EEFF"};
		  
		  $http({method: 'POST', url: SERVER_URL+'canvas/fetch_canva', data:{id:$routeParams.id,cookie:$.cookie("session_key")}}).
		  success(function(data, status, headers, config) {
			$scope.canva=data.canva;
			console.log($scope.canva);
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
		  
		  /* ################# COMIENZO DE LAS FUNCIONES ######################## */
		  
		  $scope.setear_seccion=function(seccion){
		  	$scope.seccion=seccion;
		  	$scope.active_color=$scope.colors.color1;
		  	$('#agregar').modal({show:true});
		  };
		  $scope.setear_item=function(indice,seccion){
		  	$scope.target_item_i=indice;
		  	$scope.seccion=seccion;
		  	$scope.active_color=eval("$scope.canva."+seccion+"[$scope.target_item_i].color");
		  	$scope.item2=eval("$scope.canva."+seccion+"[$scope.target_item_i]");
		  	$scope.actualizable.id=$scope.item2.id;
		  	$scope.actualizable.abreviacion=$scope.item2.abreviacion;
		  	$scope.actualizable.descripcion=$scope.item2.descripcion;
		  	$('#editar').modal({show:true});
		  };
		  $scope.agregar_a_canva=function(){
		  	$scope.item.color=$scope.active_color;
		  	accion={tipo:"agregar",objeto:$scope.seccion};
		  	$scope.agregar_a_historial(accion);
		  	eval("$scope.canva."+$scope.seccion+"=$scope.canva."+$scope.seccion+"?$scope.canva."+$scope.seccion+":[];");
		  	aux={};
		  	aux[$scope.seccion]=[$scope.item];
		  		$http({method: 'POST', url: SERVER_URL+'canvas/add_item', data:{canva:aux,id:$routeParams.id,cookie:$.cookie("session_key")}}).
					 success(function(data, status, headers, config) {
					 	$scope.canva=data.canva;
					 }).
					  error(function(data, status, headers, config) {
					 });
		  	$scope.item="";
		  	};
		  $scope.editar_item=function(){
		  	$scope.actualizable.color=$scope.active_color;
		  	accion={tipo:"editar",objeto:$scope.seccion,indice:parseInt($scope.target_item_i),cambiado:eval("$scope.canva."+$scope.seccion+"[$scope.target_item_i]")};
		  	$scope.agregar_a_historial(accion);
		  	eval("$scope.canva."+$scope.seccion+"[$scope.target_item_i]=$scope.actualizable");
		  	aux={};
		  	aux[$scope.seccion]=[$scope.actualizable];
		  		$http({method: 'POST', url: SERVER_URL+'canvas/add_item', data:{canva:aux,id:$routeParams.id,cookie:$.cookie("session_key")}}).
					 success(function(data, status, headers, config) {
					 	$scope.canva=data.canva;
					 }).
					  error(function(data, status, headers, config) {
					 });	
		  	$scope.item2="";
		  	$scope.actualizable={};
		  };
		  $scope.borrar_item=function(){
		  	accion={tipo:"borrar",objeto:$scope.seccion,indice:parseInt($scope.target_item_i),borrado:eval("$scope.canva."+$scope.seccion+"[$scope.target_item_i]")};
		  	$scope.agregar_a_historial(accion);
		  	//$scope.para_borrar.push(eval("$scope.canva."+$scope.seccion+"[$scope.target_item_i]"));
		  	id_a_borrar=eval("$scope.canva."+$scope.seccion+"[$scope.target_item_i].id");
	  		$http({method: 'POST', url: SERVER_URL+'canvas/remove_item', data:{seccion:$scope.seccion,id_a_borrar:id_a_borrar,id:$routeParams.id,cookie:$.cookie("session_key")}}).
			 success(function(data, status, headers, config) {
			 	$scope.canva=data.canva;
			 }).
			  error(function(data, status, headers, config) {
			 });
			 
		  	$scope.item="";
		  	$scope.target_item_i="";
		  };
		  $scope.agregar_a_historial = function(obj){
		  	$scope.historial.push(obj);
		  	$.jStorage.set(historial_id,$scope.historial);
		  };
		  $scope.deshacer = function(){
		  	if($scope.historial.length>0){
			  	indice=$scope.historial.length-1;
			  	ultimo=$scope.historial[indice];
			  	tipo=ultimo.tipo;
			  	if(tipo=="borrar"){
			  		//obj.splice(ultimo.indice,0,ultimo.borrado);
			  		delete ultimo.borrado.id;
			  		aux={};
				  	aux[ultimo.objeto]=[ultimo.borrado];
				  		$http({method: 'POST', url: SERVER_URL+'canvas/add_item', data:{canva:aux,id:$routeParams.id,cookie:$.cookie("session_key")}}).
							 success(function(data, status, headers, config) {
							 	$scope.canva=data.canva;
							 }).
							  error(function(data, status, headers, config) {
							 });
			  		$scope.historial.splice(indice,1);
			  		$.jStorage.set(historial_id,$scope.historial);
			  	}
			  	if(tipo=="agregar"){
			  		//obj.splice(obj.length-1,1);
			  		
			  		$http({method: 'POST', url: SERVER_URL+'canvas/remove_item', data:{seccion:ultimo.objeto,id_a_borrar:-1,id:$routeParams.id,cookie:$.cookie("session_key")}}).
					 success(function(data, status, headers, config) {
					 	$scope.canva=data.canva;
					 }).
					  error(function(data, status, headers, config) {
					 });
			  	
			  		$scope.historial.splice(indice,1);
			  		$.jStorage.set(historial_id,$scope.historial);
			  	}
			  	if(tipo=="editar"){
			  		//obj[ultimo.indice]=ultimo.cambiado;
			  		aux={};
				  	aux[ultimo.objeto]=[ultimo.cambiado];
				  		$http({method: 'POST', url: SERVER_URL+'canvas/add_item', data:{canva:aux,id:$routeParams.id,cookie:$.cookie("session_key")}}).
							 success(function(data, status, headers, config) {
							 	$scope.canva=data.canva;
							 }).
							  error(function(data, status, headers, config) {
							 });
			  		$scope.historial.splice(indice,1);
			  		$.jStorage.set(historial_id,$scope.historial);
			  	}
		  	}
		  };
		  /* $scope.check_color=function(){
		  	
		  };*/
		  $scope.activecolor=function(color){
		  	if(color==$scope.active_color) return "active";
		  	else return "";
		  };
		  $scope.pick_color=function(color){
		  	$scope.active_color=color;
		  };
		  $scope.activecolor2=function(color){
		  	if(color==$scope.active_color2) return "over_active"; 
		  	else return "";
		  };
		  $scope.pick_color2=function(color){
		  	$scope.active_color2=color;
		  };
		  $scope.clear_active_color=function(){
		  	$scope.active_color2="";
		  };
		  $scope.check_history=function(){
		  	if($scope.historial.length>0) return "deshacer_activo";
		  	else return "deshacer_inactivo";
		  };
}
