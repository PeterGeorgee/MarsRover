class Coordinates{
    constructor(x,y){
        this.x=x;
        this.y=y;
    }
}

class State{
    
}

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


app.get('/performInstructions',performInstructions);
app.get('/operationF', async () => {await myRover.moveForward();});
app.get('/operationB', async () => {await myRover.moveBackward(); });
app.get('/operationR', async () => {await myRover.turnRight();});
app.get('/operationL', async () => {await myRover.turnLeft();});


async function performInstructions(req, res) {
    const instructions = req.query.instructions;

    for await(const element of instructions) {
        let endpoint = `/operation${element}`;
        const options={
            hostname: 'localhost',
            port: 8080,
            path: endpoint,
            agent: false,
        }
        http.get(options, async res => {
            console.log("hi there");
        });
    }

    setTimeout(()=>{
        res.send({
            'coordinates': `(${myRover.s.c.x}, ${myRover.s.c.y}) ${myRover.s.label}`,
        });
    },"9000")
}




app.post('/errors', (req, res) => {
    console.log(req.body)
    res.send()
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})