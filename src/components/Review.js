import React, {useState} from 'react';

export default function FetchTest() {
    const [cat, setCat] = useState([]);
    const retrive = () => {
        alert(localStorage.getItem('idCatering'))
    }
    //const getCateringName = () => {
       // fetch("http://localhost:8080/api/caterings/allowed?id="+localStorage.getItem('idCatering')).then(res => res.json()).then(cat => setCat(cat));
    //}
    window.onload = (event) => {
        fetch("http://localhost:8080/api/caterings/allowed?id="+localStorage.getItem('idCatering')).then(res => res.json()).then(cat => setCat(cat));
    };
    return(
        <div className='divthing'>
            <button onClick={retrive}>
               Retrive
            </button>
            <p> You are reviewing:  {Object.values(cat)[1]} </p>
            
            
           
        </div>
    )
}

