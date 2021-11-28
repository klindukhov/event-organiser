import React, {useState, useEffect} from 'react'
import '../styles/CreateBusinessPage.css'
import { Link } from 'react-router-dom'

export default function CreateBusinessAcc(props) {
  const [email, setEmail] = useState('');

    useEffect(() => {
        try {
            if (props.cach.email) { setEmail(props.cach.email) }
        } catch (error) { }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  return (
    <div className="create-business-page-content">

      <div className="create-business-rect">
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

        <p className="create-acc-input-label">Business name</p>
        <input className="input-register" type="text">
        </input>
        
        <p className="create-acc-input-label">Country</p>
        <input className="input-register" type="text">
        </input>

        <p className="create-acc-input-label">City</p>
        <input className="input-register" type="text">
        </input>

        <p className="create-acc-input-label">Street</p>
        <input className="input-register" type="text">
        </input>

        <p className="create-acc-input-label">House</p>
        <input className="input-register" type="text">
        </input>

        <p></p>
        <Link to="/customerHome">
          <button className="input-create-business-button">
            Create
          </button>
        </Link>
      </div>

    </div>
  )
}