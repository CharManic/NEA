const mysql = require("mysql2");


// ask: do i need user accs if they're not necessarily able to edit it???
// if so, what permissions?
let connection = mysql.createConnection({
    "host": "localhost",
    "user": "root",
    "password": "albatross"

});

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

    /** Returns list of friends that a user has. */
    getFriendsList() {
        const query = 'SELECT friend_id FROM friends WHERE user_id = ? UNION SELECT user_id FROM friends WHERE friend_id = ?';
        connection.query(query, [getId()], (err, results) => {
            if (err) throw err;
            console.log(results);
        });
    }
    




}

// possible queries:
// friends list: