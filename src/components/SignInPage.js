import React from 'react';
import { Link } from 'react-router-dom'
import '../styles/SignInPage.css';


function SignInPageContent(){
    return(
        <div className="signIn-page-content">
            <br></br>
            <br></br>
            <br></br>
            <br></br>

            <div className="sign-in-rect">
                <div className="sign-in-h1">
                    Sign in
                </div>
                <p>Email</p>
                <input className="input-login" type="text">
                </input>
                <br></br>
                <p>Password</p>
                <input className="input-login" type="text">
                </input>
                <br></br>
                <Link to="/customerHome">
                <button className="input-login-button" 
                        onMouseEnter={e => {e.target.style.cursor = "pointer";}}
                        onMouseLeave={e => {e.target.style.cursor = "default";}}>
                    Sign in
                </button>
                </Link>
                <br></br>
                Dont have an account?  
                <Link to="/SignUp">Register</Link>
                <br></br>
                <Link to="/SignUp">Forgot password?</Link>


            </div>

        </div>
    )
}

export default SignInPageContent;