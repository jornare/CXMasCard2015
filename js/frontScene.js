window.cx = window.cx || {};
(function (ns) {
    ns.editMode = false;
    var godjul = [ [29, 212, 500], [39, 200, 500], [25, 208, 500], [27, 215, 500],
        [29, 211],[78, 304],[226, 324],[390, 273],[424, 209],
[352, 194],[271, 255],[267, 357],[360, 355],[426, 315],[418, 456],[366, 483],[383, 385],[470, 314],[519, 323],[523, 378],[477, 381],[481, 317],[582, 298],[618, 332],[614, 298],[631, 225],[661, 175],
[673, 195],[648, 287],[589, 361],[555, 358],[561, 324],[599, 313],[670, 353],[758, 246],[784, 160],[818, 437],[729, 536],[644, 489],[701, 374],[839, 296],[854, 302],[863, 349],
[898, 345],[917, 288],[915, 344],[949, 355],[1023, 261],[1054, 171],[1016, 163],[974, 284],[1001, 366],[1077, 374],[1095, 342],[1082, 323],[1082, 323],[1082, 323]]
    
    
    function scalePoints(arr, sx, sy){
        var i, result = [];
        for(i=0; i<arr.length; i++) {
            result.push([
                arr[i][0] *sx,
                arr[i][1] *sy
            ]
            );
        }
        return result;
    }

    
    ns.FrontScene = function(canvas, bgImgUrl) {
        ns.Scene.call(this, canvas, (ns.editMode? 'img/god-jul_2.png':'img/winter.jpg'));
        this.writer = new ns.Writer(scalePoints(godjul, this.scale.x*0.7 , this.scale.y ), this.scale.x * 140, this.scale.y * 100, 1);
        this.lamp = new ns.CanvasImage(this.width * 0.01,0,this.height*0.8 * 0.5, this.height * 0.8, 'img/lamp.png');
        this.lamp.y = this.height - this.lamp.height;
        this.sparkle = new ns.Sparkle(this, 100, 100);
        this.snowBehind = new ns.Snow(this, 300, this.scale.x);
        this.snowFront = new ns.Snow(this, 100, this.scale.x * 2);
        ns.editMode && (this.sparkle.draw = this.sparkle.drawModifyMode);
        this.objects.push(this.snowBehind);
        this.objects.push(this.lamp);
        this.objects.push(this.snowFront);
        this.objects.push(this.sparkle);
        this.isFinishedWriting = false;
        
        //this.writer.addPoint(0,0,100);
        
        this._move = function(elapsed) {
            //this.sparkle.x = 200 + Math.cos(this.lastFrameTime / 400) * 200;
            //this.sparkle.y = 200 + Math.sin(this.lastFrameTime / 400) * 200;    
            this.sparkle.x = this.touch.x || this.sparkle.x;
            this.sparkle.y = this.touch.y || this.sparkle.y;
            this.__proto__.move.call(this, elapsed);
        };
        
        this.move = function(elapsed) {
            if(!this.isFinishedWriting) {
                var point = this.writer.getPos(this.runTime);
                this.sparkle.x = point.x;
                this.sparkle.y = point.y;
                if(this.runTime > this.writer.runTime) {
                    this.isFinishedWriting = true;
                }
            }

            this.__proto__.move.call(this, elapsed);
        };
        
        this.draw = function (ctx) {
            this.__proto__.draw.call(this, ctx);
            if(ns.editMode) {
                var i, points = this.writer.path;
                if(points.length<2) {
                    return;
                }
                for(i=0;i<points.length; i++) {
                    drawCross(ctx, points[i].x, points[i].y, 1);
                    drawVector(ctx, points[i].x, points[i].y,points[i].suv);
                }
                this.selectedPoint && drawCross(ctx, this.selectedPoint.x, this.selectedPoint.y, 4);
            }
        };
        this.resize = function(w, h) {
            this.__proto__.resize.call(this, w, h);
            this.lamp.width= this.height*0.8 * 0.5;
            this.lamp.height = this.height * 0.8;
            this.lamp.y = this.height - this.lamp.height;
        }
        this.addPoint = function(x, y){
            if(this.selectedPoint) {
                this.selectedPoint.x = x;
                this.selectedPoint.y = y;
                this.writer.calculateVectors();
            } else {
                this.writer.addPoint(x,y, 100);
            }

        };
        
        this.onMouseMove = function(x,y, buttons) {
            var i, points = this.writer.path;
            if(ns.editMode) {
                if(buttons && this.selectedPoint) {
                    this.selectedPoint.x = x;
                    this.selectedPoint.y = y;
                    this.writer.calculateVectors();
                }
                this.selectedPoint = null;
                for(i=0;i<points.length; i++) {
                    if(distance(x,y, points[i].x, points[i].y) < 10) {
                        this.selectedPoint = points[i];
                    }
                }  
            } else if(this.isFinishedWriting) {
                this.sparkle.x = x;
                this.sparkle.y = y;
            }
            
        }
    }
    ns.FrontScene.prototype = ns.Scene.prototype;

    function distance(x1, y1, x2, y2) {
        var x = x2-x1, y=y2-y1;
        return Math.sqrt(x*x + y*y);
    }
    function drawCross(ctx, x, y, size) {
            ctx.beginPath();
            ctx.strokeStyle = 'red';
            ctx.lineWidth = size;
            ctx.moveTo(x-4, y);
            ctx.lineTo(x+4, y);
            ctx.stroke();
            ctx.moveTo(x, y-4);
            ctx.lineTo(x, y+4);
            ctx.stroke();
    }
    
    function drawVector(ctx, x, y, v) {
            ctx.beginPath();
            ctx.strokeStyle = 'green';
            ctx.lineWidth = 1;
            ctx.moveTo(x, y);
            ctx.lineTo(x + v.x*10, y + v.y*10);
            ctx.stroke();
    }
    
    //ns.FrontScene.prototype.

}(window.cx))

