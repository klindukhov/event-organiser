import React from 'react';
import '../styles/SignUpPage.css';
import { Link } from 'react-router-dom'


function SignUpPageContent(){
    return(
        <div className="signUp-page-content">
            <br></br>
            <br></br>
            <br></br>
            <br></br>

            <div className="sign-up-rect">
                <div className="sign-up-h1">
                    Sign up
                </div>
                <input className="input-acctype-personal" type="button" value="Personal"
                       onClick={(e) => e.target.style.color = "#47525e"}
                ></input>
                <input className="input-acctype-business" type="button" value="Business"
                       onClick={(e) => e.target.style.color = "#47525e"}
                ></input>
                <br></br>
                <p>Email</p>
                <input className="input-register" type="text">
                </input>
                <br></br>
                <p>Password</p>
                <input className="input-register" type="text">
                </input>
                <br></br>
                <p>Confirm password</p>
                <input className="input-register" type="text">
                </input>
                <br></br>
                <Link to="/CreatePersonalAccount">
                <button className="input-register-button">
                    Sign up
                </button>
                </Link>
                

            </div>

        </div>
    )
}

export default SignUpPageContent;