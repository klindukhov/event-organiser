import React, {useState} from 'react';


export default function FetchTest() {
    const [cats, setCats] = useState([]);
    const [locs, setLocs] = useState([]);

    const getAllCaterings = () => {
        fetch("http://localhost:8080/api/catering/all").then(res => res.json()).then(cats => setCats(cats));
        
    }

    const getAllLocations = () => {
        fetch("http://localhost:8080/api/location/all").then(res => res.json()).then(locs => setLocs(locs));
    }

    return(
        <div className='divthing'>
            <button onClick={getAllCaterings}>
                Get catering
            </button>
            {cats.map(c => <li key={c.name}> {Object.values(c)[0]} </li>)}
            <br></br>
            <button onClick={getAllLocations}>
                Get locations
            </button>
            {locs.map(c => <li key={c.name}> {Object.values(c)[1]} </li>)}

        </div>
    )
}

