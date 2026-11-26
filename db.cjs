const mysql = require("mysql2");

const fs = require("fs");

// ask: do i need user accs if they're not necessarily able to edit it???
// if so, what permissions?
const connection = mysql.createConnection({
    "host": "localhost",
    "user": "root",
    "password": "albatross"

});

let userId = 0;

// get last message in thread
// += 1 ig

let messageID = 0;
let threadId = 0; 

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");

});

class ClientQuery {
    #id;
    constructor(id) {
        this.#id = id;
    }
    getId() {
        return this.#id;
    }

    createUser(username, digest) {
        // create a new row in the db
        var username = this.getUserNames(username)
        if (username) {
            return("User already exists.")

        } else {
            var query2 = `INSERT INTO users VALUES (?, ?, ?)`;
            connection.query(query2, [userId, username, digest]);
            userId ++;
            return userId;
        }
    }
    checkIfValidUser(username, digest) {
        var query1 = `SELECT user_id, password FROM users WHERE username = ?`;
        var user = connection.query(query1, username);
        
        // temp: change later !
        if (not(user)) {
            return(["User does not exist."]);
        };

        var query2 = `SELECT user_id, username FROM users WHERE user_id = ?, password = ?`;
        var authenticatedUser = connection.query(query2, user.user_id, digest);
        if(not(authenticatedUser)) {
            return(["Incorrect password."]);
        };

        return ([authenticatedUser[0].username, authenticatedUser[0].user_id]);


    }

    getFriendsList() {
        var query = `SELECT username FROM users WHERE user_id IN
                    (SELECT friend_id FROM friends WHERE user_id = ? 
                    UNION SELECT user_id FROM friends WHERE friend_id = ?) 
                    ORDER BY username LIMIT 10`;
        connection.query(query, [this.getId()], (err, results) => {
            if (err) throw err;
            console.log(results);
        });
    }

    getSentFriendRequests() {
        // friend_id here is the person who you've friend requested
        var query = `SELECT username FROM users WHERE user_id IN 
                     (SELECT friend_id FROM friend_requests WHERE user_id = ?) 
                     ORDER BY sent_at LIMIT 5`;
        return connection.query(query, [this.getId()]);
    }

    getReceivedFriendRequests() {
        // friend_id here is the person who has been friend requested (you)
        // will not limit for now as client-side does that too
        var query = `SELECT username, sent_at FROM users WHERE user_id IN 
                     (SELECT user_id FROM friend_requests WHERE friend_id = ?) 
                     ORDER BY sent_at`;
        return connection.query(query, [this.getId()]);
    }

    addFriendRequest(friendId) {
        // check if there is already a record for said request
        // if so ADD FRIEND !!
        var query1 = `SELECT * FROM friend_requests WHERE user_id = ?`;
        if (connection.query(query1, [friendId])) {
            
            var query2 = `DELETE FROM friend_requests WHERE user_id = ? AND friend_id = ?`;
            connection.query(query2, [friendId, this.getId()]);

            var query3 = `INSERT INTO friends VALUES(?, ?)`;
            connection.query(query3, [this.getId(), friendId].sort());
            // make a new thread??

            var query4 = `INSERT INTO threads VALUES(?, ?)`;
            connection.query(query4, [threadId, Date.now()]);

            var query5 = `INSERT INTO thread_members VALUES(?, ?), (?, ?)`;
            connection.query(query5, [threadId, this.getId(), threadId, friend_id]);

            this.createThread(this.getId(), friend_id)

            threadId ++;
        } else {
            var query7 = `INSERT INTO friend_requests VALUES(?, ?)`;
            connection.query(query5, [this.getId(), friend_id]);


        };

    }

    getThread(senderId, recipientId) {
        var query = `SELECT thread_id FROM thread_members WHERE user_id = ? 
                    INTERSECT
                    SELECT thread_id FROM thread_members WHERE user_id = ?`;
        return connection.query(query, [senderId, recipientId]); 
    }
    
    createThread(senderId, recipientId) {
        var query1 = `INSERT INTO threads VALUES (?, ?)`;
        var query2 = `INSERT INTO thread_members VALUES (?,?), (?,?)`;
        connection.query(query1, [threadId, Date.now()]);
        connection.query(query2, [threadId, senderId, threadId, recipientId]);
    }
    
    removeThread(senderId, recipientId) {
        var query1 = `DELETE FROM threads WHERE thread_id = ?`;
        
        
        connection.query(query1, [this.getThread()[0].thread_id])
    }

    updateMessages(senderId, recipientId, message, iv) {


        // FIGURE OUT MESSAGE IDS !!!!

        var threadId = this.getThread(senderId, recipientId);
        if (threadId === null) {
                threadId = this.createThread(senderId, recipientId);
            }

        var query = `INSERT INTO messages 
                    VALUES (?, ?, ?, ?, ?)`;
        connection.query(query, [threadId, senderId, messageId, iv, message, Date.now()]);

    }

    getRecentMessages(senderId, recipientId) {
        var query = `SELECT message, userId FROM messages
                     WHERE thread_id = ?
                     ORDER BY message_id DESC
                     LIMIT 5`;
        return (connection.query(query, [this.getThread(senderId, recipientId)]));
    }


    // gonna iterate this query here in case any new messages come in ????

    getLastMessageAndSender(senderId, recipientId) {
        var query = `SELECT message, user_id, iv FROM messages
                     JOIN thread_members ON thread_members.thread_id = messages.message_id
                     WHERE thread_id IN ?
                     ORDER BY message_id DESC
                     LIMIT 1`;
        return (connection.query(query, [this.getThread(senderId, recipientId)]));
    }
    
    // for area on site on the left of the screen - list of chats!!
    getRecentChatUser(senderId) {
        var threads = getThread(senderId, "%")
        var query = `SELECT user_id FROM thread_members
                     JOIN messages ON thread_members.thread_id = messages.thread_id
                     WHERE user_id <> ? AND thread_id IN ?
                     ORDER BY sent_at
                     LIMIT 10`;
        return (connection.query(query, [senderId, threads]));
    }

    getUserNames(userIds) {
        var query = `SELECT username FROM users WHERE user_id IN ?`;
        return (connection.query(query, [userIds]));
    }


    // ARRAY FOR THREAD_ID ????




}

// possible queries:
// friends list: