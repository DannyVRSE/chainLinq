/*import { $query, $update, nat} from 'azle';

type Db = {
    users: {
        [id: string]: User;
    };
};
//user is identified via an id which is a principal.toString()
type User ={
    id: string;
    username: string;
    Tokens: string;
};

let db: Db = {
    users: {}
};

$query;
export function getUserById(id: string): string {
    const userName = db.users[id].username;
    return userName;
}

$query;
export function checkBalance(id: string): string {
    const tokenBalance = db.users[id].Tokens;
    return tokenBalance.toString();
}

$query;
export function checkIfUserExists(id: string): boolean {
    return id in db.users;
}


$update;
export function createUser(id: string, username: string): User {
    let reward = 100;
    const user: User = {
        id,
        username,
        Tokens: reward.toString()
    };
    if (checkIfUserExists(id) == false) {
        db.users[id] = user;
    }

    return user;
}

//functions supporting transfer tokens

function stringToBigInt(string_val: string): nat {
    let val_n = Number(string_val);
    let val_bigInt = BigInt(val_n);
    return val_bigInt;
}

function getBal(id: string): string {
    let bal: string = db.users[id].Tokens;
    return bal;
}

function incReceiverBal(receiver: string, amount: string) {
    db.users[receiver].Tokens = amount;
}

function reduceSenderBal(sender: string, amount: string) {
    db.users[sender].Tokens = amount;
}

//transfer function
$update;
export function transferTokens(sender: string, receiver: string, amount: number): number {
    let fee: nat = 5n;

    let amountNat = BigInt(amount);

    if (sender !== receiver) {
        if (checkIfUserExists(receiver)) {

            let senderBal = stringToBigInt(getBal(sender));
            let receiverBal = stringToBigInt(getBal(receiver));

            if (senderBal > amountNat + fee) {
                let newSenderBal = (senderBal - amountNat - fee).toString();
                reduceSenderBal(sender, newSenderBal);

                let newReceiverBal = (receiverBal + amountNat).toString();
                incReceiverBal(receiver, newReceiverBal);

                return 1;
            } else {
                return 2;
            }
        } else {
            return 3;
        }
    } else {
        return 4;
    }

}

//export database as a string for easy access in the frontend
$query;
export function dbAsString(): string{
    const serializedDb=JSON.stringify(db, null, 2);
    return serializedDb;
}
*/

import { $query, $update, Record, StableBTreeMap, Principal, Tuple, Vec } from 'azle';

type User = Record<{
    id: Principal;
    username: string;
    tokens: number;
}>

//created an instance of stable database mapping
let users = new StableBTreeMap<Principal, User>(0, 100, 1000)

//create user
$update
export function createUser(id: Principal, username: string): User {
    let reward = 100;
    const user: User = {
        id,
        username,
        tokens: reward
    }

    users.insert(user.id, user);
    return user;
}

//check if user exists
$query
export function checkIfUserExists(id: Principal): boolean {
    return users.containsKey(id);
}

//check balance
$query
export function checkBal(id: Principal): number {
    const user = users.get(id)
    const balance = user.Some?.tokens;
    if (balance!=undefined){
        return balance;
    }else{
        console.log("error in checkBal")
        return 0;
    }
        
}

async function incReceiverBal(id: Principal, amount: number) {
    const receiver = users.get(id);

    if (receiver.Some?.id && receiver.Some?.username && receiver.Some?.tokens != undefined) {
        const modifiedReceiver: User = {
            id: receiver.Some.id,
            username: receiver.Some.username,
            tokens: receiver.Some.tokens
        }
//overwrite
        users.insert(id, modifiedReceiver)
    } else {
        console.log("error in incReceiverBal")
    }
}

function reduceSenderBal(id: Principal, amount: number) {
    const sender = users.get(id);

    if (sender.Some?.id && sender.Some?.username && sender.Some?.tokens != undefined) {
        const modifiedSender: User = {
            id: sender.Some.id,
            username: sender.Some.username,
            tokens: sender.Some.tokens
        };
        users.insert(id, modifiedSender);
    } else {
        console.log("error in reduceSenderBal");
    }
}

//transfer tokens
$update

export async function transferTokens(sender: Principal, receiver: Principal, amount: number): Promise<number> {
    let fee: number = 5;
    let senderBal = await checkBal(sender)
    let receiverBal = await checkBal(receiver)
    if (senderBal && receiverBal !== undefined) {
        if (sender !== receiver) {
            if (checkIfUserExists(receiver)) {
                if (senderBal > amount + fee) {
                    let newSenderBal = senderBal - amount - fee
                    let newReceiverBal = receiverBal + amount
                    reduceSenderBal(sender, newSenderBal);
                    incReceiverBal(receiver, newReceiverBal);
                    return 1;
                } else { return 2 }
            } else { return 3 }
        } else {
            return 4
        }
    } else { return 0 };
}

$query
export function items(): Vec<Tuple<[Principal, User]>>{
    const allUsers= users.items();
    return allUsers; 
}


