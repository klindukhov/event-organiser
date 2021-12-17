import React,{useEffect} from 'react';

export default function AdminHomePage(props){
    // eslint-disable-next-line
    useEffect(() => { props.setHeaderMessage('Dashboard')}, [])
return(<div className='users-page-main'>
    <h1>Admin dashboard</h1>
</div>)
}