//Init canvas
var canvy: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
var context: CanvasRenderingContext2D = canvy.getContext("2d");
context.canvas.width = window.innerWidth;
context.canvas.height = window.innerHeight;


//Init types and classes
type Color = {
    r: number;
    g: number;
    b: number;
}

class Planet {
    color: Color;
    position: [number, number];
    velocity: [number, number];
    acceleration: [number, number] = [0, 0];
    mass: number;
    radius: number = 10;

    constructor(color: Color, position: [number, number], velocity: [number, number], mass: number) {
        this.color = color;
        this.position = position;
        this.velocity = velocity;
        this.mass = mass;
    }
    update() {
        this.velocity[0] += this.acceleration[0];
        this.velocity[1] += this.acceleration[1];
        this.position[0] += this.velocity[0] * dt;
        this.position[1] += this.velocity[1] * dt;
    }
    draw() {
        context.fillStyle = "rgb(" + this.color.r + "," + this.color.g + "," + this.color.b + ")";
        context.beginPath();
        context.arc(this.position[0], this.position[1], this.radius, 0, Math.PI * 2);
        context.fill();
    }
}

class BlackHole extends Planet {
    constructor(position: [number, number], velocity: [number, number], mass: number) {
        super({r:159, g: 43, b:104}, position, velocity, mass);
        this.radius = 20;
    }
    update(): void {
        this.velocity = [0, 0];
    }
}


//Init variables
var Planets: Array<Planet> = [new Planet({ r: 0, g: 255, b: 0 }, [canvy.width * 5/12, canvy.height / 2], [0, 1], 5000), new Planet({ r: 0, g: 0, b: 255 }, [canvy.width * 7/12, canvy.height / 2], [0, -1], 5000)];
const dt = 1;

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
