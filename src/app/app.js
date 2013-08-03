angular.module('app', ['ui.bootstrap', 'downloadManager', 'fileParser'])

.controller('appController', ['$scope', '$rootScope', 'downloadManager', function($scope, $rootScope, downloadManager){
    $scope.study = {};
    $scope.patient = {};
    $scope.series = []; //{SeriesUID, Images[]}
    $scope.imageFile = null;
    $scope.mouse = {x: 0, y: 0};
    $scope.pos = {_x: 0, _y: 0};
    $scope.presets = {
        "abdomen": {"center": 350, "width": 40},
        "lung": {"center": -600, "width": 1500},
        "brain": {"center": 40, "width": 80},
        "bone": {"center": 480, "width": 2500},
        "head": {"center": 90, "width": 350}
    };
    $scope.selectedPreset = null;
    
    $scope.changePreset = function(){
        $scope.imageFile.windowCenter = $scope.selectedPreset.center;
        $scope.imageFile.windowCenter = $scope.selectedPreset.width;
        $rootScope.$broadcast('image.render', {image: $scope.imageFile})
    }
    
    downloadManager.downloadSeries(['data/image']).then(function(result){
        var headers = {
            BITSALLOCATED: 16,
            COLUMNS: 512,
            ROWS: 512,
            RI: -1024,
            RS: 1,
            WC: 400,
            WW: 2000
        }
        var image = new ImageFile(result[0].data, headers);
        $scope.imageFile = image;
        $rootScope.$broadcast('image.render', {image: image})
    })
    // angular.forEach(promises, function(promise))
    
    $scope.handleMouseMove = function(e){
        e.preventDefault();
        var x, y;
        x = e.offsetX === undefined ? (e.pageX - e.target.offsetLeft) : e.offsetX;
        y = e.offsetY === undefined ? (e.pageY - e.target.offsetTop) : e.offsetY;
        $scope.mouse.x = x;
        $scope.mouse.y = y;
        
        if($scope.mousedown){      
            var diffX = x - $scope.pos._x;
            var diffY = $scope.pos._y - y;
            $scope.imageFile.windowCenter = $scope.imageFile.windowCenter + diffX;
            $scope.imageFile.windowWidth = $scope.imageFile.windowWidth + diffY;
            $rootScope.$broadcast('image.render', {image: $scope.imageFile})
        }     
        $scope.pos._x = x;
        $scope.pos._y = y;
    }
    $scope.handleMouseDown = function(e){
        e.preventDefault();
        $scope.mousedown = true;
    }
    
}])