import { useEffect, useState } from 'react';
import { backend } from "../declarations/backend";

function Profiles() {
    const [userProfiles, setUserProfiles] = useState([]);

    useEffect(() => {
        // Fetch user profiles from backend and update state
        const fetchProfiles = async () => {
            try {
                const serializedDb = await backend.dbAsString();
                const dbObject = JSON.parse(serializedDb);

                const profiles = Object.values(dbObject.users);
                setUserProfiles(profiles);
            } catch (error) {
                console.error("Error fetching profiles:", error);
            }
        };

        fetchProfiles();
    }, []);

    return (
        <div className="section">
            <div className="inner">
                <h2>Accounts</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Username</th>
                            <th scope="col">Tokens</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userProfiles.map((profile) => (
                            <tr key={profile.id}>
                                <td>{profile.id}</td>
                                <td>{profile.username}</td>
                                <td>{profile.Tokens}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default Profiles;
