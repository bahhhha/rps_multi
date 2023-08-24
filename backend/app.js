const app = require('express');
const randomstring = require('randomstring');
const cors = require('cors')

const WebSocket = require('ws');

const express = app();
express.use(cors())
const server=express.listen(4000,()=>{
    console.log("server started at http://localhost:4000");
})

// express.use(app.static('public'));
const ws = new WebSocket.Server({ server });

//ALL player info
let players={};


//GAME VARIABLES
let choice1=""
let choice2="";

express.get('/api/rooms', (req, res) => {
    res.json(players);
});

ws.on("connection",(socket)=>{
    console.log("connection established");
    //новая игровая сессия

    socket.on('message', (message) => {
        try {
            const event = JSON.parse(message);
            console.log(event.event)
            if (event.event === "createGame") {
                const playerName = event.data;
                const roomID = randomstring.generate({ length: 4 });
                socket.roomID = roomID; // Assign room ID to the socket
    
                if (!players[roomID]) {
                    players[roomID] = { players: [] };
                }

                socket.send(JSON.stringify({ event: 'newGame', roomID: roomID, playerName }));
            }
            if (event.event === "joinGame") {
                const data = JSON.parse(event.data)
                const roomID = data.roomID;
                const name = data.name;
                players[roomID].players.push(name);

                if (players[roomID].players.length === 1) {
                    players[roomID].player1 = name;
                    socket.send(JSON.stringify({ event: 'player1Joined', data: { p2name: name, p1name: players[roomID].player1 } }));
                } else {
                    players[roomID].player2 = name;
                    socket.send(JSON.stringify({ event: 'player2Joined', data: { p2name: name, p1name: players[roomID].player1 } }));
                    ws.clients.forEach(client => {
                    if (client !== socket && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ event: 'player2Joined', data: { p2name: name, p1name: players[roomID].player1 } }));
                    }
                    });
                }
            }
            
            if (event.event === "choice1") {
                const data = JSON.parse(event.data)
                choice1 = data.choice;
                if (choice2 != "") {
                    result(data.roomID);
                }
            }

            if (event.event === "choice2") {
                const data = JSON.parse(event.data)
                choice2 = data.choice;
                if (choice1 != "") {
                    result(data.roomID);
                }
            }
            
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    const result=(roomID)=> {
        const winner = getWinner(choice1, choice2);
        ws.clients.forEach(client => {
            if (client.room === roomID) {
                const payload = JSON.stringify({
                    event: 'result',
                    data: {
                        winner: winner
                    }
                });
                client.send(payload);
            }
        });
        choice1 = "";
        choice2 = "";
    }

})

const getWinner=(p, c)=>  {
    if (p === c) {
        return "draw";
    } else if (p === "rock") {
        if (c === "spells") {
            return "spells";
        } else {
            return "rock";
        }
    } else if (p === "spells") {
        if (c === "blade") {
            return "blade";
        } else {
            return "spells";
        }
    } else if (p === "blade") {
        if (c === "rock") {
            return "rock";
        } else {
            return "blade";
        }
    }
}