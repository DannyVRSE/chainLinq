import { pollForResponse } from "@dfinity/agent/lib/cjs/polling";

interface AppProps {
    value: string | undefined
}

function Balance(props: AppProps) {
    const cardStyle = {
        maxWidth: '20rem',
    }
    const containerStyle = {
        display: 'flex',
        justifyContent: 'center', // Horizontally center
        alignItems: 'center', // Vertically center
       
    };

    return (
        <div style={containerStyle}>
            <div className="card text-white bg-success mb-3" style={cardStyle}>
                <div className="card-header">Your balance</div>
                <div className="card-body">
                    <p className="card-text"><span className="accBal">{"LNQ " + props.value}</span></p>
                </div>
            </div>
        </div>
    )
}

export default Balance;