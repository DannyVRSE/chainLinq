import { $query, $update, Record, int, nat } from 'azle';

type Db = {
    users: {
        [id: string]: User;
    };
};

type User = Record<{
    id: string;
    username: string;
    Tokens: nat;
}>;
//initialize empty database
let db: Db = {
    users: {}
};

$query;
//id is an input parameter from frontend
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
    const user:User = {
        id,
        username,
        Tokens:100n
    };
    if (checkIfUserExists(id)==false){
        db.users[id] = user;
    }
   
    return user;
}


$update;
export function transferTokens(sender: string, receiver: string, amount: number): number{
    let amountNat=BigInt(amount)
    if (sender!==receiver){
        if (checkIfUserExists(receiver)) {
            let senderBal: int = db.users[sender].Tokens;
            let receiverBal: int = db.users[receiver].Tokens
            if (senderBal > amount) {
                let newSenderBal = senderBal - amountNat;
                db.users[sender].Tokens = newSenderBal;
                let newRecieverBal = receiverBal + amountNat;
                db.users[receiver].Tokens = newRecieverBal;
    
                return 1;
            } else {
                return 2;
            }
        } else {
            return 3;
        }
    }else{
        return 4;
    }
    
}
