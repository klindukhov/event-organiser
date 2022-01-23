/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import apiFetch from "../../api";
import '../../styles/business/AddBusinessPage.css'

export default function AddBusinessPage(props) {
    const { id } = useParams();
    const history = useHistory();
    const { businessType } = useParams();
    const [typeOfBusiness, setTypeOfBusiness] = useState('');
    useEffect(() => { if (businessType === 'Venue') { setTypeOfBusiness('locations') } else if (businessType === 'Catering') { setTypeOfBusiness('caterings/new') } else if (businessType === 'Service') { setTypeOfBusiness('services') } }, [])
    useEffect(() => { props.setHeaderMessage((id === undefined ? 'New ' : 'Edit ') + businessType) }, []);
    const [descriptionOptions, setDescriptionOptions] = useState([]);
    useEffect(() => {
        if (businessType === 'Venue') {
            apiFetch('location_description/allowed/all').then(res => setDescriptionOptions(res)).catch(e => console.log('error', e))
        } else if (businessType === 'Catering') {
            apiFetch('cuisines/allowed/all').then(res => setAvailableCuisines(res)).catch(e => console.log('error', e))
        } else if (businessType === 'Service') {
            apiFetch('services/allowed/types').then(res => setAvailableTypes(res)).catch(e => console.log('error', e))
            apiFetch('services/allowed/kid/performer/types').then(res => setAvailableKidTypes(res)).catch(e => console.log('error', e))
            apiFetch('services/allowed/languages').then(res => setAvailableLanguages(res)).catch(e => console.log('error', e))
            apiFetch('services/allowed/music/styles').then(res => setAvailableMusicStyles(res)).catch(e => console.log('error', e))
        }
    }, [])
    useEffect(() => {
        if (id !== undefined) {
            apiFetch(`${businessType !== 'Catering' ? typeOfBusiness : 'caterings'}/allowed/${id}/detail`).then(res => {
                console.log(businessType);
                setEmail(res.email)
                setDescription(res.description)
                if (res.address !== null) {
                    setCity(res.address.city)
                    setCountry(res.address.country)
                    setStreetName(res.address.streetName)
                    setStreetNum(res.address.streetNumber)
                    setPostCode(res.address.zipCode)
                }
                setBusinessHours(res.businessHours)
                let temp = pics.slice();
                res.images.forEach(i => {
                    temp.push({ 'pic': 'data:image/png;base64,' + i.encodedImage, 'file': 'none' });
                })
                setPics(temp)
                switch (businessType) {
                    case 'Venue':
                        setName(res.name)
                        setDailyRentCost(res.dailyRentCost)
                        setPhoneNumber(res.phoneNumber)
                        setDescriptions(res.descriptions)
                        setSeatingCap(res.seatingCapacity)
                        setStandingCap(res.standingCapacity)
                        setSize(res.sizeInSqMeters)
                        break;
                    case 'Catering':
                        setName(res.name)
                        setDailyRentCost(res.serviceCost)
                        setOutsideCatering(res.offersOutsideCatering)
                        setPhoneNumber(res.phoneNumber)
                        setCuisines(res.cuisines.map(c => c.name))
                        break;
                    case 'Service':
                        setDailyRentCost(res.serviceCost)
                        setName(res.firstName)
                        setSurname(res.lastName)
                        setAlias(res.alias)
                        setType(res.type)
                        setKidType(res.kidPerformerType)
                        setAgeFrom(res.kidAgeFrom)
                        setAgeTo(res.kidAgeTo)
                        setLanguages(res.translationLanguages)
                        setBandPeople(res.musicBandPeopleCount)
                        setMusicStyles(res.musicStyle)
                        setInstrument(res.instrument)
                        break;
                    default:
                        break;
                }

            }).catch(e => console.log('error', e));
        }
    }, [typeOfBusiness])

    const [formErrorMessage, setFormErrorMessage] = useState('');
    const handleCreateBusiness = () => {
        if (name !== '' && email !== '' && description !== '' && dailyRentCost !== '' && country !== '' && city !== '' && streetName !== '' && streetNum !== '' && postCode !== '' &&
            (
                (businessType === 'Venue' && seatingCap !== '' && phoneNumber !== '' && standingCap !== '' && size !== '' && descriptions.length > 0) ||
                (businessType === 'Catering' && phoneNumber !== '' && cuisines.length > 0) ||
                (businessType === "Service" && surname !== '' && alias !== '' && type !== '' &&
                    (
                        (type === "KIDS PERFORMER" && kidType !== '' && ageTo !== '' && ageFrom !== '') ||
                        (type === "MUSIC BAND" && bandPeople !== '' && musicStyles.length > 0) ||
                        (type === 'MUSICIAN' && musicStyles.length > 0 && instrument !== '') ||
                        (type === 'SINGER' && musicStyles.length > 0) ||
                        (type === 'DJ' && musicStyles.length > 0) ||
                        (type === 'INTERPRETER' && languages.length > 0) ||
                        (type === 'HOST' || type === 'OTHER')
                    )
                )
            )
        ) {
            let body = { "address": { "country": country, "city": city, "streetName": streetName, "streetNumber": streetNum, "zipCode": postCode }, "businessHours": businessHours, "email": email, "description": description };
            if (businessType === 'Venue' && seatingCap !== '' && phoneNumber !== '' && standingCap !== '' && size !== '' && descriptions !== []) {
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
                body.kidPerformerType = kidType;
                body.kidAgeFrom = ageFrom;
                body.kidAgeTo = ageTo;
                body.translationLanguages = languages;
                body.musicBandPeopleCount = bandPeople;
                body.musicStyle = musicStyles;
                body.instrument = instrument;
            }
            apiFetch(typeOfBusiness, "POST", JSON.stringify(body))
                .then(res => res.json())
                .then(res => {
                    if (businessType !== "Venue") {
                        pics.forEach(p => {
                            let data = new FormData();
                            data.append("file", p.file, p.file.name);
                            apiFetch(`images/${businessType.toLowerCase()}/upload?${businessType.toLowerCase()}Id=${res.id}`, "POST", data, 's')
                        })
                    } else {
                        pics.forEach(p => {
                            let data = new FormData();
                            data.append("file", p.file, p.file.name);
                            apiFetch(`images/location/upload?locationId=${res.id}`, "POST", data, 's');
                        })
                    }
                    history.push(`/ListPage/${businessType}s`)
                })
                .catch(e => console.log('error', e));
            setFormErrorMessage(false);
        } else {
            setFormErrorMessage(true);
        }
    }

    const [kidType, setKidType] = useState('');
    const [availableKidTypes, setAvailableKidTypes] = useState([]);
    const [ageFrom, setAgeFrom] = useState('');
    const [ageTo, setAgeTo] = useState('');
    const [availableLanguages, setAvailableLanguages] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [bandPeople, setBandPeople] = useState('');
    const [availableMusicStyles, setAvailableMusicStyles] = useState([]);
    const [musicStyles, setMusicStyles] = useState([]);
    const [instrument, setInstrument] = useState('');
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
            t.push({ "name": e.target.value });
        } else {
            t.splice(t.indexOf({ "name": e.target.value }), 1);
        }
        setCuisines(t);
    }

    const handleMusicStyles = (e) => {
        let t = new Array(...musicStyles);
        if (e.target.checked) {
            t.push({ "name": e.target.value });
        } else {
            t.splice(t.indexOf({ "name": e.target.value }), 1);
        }
        setMusicStyles(t);
    }

    const handleLanguages = (e) => {
        let t = new Array(...languages);
        if (e.target.checked) {
            t.push({ "name": e.target.value });
        } else {
            t.splice(t.indexOf({ "name": e.target.value }), 1);
        }
        setLanguages(t);
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
            let temp = pics.slice();
            if (e.target.files.length > 1) {
                Object.values(e.target.files).forEach(f => temp.push({ 'pic': URL.createObjectURL(f), 'file': f }))
            } else {
                temp.push({ 'pic': URL.createObjectURL(e.target.files[0]), 'file': e.target.files[0] });
            }
            setPics(temp);
        }
    }

    const handleDeleteImage = (e) => {
        let temp = pics.slice();
        temp.splice(temp.indexOf(e), 1);
        setPics(temp);
    }

    const handleDeleteBusiness = () => {
        if (businessType === 'Catering') {
            apiFetch(`caterings/delete?id=${id}`, 'DELETE').then(() => history.push('/ListPage/Caterings')).catch(error => console.log('error', error))
        }
        if (businessType !== 'Catering') {
            apiFetch(`${typeOfBusiness}?id=${id}`, 'DELETE').then(() => history.push(`/ListPage/${businessType}s`)).catch(error => console.log('error', error))
        }
    }

    const handleSubmitChanges = () => {

    }


    return (<div className="main">
        <div className="block">
            Name
            <input className="input" defaultValue={name} onChange={e => setName(e.target.value)} /><br />
            {businessType === "Service" &&
                <>
                    Surname
                    <input className="input" defaultValue={surname} onChange={e => setSurname(e.target.value)} /><br />
                    Alias
                    <input className="input" defaultValue={alias} onChange={e => setAlias(e.target.value)} /><br />
                    Type
                    <select className="input" onChange={e => setType(e.target.value)}>
                        <option value={type}>{id === undefined ? 'choose' : type}</option>
                        {availableTypes.map(t =>
                            <option key={t} value={t}>{t}</option>
                        )}
                    </select><br />
                    {type === 'KIDS PERFORMER' &&
                        <div>
                            Type of kids performer
                            <select className="input" onChange={e => setKidType(e.target.value)}>
                                <option value={kidType}>{kidType}</option>
                                {availableKidTypes.map(t =>
                                    <option key={t} value={t}>{t}</option>
                                )}
                            </select><br />
                            Age
                            <input className="input" defaultValue={ageFrom} onChange={e => setAgeFrom(e.target.value)} />
                            to
                            <input className="input" defaultValue={ageTo} onChange={e => setAgeTo(e.target.value)} /><br />
                        </div>
                    }
                    {type === "INTERPRETER" &&
                        <div>
                            {availableLanguages.map(o => <div key={o}><input type='checkbox' checked={languages.includes(o)} value={o} onChange={handleLanguages} /> {o}</div>)}
                        </div>
                    }
                    {type === 'MUSIC BAND' &&
                        <div>
                            Number of people
                            <input className="input" defaultValue={bandPeople} onChange={e => setBandPeople(e.target.value)} /><br />
                            {availableMusicStyles.map(o => <div key={o}><input type='checkbox' checked={musicStyles.includes(o)} value={o} onChange={handleMusicStyles} /> {o}</div>)}
                        </div>
                    }
                    {type === 'MUSICIAN' &&
                        <div>
                            Instrument
                            <input className="input" defaultValue={instrument} onChange={e => setInstrument(e.target.value)} /><br />
                            {availableMusicStyles.map(o => <div key={o}><input type='checkbox' checked={musicStyles.includes(o)} value={o} onChange={handleMusicStyles} /> {o}</div>)}
                        </div>
                    }
                    {(type === 'SINGER' || type === "DJ") &&
                        <div>
                            {availableMusicStyles.map(o => <div key={o}><input type='checkbox' checked={musicStyles.includes(o)} value={o} onChange={handleMusicStyles} /> {o}</div>)}
                        </div>
                    }
                </>
            }
            Email
            <input className="input" defaultValue={email} onChange={e => setEmail(e.target.value)} /><br />
            {businessType !== 'Service' &&
                <>Phone number
                    <input className="input" defaultValue={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} /><br />
                </>
            }
            {businessType === "Venue" &&
                <>
                    Seating capacity
                    <input className="input" defaultValue={seatingCap} onChange={e => setSeatingCap(e.target.value)} /><br />
                    Standing capasity
                    <input className="input" defaultValue={standingCap} onChange={e => setStandingCap(e.target.value)} /><br />
                    Size(square meters)
                    <input className="input" defaultValue={size} onChange={e => setSize(e.target.value)} /><br />
                </>
            }
            Description<br />
            <textarea className="input" defaultValue={description} onChange={e => setDescription(e.target.value)} /><br />
            {businessType === "Venue" && 'Daily rent cost'}
            {(businessType === "Catering" || businessType === "Service") && 'Service cost'}
            <input className="input" defaultValue={dailyRentCost} onChange={e => setDailyRentCost(e.target.value)} /><br />
            Country
            <input className="input" defaultValue={country} onChange={e => setCountry(e.target.value)} /><br />
            City
            <input className="input" defaultValue={city} onChange={e => setCity(e.target.value)} /><br />
            Street name
            <input className="input" defaultValue={streetName} onChange={e => setStreetName(e.target.value)} /><br />
            Street number
            <input className="input" defaultValue={streetNum} onChange={e => setStreetNum(e.target.value)} /><br />
            Postal code
            <input className="input" defaultValue={postCode} onChange={e => setPostCode(e.target.value)} /><br />
            {businessType === 'Catering' &&
                <>
                    Offers outside catering
                    <input type='checkbox' checked={outsideCatering} onChange={e => setOutsideCatering(e.target.checked)} />
                </>}
            {businessType === 'Venue' &&
                <>
                    <p style={{ textAlign: 'center' }}>Descriptions </p>
                    {descriptionOptions.map(o => <div key={o}><input type='checkbox' value={o} checked={descriptions.includes(o)} onChange={handleDescriptions} /> {o}</div>)}
                </>
            }
            {businessType === 'Catering' &&
                <>
                    <p style={{ textAlign: 'center' }}>Cuisines </p>
                    {availableCuisines.map(o => <div key={o.name}><input type='checkbox' checked={cuisines.includes(o.name)} value={o.name} onChange={handleCuisines} /> {o.name}</div>)}
                </>
            }
            <p style={{ textAlign: 'center' }}>Business Hours</p>
            {businessHours !== '' && <div className="business-hours">
                {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map(d =>
                    <div key={d}>
                        {d}<br />
                        <input type='time' id={d} value={businessHours.find(b => b.day === d).timeFrom} onChange={handleOpenTime} />
                        <input type='time' id={d} value={businessHours.find(b => b.day === d).timeTo} onChange={handleCloseTime} />
                    </div>)}
            </div>}
            <p style={{ textAlign: 'center' }}>Images </p>
            <div className="business-images">
                {pics.map(p =>
                    <div className="image-added" key={p.file.name}>
                        <img alt={p.pic} key={p} src={p.pic} className="add-images-list" onClick={() => handleDeleteImage(p)} />
                    </div>
                )}
                <div className="add-images-wrapper">
                    <label htmlFor='add-images' className="add-images-label">+</label>
                    <input type='file' className="add-images-input" id='add-images' multiple={true} accept='image/*' onChange={handleAddPics} />
                </div>
            </div>
            {pics.length > 0 && 'Click on image to delete it'}



        </div>
        {id === undefined &&
            <div className="block" onClick={handleCreateBusiness} style={{ cursor: 'pointer', textAlign: 'center' }}>
                Add {businessType}<br />
                {formErrorMessage && <p style={{ color: 'red' }}>Please fill all the form fields</p>}
            </div>
        }
        {id !== undefined &&
            <div className="block" style={{ display: 'grid', gridTemplateColumns: 'auto auto auto', justifyItems: 'center' }}>
                <input type='button' className="button" value='Cancel' onClick={() => history.push(`/ListPage/${businessType}s`)} />
                <input type='button' className="button" value='Submit changes' onClick={handleSubmitChanges} />
                <input type='button' className="button" value={'Delete' + businessType} onClick={handleDeleteBusiness} />
            </div>
        }

    </div>)
}