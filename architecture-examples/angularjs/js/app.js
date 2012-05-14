(function( window ) {
	'use strict';

	var angular = window.angular;

	var module = angular.module('TodoApp', []);

	/** custom directive for blur/keydown event handling */
	module.directive('todoCommit', function() {
		var ENTER_KEY = 13;
		return function( scope, elem, attrs ) {
			var runCommit = function() {
				scope.$apply(attrs.todoCommit);
			};
			elem.bind('blur', runCommit );
			elem.bind('keydown', function( event ) {
				if ( event.which === ENTER_KEY ) {
					runCommit();
				}
			});
		};
	});

	/** custom directive to handle autofocus & select */
	module.directive('todoFocus', function( $defer ) {
		return function( scope, elem, attrs ) {
			scope.$watch( attrs.todoFocus, function( newval ) {
				if ( newval ) {
					$defer(function() {
						elem[0].focus();
						elem[0].select();
					}, 100 );
				}
			});
		};
	});

	/** angular todo application controller */
	var TodoController = function( $scope, $filter, $location ) {
		var storageKey = 'todos-angularjs';

		// persist todo items in localStorage.
		var persist = function() {
			localStorage[storageKey] = angular.toJson($scope.todos);
		};

		// load array of todo items
		$scope.todos = angular.fromJson(localStorage[storageKey]) || [];

		// routing handler: active/completed todo filtering
		$scope.$location = $location;
		$scope.$watch( '$location.path()', function( newval ) {
			$scope.displayFilter = {};
			if ( newval === '/completed' ) {
				$scope.displayFilter.completed = true;
			} else if ( newval === '/active' ) {
				$scope.displayFilter.completed = false;
			}
		});

		$scope.createTodo = function() {
			$scope.todos.push({
				name: $scope.newItem,
				completed: false
			});
			$scope.newItem = '';
			persist();
		};

		$scope.updateTodo = function( index ) {
			var newname = $scope.todos[index].name;
			if ( !newname ) {
				$scope.deleteTodo( index );
			} else {
				delete $scope.todos[index].editing;
			}
			persist();
		};

		$scope.deleteTodo = function( index ) {
			$scope.todos.splice( index, 1 );
			persist();
		};

		var filterTodo = function(completed) {
			return $filter('filter')( $scope.todos, {
				completed: completed
			});
		};

		$scope.remainingCount = function() {
			return filterTodo( true ).length;
		};

		$scope.clearCompleted = function() {
			$scope.todos = filterTodo( false );
			persist();
		};
		
		$scope.allCompleted = function() {
			var all = $scope.todos.length;
			return (all > 0) && (all === filterTodo( true ).length);
		};

		$scope.toggleCompletion = function() {
			var newval = !$scope.allCompleted();
			angular.forEach( $scope.todos, function( todo ) {
				todo.completed = newval;
			});
			persist();
		};

	};
	// export
	window.TodoController = TodoController;

})( window );
