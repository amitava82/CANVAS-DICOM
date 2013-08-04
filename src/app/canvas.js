angular.module('app')
.directive('canvasPainter', ['fileParser', '$parse', function(fileParser, $parse){
    function link(scope, element, attrs, modelCtrl){
        var canvasPainter = $parse(attrs.ngModel)(scope);
        if(!canvasPainter) return;
        
        var container = angular.element('#viewer');
        var viewer = scope.viewer;
        var cW = container[0].offsetWidth;
        var cH = container[0].offsetHeight - 50 - viewer.matrix[1]*.5;
        
        //calculate canvas sizes
        var cellWidth = cW / viewer.matrix[0];
        var cellHeight = cH / viewer.matrix[1];
        var canvas = element[0];
        var ctx = canvas.getContext('2d');
        var scale = 1;
        var originx = 0;
        var originy = 0;
        
        setCanvasDimentions(cellWidth, cellHeight);
        
        function setCanvasDimentions(width, height){
            ctx.canvas.width  = width;
            ctx.canvas.height = height;
        }
        //render image on canvas
        function render(image){                        
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, cW, cH);
            
            image = canvasPainter.currentImage;
            
            if(!image) return;
            
            var tempcanvas = document.createElement('canvas');
            tempcanvas.height = image.height;
            tempcanvas.width = image.width;
            var tempContext = tempcanvas.getContext('2d');
            var imgData = tempContext.createImageData(image.width, image.height);
            
            var pixelData = image.pixelData,
                width = image.width,
                height = image.height,
                ww = image.windowWidth,
                wc = image.windowCenter,
                slope = image.RS,
                intercept = image.RI;
            //imageData = ctx.getImageData(0, 0, width, height),
            //data = imageData.data;
            //setCanvasDimentions(width, height);
            
            if(slope > 0) wc = (wc - intercept) / slope;
            
            var lut = fileParser.LUT(ww, wc, image.BITSALLOCATED);
            
            /*
             * NewValue = (RawPixelValue * RescaleSlope) + RescaleIntercept
            */
            for(var h = 0, hh = height; h < hh; ++h){
                for(var w = 0, ww = width; w < ww; ++w){
                    var pixelIndex = (h*width) + w; //get the pixel number
                    var canvasIndex = pixelIndex*4; // pixel position on canvas, gives R index  
                    var raw = pixelData[pixelIndex]; //raw pixel value    
                    var colorValue = lut[raw]; // get color value from LUT
                    imgData.data[canvasIndex]   = colorValue;    // red
                    imgData.data[canvasIndex+1] = colorValue;    // green
                    imgData.data[canvasIndex+2] = colorValue;    // blue
                    imgData.data[canvasIndex+3] = 255;      // alpha
                }
            }
            
            var targetWidth = scale * width,
                targetHeight = scale * height,
                xOffset = (width - targetWidth) / 2,
                yOffset = (height - targetHeight) / 2;
            
            tempContext.putImageData(imgData, 0, 0); 
            //   ctx.translate(cW/2, cH/2);
            // ctx.drawImage(tempcanvas, xOffset, yOffset, targetWidth, targetHeight);
            ctx.drawImage(tempcanvas, 0, 0);
        }
        
        scope.$on('image.render', function(e, param){
            render(param.image);
        });
        
        canvas.onmousewheel = function (event){
            var mousex = event.clientX - canvas.offsetLeft;
            var mousey = event.clientY - canvas.offsetTop;
            var wheel = event.wheelDelta/120;//n or -n
            
            var zoom = Math.pow(1 + Math.abs(wheel)/2 , wheel > 0 ? 1 : -1);
            //            
            //            ctx.translate(
            //                originx,
            //                originy
            //            );
            ctx.scale(zoom,zoom);
            //            ctx.translate(
            //                -( mousex / scale + originx - mousex / ( scale * zoom ) ),
            //                -( mousey / scale + originy - mousey / ( scale * zoom ) )
            //            );
            
            originx = ( mousex / scale + originx - mousex / ( scale * zoom ) );
            originy = ( mousey / scale + originy - mousey / ( scale * zoom ) );
            scale *= zoom;
            render();
        }
        
        function zoom(factor){
            
        }
        
        scope.$watch('viewer.matrix', function(newVal){
            if(newVal){
                cellWidth = cW / newVal[0];
                cellHeight = cH / newVal[1];
                setCanvasDimentions(cellWidth, cellHeight);
                render();
            }
            
        })
        
        function calculateCellDimention(){
            
        }
        
        
    }
    
    return {
        restrict: 'EAC',
        link: link,
        require: 'ngModel'
    }
}])