import React,{useEffect} from "react";

export default function ProblemsPage(props){
    // eslint-disable-next-line
    useEffect(() => { props.setHeaderMessage('Problems')}, [])
    return(<div className="users-page-main">
        <h1>Problems list</h1>
    </div>)
}