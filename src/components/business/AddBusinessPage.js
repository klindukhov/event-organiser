/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import '../../styles/business/AddBusinessPage.css'

export default function AddBusinessPage(props){
    const {businessType} = useParams();
    useEffect(() => {props.setHeaderMessage('New '+businessType)}, []);

    return(<div className="main">
        <div className="default-rect">
            Name

        </div>

    </div>)
}