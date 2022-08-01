class Coordinates {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class State {

}

let globalObstacles = []


class Stopped extends State {
    c = new Coordinates();
    label = '';

    constructor(c, l) {
        super();
        this.c = c;
        this.label = `${l} Stopped`
    }

    async moveForward() {
        return this;
    }

    async moveBackward() {
        return this;
    }

    async turnLeft(c) {
        return this;
    }

    async turnRight(c) {
        return this;
    }
}

class North extends State {
    c = new Coordinates(0,0);
    label = 'North';

    constructor(c) {
        super();
        this.c = c;
    }

    async moveForward() {
        for await(const obstacle of globalObstacles) {
            // console.log(this.c.y);
            if (obstacle[1] == this.c.y + 1 && obstacle[0]==this.c.x) {
                return new Stopped(this.c, this.label);
            }
        }
        this.c.y++;
        return new North(this.c);
    }

    async moveBackward() {
        // this.c.y--;
        for await(const obstacle of globalObstacles) {
            if (obstacle[1] == this.c.y - 1 && obstacle[0]==this.c.x) {
                return new Stopped(this.c, this.label);
            }
        }
        this.c.y--;
        return new North(this.c);
    }

    turnLeft(c) {
        return new West(this.c);
    }

    turnRight(c) {
        return new East(this.c);
    }
}

class South extends State {
    c = new Coordinates(0, 0);
    label = 'South';

    constructor(c) {
        super();
        this.c = c;
    }

    async moveForward() {
        // this.c.y--;
        for await(const obstacle of globalObstacles) {
            if (obstacle[1] == this.c.y - 1 && obstacle[0]==this.c.x) {
                return new Stopped(this.c, this.label);
            }
        }
        this.c.y--;
        return new South(this.c);
    }

    async moveBackward() {
        // this.c.y++;
        for await(const obstacle of globalObstacles) {
            if (obstacle[1] == this.c.y + 1 && obstacle[0]==this.c.x) {
                return new Stopped(this.c, this.label);
            }
        }
        this.c.y++;
        return new South(this.c);
    }

    turnLeft(c) {
        return new East(this.c);
    }

    turnRight(c) {
        return new West(this.c);
    }
}

class East extends State {
    c = new Coordinates(0, 0);
    label = 'East';

    constructor(c) {
        super();
        this.c = c;
    }

    async moveForward() {
        console.log("entered Forward East");
        // this.c.x++;
        for await(const obstacle of globalObstacles) {
            if (obstacle[0] == this.c.x + 1 && obstacle[1]==this.c.y) {
                return new Stopped(this.c, this.label);
            }
        }
        this.c.x++;
        return new East(this.c);
    }

    async moveBackward() {
        // this.c.x--;
        for await(const obstacle of globalObstacles) {
            if (obstacle[0] == this.c.x - 1 && obstacle[1]==this.c.y) {
                return new Stopped(this.c, this.label);
            }
        }
        this.c.x--;
        return new East(this.c);
    }

    turnLeft(c) {
        return new North(this.c);
    }

    turnRight(c) {
        return new South(this.c);
    }
}

class West extends State {
    c = new Coordinates(0, 0);
    label = 'West';

    constructor(c) {
        super();
        this.c = c;
    }

    async moveForward() {
        // this.c.x--; [0,1]
        for await(const obstacle of globalObstacles) {
            if (obstacle[0] == this.c.x - 1 && obstacle[1]==this.c.y) {
                return new Stopped(this.c, this.label);
            }
        }
        this.c.x--;
        return new West(this.c);
    }

    async moveBackward() {
        // this.c.x++;
        for await(const obstacle of globalObstacles) {
            if (obstacle[0] == this.c.x + 1 && obstacle[1]==this.c.y) {
                return new Stopped(this.c, this.label);
            }
        }
        this.c.x++;
        return new West(this.c);
    }

    turnLeft(c) {
        return new South(this.c);
    }

    turnRight(c) {
        return new North(this.c);
    }
}

class Rover {
    c = new Coordinates(0, 0)
    s = new North(this.c);

    async moveForward() {
        this.s = await this.s.moveForward();
    }

    async moveBackward() {
        this.s = await this.s.moveBackward();
    }

    async turnLeft() {
        this.s = this.s.turnLeft();       
    }

    async turnRight() {
        this.s = this.s.turnRight();       
    }
}

myRover = new Rover();


const express = require('express')
const bodyParser = require('body-parser')

let http = require('http');

const app = express()
const port = process.env.PORT || 8080
app.use(bodyParser.json())


app.get('/performInstructions', performInstructions);
app.get('/operationF', async () => { await myRover.moveForward(); });
app.get('/operationB', async () => { await myRover.moveBackward(); });
app.get('/operationR', async () => { await myRover.turnRight(); });
app.get('/operationL', async () => { await myRover.turnLeft(); });

async function performInstructions(req, res) {
    const instructions = req.query.instructions;
    const o = req.body.obstacles;
    globalObstacles = o;

    for (const element of instructions) {
            let endpoint = `/operation${element}`;
        
            const options = {
                hostname: 'localhost',
                port: 8080,
                path: endpoint,
                agent: false,
                json: true,
            }
            http.get(options, (res) => {
            });   
    }

    setTimeout(() => {
        res.send({
            'coordinates': `(${myRover.s.c.x}, ${myRover.s.c.y}) ${myRover.s.label}`,
        });
    }, "9000")
}



app.post('/errors', (req, res) => {
    console.log(req.body)
    res.send()
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})