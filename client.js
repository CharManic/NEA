const socket = new WebSocket('ws://localhost:8080');

import {Queue, Stack} from "./data-structs.js";

import crypto from "crypto-js";

import {id} from "./index.js";
// IMPORT DH PARAMS !!!


socket.addEventListener('open', (event) => {
    
    // fetching params
    socket.send({
        code: 111,
        senderId: this.getId()
    })

});

// any communications received by the client is caught here and dealt with
socket.addEventListener ('message', (sentData) => {
    console.log('received %s', event1.data);
     const sentData = JSON.parse(data);
    var code = sentData.code;

    if (code === 110) {
        clientObject.p = sentData.prime;
        clientObject.b = sentData.base;
    }

    if (code === 111) {
        clientObject.keyGeneration(sentData.recipientId, sentData.reqReceived);
    };

    if (code === 112) {
        clientObject.fetchedKey = sentData.publicKey;
    };

    if (code === 115) {
        clientObject.friendReqs = sentData.reqs;
    };
    
    if (code === 116) {
        clientObject.recentChats = [sentData.recentUsers, sentData.recentMessages, sentData.lastSender];
    }


});

class Client {
    #id;
    constructor(id) {

        this.#id = id;
        
        this.fetchedKey;
        this.p;
        this.b;

        // for eventloop
        this.INTERVAL = 50000;
        this.previousTimestamp = Date.now();
        
        // vvv set this AFTER authenticating!
        this.timeout = setTimeout(this.eventLoop(Date.now()), this.INTERVAL);
        

        // what is needed by a notification?
        // perhaps we need a notif table
        // ugh why is this so complicated

        this.notifications = Stack(20);
        this.chatQueue = Stack(100);
        this.actionsOnHold = Queue(10);
    }
    
    getId() {
        return this.#id;
    }

    setId(pId) {
        this.#id = pId; 
    }

    async socketCall(data) {
        socket.send(JSON.stringify(data));
    }

    async keyGeneration(friendId, reqReceived) {
        // SESSION KEY GENERATION
        // automatic when friend req has been accepted???
        // if session key does NOT exist already
        
        // starts DH on the other client
        if (reqReceived) {
            await this.socketCall({
                code: 111,
                senderId: this.getId(),
                recipientId: friendId
            });
        };


        let isValid = false;
        let power = 0;
            while (!isValid) {
                power = BigInt("0x" + crypto.randomBytes(256).toString("hex"));
                if (power < p) {
                    isValid = true;
                };
            };

        let publicKey = this.modPow(b, power, p);
        
        await this.socketCall({
            code: 112,
            senderId: this.getId(),
            recipientId: friendId,
            key: publicKey
        });

        let privateKey = this.modPow(this.fetchedKey, power, p);
        let hash = createHash("sha3-256");
        hash.update(privateKey).digest("hex");
        
        // extremely bad practice im sorry it has to be done
        await this.socketCall({
            code: 117,
            senderId: this.getId(),
            recipientId: friendId,
            key: privateKey
        });
        // no need to send this flag if the client has been told to DH
        
        // look into fetch and async!!!!

        // AGREE ON A SHARED KEY FOR ENCRYPTION OF PUBLIC KEYS ??
    }
    
    async encrypt(message, pSessionKey, iv) {
        const cipher = crypto.createCipheriv("aes-256-gcm", pSessionKey, iv);
        encryptedMessage = cipher.update(message);
        encryptedMessage += cipher.final();
        return encryptedMessage;
    }

    async decrypt(encryptedMessage, pSessionKey, iv) {
        const cipher = crypto.createCipheriv("aes-256-gcm", pSessionKey, iv);
        decryptedMessage = cipher.decrypt(encryptedMessage);
        return decryptedMessage;
    }


    async sendMessage(friendId, message) {        
        
        // EDIT : THIS METHOD MIGHT NOT WORK WITH NODE CRYPTO MODULE
        var iv = crypto.lib.WordArray(16);
        
        encryptedMessage = encrypt(message, sessionKey, iv)
        
        await this.socketCall({
            code: 113,
            senderId: this.getId(),
            recipientId: friendId,
            message: encryptedMessage,
            iv: iv
        });

        // NOTE: crypto js requires an IV (16-bit number) when encrypting w/ aes:
        // this does NOT need to be secret and can be transferred w/ the ciphertext
        // each message in the database will have an IV stored with it !!!!!!!
        
        
        // we'll have another method for retrieving the sessionkey

        // for now we're storing non-encrypted session keys on the 
        // .env file which would not mean we have TRUE E2EE but it's close enough


    }

    modPow(base, exponent, p) {
        
        exponent = exponent.toString(2);
        let length = exponent.length - 1;   
        let value = base;
        for (let b = 0; b <= length; b++) {
            let bit = exponent[b];
            if (bit === "0") {
                value = (value ** 2n) % p;
            } else {
                value = (((value ** 2n) % p) * base) % p;
            };
        };

        return value;
    }
    
    eventLoop(timestamp) {
        if (this.previousTimestamp == 0) {
            this.checkForRecentReqs();
            this.checkForRecentChats();
        };

    }

    async sendFriendReq() {
        // general friend req - this is also used to accept reqs too!
        await this.socketCall({
            code: 114,
            senderId: this.getId(),
            recipientId: friendId,
        });

    }

    async checkForRecentReqs() {
        // friend reqs
        await this.socketCall({
            code: 115,
            senderId: this.getId(),
            recipientId: friendId,
            earliestDate: this.previousTimestamp
        });

        // slight oversight here - perhaps in the future i can make a sep menu
        // as opposed to simply pushing all of them onto the stack
        if (this.friendReqs) {
            this.notifications.push();
        };

    }  

    async checkForRecentMessages() {
        await this.socketCall({
            code: 116,
            senderId: this.getId()
        });

        // first time loading up the site, just go add everyone there
        if (this.chatQueue.length === 0) {
            let chatUser = document.getElementById("template-chat");
            let chatContainer = document.getElementById("chat-list");
            let messagePreviewSender

            for (let i = 0; i < 10; i ++) {
                var cloneChat = document.importNode(chatUser);
                cloneChat.getElementById("username").innerHTML = this.recentChats[0][i];
                
                // you sent the last message
                if (this.recentChats[1][i].user_id === this.getId()) {
                    messagePreviewSender = "You: ";
                } 
                
                // figure out updating this LATER for now go let users register their accounts !!!
                // other person sent the last message
                else {

                    // figure this out !!!
                    // message, key, iv
                    messagePreviewSender = `${this.recentChats[0][i]}: ${this.decrypt(recentChats[1][i].message, recentChats[1][i].iv)}`;
                };
                
                cloneChat.getElementById("message-preview").innerHTML = `${messagePreviewSender}${this.recentChats[1][i].message}`;

            }
        } else {

        };
    }

    // finally getting into some concrete web changes here
    

    
}


    // finding another user (message sending):
    // send over a userId and a number/code: this tells the server what to do
    // from there, find the other user's ws connection
    // 


// for the minute assume everything has been opened and that user has access to the db and ws#

// EVENT LOOP
// EVERY x seconds, get the "previous" timestamp and run a function
// CHECK FOR:
// FRIEND REQS
// MESSAGES

// return stuff as notifications if so!


clientObject = Client(id);

