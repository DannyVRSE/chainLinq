import { backend } from "../declarations/backend";
import React, { useState } from 'react';
import { principal } from "../main";
import { Float64 } from "@dfinity/candid/lib/cjs/idl";


function Transfer() {
    const [receiverId, setReceiverId] = useState("");
    const [amount, setAmount] = useState(0);

    function handleId(event) {
        event.preventDefault();
        setReceiverId(event.target.value)
        console.log(receiverId);
    };
    function handleAmount(event) {
        event.preventDefault();
        let a = event.target.value;
        let b = a.toString();
        let c = parseFloat(b);
        setAmount(c);
        console.log(event.target.value);
    }
    async function transfer(event) {
        event.preventDefault();
        if (amount !== 0) {
            let result = await backend.transferTokens(principal, receiverId, amount);
            if (result == 1) {
                alert("Success");
            } else if (result == 2) {
                alert("Not Enough Tokens")
            } else if (result == 3) {
                alert("Receiver does not exist")
            } else if (result == 4) {
                alert("Cannot send to self")
            }
            setReceiverId("");
        } else {
            alert("Cannnot transfer 0 Tokens")
        }

    };

    return (
        <div className="transfer">
            <h2>Transfer Tokens</h2>
            <form onSubmit={transfer}>
                <div className="mb-3 "><label className="form-label">Receiver ID</label>
                    <input
                    placeholder="Enter a receiver ID"
                        className="form-control"
                        name="receiver"
                        value={receiverId}
                        onChange={handleId}
                        required
                        type="text"
                    /></div>
                <div className="mb-3 "><label className="form-label">Amount</label>
                    <input
                        className="form-control"
                        name="amount"
                        value={amount}
                        onChange={handleAmount}
                        required
                        type="number"
                    /></div>


                <button type="submit" className="btn btn-danger">Transfer Tokens</button>
            </form>
        </div>
    );
}

export default Transfer;