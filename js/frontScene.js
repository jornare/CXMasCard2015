window.cx = window.cx || {};
(function (ns) {
    /*
    [614, 298],[631, 225],[661, 175],[673, 195],[648, 287],
[589, 361],[555, 358],[561, 324],[599, 313],*/
    ns.editMode = false;
    var godjul = [  
        [29, 211,3000],[78, 304],[226, 324],[390, 273],[424, 209],
[352, 194],[271, 255],[267, 357],[360, 355],[426, 315],[418, 456],[366, 483],[383, 385],[470, 314],[519, 323],[523, 378],[477, 381],[481, 317],[582, 298],[618, 332],


[599, 313],[561, 324],[555, 358],[589, 361],

[648, 287],[673, 195],[661, 175],[631, 225],[616, 323],




[670, 353],





[758, 246],[784, 160],[818, 437],[729, 536],[644, 489],[701, 374],[839, 296],[858, 302],[863, 349],
[898, 345],[917, 288],[915, 344],[949, 355],[1023, 261],[1054, 171],[1016, 163],[974, 284],[1001, 366],[1077, 374],[1095, 340],[1095, 340],[1095, 340]]
    
    
    function scalePoints(arr, sx, sy){
        var i, result = [];
        for(i=0; i<arr.length; i++) {
            result.push([
                arr[i][0] *sx,
                arr[i][1] *sy,
                arr[i][2]
            ]
            );
        }
        return result;
    }

    var byTxt =  'E-card by Jørn Are Hatlelid @ Computas';
    
    
    
    
    ns.FrontScene = function(canvas, bgImgUrl) {
        var self = this;
        this.__proto__ = ns.Scene.prototype;
        ns.Scene.call(this, canvas, (ns.editMode? 'img/god-jul_2.png':'img/winter.jpg'));
        
        if(ns.editMode){
            this.writer = new ns.Writer(godjul, 0, 0, 1, true);
        } else {
            this.writer = new ns.Writer(scalePoints(godjul, this.scale.x*0.7 , this.scale.y ), this.scale.x * 140, this.scale.y * 100, 1);
        }
        this.lamp = new ns.CanvasImage(this.width * 0.01,0,Math.min(this.height * 0.8 * 0.5, this.width * 0.3), this.height * 0.8, 'img/lamp.png');
        this.lamp.y = this.height - this.lamp.height;
        this.sparkle = new ns.Sparkle(this, 100, 100);
        this.snowFarBehind = new ns.Snow(this, 100, this.width * 0.003, true);
        this.snowBehind = new ns.Snow(this, 50, this.width * 0.004);
        this.snowFront = new ns.Snow(this, 50, this.width *0.007);
        ns.editMode && (this.sparkle.draw = this.sparkle.drawModifyMode);
        //(!ns.editMode) && this.objects.push(this.snowFarBehind);
        //(!ns.editMode) && this.objects.push(this.snowBehind);
        (!ns.editMode) && this.objects.push(this.lamp);
        (!ns.editMode) && this.objects.push(this.snowFront);
        this.objects.push(this.sparkle);
        this.isFinishedWriting = false;
        
        //this.writer.addPoint(0,0,100);
        

        this.addInterpolatedPoints = function (startTime, elapsed) {
            var i, p; //step every 10ms
            for(i = 10; i < elapsed - 10; i += 10) {
                p = this.writer.getPos(startTime + i);
                this.sparkle.addTrailPos(p.x, p.y, startTime + i);
            }
        }
        
        this.start = function() {
            this.__proto__.start.call(this);
        
            //add more snow if cpu is ok with it
            setTimeout(function() {
                if(self.renderTime < 20){
                    (!ns.editMode) && self.objects.unshift(self.snowBehind);
                    setTimeout(function(){
                        if(self.renderTime < 20){
                            (!ns.editMode) && self.objects.unshift(self.snowFarBehind);
                        }                
                    }, 2000);
                }
            }, 2000);
        };
        
        this.move = function(elapsed) {
            if(!this.isFinishedWriting) {
                if(elapsed > 20) {
                    this.addInterpolatedPoints(this.runTime - elapsed, elapsed);
                }
                var point = this.writer.getPos(this.runTime);
                this.sparkle.x = Math.floor(point.x);
                this.sparkle.y = Math.floor(point.y);
                if(this.runTime > this.writer.runTime && !ns.modifyMode) {
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
            ctx.fillStyle = '#44a';
            ctx.font = 'italic bold '+Math.ceil(this.height * 0.026) +'px sans-serif';
            ctx.textBaseline = 'bottom';
            ctx.fillText(byTxt, this.width - ctx.measureText(byTxt).width - 10, this.height - 20);
        };
        
        this.resize = function(w, h) {
            this.__proto__.resize.call(this, w, h);
            this.lamp.height = this.height * 0.8;
            this.lamp.width = Math.min(this.height * 0.8 * 0.5, this.width * 0.3);
            this.lamp.y = this.height - this.lamp.height;
        };
        
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
                        //console.log(this.selectedPoint.x, this.selectedPoint.y);
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

