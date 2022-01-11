//Init canvas
var canvy: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
var context: CanvasRenderingContext2D = canvy.getContext("2d");
context.canvas.width = window.innerWidth;
context.canvas.height = window.innerHeight;
context.lineWidth = 5;
context.strokeStyle = 'rgba(255, 0, 0, 0.05)';



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
    path: Path2D = new Path2D();

    constructor(color: Color, position: [number, number], velocity: [number, number], mass: number) {
        this.color = color;
        this.position = position;
        this.velocity = velocity;
        this.mass = mass;
        this.path.moveTo(position[0], position[1]);
    }
    update() {
        this.velocity[0] += this.acceleration[0] * dt;
        this.velocity[1] += this.acceleration[1] * dt;
        this.position[0] += this.velocity[0] * dt;
        this.position[1] += this.velocity[1] * dt;

        this.acceleration = [0, 0];
    }
    draw() {
        this.path.lineTo(this.position[0], this.position[1]);
        context.stroke(this.path);


        context.fillStyle = "rgb(" + this.color.r + "," + this.color.g + "," + this.color.b + ")";
        context.beginPath();
        context.arc(this.position[0], this.position[1], this.mass/50, 0, Math.PI * 2);
        context.fill();

    }
}

class BlackHole extends Planet {
    constructor(position: [number, number], mass: number) {
        super({ r: 159, g: 43, b: 104 }, position, [0, 0], mass);
    }
    update(): void {
        return;
    }
}


//Init variables
var Planets: Array<Planet> = [];

Planets.push(new Planet({ r: 0, g: 255, b: 0 }, [canvy.width / 2 - 300, canvy.height / 2], [0, 3], 500));
Planets.push(new Planet({ r: 0, g: 0, b: 255 }, [canvy.width / 2 + 300, canvy.height / 2], [0, -3], 500));
// Planets.push(new BlackHole([canvy.width/2, canvy.height/2], 800));

const initV = 1;
Planets.push(new Planet({ r: 255, g: 0, b: 0 }, [canvy.width / 2 + 150, canvy.height / 2 + 0], [0, initV], 500));
Planets.push(new Planet({ r: 255, g: 0, b: 0 }, [canvy.width / 2 - 150, canvy.height / 2 + 0], [0, -initV], 500));
Planets.push(new Planet({ r: 255, g: 0, b: 0 }, [canvy.width / 2 + 0, canvy.height / 2 + 150], [-initV, 0], 500));
Planets.push(new Planet({ r: 255, g: 0, b: 0 }, [canvy.width / 2 + 0, canvy.height / 2 - 150], [initV, 0], 500));


const dt: number = 0.1;
var simulationRate: number = 20;

//Generic functions
function clearCanvas() {
    context.fillStyle = 'rgba(0, 0, 0, 0.2)';
    context.fillRect(0, 0, canvy.width, canvy.height);

}

//Start animation loop
setInterval(animate, 1000 / 60);

function animate() {
    for (let i = 0; i < simulationRate; i++) {
        update();
    }
    draw();
    console.log(simulationRate)
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
canvy.addEventListener("click", (e) => {
    simulationRate++;
});


function combinePlanets(p1: Planet, p2: Planet) {
    var newMass: number = p1.mass + p2.mass;
    var newVelocity: [number, number] = [(p1.velocity[0] * p1.mass + p2.velocity[0] * p2.mass) / newMass, (p1.velocity[1] * p1.mass + p2.velocity[1] * p2.mass) / newMass];
    var newPosition: [number, number] = [p1.position[0], p1.position[1]];
    var newPlanet = new Planet({ r: Math.floor(Math.random() * 255), g: Math.floor(Math.random() * 255), b: Math.floor(Math.random() * 255) }, newPosition, newVelocity, newMass);
    Planets.push(newPlanet);
    Planets.splice(Planets.indexOf(p1), 1);
    Planets.splice(Planets.indexOf(p2), 1);
}