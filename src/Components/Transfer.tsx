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
                alert("Receiver does not exist, crosscheck the id in the profiles section")
            } else if (result == 4) {
                alert("Cannot send to self")
            }
            setReceiverId("");
        } else {
            alert("Cannnot transfer 0 Tokens")
        }

    };

    return (
        
        <div className="section">
            <div className="inner">
            <h2>Transfer linqCoin(LNQ)</h2>
            <form onSubmit={transfer}>
                <div className="mb-3 "><label className="form-label">Receiver ID</label>
                    <input
                    placeholder="Enter a receiver ID. You can check if the id exists in the Profiles section at the end 👍"
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

<h5 className="text-danger">Wait✋ The transfer fee is LNQ 5 🥶</h5>
                <button type="submit" className="btn btn-warning">Transfer</button>
            </form>
            </div>
            
        </div>
    );
}

export default Transfer;