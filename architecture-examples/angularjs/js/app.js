(function( window ) {
	'use strict';

	var angular = window.angular;

	angular.module('TodoApp', []).directive('todoBlur', function() {
		/** custom directive for blur event handling */
		return function( scope, elem, attrs ) {
			elem.bind('blur', function() {
        // submit emitter
        var event = document.createEvent('HTMLEvents');
        event.initEvent('submit', true, false);
        elem.parent('form')[0].dispatchEvent(event);
			});
		};
	}).directive('todoFocus', function( $timeout ) {
		/** custom directive to handle autofocus & select */
		return function( scope, elem, attrs ) {
			scope.$watch( attrs.todoFocus, function( newval ) {
				if ( newval ) {
					$timeout(function() {
						elem[0].focus();
						elem[0].select();
					}, 0 );
				}
			});
		};
	});

	/** angular todo application controller */
	var TodoController = function( $scope, $filter, $location ) {
		var storageKey = 'todos-angularjs';

		// persist todo items in localStorage.
		var persist = function() {
			localStorage[storageKey] = angular.toJson( $scope.todos );
		};

		// load array of todo items
		$scope.todos = angular.fromJson( localStorage[storageKey] ) || [];

		// routing handler: active/completed todo filtering
		$scope.$location = $location;
		$scope.$watch('$location.path()', function( newval ) {
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

		var filterTodo = function( completed ) {
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
