import React,{useEffect} from "react";

export default function Page(props){
    // eslint-disable-next-line
    useEffect(() => { props.setHeaderMessage('Reservations')}, [])
    return(<div className="users-page-main">
        <h1>Reservations list</h1>
    </div>)
}