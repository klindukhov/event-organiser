import React, {useState, useEffect} from 'react';
import '../styles/CreatePersonalPage.css'
import { Link } from 'react-router-dom'


function SignUpPageContent(props) {
    const [email, setEmail] = useState('');

    useEffect(() => {
        try {
            if (props.cach.email) { setEmail(props.cach.email) }
        } catch (error) { }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div className="create-account-page-content">

            <div className="create-account-rect">
                <h1 className="create-personal-h1">
                    Create Account
                </h1>
                <p className="create-acc-input-label">Email</p>
                <input className="input-register" type="text" defaultValue={email}>
                </input>

                <p className="create-acc-input-label">Name</p>
                <input className="input-register" type="text">
                </input>

                <p className="create-acc-input-label">Surname</p>
                <input className="input-register" type="text">
                </input>

                <p className="create-acc-input-label">Birthdate</p>
                <input className="input-register" type="date">
                </input>

                <p className="create-acc-input-label">Phone number</p>
                <input className="input-register" type="text">
                </input>

                <p></p>
                <Link to="/customerHome">
                    <button className="input-create-account-button">
                        Create
                    </button>
                </Link>
            </div>

        </div>
    )
}

export default SignUpPageContent;