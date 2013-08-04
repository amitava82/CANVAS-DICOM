angular.module('viewerService', [])

.factory('viewerService', [function(){
    function initialize(matrix){
        return new Viewer(matrix);
    }
    return {
        init: initialize
    }
}]);

function Viewer(matrix){
    this.fileParser = new FileParser();
    this.canvasPainters = [];
    this.matrix = matrix || [1, 1];
    
    for(var x = 0; x < this.matrix[0] * this.matrix[1]; x++){
        var canvas = new CanvasPainter();
        this.canvasPainters.push(canvas);
    }
}

Viewer.prototype.setMatrix = function(matrix){
    this.matrix = matrix;
}

