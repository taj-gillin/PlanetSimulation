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
var Planet = /** @class */ (function () {
    function Planet(color, position, velocity, mass) {
        this.acceleration = [0, 0];
        this.radius = 10;
        this.color = color;
        this.position = position;
        this.velocity = velocity;
        this.mass = mass;
    }
    Planet.prototype.update = function () {
        this.velocity[0] += this.acceleration[0];
        this.velocity[1] += this.acceleration[1];
        this.position[0] += this.velocity[0] * dt;
        this.position[1] += this.velocity[1] * dt;
    };
    Planet.prototype.draw = function () {
        context.fillStyle = "rgb(" + this.color.r + "," + this.color.g + "," + this.color.b + ")";
        context.beginPath();
        context.arc(this.position[0], this.position[1], this.radius, 0, Math.PI * 2);
        context.fill();
    };
    return Planet;
}());
var BlackHole = /** @class */ (function (_super) {
    __extends(BlackHole, _super);
    function BlackHole(position, velocity, mass) {
        var _this = _super.call(this, { r: 159, g: 43, b: 104 }, position, velocity, mass) || this;
        _this.radius = 20;
        return _this;
    }
    BlackHole.prototype.update = function () {
        this.velocity = [0, 0];
    };
    return BlackHole;
}(Planet));
//Init variables
var Planets = [new Planet({ r: 0, g: 255, b: 0 }, [canvy.width * 5 / 12, canvy.height / 2], [0, 1], 5000), new Planet({ r: 0, g: 0, b: 255 }, [canvy.width * 7 / 12, canvy.height / 2], [0, -1], 5000)];
var dt = 1;
//Generic functions
function clearCanvas() {
    context.fillStyle = 'rgba(0, 0, 0)';
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
        Planets[i].update();
    }
}
function draw() {
    clearCanvas();
    for (var i = 0; i < Planets.length; i++) {
        Planets[i].draw();
    }
}
