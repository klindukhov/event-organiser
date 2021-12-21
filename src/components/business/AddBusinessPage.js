import React, { useEffect } from "react";
import '../../styles/business/AddBusinessPage.css'

export default function AddBusinessPage(props){
    // eslint-disable-next-line
    useEffect(() => {props.setHeaderMessage('New business')}, []);

    return(<div className="business-home-main">

    </div>)
}