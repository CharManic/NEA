import crypto from "node:crypto";

var p = BigInt("0xFFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD129024E088A67CC74020BBEA63B139B22514A08798E3404DDEF9519B3CD3A431B302B0A6DF25F14374FE1356D6D51C245E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7EDEE386BFB5A899FA5AE9F24117C4B1FE649286651ECE45B3DC2007CB8A163BF0598DA48361C55D39A69163FA8FD24CF5F83655D23DCA3AD961C62F356208552BB9ED529077096966D670C354E4ABC9804F1746C08CA18217C32905E462E36CE3BE39E772C180E86039B2783A2EC07A28FB5C55DF06F4C52C9DE2BCBF6955817183995497CEA956AE515D2261898FA051015728E5A8AACAA68FFFFFFFFFFFFFFFF");
var b = BigInt(2);

function publicKeyGeneration() {
    let isValid = false;    
    let power = 0;
    while (!isValid) {
        power = BigInt("0x" + crypto.randomBytes(256).toString("hex"));
        if (power < p) {
            isValid = true;
        };
    };
    let publicKey = modPow(b, power, p);

    return [publicKey, power];
};

// temp second param for moment
function keyGeneration(publicKey, power) {
    let privateKey = modPow(publicKey, power, p);
    return privateKey;

        // no need to send this flag if the client has been told to DH
        
        // look into fetch and async!!!!

        // AGREE ON A SHARED KEY FOR ENCRYPTION OF PUBLIC KEYS ??
};
    

function modPow(base, exponent, p) {
    // check if this works..
    exponent = exponent.toString(2);
    console.log(exponent);
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
};

let [pubKey1, power1] = publicKeyGeneration(false);


let [pubKey2,power2] = publicKeyGeneration(false);


let key1 = keyGeneration(pubKey2, power1);
console.log(key1);
let key2 = keyGeneration(pubKey1, power2);
console.log(key2);

console.log(key1 - key2);
    // async encrypt(message, pSessionKey, iv) {
    //     const cipher = crypto.createCipheriv("aes-256-gcm", pSessionKey, iv);
    //     encryptedMessage = cipher.update(message);
    //     encryptedMessage += cipher.final();
    //     return encryptedMessage;
    // }

    // async decrypt(encryptedMessage, pSessionKey, iv) {
    //     const cipher = crypto.createCipheriv("aes-256-gcm", pSessionKey, iv);
    //     decryptedMessage = cipher.decrypt(encryptedMessage);
    //     return decryptedMessage;
    // }


    // async sendMessage(friendId, message) {
    //     if (!sessionKey) {
    //         // try to fetch from db first !
    //         sessionKey = this.keyGeneration(friendId);
    //     };
        
        
    //     // EDIT : THIS METHOD MIGHT NOT WORK WITH NODE CRYPTO MODULE
    //     var iv = crypto.lib.WordArray(16);
        
    //     encryptedMessage = encrypt(message, sessionKey, iv)
        
    //     // NOTE: crypto js requires an IV (16-bit number) when encrypting w/ aes:
    //     // this does NOT need to be secret and can be transferred w/ the ciphertext
    //     // each message in the database will have an IV stored with it !!!!!!!
        
        
    //     // we'll have another method for retrieving the sessionkey

    //     // for now we're storing non-encrypted session keys on the 
    //     // .env file which would not mean we have TRUE E2EE but it's close enough


    // }

