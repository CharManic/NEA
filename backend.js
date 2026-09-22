const socket = new WebSocket('ws://localhost:8080');


import {randomInt} from "crypto-js";
// IMPORT DH PARAMS !!!

const thing = {
    "senderID": 1,
    "recipientID": 0
};

thing.text = "hello alice";

socket.addEventListener('open', (event) => {
    socket.send(JSON.stringify(thing));
});

socket.addEventListener ('message', (event1) => {
    console.log('received %s', event1.data);
     
    // receiving key stuff
    // if flag = some value
    clientObject.privateKey = event1.data;
});


// this should really go on the websockets file + get imported in!!
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

    // finding another user (message sending):
    // send over a userId and a number/code: this tells the server what to do
    // from there, find the other user's ws connection
    // 


// for the minute assume everything has been opened and that user has access to the db and ws