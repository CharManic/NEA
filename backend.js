const socket = new WebSocket('ws://localhost:8080');


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
});

// for the minute assume everything has been opened and that user has access to the db and ws