// change name please

function init() {
    client = Client();
}

class Client {
    constructor() {
        test.MessageQueue = Queue(5);
    }

    addMessage() {
        message = document.getElementById("message").value;
        if (message === "") {
            return;
        }

        messageQueue.enqueue(message);
        

    }

}


// queue used for temporary message storing when a connection cannot be created
class Queue {
    constructor(pMaxLength) {
        Queue.#front;
        Queue.#rear;
        
        Queue.length = 0;
        Queue.maxLength = pMaxLength;
    }
    
    getFront() {
        return (Queue.#front);

    }

    setFront(pFront) {
        Queue.#front = pFront;
    }
    
    getRear() {
        return (Queue.#rear);
    }

    setRear(pRear) {
        Queue.#rear = pRear;
    }

    enqueue(pData) {
        // check for full queue
        if (Queue.length === Queue.maxLength) {
            throw new Error("LengthError: Queue length cannot be greater than Queue.maxSize.");
        }
        
        newNode = Node(pData);

        // check for empty queue / typical case
        if (Queue.length === 0) {
            Queue.setFront(newNode);
            Queue.setRear(newNode);
        } else {
            Queue.getRear().setNext(newNode);
            Queue.setRear(newNode);
            }
        Queue.size ++;        
    }

    dequeue() {
        // check for empty queue
        if (Queue.length === 0) {
            throw new Error("LengthError: Queue length cannot be lesser than 0.");
        } 

    
        let front = Queue.getFront();

        // check for single-element array / typical case
        if (Queue.length === 1) {
            Queue.setFront(undefined);
            Queue.setRear(undefined);
        } else {
            Queue.setFront(front.getNext())
        }

        Queue.size --;
        return front;
    }

}

class Node {
    constructor(data) {
        Node.#data = data;
        Node.#next;
    }

    getData() {
        return (Node.#data);
    }

    setData(pData) {
        Node.#data = pData;
    }

    getNext() {
        return Node.#next;
    }
    
    setNext(pNext) {
        Node.#next = pNext;
    }
}
