var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
//Init canvas
var canvy = document.getElementById("canvas");
var context = canvy.getContext("2d");
context.canvas.width = window.innerWidth;
context.canvas.height = window.innerHeight;
context.lineWidth = 5;
context.strokeStyle = 'rgba(255, 0, 0, 0.05)';
var Planet = /** @class */ (function () {
    function Planet(color, position, velocity, mass) {
        this.acceleration = [0, 0];
        this.radius = 10;
        this.path = new Path2D();
        this.color = color;
        this.position = position;
        this.velocity = velocity;
        this.mass = mass;
        this.path.moveTo(position[0], position[1]);
    }
    Planet.prototype.update = function () {
        this.velocity[0] += this.acceleration[0];
        this.velocity[1] += this.acceleration[1];
        this.position[0] += this.velocity[0] * dt;
        this.position[1] += this.velocity[1] * dt;
    };
    Planet.prototype.draw = function () {
        this.path.lineTo(this.position[0], this.position[1]);
        context.stroke(this.path);
        context.fillStyle = "rgb(" + this.color.r + "," + this.color.g + "," + this.color.b + ")";
        context.beginPath();
        context.arc(this.position[0], this.position[1], this.radius, 0, Math.PI * 2);
        context.fill();
    };
    return Planet;
}());
var BlackHole = /** @class */ (function (_super) {
    __extends(BlackHole, _super);
    function BlackHole(position, mass) {
        var _this = _super.call(this, { r: 159, g: 43, b: 104 }, position, [0, 0], mass) || this;
        _this.radius = 20;
        return _this;
    }
    BlackHole.prototype.update = function () {
        return;
    };
    return BlackHole;
}(Planet));
//Init variables
var Planets = [];
Planets.push(new Planet({ r: 0, g: 255, b: 0 }, [canvy.width / 2 - 150, canvy.height / 2], [0, 1.5], 5000));
Planets.push(new Planet({ r: 0, g: 0, b: 255 }, [canvy.width / 2 + 150, canvy.height / 2], [0, -1.5], 5000));
// Planets.push(new BlackHole([canvy.width/2, canvy.height/2], 800));
var dt = 1;
//Generic functions
function clearCanvas() {
    context.fillStyle = 'rgba(0, 0, 0, 0.2)';
    context.fillRect(0, 0, canvy.width, canvy.height);
}
//Start animation loop
setInterval(animate, 1000 / 60);
function animate() {
    update();
    draw();
}
function update() {
    for (var i = 0; i < Planets.length; i++) {
        for (var j = 0; j < Planets.length; j++) {
            if (j != i) {
                var dx = Planets[j].position[0] - Planets[i].position[0];
                var dy = Planets[j].position[1] - Planets[i].position[1];
                var d = Math.sqrt(dx * dx + dy * dy);
                var F = (Planets[i].mass * Planets[j].mass) / (d * d);
                var a = F / Planets[i].mass;
                Planets[i].acceleration[0] = a * dx / d;
                Planets[i].acceleration[1] = a * dy / d;
            }
        }
    }
    for (var i = 0; i < Planets.length; i++) {
        Planets[i].update();
    }
}
function draw() {
    clearCanvas();
    for (var i = 0; i < Planets.length; i++) {
        Planets[i].draw();
    }
}
//Mouse click
canvy.addEventListener("click", function (e) {
    dt += 0.1;
    // for (let i = 0; i < 10; i++) {
    //     Planets.push(new Planet({ r: Math.random() * 256, g: Math.random() * 256, b: Math.random() * 256 }, [Math.random() * canvy.width, Math.random() * canvy.height], [0, 0], Math.random() * 10000 + 2000))
    // }
});
