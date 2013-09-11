function canvasCtrl($scope, $dialog, $http, mensajeria,$routeParams){
		  
		   /* ################# INICIALIZACIÓN DE VARIABLES ######################## */
		  SERVER_URL="http://calm-meadow-8426.herokuapp.com/";
		  canva_id="canva"+$routeParams.id;
		  historial_id="historial2"+$routeParams.id;
		  $scope.canva=$.jStorage.get(canva_id)?$.jStorage.get(canva_id):{};
		  $scope.actualizable={};
		  $scope.active_color="";
		  $scope.active_color2="";
		  result=false;
		  $scope.historial=$.jStorage.get(historial_id)?$.jStorage.get(historial_id):[];
		  $scope.colors={color1:"#FFCCCC",color2:"#D1D8FF",color3:"#CEFFC9",color4:"#FFFEBF",color5:"#B5EEFF"};
		  
		  $http({method: 'POST', url: SERVER_URL+'canvas/fetch_canva', data:{id:$routeParams.id,cookie:$.cookie("session_key")}}).
		  success(function(data, status, headers, config) {
			if(!$.jStorage.get(canva_id)){
				$scope.canva=data.canva;
				$.each($scope.canva, function(index, value) {
					if(value.length==0){delete $scope.canva[index];}	  
				});
			}
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
		  
		  /* ################# COMIENZO DE LAS FUNCIONES ######################## */
		  
		  $scope.guardar_canva=function(){
		  		$http({method: 'POST', url: SERVER_URL+'canvas/save', data:{canva:$scope.canva,id:$routeParams.id,cookie:$.cookie("session_key")}}).
					  success(function(data, status, headers, config) {
						console.log(data);
						mensajeria.push(data.msge);
						$.jStorage.deleteKey(historial_id);
						$.jStorage.deleteKey(canva_id);
						$scope.historial=[];
					  }).
					  error(function(data, status, headers, config) {
					    console.log("data");
					 });
		  };
		  
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
		  	accion={tipo:"agregar",objeto:"$scope.canva."+$scope.seccion};
		  	$scope.agregar_a_historial(accion);
		  	eval("$scope.canva."+$scope.seccion+"=$scope.canva."+$scope.seccion+"?$scope.canva."+$scope.seccion+":[];");
		  	eval("$scope.canva."+$scope.seccion+".push($scope.item)");
		  	console.log($scope.canva);
		  	$.jStorage.set(canva_id,$scope.canva);
		  	$scope.item="";
		  };
		  $scope.editar_item=function(){
		  	$scope.actualizable.color=$scope.active_color;
		  	accion={tipo:"editar",objeto:"$scope.canva."+$scope.seccion,indice:parseInt($scope.target_item_i),cambiado:eval("$scope.canva."+$scope.seccion+"[$scope.target_item_i]")};
		  	$scope.agregar_a_historial(accion);
		  	eval("$scope.canva."+$scope.seccion+"[$scope.target_item_i]=$scope.actualizable");
		  	$.jStorage.set(canva_id,$scope.canva);
		  	$scope.item2="";
		  	$scope.actualizable={};
		  };
		  $scope.borrar_item=function(){
		  	accion={tipo:"borrar",objeto:"$scope.canva."+$scope.seccion,indice:parseInt($scope.target_item_i),borrado:eval("$scope.canva."+$scope.seccion+"[$scope.target_item_i]")};
		  	$scope.agregar_a_historial(accion);
		  	//$scope.para_borrar.push(eval("$scope.canva."+$scope.seccion+"[$scope.target_item_i]"));
		  	eval("$scope.canva."+$scope.seccion+".splice($scope.target_item_i,1)");
		  	$.jStorage.set(canva_id,$scope.canva);
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
			  	obj=eval(ultimo.objeto);
			  	if(tipo=="borrar"){
			  		obj.splice(ultimo.indice,0,ultimo.borrado);
			  		$scope.historial.splice(indice,1);
			  		$.jStorage.set(historial_id,$scope.historial);
			  	}
			  	if(tipo=="agregar"){
			  		obj.splice(obj.length-1,1);
			  		$scope.historial.splice(indice,1);
			  		$.jStorage.set(historial_id,$scope.historial);
			  	}
			  	if(tipo=="editar"){
			  		obj[ultimo.indice]=ultimo.cambiado;
			  		$scope.historial.splice(indice,1);
			  		$.jStorage.set(historial_id,$scope.historial);
			  	}
			  	$.jStorage.set(canva_id,$scope.canva);
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
