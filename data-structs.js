/// QUEUE CLASS : STORING MESSAGES FOR TRANSMISSION AT FIRST AVAILABILITY

class Struct {
    #front;
    #rear;
    constructor(pMaxLength) {
        this.#front;
        this.#rear;
        
        this.length = 0;
        this.maxLength = pMaxLength;
    }

    getFront() {
        return (this.#front);

    }

    setFront(pFront) {
        this.#front = pFront;
    }

    getRear() {
        return (this.#rear);
    }

    setRear(pRear) {
        this.#rear = pRear;
    }
}


// QUEUE will be used for UNSENT MESSAGES
class Queue extends Struct {
    constructor(pMaxLength) {
        super(pMaxLength);
    }

    enqueue(pData) {
        // check for full queue
        // consider deleting first message / popup ?????
        if (this.length === this.maxLength) {
            throw new Error("LengthError: Queue length cannot be greater than Queue.maxSize.");
        }
        
        newNode = Node(pData);

        // check for empty queue / typical case
        if (this.length === 0) {
            this.setFront(newNode);
            this.setRear(newNode);
        } else {
            this.getRear().setNext(newNode);
            this.setRear(newNode);
            }
        
        this.size ++;        
    }

    dequeue() {
        // check for empty queue
        if (this.length === 0) {
            throw new Error("LengthError: Queue length cannot be less than 0.");
        } 

        let front = this.getFront();

        // check for single-element array / typical case
        if (this.length === 1) {
            this.setFront(undefined);
            this.setRear(undefined);
        } else {
            this.setFront(front.getNext())
        }

        this.size --;
        return front;
    }

}

// STACK will be used for NOTIFICATIONS
class Stack extends Struct {
    constructor(pMaxLength) {
        super(pMaxLength);
    }

    // no-ops to allow for class to follow typical conventions
    // setFront is not no-op to allow for use in push/pop methods
    setRear(pRear) {}
    getRear() {}
    getFront() {}

    peek() {
        return super.getFront()
    }

    push(pData) {
        if (this.length === this.maxLength) {
            throw new Error("LengthError: Stack length cannot be greater than Stack.maxSize.");
        }
        
        newNode = Node(pData);

        // check for empty queue / typical case
        if (this.length === 0) {
            this.setFront(newNode);
            this.setRear(newNode);
        } else {
            this.getRear().setNext(newNode);
            this.setRear(newNode);
            }
        
        this.size ++;        
    }

    pop() {
     // check for empty stack
        if (this.length === 0) {
            throw new Error("LengthError: Stack length cannot be less than 0.");
        } 

        let front = this.getFront();

        // check for single-element array / typical case
        if (this.length === 1) {
            this.setFront(undefined);
        } else {
            this.setFront(front.getNext())
        }

        this.size --;
        return front;  
    }

}

class Node {
    #data;
    #next;
    constructor(data) {
        this.#data = data;
        this.#next;
    }

    getData() {
        return (this.#data);
    }

    setData(pData) {
        this.#data = pData;
    }

    getNext() {
        return this.#next;
    }
    
    setNext(pNext) {
        this.#next = pNext;
    }
}