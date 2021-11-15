import React, {useState} from 'react';
import '../styles/Users.css';


export default function FetchTest() {
    const [users, setUsers] = useState([]);

    const getAllUsers = () => {
        fetch("http://localhost:8080/api/users/all").then(res => res.json()).then(users => setUsers(users));
    }

    const blockId = (id) =>
    {
       
        let requestOptions = {
            method: 'POST',
        };
        let blockURL = "http://localhost:8080/api/"+ id +"/block"
        fetch(blockURL, requestOptions)
            .then(response => {
                console.log(response.status);
                if(response.status === 200){
                    alert("response OK - blocked");
                }else{
                    alert("response not Ok");
                }})
            .catch(error => console.log('error', error));
    }

    
    return(
        <div className='divthing'>
            <button onClick={getAllUsers}>
                 Get Users
             </button>
             {users.map(c => <lo key={c.name}>
                 <div className='list-elements'>
                     <p> email: {Object.values(c)[1]}</p>
                     <p> type: {Object.values(c)[3]} </p>
                  <button onClick={() => blockId(Object.values(c)[0])}> Block </button>
                  </div>
                  </lo>)}
             <br></br>
        </div>
    )
}