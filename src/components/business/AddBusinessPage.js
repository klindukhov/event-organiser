/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import apiFetch from "../../api";
import '../../styles/business/AddBusinessPage.css'
import TextField from '@mui/material/TextField'
import { Backdrop, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Tooltip } from "@mui/material";
import { Cancel, Delete } from "@mui/icons-material";

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
    const [businessDetails, setBusinessDetails] = useState('');
    useEffect(() => {
        if (id !== undefined) {
            apiFetch(`${businessType !== 'Catering' ? typeOfBusiness : 'caterings'}/allowed/${id}/detail`).then(res => {
                setBusinessDetails(res);
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
                    temp.push({ 'pic': 'data:image/png;base64,' + i.encodedImage, 'file': 'none', 'id': i.id });
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
                        setCuisines(res.cuisines.map(c => { return { name: c.name } }))
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
                setOpen(false);
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
        { "day": "MONDAY", "timeFrom": "08:00", "timeTo": "23:59" },
        { "day": "TUESDAY", "timeFrom": "08:00", "timeTo": "23:59" },
        { "day": "WEDNESDAY", "timeFrom": "08:00", "timeTo": "23:59" },
        { "day": "THURSDAY", "timeFrom": "08:00", "timeTo": "23:59" },
        { "day": "FRIDAY", "timeFrom": "08:00", "timeTo": "23:59" },
        { "day": "SATURDAY", "timeFrom": "08:00", "timeTo": "23:59" },
        { "day": "SUNDAY", "timeFrom": "08:00", "timeTo": "23:59" }
    ]);
    const [pics, setPics] = useState([]);
    const [picsToDelete, setPicsToDelete] = useState([]);


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
            t.splice(t.indexOf(t.find(el => el.name === e.target.value)), 1);
        }
        setCuisines(t);
    }

    const handleMusicStyles = (e) => {
        let t = new Array(...musicStyles);
        if (e.target.checked) {
            t.push({ "name": e.target.value });
        } else {
            t.splice(t.indexOf(t.find(el => el.name === e.target.value)), 1);
        }
        setMusicStyles(t);
    }

    const handleLanguages = (e) => {
        let t = new Array(...languages);
        if (e.target.checked) {
            t.push({ "name": e.target.value });
        } else {
            t.splice(t.indexOf(t.find(el => el.name === e.target.value)), 1);
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

        if (e.file === 'none') {
            setPicsToDelete([...picsToDelete, e.id]);
        }
    }

    const handleDeleteBusiness = () => {
        setOpen(true);
        if (businessType === 'Catering') {
            apiFetch(`caterings/delete?id=${id}`, 'DELETE').then(() => history.push('/ListPage/Caterings')).catch(error => console.log('error', error))
        }
        if (businessType !== 'Catering') {
            apiFetch(`${typeOfBusiness}?id=${id}`, 'DELETE').then(() => history.push(`/ListPage/${businessType}s`)).catch(error => console.log('error', error))
        }
    }

    const handleSubmitChanges = () => {
        setOpen(true);
        let body = { ...businessDetails };
        body.email = email;
        body.description = description;

        switch (businessType) {
            case 'Venue':
                body.name = name;
                body.phoneNumber = phoneNumber;
                body.descriptions = descriptions;
                body.dailyRentCost = dailyRentCost;
                body.seatingCapacity = seatingCap;
                body.standingCapacity = standingCap;
                break;
            case 'Catering':
                body.name = name;
                body.phoneNumber = phoneNumber;
                body.serviceCost = dailyRentCost;
                body.cuisines = cuisines;
                break;
            case 'Service':
                body.firstName = name;
                body.lastName = surname;
                body.alias = alias;
                body.serviceCost = dailyRentCost;
                break;
            default:
                break;
        }
        apiFetch(`${typeOfBusiness === 'caterings/new' ? 'caterings' : typeOfBusiness}/edit?id=${id}`, "PUT", JSON.stringify(body))
            .then(() => {
                if (picsToDelete.length > 0) {
                    picsToDelete.forEach(p => {
                        apiFetch(`images/${typeOfBusiness === 'caterings/new' ? 'catering' : typeOfBusiness.substring(0, typeOfBusiness.length - 1)}?id=${p}`, "DELETE")
                            .catch(e => console.log('error', e));
                    })
                }
                let newPics = pics.filter(p => p.file !== 'none');
                if (newPics.length > 0) {
                    if (businessType !== "Venue") {
                        newPics.forEach(p => {
                            let data = new FormData();
                            data.append("file", p.file, p.file.name);
                            apiFetch(`images/${businessType.toLowerCase()}/upload?${businessType.toLowerCase()}Id=${id}`, "POST", data, 's').then(() => {
                                window.location.reload()
                            }).catch(e => console.log('error', e))
                        })
                    } else {
                        newPics.forEach(p => {
                            let data = new FormData();
                            data.append("file", p.file, p.file.name);
                            apiFetch(`images/location/upload?locationId=${id}`, "POST", data, 's').then(() => {
                                window.location.reload()
                            }).catch(e => console.log('error', e));
                        })
                    }
                } else {
                    window.location.reload()
                }
            })
            .catch(e => console.log('error', e))

    }

    const [open, setOpen] = useState(false);
    useEffect(() => { if (id !== undefined) { setOpen(true) } }, [])

    const [isDialog, setIsDialog] = useState(false);
    const [dialogContent, setDialogContent] = useState('');
    const [dialogConfirm, setDialogConfirm] = useState('');



    return (<div className="main">
        <Dialog
            open={isDialog}
            onClose={() => setIsDialog(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Confirm action"}
            </DialogTitle>
            <DialogContent>
                <div style={{ width: '400px', height: '200px', display: 'grid' }}>
                    <span style={{ alignSelf: 'center', justifySelf: 'center' }}>{dialogContent}</span>
                </div>
            </DialogContent>
            <DialogActions>
                {dialogConfirm === 'cancel' &&
                    <Button onClick={() => history.push(`/ListPage/${businessType}s`)} >
                        Confirm
                    </Button>
                }
                {dialogConfirm === 'delete' &&
                    <Button onClick={handleDeleteBusiness} >
                        Confirm
                    </Button>
                }
                <Button onClick={() => setIsDialog(false)} >
                    <Cancel />Cancel
                </Button>
            </DialogActions>
        </Dialog>
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
        <div className="block">

            <TextField InputLabelProps={id !== undefined ? { shrink: id !== undefined } : ''} margin="dense" size="small" label='Email' style={{ width: '250px' }} value={email} onChange={e => setEmail(e.target.value.replace(/ *$/, ''))} /><br />
            <TextField InputLabelProps={id !== undefined ? { shrink: id !== undefined } : ''} margin="dense" size="small" label='Name' style={{ width: '250px' }} value={name} onChange={e => setName(e.target.value.replace(/ *$/, ''))} /><br />
            {businessType === "Service" &&
                <>
                    <TextField InputLabelProps={id !== undefined ? { shrink: id !== undefined } : ''} margin="dense" size="small" label='Surname' style={{ width: '250px' }} value={surname} onChange={e => setSurname(e.target.value.replace(/ *$/, ''))} /><br />
                    <TextField InputLabelProps={id !== undefined ? { shrink: id !== undefined } : ''} margin="dense" size="small" label='Alias' style={{ width: '250px' }} value={alias} onChange={e => setAlias(e.target.value.replace(/ *$/, ''))} /><br />
                    <FormControl margin="dense" size="small">
                        <InputLabel id='service-type-label'>Type</InputLabel>
                        <Select style={{ width: '250px' }} label='Type' disabled={id !== undefined} value={type} onChange={e => setType(e.target.value)}>
                            {availableTypes.map(t =>
                                <MenuItem key={t} value={t}>{t}</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                    <br />
                    {type === 'KIDS PERFORMER' &&
                        <div>
                            <FormControl margin="dense" disabled={id !== undefined} size="small">
                                <InputLabel>Type of kids performer</InputLabel>
                                <Select style={{ width: '250px' }} value={kidType} onChange={e => setKidType(e.target.value)}>
                                    {availableKidTypes.map(t =>
                                        <MenuItem key={t} value={t}>{t}</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                            <br />
                            <TextField InputLabelProps={id !== undefined ? { shrink: id !== undefined } : ''} disabled={id !== undefined} margin="dense" size="small" label='Age from' style={{ width: '250px' }} value={ageFrom} onChange={e => setAgeFrom(e.target.value)} />
                            <TextField InputLabelProps={id !== undefined ? { shrink: id !== undefined } : ''} disabled={id !== undefined} margin="dense" size="small" label='Age to' style={{ width: '250px' }} value={ageTo} onChange={e => setAgeTo(e.target.value)} /><br />
                        </div>
                    }
                    {type === "INTERPRETER" &&
                        <div>
                            {availableLanguages.map(o => <div key={o}>
                                <FormControlLabel margin="dense" disabled={id !== undefined} size="small" control={<Checkbox value={o} checked={id !== undefined ? languages.includes(o) : languages.some(c => c.name === o)} onChange={handleLanguages} />} label={o} />
                            </div>)}
                        </div>
                    }
                    {type === 'MUSIC BAND' &&
                        <div>
                            <TextField InputLabelProps={id !== undefined ? { shrink: id !== undefined } : ''} disabled={id !== undefined} margin="dense" size="small" label='Number of people' style={{ width: '250px' }} value={bandPeople} onChange={e => setBandPeople(e.target.value)} /><br />
                            <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto' }}>
                                {availableMusicStyles.map(o => <div key={o}>
                                    <FormControlLabel margin="dense" size="small" disabled={id !== undefined} control={<Checkbox value={o} checked={id !== undefined ? musicStyles.includes(o) : musicStyles.some(c => c.name === o)} onChange={handleMusicStyles} />} label={o} />
                                </div>)}
                            </div>
                        </div>
                    }
                    {type === 'MUSICIAN' &&
                        <div>
                            <TextField InputLabelProps={id !== undefined ? { shrink: id !== undefined } : ''} disabled={id !== undefined} margin="dense" size="small" label='Instrument' style={{ width: '250px' }} value={instrument} onChange={e => setInstrument(e.target.value.replace(/ *$/, ''))} /><br />
                            <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto' }}>
                                {availableMusicStyles.map(o => <div key={o}>
                                    <FormControlLabel margin="dense" size="small" disabled={id !== undefined} control={<Checkbox value={o} checked={musicStyles.some(c => c.name === o)} onChange={handleMusicStyles} />} label={o} />
                                </div>)}
                            </div>
                        </div>
                    }
                    {(type === 'SINGER' || type === "DJ") &&
                        <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto' }}>
                            {availableMusicStyles.map(o => <div key={o}>
                                <FormControlLabel margin="dense" size="small" disabled={id !== undefined} control={<Checkbox value={o} checked={id !== undefined ? musicStyles.includes(o) : musicStyles.some(c => c.name === o)} onChange={handleMusicStyles} />} label={o} />
                            </div>)}
                        </div>
                    }
                </>
            }
            {businessType !== 'Service' &&
                <>
                    <TextField InputLabelProps={id !== undefined ? { shrink: id !== undefined } : ''} margin="dense" size="small" label='Phone number' style={{ width: '250px' }} value={phoneNumber} onChange={e => setPhoneNumber(e.target.value.replace(/ *$/, ''))} /><br />
                </>
            }
            {businessType === "Venue" &&
                <>
                    <br />
                    <TextField InputLabelProps={id !== undefined ? { shrink: id !== undefined } : ''} margin="dense" size="small" type='number' label='Seating capacity' style={{ width: '250px' }} value={seatingCap} onChange={e => setSeatingCap(e.target.value)} /><br />
                    <TextField InputLabelProps={id !== undefined ? { shrink: id !== undefined } : ''} margin="dense" size="small" type='number' label='Standing capasity' style={{ width: '250px' }} value={standingCap} onChange={e => setStandingCap(e.target.value)} /><br />
                    <TextField InputLabelProps={id !== undefined ? { shrink: id !== undefined } : ''} margin="dense" size="small" disabled={id !== undefined} type='number' label='Size(square meters)' style={{ width: '250px' }} value={size} onChange={e => setSize(e.target.value)} /><br />
                </>
            }
            <br />
            <TextField InputLabelProps={id !== undefined ? { shrink: id !== undefined } : ''} margin="dense" size="small" type='number' label={businessType === "Venue" ? 'Daily rent cost' : 'Service cost'} style={{ width: '250px' }} value={dailyRentCost} onChange={e => setDailyRentCost(e.target.value)} /><br />
            <TextField InputLabelProps={id !== undefined ? { shrink: id !== undefined } : ''} margin="dense" size="small" label='Description' multiline style={{ width: '510px' }} value={description} onChange={e => setDescription(e.target.value)} /><br />
            <br />
            <TextField InputLabelProps={id !== undefined ? { shrink: id !== undefined } : ''} margin="dense" disabled={id !== undefined} size="small" label='Country' style={{ width: '250px', marginRight: '10px' }} value={country} onChange={e => setCountry(e.target.value)} />
            <TextField InputLabelProps={id !== undefined ? { shrink: id !== undefined } : ''} margin="dense" disabled={id !== undefined} size="small" label='City' style={{ width: '250px' }} value={city} onChange={e => setCity(e.target.value)} /><br />
            <TextField InputLabelProps={id !== undefined ? { shrink: id !== undefined } : ''} margin="dense" disabled={id !== undefined} size="small" label='Street name' style={{ width: '250px', marginRight: '10px' }} value={streetName} onChange={e => setStreetName(e.target.value)} />
            <TextField InputLabelProps={id !== undefined ? { shrink: id !== undefined } : ''} margin="dense" disabled={id !== undefined} size="small" label='Number' style={{ width: '100px', marginRight: '10px' }} value={streetNum} onChange={e => setStreetNum(e.target.value)} />
            <TextField InputLabelProps={id !== undefined ? { shrink: id !== undefined } : ''} margin="dense" disabled={id !== undefined} size="small" label='Postal code' style={{ width: '140px' }} value={postCode} onChange={e => setPostCode(e.target.value)} /><br />
            {businessType === 'Catering' &&
                <>
                    <FormControlLabel margin="dense" size="small" disabled={id !== undefined} control={<Checkbox checked={outsideCatering} onChange={e => setOutsideCatering(e.target.checked)} />} label={'Offers outside catering'} />
                </>}
            {businessType === 'Venue' &&
                <>
                    <p style={{ textAlign: 'center' }}><br />Descriptions </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'auto auto' }}>
                        {descriptionOptions.map(o => <div key={o.id}>
                            <Tooltip title={o.description}>
                                <FormControlLabel margin="dense" size="small" control={<Checkbox value={o.id} checked={descriptions.includes(o.id)} onChange={handleDescriptions} />} label={o.id} />
                            </Tooltip>
                        </div>)}
                    </div>
                </>
            }
            {businessType === 'Catering' &&
                <>
                    <p style={{ textAlign: 'center' }}>Cuisines </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto' }}>
                        {availableCuisines.map(o => <div key={o.name}>
                            <FormControlLabel margin="dense" size="small" control={<Checkbox value={o.name} checked={cuisines.some(c => c.name === o.name)} onChange={handleCuisines} />} label={o.name} />
                        </div>)}
                    </div>
                </>
            }
            <div style={{ textAlign: 'center' }}><br />Business Hours </div>
            {businessHours !== '' && <div className="business-hours">
                {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map(d =>
                    <div key={d}>
                        {d}<br />
                        <TextField InputLabelProps={{ shrink: true }} disabled={id !== undefined} margin="dense" size="small" label='From' type='time' id={d} value={businessHours.find(b => b.day === d) && businessHours.find(b => b.day === d).timeFrom} onChange={handleOpenTime} />
                        <TextField InputLabelProps={{ shrink: true }} disabled={id !== undefined} margin="dense" size="small" label='To' type='time' id={d} value={businessHours.find(b => b.day === d) && businessHours.find(b => b.day === d).timeTo} onChange={handleCloseTime} />
                    </div>)}
            </div>}
            {id !== undefined && businessType !== "Catering" && <div style={{ textAlign: 'center' }}><br /><Button variant='contained' onClick={() => history.push(`/BusinessCalendar/${typeOfBusiness}/${id}`)}>Manage calendar</Button><br /><br /></div>}
            <p style={{ textAlign: 'center' }}>Images </p>
            <div className="business-images">
                {pics.map(p =>
                    <div className="image-added" key={p.file.name}>
                        <img alt={p.pic} key={p} src={p.pic} className="add-images-list" onClick={() => handleDeleteImage(p)} />
                    </div>
                )}
                <div className="add-images-wrapper">
                    <label htmlFor='add-images' className="add-images-label">+</label>
                    <TextField InputLabelProps={id !== undefined ? { shrink: id !== undefined } : ''} margin="dense" size="small" label='' type='file' className="add-images-input" id='add-images' multiple={true} accept='image/*' onChange={handleAddPics} />
                </div>
            </div>
            {pics.length > 0 && 'Click on image to delete it'}



        </div>
        {id === undefined &&
            <div className="block"  style={{ textAlign: 'center' }}>
                <Button variant='outlined' onClick={handleCreateBusiness}>
                    Add {businessType}
                </Button>                
                {formErrorMessage && <p style={{ color: 'red', fontSize:'12pt' }}>Please fill all the form fields</p>}
            </div>
        }
        {id !== undefined &&
            <div className="block" style={{ display: 'grid', gridTemplateColumns: 'auto auto auto', justifyItems: 'center' }}>
                <Button variant='contained' margin="dense" size="small" onClick={() => {
                    setIsDialog(true);
                    setDialogConfirm('cancel');
                    setDialogContent('Discard changes?')
                }}><Cancel /> Cancel</Button>
                <Button variant='contained' margin="dense" size="medium" onClick={handleSubmitChanges}>Submit Changes</Button>
                <Button variant='contained' margin="dense" size="small" onClick={() => {
                    setIsDialog(true);
                    setDialogConfirm('delete');
                    setDialogContent('Are you sure you want to delete this ' + businessType.toLowerCase() + '?')
                }} ><Delete /> Delete</Button>
            </div>
        }

    </div>)
}