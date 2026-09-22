import {WebSocketServer} from "ws";

import {ClientQuery} from "./db.cjs";

var id = 0;

const wss = new WebSocketServer({port:8080})

const clients = new Map()

const queries = new Map()

// SEND A CODE AS WELL TO FLAG WHAT YOU WANT TO DO !!!

wss.on('connection', function connection(ws) {
    
    clients.set(id, ws);
    queries.set(id, new ClientQuery(id));
    id++;
    
    ws.on('message', function message(data) {
        console.log('received %s', data);
    
        const sentData = JSON.parse(data);
        var recipientID = sentData["recipientID"];
        var message1 = sentData["text"];

    clients.get(recipientID).send(message1);

    });

});
wss.on()

class ClientBridge {

}

class Client {
    #id;
    constructor(id) {
        this.#id = id;

        // temp until i figure out a way of doing this better !!!
        this.receivedKey = 0;

    }
    getId() {
        return this.#id;
    }

    diffieHellman(friendId, contents) {
        // SESSION KEY GENERATION
        // automatic when friend req has been accepted???
        // if session key does NOT exist already
        
        // "flag" is temp for a code i'll later sub in
        // IT WILL ALWAYS BE THE FIRST ITEM PLACED IN / JSON ATTR.
        // here it starts DH on the other client
        socket.send(flag);
        
        // no need to send this flag if the client has been told to DH
        
        // look into fetch and async!!!!

        // AGREE ON A SHARED KEY FOR ENCRYPTION OF PUBLIC KEYS ??

        const power = randomInt(0, p - 1);
        const publicKey = this.modPow(b, power, p);
        
        const privateKey = this.modPow(fetchedKey, power, p);

        return privateKey;

    }
    
    modPow(base, exponent, p) {
        // check if this works..
        var exponent = exponent.toString(2);
        let length = exponent.length() - 1;   
        var value = base;
        for (let b = 0; b ++; b <= length) {
            bit = exponent[b];
            if (bit === "0") {
                value = (value ** 2) % p;
            } else {
                value = ((value ^ 2) << 1) % p;
            };
        };

        return value;
    }
    }

// when a client logs into the app for the first time, a websocket is opened containing the login info of the user as a list
// password is hashed
// entry with user info is searched for within db
// failure to find it results in error message and closure of socket
// success adds the websocket to clients until app is closed and connection is terminated
// user receives information and instance of the query object is added here for further user interaction