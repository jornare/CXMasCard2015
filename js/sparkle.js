window.cx = window.cx || {};
if (typeof Audio === undefined) {
    var Audio = { play: function () { }, canPlayType: function () { return false }};
}
(function (ns) {
    var TWOPI = Math.PI * 2,
        numParticles = 15;
    
    
    function createBuffer(width, height){
        var buffer = document.createElement('canvas');
        buffer.width = width;
        buffer.height = height;
        return buffer;
    }
 
    //var tss = new Audio("");
    ns.Sparkle = function (_scene, x, y) {
        var self = this;
        var scene = _scene;
        this.scale = scene.scale.d;
        this.trail = [];
        this.showTrail = true;
        this.x = x;
        this.y = y;
        this.particles = [];
        this.buffer = createBuffer(scene.width, scene.height);
        //this.flare = new Image();
        //this.flare.src = 'img/flare.png';
        this.flareWidth = 1;
        this.flareHeight = 1;
        this.heatCenterY = 1;
        this.dead = false;
        this.time = 0;
        this.fade = false; //true if the background should fade
        this.fadeTimer = 0;
        this.opacity = 0;
       /* this.flare.onload = function () {
            self.flareWidth = self.flare.width * scene.scale.x;
            self.flareHeight = self.flare.height * scene.scale.y;
            self.heatCenterY = self.y - self.flareHeight * 0.2;
        };*/
        // prepare palette function

        this.resize = function(width, height) {
            this.buffer = createBuffer(width, height);
        }
        this.create = function () {
            for (var i = 0; i < numParticles; i++) {
                this.particles.push(new Particle(self.x, self.y, this.scale));
            }
        };

        this.addTrailPos = function(x, y, t) { //for a smoother trail on slow devices
            if(this.showTrail){
                this.trail.push({x: x, y: y, t: t});
            }
        }
        
        this.move = function (elapsed) {
            var i,
                p,
                numParticles = self.particles.length,
                thisPos = {x: this.x, y: this.y, t: this.time};
            this.time += elapsed;
            this.fadeTimer += elapsed;
            if(this.fadeTimer > 60){
                this.fade = true;
                this.fadeTimer -= 60;
            } else {
                this.fade = false;
            }
            if(this.showTrail){
                this.trail.push(thisPos);
            }
            for(; this.trail.length && this.time - this.trail[0].t > 3000;) {
                this.trail.shift();
            }
            for (i = 0; i < numParticles; i++) {
                p = self.particles[i];
                //lets move the particles
                p.remaining_life -= elapsed;
                //p.radius -= elapsed * 0.002;
                
                p.x = p.x + p.speed.x * elapsed;////p.speed.x*(scene.gravx+1.0)*5;
                p.y = p.y + p.speed.y * elapsed;//p.speed.y*(scene.gravy+1.0)*5;

                //regenerate particles
                if (p.remaining_life < 0) {
                    //a brand new particle replacing the dead one
                    this.particles[i] = new Particle(this.x, this.y, this.scale);
                }
            }
        };

     

        this.draw = function (ctx) {
            if (this.dead) {
                return;
            }
            var numParticles = self.particles.length, scale = this.scale,
                i,
                p,
                t,
                bufferCtx = this.buffer.getContext('2d'),
                strokeStyle = bufferCtx.strokeStyle,
                gradient1;

            if(this.fade) {
                bufferCtx.globalCompositeOperation = "multiply";
                if(bufferCtx.globalCompositeOperation == 'multiply') {
                    bufferCtx.fillStyle = 'rgba(200,200,200,0.9)';
                    bufferCtx.fillRect(0, 0, scene.width, scene.height);  
                } else {
                    bufferCtx.clearRect(0,0, scene.width, scene.height);
                }
            }
            bufferCtx.globalCompositeOperation = "source-over";


            //trail
            if(this.trail.length > 1) {
                bufferCtx.beginPath();
                bufferCtx.strokeStyle = 'rgba(170,150,140,0.5)';
                bufferCtx.lineWidth = 6 * scale;

                bufferCtx.moveTo(this.trail[0].x, this.trail[0].y);
                for(i = 1; i < this.trail.length ; i++) {
                    t = this.trail[i];
                    bufferCtx.lineTo(t.x, t.y);
                }
                bufferCtx.stroke();
                bufferCtx.beginPath();
                bufferCtx.strokeStyle = 'rgba(255,240,100,0.9)';
                bufferCtx.lineWidth = 2 * scale;
                bufferCtx.moveTo(this.trail[0].x, this.trail[0].y);
                for(i = 1; i < this.trail.length ; i++) {
                    t = this.trail[i];
                    bufferCtx.lineTo(t.x, t.y);
                }
                bufferCtx.stroke();
            }

            //gradient for center
            gradient1 = bufferCtx.createRadialGradient(this.x, this.y, 0, this.x ,this.y, 100 * scale);
            gradient1.addColorStop(0, "rgba(255, 250, 250, 0.2)");
            gradient1.addColorStop(0.05, "rgba(220, 50, 0, 0.07)");
            gradient1.addColorStop(0.1, "rgba(220, 100, 100, 0.04)");
            gradient1.addColorStop(1, "rgba(255, 255, 255, 0)");
            bufferCtx.fillStyle = gradient1;
            bufferCtx.arc(this.x, this.y, 60 * scale, TWOPI, false);
            bufferCtx.fill();     


            //gradient for speckle
            var gradient = bufferCtx.createRadialGradient(this.x, this.y, 0, this.x , this.y , 200 * scale);
            gradient.addColorStop(0, "rgba(255,200,200, 0.8)");
            gradient.addColorStop(1, "rgba(255,255,255, 0.7)");
            bufferCtx.lineWidth = 1;//2 * scale;
            bufferCtx.strokeStyle = strokeStyle;
            for (i = 0; i < numParticles; i++) {
                p = self.particles[i];

                bufferCtx.fillStyle = gradient;
                p.draw(bufferCtx, scale);
            }
            
            ctx.globalCompositeOperation = "lighten";
            ctx.drawImage(this.buffer, 0, 0);
        };
        
        this.drawModifyMode = function(ctx) {
            var i, t;
            for(i = this.trail.length - 1; i > 0 ; i--) {
                t = this.trail[i];
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(255,240,100,0.9)';
                ctx.lineWidth = 4 * this.scale;
                ctx.moveTo(t.x, t.y);
                ctx.lineTo(this.trail[i-1].x, this.trail[i-1].y);
                ctx.stroke();
            }
        }
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
        function Particle(x, y, scale) {
            var speedX = (Math.random() - 0.5) * Math.random() * 5 * scale;
            var speedY = (Math.random() - 0.5) * Math.random() * 5 * scale;
            this.speed = {x: speedX, y: speedY};//{ x: -(scene.gravx * 2 + Math.random()) * 0.025, y: -(scene.gravy * 2 + Math.random()) * 0.025 };
            this.x = x;
            this.y = y;
            var size = (scene.height + scene.width) / 300;
            //radius range = 10-30
            //this.radius = size * 1.1 + Math.random() * size;
            //life range = 20-30
            this.life = (size + Math.random() * size) * 10;
            this.remaining_life = this.life;
        }
        
        Particle.prototype.draw = function (ctx, scale) {
            var x = this.x,
                y = this.y,
                i,
                r,
                d,
                gradient = ctx.createRadialGradient(x, y, 0, x , y, 2 + 25 * scale);
            gradient.addColorStop(0, "rgba(255, 250, 250, 0.5)");
            gradient.addColorStop(0.3, "rgba(255, 250, 250, 0.4)");
            gradient.addColorStop(0.6, "rgba(255, 200, 200, 0.2)");
            gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(x, y);
            for(i = 0; i < 10; i++) {
                r = 1 + Math.random() * 10 * scale;
                d = Math.random() * TWOPI;
                ctx.lineTo(x + r * Math.cos(d), y + r * Math.sin(d));
                ctx.lineTo(x + r * Math.cos(d + 0.2), y + r * Math.sin(d + 0.2));
                ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
                
        }
         
        this.create();
    }



}(window.cx));

