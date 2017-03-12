angular.module('mybrain', [])
	.controller('mainController', function($scope, $http) {

		$http.get('/forms').success(function(data) {
			$scope.userIds = data.userIds
			$scope.tags = data.tags.map(function(v) {
				return {
					name: v,
					selected: false
				}
			})
		})

		$scope.user = {
			selectedId: ''
		}

		$scope.byUser = function() {
			$http
				.post('/retrieveData', {userId: $scope.user.selectedId})
				.success(drawData)
		}

		$scope.byTags = function() {
			$http
				.post('/retrieveData', {
					tags: $scope.tags
						.filter(v => v.selected)
						.map(v => v.name)
				})
				.success(drawData)
		}

		function drawData(data) {
			new Chartist.Line('#graph-container', {series: data.map(v => v.data)})
		}

	})