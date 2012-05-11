(function( window ) {
	'use strict';

	var angular = window.angular,
	  undefined;

	/** angular controller */
	var TodoController = function($scope, $filter, $location) {
		// array of todo items
		$scope.todos = [];

		// active/completed todo filtering
		$scope.$location = $location;
		$scope.$watch('$location.path()', function(newval) {
			var filter;
			if (newval.length > 3) {
				filter = {completed: ( newval === '/completed' ? true : false)};
			}
			$scope.displayFilter = filter;
		});

		$scope.addTodo = function() {
			$scope.todos.push({name: $scope.newItem, completed: false});
			$scope.newItem = '';
		};

		$scope.destroyTodo = function(index) {
			$scope.todos.splice(index, 1);
		};

		$scope.remainingCount = function() {
			return $filter('filter')($scope.todos, {completed: true}).length;
		};

		$scope.clearCompleted = function() {
			$scope.todos = $filter('filter')($scope.todos, {completed: false});
		};
		
		$scope.allCompleted = function() {
			var all = $scope.todos.length,
			    completed = $filter('filter')($scope.todos, {completed: true}).length;
			return (all > 0) && (all === completed);
		};

		$scope.toggleCompletion = function() {
			var newval = !$scope.allCompleted();
			angular.forEach($scope.todos, function(todo) {
				todo.completed = newval;
			});
		};
	};
	// export
	window.TodoController = TodoController;

})( window );
