window.cx = window.cx || {};
(function (ns) {
        var letters = {
                G: {
                        untimed: true,
                        path: [
                                [24, 206],
                                [38, 274],
                                [108, 315],
                                [215, 311],//G x
                                [336, 265],
                                [354, 199],
                                [309, 189],
                                [215, 311],//G x
                                [272, 356],
                                [362, 301],//g tip
                                [362, 302],//g tip
                                [364, 421],
                                [324, 474],
                                [366, 324]
                        ],
                        width: 400,
                        runTime: 600
                },


                g: {
                        untimed: true,
                        path: [
                                [24, 206],
                                [215, 311],
                                [336, 265],//G x
                                [354, 199],
                                [309, 189],
                                [336, 265],//G x
                                [272, 356]
                        ],
                        runTime: 450,
                        width: 200
                },
                o: {
                        path: [
                                { t: 0, x: 0, y: 100 },
                                { t: 50, x: 25, y: 50 },
                                { t: 150, x: 100, y: 0 },
                                { t: 200, x: 175, y: 50 },
                                { t: 250, x: 200, y: 100 },
                                { t: 300, x: 175, y: 150 },
                                { t: 350, x: 100, y: 200 },
                                { t: 400, x: 25, y: 150 },
                                { t: 450, x: 0, y: 100 },
                                { t: 500, x: 25, y: 50 },
                                { t: 550, x: 100, y: 0 },
                                { t: 600, x: 175, y: 50 },
                                { t: 650, x: 200, y: 100 }],
                        runTime: 650,
                        width: 200
                },
                d: {
                        path: [
                                { t: 0, x: 0, y: 100 },
                                { t: 100, x: 100, y: 0 },
                                { t: 200, x: 0, y: 100 },
                                { t: 300, x: 100, y: 200 },
                                { t: 400, x: 200, y: 150 },
                                { t: 500, x: 180, y: 150 },
                                { t: 600, x: 200, y: 150 },
                                { t: 700, x: 200, y: 250 },
                                { t: 800, x: 180, y: 250 },
                                { t: 900, x: 210, y: 150 }],
                        runTime: 900,
                        width: 200
                },
                j: {
                        path: [
                                { t: 0, x: 0, y: 100 },
                                { t: 20, x: 100, y: 0 },
                                { t: 50, x: 200, y: 20 },
                                { t: 100, x: 100, y: 0 },
                                { t: 200, x: 0, y: 100 },
                                { t: 300, x: 100, y: 200 },
                                { t: 400, x: 200, y: 150 },
                                { t: 500, x: 180, y: 150 },
                                { t: 600, x: 200, y: 150 },
                                { t: 700, x: 200, y: 250 },
                                { t: 800, x: 180, y: 250 },
                                { t: 900, x: 210, y: 150 }],
                        runTime: 900,
                        width: 200
                },
                u: {
                        path: [
                                { t: 0, x: 0, y: 100 },
                                { t: 20, x: 100, y: 0 },
                                { t: 50, x: 200, y: 20 },
                                { t: 100, x: 100, y: 0 },
                                { t: 200, x: 0, y: 100 },
                                { t: 300, x: 100, y: 200 },
                                { t: 400, x: 200, y: 150 },
                                { t: 500, x: 180, y: 150 },
                                { t: 600, x: 200, y: 150 },
                                { t: 700, x: 200, y: 250 },
                                { t: 800, x: 180, y: 250 },
                                { t: 900, x: 210, y: 150 }],
                        runTime: 900,
                        width: 200
                },
                l: {
                        path: [
                                { t: 0, x: 0, y: 50 },
                                { t: 100, x: 60, y: 100 },
                                { t: 200, x: 70, y: 50 },
                                { t: 300, x: 70, y: 10 },
                                { t: 400, x: 50, y: 0 },
                                { t: 500, x: 30, y: 10 },
                                { t: 600, x: 20, y: 50 },
                                { t: 700, x: 20, y: 110 },
                                { t: 800, x: 30, y: 190 },
                                { t: 900, x: 50, y: 200 },
                                { t: 1000, x: 70, y: 190 },
                                { t: 1100, x: 100, y: 170 }],
                        runTime: 2100,
                        width: 100
                },
                ' ': {
                        path: [
                                //{t: 0, x: 0, y: 100},
                                //{t: 100, x: 100, y: 100}
                        ],
                        runTime: 100,
                        width: 200
                },
                '^': {
                        path: [
                                { t: 0, x: 0, y: 200 },
                                { t: 1000, x: 100, y: 0 },
                                { t: 2000, x: 200, y: 200 },
                                { t: 3000, x: 300, y: 0 }],
                        runTime: 3100,
                        width: 300
                }
        };


        function normalizeLetter(letter) {
                var i, result = [], path = letter.path, width = 0;
                for (i = 0; i < path.length; i++) {
                        result.push({
                                t: i * 100,
                                x: path[i][0],
                                y: path[i][1]
                        });
                        width = Math.max(width, path[i][1]);
                }
                letter.width = width;
                letter.path = result;
                letter.runTime = (i + 1) * 100;
                return letter;
        }

        ns.Writer = function (str, x, y, scale) {
                this.repeat = false;
                this.path = [];
                this.runTime = 0;
                if(str instanceof Array) {
                        this.addPoints(str, 190, x, y);
                } else {
                        this.str = str;
                        str && this.addString(str, 0, 0);
                }
                this.calculateVectors();
                this.currentLetter = 0;
        }
        ns.Writer.prototype.addString = function(str, x, y) {
                var i, j,  t=0, letter, path;
                //add letters to path
                for (i = 0; i < str.length; i++) {
                        letter = letters[str[i]];
                        if (letter.untimed) {
                                letter = normalizeLetter(letter);
                                letter.untimed = false;
                        }
                        path = letter.path;


                        this.runTime += letters[str[i]].runTime;
                        for (j = 0; j < path.length; j++) {
                                this.path.push({
                                        t: t + path[j].t,
                                        x: x + path[j].x,
                                        y: y + path[j].y
                                });
                        }
                        x += letter.width + 1;
                        t += letter.runTime + 100;
                }
                this.runTime = t;
        }
        ns.Writer.prototype.calculateVectors = function(){
                var i, p1, p2;
                if(this.path.length < 2) {
                        return;
                }
                //calculate vectors & normalized inverse vectors
                for (i = 0; i < this.path.length - 1; i++) {
                        p1 = this.path[i];
                        p2 = this.path[i + 1];
                        //vectors
                        p1.v = {
                                x: p2.x - p1.x,
                                y: p2.y - p1.y
                        };
                        p1.v.len = Math.sqrt(p1.v.x * p1.v.x + p1.v.y * p1.v.y);
                        p1.uv = {
                                x: p1.v.x / p1.v.len,
                                y: p1.v.y / p1.v.len
                        };
                        /*p1.niv = {
                                x: - p1.v.x / p1.v.len,
                                y: - p1.v.y / p1.v.len
                        };*/
                        p2.suv = p1.uv;//start unit vector
                        /*r = p2.v.len *0.5;
                        p2.bp1 = { //bending point for curve
                                x: p2.x + p2.v.x * 0.5 + p1.niv.x * r,
                                y: p2.y + p2.v.y * 0.5 + p1.niv.y * r,
                                r: r
                        };*/
                }
                this.path[this.path.length - 1].euv = this.path[this.path.length - 1].uv = this.path[this.path.length - 2].uv;
                for(i=0; i<this.path.length - 1; i++) {
                        this.path[i].euv = this.path[i+1].uv;
                }
                this.path[0].suv = this.path[0].uv;
                this.path[this.path.length - 1].v = {
                        x: this.path[this.path.length - 2].v.x,
                        y: this.path[this.path.length - 2].v.y,
                        len: this.path[this.path.length - 2].v.len
                };
                this.path[this.path.length - 1].niv = {
                        x: this.path[this.path.length - 2].v.x / this.path[this.path.length - 2].v.len,
                        y: this.path[this.path.length - 2].v.y / this.path[this.path.length - 2].v.len
                };
        };

        ns.Writer.prototype.addPoints = function(arr, t, xOff, yOff) {
                var i;
                xOff = xOff || 0;
                yOff = yOff || 0;
                for(i=0; i < arr.length; i++) {
                        this.path.push({x:arr[i][0] + xOff,y:arr[i][1] + yOff, t: this.runTime});
                        this.runTime += arr[i][2] ? arr[i][2] : t;
                }
                this.calculateVectors();
        }

        ns.Writer.prototype.addPoint = function(x, y, t) {

                this.path.push({x:x,y:y, t: this.runTime});
                this.runTime += t;
                this.calculateVectors();
                
                for(var i=0;i<this.path.length;i++) {
                        console.log('['+this.path[i].x + ', '+this.path[i].y+'],');
                }
        }
        
        ns.Writer.prototype.modifyPoint = function(index, x, y, t) {
                this.path[index].x = x;
                this.path[index].y = y;
                this.calculateVectors();
        };
        
        
        ns.Writer.prototype.getPos = function (t) {
                if(this.path.length<3){
                        return{x:0,y:0};
                }
                var dt = this.repeat ? t % this.runTime : t,
                        dtp, //delta time position
                        i = this.getPosition(dt),
                        
//                p1 = this.path[(i - 2 < 0 ? this.path.length + (i - 2) : i - 2)],
                p1 = this.path[Math.max(i-2, 0)];
                p2 = this.path[Math.max(i-1, 0)];
                //p2 = this.path[i - 1] || this.path[this.path.length - 1],
                p3 = this.path[i],
                p4 = this.path[Math.min(i + 1, this.path.length-1)];
                //p4 = this.path[i + 1] || this.path[0] ;

                dtp = (dt - p2.t) / (p3.t - p2.t); // delta time position 0.0-1.0
                var r = {
                        x: cmr_spline(p1.x, p2.x, p3.x, p4.x, dtp),
                        y: cmr_spline(p1.y, p2.y, p3.y, p4.y, dtp),
                };
                if(!r.x || !this.repeat && t > this.runTime) {
                        return {
                                x: p3.x,
                                y: p3.y
                        }
                }
                return r;
        };
        
        function cmr_spline(a, b, c, d, t)
        {
                return (0.5*((d-3.0*c+3.0*b-a)*t*t*t+(-d+4.0*c-5.0*b+2.0*a)*t*t+(c-a)*t+2.0*b));
        }
        
        ns.Writer.prototype.getPosition = function(dt) {
                var i;
                for (i = 1; i < this.path.length-1; i++) {//find the points
                        if (this.path[i].t >= dt) {
                                break;
                        }
                }
                return i;  
        }
        
        
} (window.cx))