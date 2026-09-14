const socket = new WebSocket('ws://localhost:8080');


// thing = {
//     "senderID": 2,
//     "recipientID": ,
// };

// thing.text = "hello alice";

socket.addEventListener('open', (event) => {
    // socket.send(JSON.stringify(text1));
    console.log("hi");
});

socket.addEventListener ('message', (event1) => {
    console.log('received %s', event1.data);
});