import React, {useState} from 'react';
//import { Link } from 'react-router';
//import { useHistory} from 'react-router-dom'
import '../styles/Users.css';





export default function Caterings() {
    const [cats, setCats] = useState([]);

        window.onload = (event) => {
        fetch("http://localhost:8080/api/caterings/allowed/all").then(res => res.json()).then(cats => setCats(cats));
    }

    const showDetails = (id) =>
    {  
        localStorage.setItem('idCatering',id)
        window.location.href = '/review';
    }
    // const showReviews = (id) =>
    // {   

       
    //     // let requestOptions = {
    //     //     method: 'POST',
    //     // };
    //     // let blockURL = "http://localhost:8080/api/"+ id +"/block"
    //     // fetch(blockURL, requestOptions)
    //     //     .then(response => {
    //     //         console.log(response.status);
    //     //         if(response.status === 200){
    //     //             alert("response OK - blocked");
    //     //         }else{
    //     //             alert("response not Ok");
    //     //         }})
    //     //     .catch(error => console.log('error', error));
    // }
   
    return(
        <div className='caterings-page-content'>
             {cats.map(c => <lo key={c.name}>
                 <div className='list-elements'>
                     <p> name: {Object.values(c)[1]}</p>
                     <p> email: {Object.values(c)[2]} </p>
                     <p> number: {Object.values(c)[3]} </p>
                  <button onClick={() => showDetails(Object.values(c)[0])}> Show details </button>
                  </div>
                  </lo>)}
             <br></br>
        </div>
    )
    
}
