function canvasCtrl($scope, $dialog, $http, mensajeria,$routeParams){
		   /* ################# INICIALIZACIÓN DE VARIABLES ######################## */
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
			if(data.msje)mensajeria.push(data.msje);
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
		  
		  /* ################# COMIENZO DE LAS FUNCIONES ######################## */
		  
		  $scope.setear_seccion=function(seccion,nombre){
		  	$scope.seccion=seccion;
		  	$scope.nombre_seccion=nombre;
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
		  	//aux={};
		  	//aux[$scope.seccion]=[$scope.item];
		  		$http({method: 'POST', url: SERVER_URL+'canvas/add_item', data:{item:$scope.item,seccion:$scope.seccion,id:$routeParams.id,cookie:$.cookie("session_key")}}).
					 success(function(data, status, headers, config) {
					 	//console.log(data);
					 	if(data.item)eval("$scope.canva."+data.meta.seccion+".push(data.item)");
					 	if(data.meta)if(data.meta.msge)mensajeria.push(data.meta.msge);
					 	if(data.msge)mensajeria.push(data.msge);
					 }).
					  error(function(data, status, headers, config) {
					 });
		  	$scope.item="";
		  	$scope.seccion="";
		  	};
		  $scope.editar_item=function(){
		  	$scope.actualizable.color=$scope.active_color;
		  	accion={tipo:"editar",objeto:$scope.seccion,indice:parseInt($scope.target_item_i),cambiado:eval("$scope.canva."+$scope.seccion+"[$scope.target_item_i]")};
		  	$scope.agregar_a_historial(accion);
		  	//eval("$scope.canva."+$scope.seccion+"[$scope.target_item_i]=$scope.actualizable");
		  		$http({method: 'POST', url: SERVER_URL+'canvas/edit_item', data:{item:$scope.actualizable,seccion:$scope.seccion,id:$routeParams.id,cookie:$.cookie("session_key")}}).
					 success(function(data, status, headers, config) {
					 	if(data.item)eval("$scope.canva."+data.meta.seccion+"[$scope.target_item_i]=data.item");
					 	//if(data.canva)$scope.canva=data.canva;
					 	if(data.meta)if(data.meta.msge)mensajeria.push(data.meta.msge);
					 	if(data.msge)mensajeria.push(data.msge);
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
			 	if(data.canva)$scope.canva=data.canva;
				if(data.meta)if(data.meta.msge)mensajeria.push(data.meta.msge);
					 	if(data.msge)mensajeria.push(data.msge);
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
		  $scope.agregar_mensaje=function(){
		  	$scope.mensaje.canva_id=$scope.canva.id;
		  	$http({method: 'POST', url: SERVER_URL+'mensajes/create', data:{mensaje:$scope.mensaje,cookie:$.cookie("session_key")}}).
			 success(function(data, status, headers, config) {
			 	$scope.canva.mensajes=data.mensajes;
			 	//console.log(data);
			 }).
			  error(function(data, status, headers, config) {
			 });
		  };
		  $scope.borrar_mensaje=function(id){
		  	$http({method: 'POST', url: SERVER_URL+'mensajes/delete', data:{mensaje:{id:id},cookie:$.cookie("session_key")}}).
			 success(function(data, status, headers, config) {
			 	if(data.mensajes)$scope.canva.mensajes=data.mensajes;
			 	if(data.msge)mensajeria.push(data.msge);
			 }).
			  error(function(data, status, headers, config) {
			 });
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
							 $http({method: 'POST', url: SERVER_URL+'canvas/add_item', data:{item:ultimo.borrado,seccion:ultimo.objeto,id:$routeParams.id,cookie:$.cookie("session_key")}}).
							 success(function(data, status, headers, config) {
							 	//console.log(data);
							 	if(data.item)eval("$scope.canva."+data.meta.seccion+".push(data.item)");
							 	if(data.meta.msge)mensajeria.push(data.meta.msge);
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
				  		$http({method: 'POST', url: SERVER_URL+'canvas/edit_item', data:{item:ultimo.cambiado,seccion:ultimo.objeto,id:$routeParams.id,cookie:$.cookie("session_key")}}).
						 success(function(data, status, headers, config) {
						 	if(data.item)eval("$scope.canva."+data.meta.seccion+"[ultimo.indice]=data.item");
						 	//if(data.canva)$scope.canva=data.canva;
						 	if(data.meta.msge)mensajeria.push(data.meta.msge);
						 }).
						  error(function(data, status, headers, config) {
						 });
			  		$scope.historial.splice(indice,1);
			  		$.jStorage.set(historial_id,$scope.historial);
			  	}
		  	}
		  };
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
