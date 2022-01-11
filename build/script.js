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
        this.path = new Path2D();
        this.color = color;
        this.position = position;
        this.velocity = velocity;
        this.mass = mass;
        this.path.moveTo(position[0], position[1]);
    }
    Planet.prototype.update = function () {
        this.velocity[0] += this.acceleration[0] * dt;
        this.velocity[1] += this.acceleration[1] * dt;
        this.position[0] += this.velocity[0] * dt;
        this.position[1] += this.velocity[1] * dt;
        this.acceleration = [0, 0];
    };
    Planet.prototype.draw = function () {
        this.path.lineTo(this.position[0], this.position[1]);
        context.stroke(this.path);
        context.fillStyle = "rgb(" + this.color.r + "," + this.color.g + "," + this.color.b + ")";
        context.beginPath();
        context.arc(this.position[0], this.position[1], this.mass / 50, 0, Math.PI * 2);
        context.fill();
    };
    return Planet;
}());
var BlackHole = /** @class */ (function (_super) {
    __extends(BlackHole, _super);
    function BlackHole(position, mass) {
        return _super.call(this, { r: 159, g: 43, b: 104 }, position, [0, 0], mass) || this;
    }
    BlackHole.prototype.update = function () {
        return;
    };
    return BlackHole;
}(Planet));
//Init variables
var Planets = [];
Planets.push(new Planet({ r: 0, g: 255, b: 0 }, [canvy.width / 2 - 300, canvy.height / 2], [0, 3], 500));
Planets.push(new Planet({ r: 0, g: 0, b: 255 }, [canvy.width / 2 + 300, canvy.height / 2], [0, -3], 500));
// Planets.push(new BlackHole([canvy.width/2, canvy.height/2], 800));
var initV = 1;
Planets.push(new Planet({ r: 255, g: 0, b: 0 }, [canvy.width / 2 + 150, canvy.height / 2 + 0], [0, initV], 500));
Planets.push(new Planet({ r: 255, g: 0, b: 0 }, [canvy.width / 2 - 150, canvy.height / 2 + 0], [0, -initV], 500));
Planets.push(new Planet({ r: 255, g: 0, b: 0 }, [canvy.width / 2 + 0, canvy.height / 2 + 150], [-initV, 0], 500));
Planets.push(new Planet({ r: 255, g: 0, b: 0 }, [canvy.width / 2 + 0, canvy.height / 2 - 150], [initV, 0], 500));
var dt = 0.1;
var simulationRate = 20;
//Generic functions
function clearCanvas() {
    context.fillStyle = 'rgba(0, 0, 0, 0.2)';
    context.fillRect(0, 0, canvy.width, canvy.height);
}
//Start animation loop
setInterval(animate, 1000 / 60);
function animate() {
    for (var i = 0; i < simulationRate; i++) {
        update();
    }
    draw();
    console.log(simulationRate);
}
function update() {
    for (var i = 0; i < Planets.length; i++) {
        for (var j = 0; j < Planets.length; j++) {
            if (j != i) {
                var dx = Planets[j].position[0] - Planets[i].position[0];
                var dy = Planets[j].position[1] - Planets[i].position[1];
                var d = Math.sqrt(dx * dx + dy * dy);
                if (d < 20) {
                    combinePlanets(Planets[i], Planets[j]);
                    break;
                }
                var F = (Planets[i].mass * Planets[j].mass) / (d * d);
                var a = F / Planets[i].mass;
                Planets[i].acceleration[0] += a * dx / d;
                Planets[i].acceleration[1] += a * dy / d;
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
    simulationRate++;
});
function combinePlanets(p1, p2) {
    var newMass = p1.mass + p2.mass;
    var newVelocity = [(p1.velocity[0] * p1.mass + p2.velocity[0] * p2.mass) / newMass, (p1.velocity[1] * p1.mass + p2.velocity[1] * p2.mass) / newMass];
    var newPosition = [p1.position[0], p1.position[1]];
    var newPlanet = new Planet({ r: Math.floor(Math.random() * 255), g: Math.floor(Math.random() * 255), b: Math.floor(Math.random() * 255) }, newPosition, newVelocity, newMass);
    Planets.push(newPlanet);
    Planets.splice(Planets.indexOf(p1), 1);
    Planets.splice(Planets.indexOf(p2), 1);
}
