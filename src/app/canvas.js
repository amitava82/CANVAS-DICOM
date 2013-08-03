angular.module('app')
.directive('canvasPainter', ['fileParser', function(fileParser){
    function link(scope, element, attrs){

        var canvas = element[0];
        var ctx = canvas.getContext('2d');
        
        function setCanvasDimentions(width, height){
            ctx.canvas.width  = width;
            ctx.canvas.height = height;
        }
        //render image on canvas
        function render(image){
            setCanvasDimentions(image.width, image.height);
            var canvasWidth  = canvas.width;
            var canvasHeight = canvas.height;
            var pixelData = image.pixelData,
                ww = image.windowWidth,
                wc = image.windowCenter,
                slope = image.RS,
                intercept = image.RI,
                imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight),
                data = imageData.data;
            
            if(slope > 0) wc = (wc - intercept) / slope;
            
            var lut = fileParser.LUT(ww, wc, image.BITSALLOCATED);
            
            /*
             * NewValue = (RawPixelValue * RescaleSlope) + RescaleIntercept
            */
            for(var h = 0, hh = canvasHeight; h < hh; ++h){
                for(var w = 0, ww = canvasWidth; w < ww; ++w){
                    var pixelIndex = (h*canvasWidth) + w; //get the pixel number
                    var canvasIndex = pixelIndex*4; // pixel position on canvas, gives R index  
                    var raw = pixelData[pixelIndex]; //raw pixel value    
                    var colorValue = lut[raw]; // get color value from LUT
                    data[canvasIndex]   = colorValue;    // red
                    data[canvasIndex+1] = colorValue;    // green
                    data[canvasIndex+2] = colorValue;    // blue
                    data[canvasIndex+3] = 255;      // alpha
                }
            }
            ctx.putImageData(imageData, 0, 0);
        }
        
        scope.$on('image.render', function(e, param){
            render(param.image);
        })
    }
        
    return {
        restrict: 'EAC',
        link: link
    }
}])