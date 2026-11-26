import {WebSocketServer} from "ws";

import {ClientQuery} from "./db.cjs";

import crypto from "crypto-js";

import {write, writeFile} from "fs";

// write to files

// IMPORT PARAMS for DH... use multiple .envs ??????


// get vars from .env !!!
const dhPrime = BigInt(process.env.PRIME);
const dhBase = BigInt(process.env.BASE);

const tempws = new WebSocketServer({port:80});

tempws.on('connection', function connection(ws) {

    ws.on("message", function message(data) {
        console.log('received %s', data);
        const sentData = JSON.parse(data);

        // LOGIN
        if (sentData.code === 0) {
            var passwordDigest = crypto.createHash("sha-256").update(sentData.password).digest("hex");
            var userInformation = queries.get(-1).checkIfValidUser(sentData.username, passwordDigest);
           
            // error has occurred !!!!
            if (userInformation.length === 2) {
                ws.send(JSON.stringify({
                    code: 0,
                    id: userInformation[1]
                }));
            } else {
                // error has occurred !!!!
                ws.send(JSON.stringify({
                    code: 0,
                    error: userInformation[0]
                }));
            }
           
            
            // login in + instantiate new client object!!!
        };
        
        // SIGN UP
        if (sentData.code === 1) {
            var passwordDigest = crypto.createHash("sha-256").update(sentData.password).digest("hex");
            var id = queries.get(-1).createUser(sentData.username, sentData.passwordDigest);
            
            if (typeof id !== "number") {
                ws.send(JSON.stringify({
                    code: 1,
                    error: id,
                }));
            } else {
                ws.send(JSON.stringify({
                code: 1,
                id: id,
            }));
            }
        };


    })


});


const wss = new WebSocketServer({port:8080});

const clients = new Map();

// -1 can be the "default" index or something - restrict it?
const queries = new Map();
queries.set(-1, new ClientQuery(id));
// SEND A CODE AS WELL TO FLAG WHAT YOU WANT TO DO !!!

wss.on('connection', function connection(ws) {
    
    clients.set(id, ws);
    queries.set(id, new ClientQuery(id));
    id++;
    
    ws.on('message', function message(data) {
        console.log('received %s', data);
    
        const sentData = JSON.parse(data);
        var code = sentData.code;
        let senderId = sentData.code;

        // DH params
        if (code === 110) {
            sentData.prime = dhPrime;
            sentData.base = dhBase;
            clients.get(senderId).send(JSON.stringify(sentData));
        }

        // DH start
        if (code === 111) {
            let recipientId = sentData.recipientId;
            clients.get(recipientId).send(JSON.stringify(sentData));
    
        };

        // DH keys
        if (code === 112) {
            let recipientId = sentData.recipientId;
            sentData.reqReceived = false;
            clients.get(recipientId).send(JSON.stringify(sentData));
        };

        // send message + log to db + fetch key
        if (code === 113) {
            let message = sentData.message;
            let recipientId = sentData.recipientId;
            clients.get(recipientId).send(JSON.stringify(sentData));

            queries.get(senderId).updateMessages(senderId, recipientId, message, sentData.iv)
        };

        // typical friend req - session key is uploaded as another code !
        if (code === 114) {
            let recipientId = sentData.recipientId;
            
            queries.get(senderId).addFriendRequest(recipientId);

            // creating a thread: initialising DH exchange to generate a session key
            clients.get(senderId).send(JSON.stringify({
                code: 111,
                friendId: recipientId,
                reqReceived: true
            }));

        }

        // check for friend req
        if (code === 115) {
            let reqs = queries.get(senderId).getReceivedFriendRequests();
            let earliestDate = sentData.earliestDate;

            let reqArray = [];

            let counter = 0;
            while (reqs[counter].sent_at > earliestDate) {
                reqArray.push(reqs[counter].userName)
                counter += 1
            };

            clients.get(senderId).send(JSON.stringify({
                code: 115,
                senderId: senderId,
                reqs: reqArray
            }
            ));
        
        // recent messages
        if (code === 116) {
            
            var chats = queries.get(senderId).getRecentChatUser(senderId);
                
            var recentUsernames = queries.get(senderId).getUserNames(chats.map(x => x.user_id));
            var recentMessages = [];

            var sessionKeys = []

            // gets first message + who sent it + iv !!!
            for (i in chats) {
                recentMessages.push(queries.get(senderId).getLastMessageAndSender(senderId, chats[i].user_id));
                sessionKeys.push(process.env[`SESSION_KEY_${queries.get(senderId).getThread(senderId, recentMessages[i].getUserNames)}`])
            }
            
            // on the client side:
            // loop through the chats list
            // clone the template element
            // edit it to add usernames, who sent the recent message, and the first part of the message itself
            // update the site !

            //this may involve a few queries - i may need to look at this again and adjust

            //getting the session key like this is EXTREMELY BAD PRACTICE but i have to do it now ig
            
            clients.get(senderId).send(JSON.stringify({
                code: 116,
                recentUsers: recentUsernames,
                recentMessages: recentMessages,
                sessionKey: sessionKeys
            }));
        }

        if (code === 117) {
            // CHECK THIS !!!
            writeFile(".env", `SESSION_KEY_${queries.get(senderId).getThread(senderId, sentData.recipientId).thread_id}: ${sentData.key}`);
        };

        }

    });

});
wss.on()






// NOTES TO SELF
// SORT NOTIFS 
// SORT LOGIN SCREEN YAY EZ
// CHANGE UI SLIGHTLY