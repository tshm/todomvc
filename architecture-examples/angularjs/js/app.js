(function( window ) {
	'use strict';

	var angular = window.angular;

	var module = angular.module('TodoApp', []);

	/** custom directive for blur/keydown event handling */
	module.directive('todoCommit', function() {
		var ENTER_KEY = 13;
		return function( scope, elem, attrs ) {
			var runCommit = function(event) {
				scope.$apply(attrs['todoCommit']);
				event.stopPropagation();
			};
			elem.bind('blur', runCommit );
			elem.bind('keydown', function( event ) {
				if ( event.which === ENTER_KEY ) {
					runCommit(event);
				}
			});
			/*
			scope.$on('activate', function() {
				scope.todo.editing = true;
				elem[0].focus();
				elem[0].select();
				console.log(['activate triggered', elem, scope]);
			});
			*/
		};
	});

	/** custom directive to handle select on focus */
	module.directive('todoFocus', function() {
		return function( scope, elem, attrs ) {
			scope.$watch(attrs['todoFocus'], function(newval) {
				console.log(typeof newval);
				console.log(['focus', elem, arguments]);
				//if (newval) { elem[0].focus(); elem[0].select(); }
			});
		};
	});

	/** angular controller */
	var TodoController = function( $scope, $filter, $location ) {
		// array of todo items
		$scope.todos = [];

		// routing handler: active/completed todo filtering
		$scope.$location = $location;
		$scope.$watch( '$location.path()', function( newval ) {
			var filter;
			if ( newval.length > 3 ) {
				filter = {
					completed: ( newval === '/completed' ? true : false )
				};
			}
			$scope.displayFilter = filter;
		});

		$scope.addTodo = function() {
			$scope.todos.push({
				name: $scope.newItem,
				completed: false
			});
			$scope.newItem = '';
		};

		$scope.destroyTodo = function( index ) {
			$scope.todos.splice( index, 1 );
		};

		$scope.remainingCount = function() {
			return $filter('filter')( $scope.todos, {
				completed: true
			}).length;
		};

		$scope.clearCompleted = function() {
			$scope.todos = $filter('filter')( $scope.todos, {
				completed: false
			});
		};
		
		$scope.allCompleted = function() {
			var all = $scope.todos.length,
				completed = $filter('filter')( $scope.todos, {
					completed: true
				}).length;
			return (all > 0) && (all === completed);
		};

		$scope.toggleCompletion = function() {
			var newval = !$scope.allCompleted();
			angular.forEach( $scope.todos, function(todo) {
				todo.completed = newval;
			});
		};

		$scope.editing = function(todo) {
			todo.editing = true;
			$scope.$broadcast('activate');
		};

		$scope.rename = function( index ) {
			console.log(['rename called', arguments]);
			var newname = $scope.todos[index].name;
			if ( !newname ) {
				$scope.destroyTodo( index );
			} else {
				delete $scope.todos[index].editing;
			}
		};

	};
	// export
	window.TodoController = TodoController;

})( window );
