import { pollForResponse } from "@dfinity/agent/lib/cjs/polling";

interface AppProps {
    value: string | undefined
}

function Balance(props: AppProps) {
    return (
        <div className="card text-white bg-success mb-3 balance">
            <div className="card-body">
                <h4 className="card-title">Your Balance: </h4>
                <p className="card-text"><span className="accBal">{"LNQ "+props.value}</span></p>
            </div>

        </div>
    )
}

export default Balance;