window.cx = window.cx || {};
(function (ns) {
    ns.CanvasImage = function (x, y, width, height, src, collisionMap) {
        var self = this;
        this.x = x;
        this.y = y;
        this.width = width || 0.0;
        this.height = height || 0.0;
        this.img = new Image();
        this.img.src = src;
        this.collisionMap = collisionMap ? [] : false;

        this.img.onload = function () {

        };

        this.move = function() {};
        
        this.draw = function (ctx) {
            ctx.drawImage(self.img, self.x, self.y, self.width, self.height);
        };
    }

}(window.cx));

