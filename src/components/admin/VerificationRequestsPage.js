import React,{useEffect} from "react";

export default function VerificationRequestsPage(props){
    // eslint-disable-next-line
    useEffect(() => { props.setHeaderMessage('Verification requests')}, [])
    return(<div className="users-page-main">
        <h1>Verififcations requests</h1>
    </div>)
}