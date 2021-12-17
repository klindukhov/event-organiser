import React,{useEffect} from "react";

export default function AdminSettings(props){
    useEffect(() => {props.setHeaderMessage("Settings")})
    return(<div className="users-page-main">
        <h1>Admin Settings</h1>
    </div>)
}