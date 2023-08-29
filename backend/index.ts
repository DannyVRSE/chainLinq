import { $query, $update, Record, int, nat } from 'azle';

type Db = {
    users: {
        [id: string]: User;
    };
};
//user is identified via an id which is a principal.toString()
type User = Record<{
    id: string;
    username: string;
    Tokens: string;
}>;
//initialize empty database
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

$query;
export function dbAsString(): string{
    const serializedDb=JSON.stringify(db, null, 2);
    return serializedDb;
}
