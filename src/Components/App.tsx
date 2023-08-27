import React, { useState } from "react";
import { backend } from "../declarations/backend";
import Balance from "./Balance";
import Transfer from "./Transfer";
import { principal } from "../main";
import Donate from "./Donate";
import Footer from "./Footer";

interface AppProps {
    id: string;
    username: string;
}

function App(props: AppProps) {
    const [myBalance, setMyBalance] = useState<string>("*hidden by default*");

    async function balance() {
        const balanceValue = await backend.checkBalance(principal);
        setMyBalance(balanceValue);
    }

    return (
        <div className="app">

            <div>
                <div>
                    <h2>Hello {props.username}</h2>
                    <p>your id is <span className="id">{props.id}</span></p>
                </div>
                <Balance value={myBalance} />
                <div>
                    <button type="button" id="balance" className="btn btn-warning" onClick={balance}>Check Balance</button>
                </div>
            </div>

            <Transfer />
            <Donate />
            <Footer/>
        </div>
    )
}

export default App;
