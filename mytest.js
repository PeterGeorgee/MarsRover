class Coordinates{
    constructor(x,y){
        this.x=x;
        this.y=y;
    }
}

class State{
    
}

obstacle=new Coordinates(2,0);

class North extends State{
    c=new Coordinates();
    label='North';

    constructor(c){
        super();
        this.c=c;
    }
    
    async moveForward() {
        this.c.y++;
        return this.c;
    }
    
    async moveBackward() {
        this.c.y--;
        return this.c;
    }

    async turnLeft(c) {
        return new West(this.c);
    }

    async turnRight(c) {
        return new East(this.c);
    }
}

class South extends State{
    c=new Coordinates(0,0);
    label='South';

    constructor(c){
        super();
        this.c=c;
    }

    async moveForward() {
        this.c.y--;
        return this.c;
    }

    async moveBackward() {
        this.c.y++;
        return this.c;
    }

    async turnLeft(c) {
        return new East(this.c);
    }

    async turnRight(c) {
        return new West(this.c);
    }
}

class East extends State{
    c=new Coordinates(0,0);
    label='East';

    constructor(c){
        super();
        this.c=c;
    }
    
    async moveForward() {
        this.c.x++;
        return this.c;
    }
    
    async moveBackward() {
        this.c.x--;
        return this.c;
    }

    async turnLeft(c) {
        return new North(this.c);
    }
    
    async turnRight(c) {
        return new South(this.c);
    }
}

class West extends State{
    c=new Coordinates(0,0);
    label='West';
    
    constructor(c){
        super();
        this.c=c;
    }
    
    async moveForward() {
        this.c.x--;
        return this.c;
    }
    
    async moveBackward() {
        this.c.x++;
        return this.c;
    }
    
    async turnLeft(c) {
        return new South(this.c);
    }
    
    async turnRight(c) {
        return new North(this.c);
    }
}

class Rover{
    c = new Coordinates(0,0)
    s=new North(this.c);

    async moveForward() {
        this.s.c = await this.s.moveForward();
        console.log(this.s);
    }

    async moveBackward() {
        this.s.c = await this.s.moveBackward();
        console.log(this.s);
    }

    async turnLeft() {
        this.s = await this.s.turnLeft();
        console.log(this.s);
    }

    async turnRight() {
        this.s = await this.s.turnRight();
        console.log(this.s);
    }
}

myRover = new Rover();


const express = require('express')
const bodyParser = require('body-parser')

let http = require('http');

const app = express()
const port = process.env.PORT || 8080
app.use(bodyParser.json())


app.post('/performInstructions',performInstructions);
app.get('/operationF', async () => {console.log("called");await myRover.moveForward();console.log("hey")});
app.get('/operationB', async () => {console.log("called");await myRover.moveBackward(); console.log("hey")});
app.get('/operationR', async () => {console.log("called");await myRover.turnRight();console.log("hey")});
app.get('/operationL', async () => {console.log("called");await myRover.turnLeft();console.log("hey")});


async function performInstructions(req, res) {
    const instructions = req.query.instructions;

    for await(const element of instructions) {
            console.log(`Performing: ${element}`);
            test = `/operation${element}`;
            console.log(test);
            let endpoint = `/operation${element}`;
            // let options={
            //     hostname: 'localhost',
            //     port: 8080,
            //     path: endpoint,
            //     agent: false,
            // }
            http.get({
                hostname: 'localhost',
                port: 8080,
                path: endpoint,
                agent: false,
            }, res => {
            });
    }

    setTimeout(()=>{
        res.send({
            'coordinates': `(${myRover.s.c.x}, ${myRover.s.c.y}) ${myRover.s.label}`,
        });
        console.log("hii");
    },"10000")
}


app.post('/errors', (req, res) => {
    console.log(req.body)
    res.send()
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})