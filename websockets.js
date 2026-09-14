import {WebSocketServer} from "ws";

var id = 0;

const wss = new WebSocketServer({port:8080})

const clients = new Map()

const queries = new Map()

wss.on('connection', function connection(ws) {
    
    clients.set(id, ws);
    id++;
    
    ws.on('message', function message(data) {
    console.log('received %s', data);
    
    const sentData = JSON.parse(data);
    var recipientID = sentData["recipientID"];
    var message1 = sentData["text"];
    
    clients.get(recipientID).send(message1);

    });

});


// when a client logs into the app for the first time, a websocket is opened containing the login info of the user as a list
// password is hashed
// entry with user info is searched for within db
// failure to find it results in error message and closure of socket
// success adds the websocket to clients until app is closed and connection is terminated
// user receives information and instance of the query object is added here for further user interaction