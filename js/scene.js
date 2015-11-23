window.cx = window.cx || {};
(function (ns) {
    ns.Scene = function (canvas, bgImgUrl) {
        this.isRunning = false;
        this.width = canvas.width;
        this.height = canvas.height;
        this.scale = { x: this.width / 1024.0, y: this.height / 768.0 };
        this.resizeTimer = null;
        this.canvas = canvas;
        this.drawTimer = null;
        this.objects = [];

        //this.cxlogo = new CanvasImage(100, 200, 400, 100, 'img/cxlogo.png', true);
        this.bg = bgImgUrl ? new ns.CanvasImage(0, 0, this.width, this.height, bgImgUrl) : null;
        this.stats = false;
        this.lastFrameTime = 0;
        this.elapsedTime = 0.0;
        this.runTime = 0;
        this.elapsedTimeSeconds = this.elapsedTime * 0.001;
        this.touch = false;
    }
    /*
    ns.Scene.prototype.onLoad = function (canvas, canvascol) {
        this.stats = window.location.href.indexOf('#stats') > 0
        this.canvas = canvas;
        this.resize(window.innerWidth, window.innerHeight);

        this.drawTimer = setTimeout(this.draw, 50);
    };*/

    ns.Scene.prototype.move = function (dt) {
        var i = 0;
        for(;i < this.objects.length; i++) {
            this.objects[i].move(dt);
        }
    };

    ns.Scene.prototype.draw = function (ctx) {
        var i = 0;
        ctx.globalCompositeOperation = "source-over";
        this.bg ? this.bg.draw(ctx) : ctx.clearRect(0, 0, this.width, this.height);
        for(; i < this.objects.length; i++) {
            this.objects[i].draw(ctx);
        }
        this.stats && this.drawStats(ctx);
    };
    
    ns.Scene.prototype.drawStats = function (ctx) {
        ctx.fillStyle = '#33e';
        ctx.font = 'italic bold 30px sans-serif';
        ctx.textBaseline = 'bottom';
        ctx.fillText(((1000.0 / this.elapsedTime) << 0) + 'fps', 100, 100);
    }

    ns.Scene.prototype.renderLoop = function() {
        if(!this.isRunning) {
            return;
        }
        var self = this,
            ctx = this.canvas.getContext('2d'),
            a = ctx.globalAlpha,
            now = elapsed = new Date().getTime();
        if (this.lastFrameTime == 0) {
            this.lastFrameTime = now;
        }
        var elapsed = this.elapsedTime = now - this.lastFrameTime;
        this.elapsedTimeSeconds = elapsed * 0.001;
        if (elapsed > 0) {
            this.runTime += elapsed;
            this.move(elapsed);
            if(now - this.lastFrameTime > 30) {//reduce cpu by not drawing unless at least 30ms has elapsed
                this.lastFrameTime = now; 
                this.draw(ctx);
                ctx.globalAlpha = a;
            }
        }
        (window.requestAnimationFrame || setTimeout)(function(){self.renderLoop()}, 10);
    }
    
    ns.Scene.prototype.start = function() {
        this.isRunning = true;
        this.runTime = 0;
        this.renderLoop();
    }
    
    ns.Scene.prototype.stop = function() {
        this.isRunning = false;
    }



    ns.Scene.prototype.resize = function (w, h) {
        var i;
        this.width = w;
        this.height = h;
        this.scale = { x: w / 1024.0, y: h / 768.0 };
        this.canvas.width = w;
        this.canvas.height = h;
        if(this.bg) {
            this.bg.width = w;
            this.bg.height = h;
        }
        for(i=0; i< this.objects.length; i++){
            if(this.objects[i].resize){
                this.objects[i].resize(w,h);
            }
        }
    };

    ns.Scene.prototype.onResize = function (w, h) {
        var self = this;
        if (this.resizeTimer) {
            clearTimeout(this.resizeTimer);
        }

        this.resizeTimer = setTimeout(function () {
            self.resizeTimer = null;
            if (w == self.width && h == self.height) {
                return;
            }
            self.resize(w, h);
        }, 500);
    };

    ns.Scene.prototype.createCanvas = function () {
        if (this.canvas) {
            this.deleteCanvas();
        }
        this.ctx = this.canvas.getContext('2d');
    }
    ns.Scene.prototype.deleteCanvas = function () {
        this.canvas = null;
    };


}(window.cx))

