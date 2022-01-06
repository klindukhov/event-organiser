/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiFetch from "../../api";
import '../../styles/business/AddBusinessPage.css'

export default function AddBusinessPage(props) {
    const { businessType } = useParams();
    const [typeOfBusiness, setTypeOfBusiness] = useState('');
    useEffect(() => { if (businessType === 'Venue') { setTypeOfBusiness('locations') } else if (businessType === 'Catering') { setTypeOfBusiness('caterings/new') } else if (businessType === 'Service') { setTypeOfBusiness('services') } }, [])
    useEffect(() => { props.setHeaderMessage('New ' + businessType) }, []);
    const [descriptionOptions, setDescriptionOptions] = useState([]);
    useEffect(() => {
        if (businessType === 'Venue') {
            apiFetch('location_description').then(res => setDescriptionOptions(res)).catch(e => console.log('error', e))
        } else if (businessType === 'Catering') {
            apiFetch('cuisines/allowed/all').then(res => setAvailableCuisines(res)).catch(e => console.log('error', e))
        } else if (businessType === 'Service') {
            apiFetch('services/allowed/types').then(res => setAvailableTypes(res)).catch(e => console.log('error', e))
        }
    }, [])

    const [formErrorMessage, setFormErrorMessage] = useState('');
    const handleCreateBusiness = () => {
        if (name !== '' && email !== '' && phoneNumber !== '' && seatingCap !== '' && standingCap !== '' && description !== '' && dailyRentCost !== '' && size !== '' && country !== '' && city !== '' && streetName !== '' && streetNum !== '' && postCode !== '' && descriptions !== []) {
            let body = JSON.stringify({ "address": { "country": country, "city": city, "streetName": streetName, "streetNumber": streetNum, "zipCode": postCode }, "businessHours": businessHours, "email": email, "description": description });
            if (businessType === 'Venue') {
                body.dailyRentCost = dailyRentCost;
                body.name = name;
                body.phoneNumber = phoneNumber;
                body.descriptions = descriptions;
                body.seatingCapacity = seatingCap;
                body.standingCapacity = standingCap;
                body.sizeInSqMeters = size;

            } else if (businessType === 'Catering') {
                body.serviceCost = dailyRentCost;
                body.name = name;
                body.offersOutsideCatering = outsideCatering;
                body.phoneNumber = phoneNumber;
                body.cuisines = cuisines;


            } else if (businessType === "Service") {
                body.serviceCost = dailyRentCost;
                body.firstName = name;
                body.lastName = surname;
                body.alias = alias;
                body.type = type;


            }
            apiFetch(typeOfBusiness, "POST", body)
                .then(res => { if (res.ok) { res.json() } })
                .then(data => apiFetch(businessType.toLowerCase(), "POST", pics))
                .catch(e => console.log('error', e));

            setFormErrorMessage(false);
        } else {
            setFormErrorMessage(true);
        }

    }

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [type, setType] = useState('');
    const [availableTypes, setAvailableTypes] = useState([]);
    const [alias, setAlias] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [seatingCap, setSeatingCap] = useState('');
    const [standingCap, setStandingCap] = useState('');
    const [description, setDescription] = useState('');
    const [dailyRentCost, setDailyRentCost] = useState('');
    const [size, setSize] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [streetName, setStreetName] = useState('');
    const [streetNum, setStreetNum] = useState('');
    const [postCode, setPostCode] = useState('');
    const [outsideCatering, setOutsideCatering] = useState(false);
    const [descriptions, setDescriptions] = useState([]);
    const [cuisines, setCuisines] = useState([]);
    const [availableCuisines, setAvailableCuisines] = useState([]);
    const [businessHours, setBusinessHours] = useState([
        { "day": "MONDAY", "timeFrom": "00:00", "timeTo": "00:00" },
        { "day": "TUESDAY", "timeFrom": "00:00", "timeTo": "00:00" },
        { "day": "WEDNESDAY", "timeFrom": "00:00", "timeTo": "00:00" },
        { "day": "THURSDAY", "timeFrom": "00:00", "timeTo": "00:00" },
        { "day": "FRIDAY", "timeFrom": "00:00", "timeTo": "00:00" },
        { "day": "SATURDAY", "timeFrom": "00:00", "timeTo": "00:00" },
        { "day": "SUNDAY", "timeFrom": "00:00", "timeTo": "00:00" }
    ]);
    const [pics, setPics] = useState([]);


    const handleDescriptions = (e) => {
        let t = new Array(...descriptions);
        if (e.target.checked) {
            t.push(e.target.value);
        } else {
            t.splice(t.indexOf(e.target.value), 1);
        }
        setDescriptions(t);
    }

    const handleCuisines = (e) => {
        let t = new Array(...cuisines);
        if (e.target.checked) {
            t.push(e.target.value);
        } else {
            t.splice(t.indexOf(e.target.value), 1);
        }
        setCuisines(t);
    }

    const handleOpenTime = (e) => {
        let b = businessHours.slice();
        b.forEach(d => {
            if (d.day === e.target.id) {
                d.timeFrom = e.target.value;
            }
        })
        setBusinessHours(b);
    }
    const handleCloseTime = (e) => {
        let b = businessHours.slice();
        b.forEach(d => {
            if (d.day === e.target.id) {
                d.timeTo = e.target.value;
            }
        })
        setBusinessHours(b);
    }

    const handleAddPics = (e) => {
        if (e.target.files && e.target.files[0]) {
            console.log(e.target.files);
            let temp = pics.slice();
            if (e.target.files.length > 1) {
                Object.values(e.target.files).forEach(f => temp.push(URL.createObjectURL(f)))
            } else {
                temp.push(URL.createObjectURL(e.target.files[0]));
            }
            setPics(temp);
        }
    }

    const handleDeleteImage = (e) =>{
        let temp = pics.slice();
        temp.splice(temp.indexOf(e), 1);
        setPics(temp);
    }

    return (<div className="main">
        <div className="block">
            Name
            <input className="input" onChange={e => setName(e.target.value)} /><br />
            {businessType === "Service" &&
                <>
                    Surname
                    <input className="input" onChange={e => setSurname(e.target.value)} /><br />
                    Type
                    <select className="input" onChange={e => setType(e.target.value)}>
                        {availableTypes.map(t =>
                            <option key={t} value={t}>{t}</option>
                        )}
                    </select><br />
                    Alias
                    <input className="input" onChange={e => setAlias(e.target.value)} /><br />
                </>
            }
            Email
            <input className="input" onChange={e => setEmail(e.target.value)} /><br />
            {businessType !== 'Service' &&
                <>Phone number
                    <input className="input" onChange={e => setPhoneNumber(e.target.value)} /><br />
                </>
            }
            {typeOfBusiness === "Venue" &&
                <>
                    Seating capacity
                    <input className="input" onChange={e => setSeatingCap(e.target.value)} /><br />
                    Standing capasity
                    <input className="input" onChange={e => setStandingCap(e.target.value)} /><br />
                    Size(square meters)
                    <input className="input" onChange={e => setSize(e.target.value)} /><br />
                </>
            }
            Description<br />
            <textarea className="input" onChange={e => setDescription(e.target.value)} /><br />
            {businessType === "Venue" && 'Daily rent cost'}
            {(businessType === "Catering" || businessType === "Service") && 'Service cost'}
            <input className="input" onChange={e => setDailyRentCost(e.target.value)} /><br />
            Country
            <input className="input" onChange={e => setCountry(e.target.value)} /><br />
            City
            <input className="input" onChange={e => setCity(e.target.value)} /><br />
            Street name
            <input className="input" onChange={e => setStreetName(e.target.value)} /><br />
            Street number
            <input className="input" onChange={e => setStreetNum(e.target.value)} /><br />
            Postal code
            <input className="input" onChange={e => setPostCode(e.target.value)} /><br />
            {businessType === 'Catering' &&
                <>
                    Offers outside catering
                    <input type='checkbox' onChange={e => setOutsideCatering(e.target.checked)} />
                </>}
            {businessType === 'Venue' &&
                <>
                    <p style={{ textAlign: 'center' }}>Descriptions </p>
                    {descriptionOptions.map(o => <div key={o}><input type='checkbox' value={o} onChange={handleDescriptions} /> {o}</div>)}
                </>
            }
            {businessType === 'Catering' &&
                <>
                    <p style={{ textAlign: 'center' }}>Cuisines </p>
                    {availableCuisines.map(o => <div key={o.name}><input type='checkbox' value={o.name} onChange={handleCuisines} /> {o.name}</div>)}
                </>
            }
            <p style={{ textAlign: 'center' }}>Business Hours</p>
            <div className="business-hours">
                {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map(d =>
                    <div key={d}>
                        {d}<br />
                        <input type='time' id={d} onChange={handleOpenTime} />
                        <input type='time' id={d} onChange={handleCloseTime} />
                    </div>)}
            </div>
            <p style={{ textAlign: 'center' }}>Images </p>
            <div className="business-images">
                {pics.map(p =>
                <div className="image-added">
                    <img alt={p} key={p} src={p} className="add-images-list" onClick={() => handleDeleteImage(p)}/>
                </div>
                )}
                <div className="add-images-wrapper">
                    <label htmlFor='add-images' className="add-images-label">+</label>
                    <input type='file' className="add-images-input" id='add-images' multiple={true} accept='image/*' onChange={handleAddPics} />
                </div>
            </div>
            {pics.length > 0 && 'Click on image to delete it'}



        </div>
        <div className="block" onClick={handleCreateBusiness} style={{ cursor: 'pointer', textAlign: 'center' }}>Add {businessType}<br />{formErrorMessage && <p style={{ color: 'red' }}>Please fill all the form fields</p>}</div>

    </div>)
}