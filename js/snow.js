window.cx = window.cx || {};

(function (ns) {
    var TWOPI = Math.PI * 2;

 
    //var tss = new Audio("");
    ns.Snow = function (_scene, numFlakes, scale, noSpecle) {
        var self = this;
        var scene = _scene;
        this.scale = scale;
        this.snowFlakes = [];
        this.numFlakes = numFlakes;
        this.maxDist = _scene.width + _scene.height;
        this.specle = !noSpecle;

       /* this.flare.onload = function () {
            self.flareWidth = self.flare.width * scene.scale.x;
            self.flareHeight = self.flare.height * scene.scale.y;
            self.heatCenterY = self.y - self.flareHeight * 0.2;
        };*/
        // prepare palette function

        this.resize = function(width, height) {
            this.maxDist = _scene.width + _scene.height;
            this.light1 = {x: Math.min(_scene.height * 0.1, _scene.width * 0.06), y: _scene.height * 0.29};
            this.light2 = {x: Math.min(_scene.height * 0.35, _scene.width * 0.25), y: _scene.height * 0.35};
            this.create();
        };
        
        this.create = function () {
            var r, i;
            this.snowFlakes = [];
            for (i = 0; i < this.numFlakes; i++) {
                r = Math.random();
                this.snowFlakes.push(new SnowFlake(Math.random() * scene.width, Math.random() * scene.height, r * r * this.scale));
            }
        };
        this.resize();
        
        this.move = function (elapsed) {
            var i,
                p,
                dlx,
                dly,
                dl;

            for (i = 0; i < this.numFlakes; i++) {
                p = self.snowFlakes[i];
                p.y += elapsed * p.speed;
                if(p.y > scene.height) {
                    p.y = -5;
                } else if(p.x < scene.width * 0.5 && p.r > 2) {
                    dlx = p.x - this.light1.x;
                    dly = p.y - this.light1.y;
                    dl = Math.sqrt(dlx * dlx + dly * dly);//distance to light1
                    
                    dlx = p.x - this.light2.x;
                    dly = p.y - this.light2.y;
                    dl = Math.min(Math.sqrt(dlx * dlx + dly * dly), dl);//shortest distance to light
                    
                    p.specle = Math.max(1.0 - Math.pow(8.0 * dl / this.maxDist, 2), 0.1); 
                } else {
                    p.specle = 0.1;
                }

            }
        };
        

        if(noSpecle) {
            this.move = function (elapsed) {
                var i,
                    p;
    
                for (i = 0; i < this.numFlakes; i++) {
                    p = self.snowFlakes[i];
                    p.y += elapsed * p.speed;
                    if(p.y > scene.height) {
                        p.y = -5;
                    }
                }
            };
        }

        this.draw = function (ctx) {
            var i;
            for (i = 0; i < this.numFlakes; i++) {
                self.snowFlakes[i].draw(ctx);
            }
            /* red dots to mark lights
            ctx.fillStyle='red';
            ctx.beginPath();
            ctx.arc(this.light1.x, this.light1.y, 2, 0, TWOPI);
            ctx.fill();
                        ctx.beginPath();
            ctx.arc(this.light2.x, this.light2.y, 2, 0, TWOPI);
            ctx.fill();*/
        };

/*
        this.touch = function (x, y) {
            if (x - 10 < this.x && x + 10 > this.x && y - 10 < this.y && y + 10 > this.y) {
                this.dead = true;
            } else if (this.dead) {
                var self = this;
                setTimeout(function () {
                    self.dead = false;
                }, 3000);
            }
        }
*/
        function SnowFlake(x, y, r) {
            //var speedX = (Math.random() - 0.5) * Math.random() * 5;
            //var speedY = (Math.random() - 0.5) * Math.random() * 5;
            //this.speed = {x: speedX, y: speedY};//{ x: -(scene.gravx * 2 + Math.random()) * 0.025, y: -(scene.gravy * 2 + Math.random()) * 0.025 };
            this.lastLocation = { x: x, y: y };
            this.x = x;
            this.y = y;
            this.r = r || Math.random() * scene.height / 130;
            this.specle = 1.0;
            this.speed = 0.005 * this.r;
           /* this.speclex = 0.0;
            this.specley = 0.0;*/
        }
        if(this.specle) {
            SnowFlake.prototype.draw = function (ctx) {
                var r = this.r,
                    gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x , this.y , r);
                gradient.addColorStop(0, "rgba(255, 250, 250, " + this.specle + ')');
                //gradient.addColorStop(0.3, "rgba(255, 250, 250, " + (this.specle * 0.9) + ")");
                //gradient.addColorStop(0.6, "rgba(255, 200, 200, 0.1)");
                gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
                ctx.beginPath();
                ctx.fillStyle = gradient;
                ctx.arc(this.x, this.y, r, 0, TWOPI);
                ctx.fill();
            }
        } else {
            SnowFlake.prototype.draw = function (ctx) {
                var r = this.r,
                    gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x , this.y , r);
                gradient.addColorStop(0, "rgba(230, 230, 230, 0.6)");
                //gradient.addColorStop(0.3, "rgba(255, 250, 250, 0.1)");
                //gradient.addColorStop(0.6, "rgba(255, 200, 200, 0.1)");
                gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
                ctx.beginPath();
                ctx.fillStyle = gradient;
                ctx.arc(this.x, this.y, r, 0, TWOPI);
                ctx.fill();
            }
        }
        this.create();
    }



}(window.cx));

