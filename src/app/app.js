angular.module('app', [
    'ui.bootstrap', 
    'downloadManager', 
    'fileParser',
    'viewerService'
])

.controller('appController', ['$scope', '$rootScope', 'downloadManager', 'viewerService', function($scope, $rootScope, downloadManager, viewerService){
    
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
    $scope.matrix = [[1,1], [1,2], [2,2], [4,4]];
    $scope.selectedMatrix = $scope.matrix[0];
    $scope.tools = {
        'Window level': {},
        'Move': {},
        'Zoom': {}
    };
    $scope.selectedPreset = null;
    
    $scope.viewer = viewerService.init($scope.selectedPreset);
    
    $scope.changePreset = function(){
        $scope.imageFile.windowCenter = $scope.selectedPreset.center;
        $scope.imageFile.windowCenter = $scope.selectedPreset.width;
        $rootScope.$broadcast('image.render', {image: $scope.imageFile})
    };
    
    $scope.changeMatrix = function(matrix){
        $scope.viewer.setMatrix(matrix);
    };
    
    downloadManager.downloadSeries(['data/image.zip']).then(function(result){
        var headers = {
            BITSALLOCATED: 16,
            COLUMNS: 512,
            ROWS: 512,
            RI: -1024,
            RS: 1,
            WC: 400,
            WW: 2000
        }
        var zip = new JSZip(result[0].data);
        
        var image = new ImageFile(zip.file('image').asArrayBuffer(), headers);
        $scope.viewer.canvasPainters[0].currentImage = image;
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
    $scope.reset = function(){
        
    }
    $scope.range = function(n) {
        return new Array(n);
    };
    
}])
.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++)
      input.push(i);
    return input;
  };
});