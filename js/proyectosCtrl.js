function proyectosCtrl($scope, $dialog, $resource, $http, mensajeria){
	$scope.proyectos=[];
	$scope.canvas=[];
	$scope.proyecto_actualizable={};
	$scope.user;
	$scope.target;
	$scope.selected_user={};
	$scope.opcion="1";
	proyecto={};
	$scope.editable=false;
	$scope.orderedBy= '-updated_at';

// ######## FUNCIONES DE PROYECTOS ##################################################################################3

	//proyectos_URL="http://localhost:3000:3000/proyectos";
	proyectos_URL=SERVER_URL+"proyectos";
	var proyectos=$resource(proyectos_URL,{cookie:$.cookie("session_key")},{
		fetch:{method:"POST",url:proyectos_URL+"/fetch"},
		save:{method:"POST",url:proyectos_URL+"/create"},
		update:{method:"POST",url:proyectos_URL+"/update"},
		destroy:{method:"POST",url:proyectos_URL+"/delete"}
	});
	proyectos.fetch(function($promise){$scope.proyectos=$promise.proyectos;},function($promise){console.log($promise);});	
	
	$scope.crear_proyecto=function(){
		proyectos.save({proyecto:$scope.proyecto},function($promise){
			if($promise.meta.msge)mensajeria.push($promise.meta.msge);
			if($promise.proyecto)aux=$scope.proyectos.push($promise.proyecto);
			$scope.fetch_canvas(aux-1);
		});
	};
	
	$scope.actualizar_proyecto=function(){
		proyectos.update({id:$scope.target.id,proyecto:$scope.proyectoactualizable},function($promise){
			$.each($promise.proyecto,function(k,v){eval("$scope.target."+k+"=$promise.proyecto."+k);});
		});
	};
	
	$scope.borrar_proyecto=function(obj,index){
		proyectos.destroy({id:obj.id},function($promise){
			if($promise.meta.msge)mensajeria.push($promise.meta.msge);
		    //$scope.proyectos=$promise.proyectos; // Carga todos los proyectos de nuevo
		    if($promise.proyecto)removeFromArray($scope.proyectos,$promise.proyecto.id);
		});
	};
	
	$scope.cargar_proyecto=function(obj){
		$scope.target=obj;
	};
	
// ######## FUNCIONES DE CANVAS ####################################################################################
	//canvas_URL="http://localhost:3000:3000/canvas";
	canvas_URL=SERVER_URL+"canvas";
	var canvas=$resource(canvas_URL,{cookie:$.cookie("session_key")},{
		fetch:{method:"POST",url:canvas_URL+"/fetch"},
		save:{method:"POST",url:canvas_URL+"/create"},
		update:{method:"POST",url:canvas_URL+"/update"},
		destroy:{method:"POST",url:canvas_URL+"/delete"},
		mover:{method:"POST",url:canvas_URL+"/mover"}
	});
	
	
	$scope.fetch_canvas=function(obj){
		canvas.fetch({proyecto_id:obj.id},function($promise){
			if($promise.canvas)$scope.canvas=$promise.canvas;
			$scope.cargar_proyecto(obj);
			},function($promise){
				console.log($promise);
		});
	};
	$scope.crear_canva=function(){
		$http({method: 'POST', url: SERVER_URL+'canvas/create', data:{proyecto_id:$scope.target.id,canva:$scope.canva,cookie:$.cookie("session_key")}}).
		  success(function(data, status, headers, config) {
		    mensajeria.push(data.msge);
		    if(data.canva)$scope.canvas.push(data.canva);
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
	};
	
	$scope.mover_canvas=function(new_id){
		if(new_id!=$scope.target_canva.proyecto_id){
			console.log(new_id);
			console.log($scope.target_canva);
			canvas.mover({id:$scope.target_canva.id,new_id:new_id},function($promise){
				if($promise.meta.msge)mensajeria.push($promise.meta.msge);
				console.log($scope.canvas);
				if($promise.canva)removeFromArray($scope.canvas,$scope.target_canva.id);
			});
		}
	};
	
	$scope.borrar_canva=function(id){
			$http({method: 'POST', url: SERVER_URL+'canvas/delete', data:{id:id,cookie:$.cookie("session_key")}}).
			  success(function(data, status, headers, config) {
			    mensajeria.push(data.msge);
			    $scope.canvas=data.canvas;
			}).
			  error(function(data, status, headers, config) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			});
	};

	$scope.cargar_canva=function(obj){
		$scope.target_canva=obj;
		//console.log(obj);
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
	
// ######## FUNCIONES DE OTRO TIPO ####################################################################################	
	
	$scope.check_editable=function(obj){
			//console.log(obj);
			if(!obj){
				return "invisible";
			}
	};
	
	$scope.check_canvas_editable=function(obj){
			if(!obj){
				return "invisible";
			}
	};
	$scope.color_proyecto_activo=function(obj){
		if($scope.target==obj){
			return "proyecto_activo";
		}
	};
	
	$scope.fetch_permisos=function(obj){
		console.log(obj);
		$http({method: 'POST', url: SERVER_URL+'permisos/fetch', data:{permiso:{},proyecto_id:obj,cookie:$.cookie("session_key")}}).
		  success(function(data, status, headers, config) {
			//if(data.permisos.length>0)$scope.proyecto.permisos_attributes=data.permisos;
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
	};
	
	
	$scope.lista_usuarios = function(){
		  	$http({method: 'POST', url: SERVER_URL+'users/fetch_all',data:{cookie:$.cookie("session_key")}}).
							 success(function(data, status, headers, config) {
							 	//console.log(data);
							 	aux=[];
							 	if(!$scope.users)$scope.users=data.users;
							 	//console.log(data);
							 	$.each(data.users,function(key,value){
							 		if(value.dato_attributes!=undefined) aux.push({
							 			value:value.dato_attributes.nombre,
							 			username:value.username,
							 			nombre:value.dato_attributes.nombre,
							 			apellido:value.dato_attributes.apellido,
							 			id:value.id,
							 			tokens:[value.dato_attributes.nombre,value.dato_attributes.apellido]
							 			});
							 	});
								$("#filtro_usuario").typeahead([{
									name: 'Buscar_usuario',
									local: aux,
									template:'<p>{{nombre}} {{apellido}}</p>',
									engine: Hogan
									}]).on('typeahead:selected', function($e, $datum){
										$scope.selected_user={};
										$scope.selected_user=$datum;
										$scope.selected_user.valor=2;
										$scope.selected_user.valor_texto="ver";
									});
							
							 }).
							  error(function(data, status, headers, config) {
							 });
		  };
		  $scope.agregar_permiso=function(){
		  	if($scope.selected_user){
		  		
			  	//$scope.canva.permisos_attributes.push($scope.selected_user);
			  	permiso_to_add={
			  		user_id:$scope.selected_user.id,
			  		proyecto_id:$scope.target.id,
			  		valor:$scope.selected_user.valor
			  		};
			  	$http({method: 'POST', url: SERVER_URL+'permisos/create', data:{permiso:permiso_to_add,proyecto_id:$scope.target.id,cookie:$.cookie("session_key")}}).
							 success(function(data, status, headers, config) {
							 	//console.log(data);
							 	if(data.permisos)$scope.target.permisos_attributes=data.permisos;
							 	//$scope.target={};
							 }).
							  error(function(data, status, headers, config) {
							 });
			  		
		  	}
		  };
		  $scope.set_permiso_actualizable=function(obj){
		  	$scope.permiso_actualizable=obj;
		  };
		  $scope.editar_permiso=function(){
		  	$http({method: 'POST', url: SERVER_URL+'permisos/edit', data:{permiso:$scope.permiso_actualizable, proyecto_id:$scope.permiso_actualizable.proyecto_id,cookie:$.cookie("session_key")}}).
							 success(function(data, status, headers, config) {
							 	$scope.permiso_actializable={};
							 	//console.log(data.permisos);
							 	if(data.msge)mensajeria.push(data.msge);
							 	if(data.permisos.length>0)$scope.target.permisos_attributes=data.permisos;
							 }).
							  error(function(data, status, headers, config) {
							 });
		  };
		  $scope.borrar_permiso=function(id){
		  	$http({method: 'POST', url: SERVER_URL+'permisos/delete', data:{permiso:{id:id},proyecto_id:$scope.target.id,cookie:$.cookie("session_key")}}).
							 success(function(data, status, headers, config) {
							 	//console.log(data);
							 	$scope.target.permisos_attributes=data.permisos;
							 }).
							  error(function(data, status, headers, config) {
							 });
		  };

}

function removeFromArray(target,id){
	$.each(target,function(k,v){
		if(v)if(v.id)if(v.id==id) target.splice(k,1);
	});
}
