/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import '../../styles/customer/ItemDetailsPage.css'
import 'react-slideshow-image/dist/styles.css'
import { Slide } from 'react-slideshow-image';
import StarRatings from 'react-star-ratings';
import { Avatar, Backdrop, Button, Checkbox, Chip, CircularProgress, Dialog, DialogActions, DialogContent, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Skeleton, TextField, Tooltip } from '@mui/material'
import VeganLogo from '../../images/veganLogo.png'
import VegetarianLogo from '../../images/vegetarianLogo.png'
import GlutenFreeLogo from '../../images/glutenFreeLogo.png'
import AirlineSeatLegroomNormalIcon from '@mui/icons-material/AirlineSeatLegroomNormal';

import pplIcon from '../../images/pplIcon.png';

import apiFetch from "../../api";

export default function ItemDetailsPage(props) {
    const { typeOfItem } = useParams();
    const [itemType, setItemType] = useState('');
    const [aliasItemType, setAliasItemType] = useState('');
    const { id } = useParams();
    const { forEventId } = useParams();
    useEffect(() => {
        if (typeOfItem === "Venue") {
            setItemType('locations');
            setAliasItemType('caterings');
        } else if (typeOfItem === "Catering") {
            setItemType('caterings');
            setAliasItemType('locations');
        } else if (typeOfItem === "Service") {
            setItemType('services')
        } else if (typeOfItem === "Event") {
            setItemType('events')
        }
        props.setHeaderMessage(typeOfItem);
    }, [id, typeOfItem])

    const history = useHistory();

    const [itemDetails, setItemDetails] = useState({});
    const [slideImages, setSlideImages] = useState([]);
    const [reviews, setReviews] = useState([]);

    const [rating, setRating] = useState();
    const [review, setReview] = useState('');
    const [title, setTitle] = useState('');
    const [reviewMessage, setReviewMessage] = useState('');

    const [cateringItemTypes, setCateringItemTypes] = useState([]);
    const [businessHours, setBusinessHours] = useState([]);

    const [aliasItemTypeDetails, setAliasItemTypeDetails] = useState([]);

    useEffect(() => {
        if (itemType !== '') {
            apiFetch(`${itemType}/allowed/${id}/detail`)
                .then(result => {
                    setItemDetails(result);
                    setSlideImages(result.images);
                    setOpen(false);
                    apiFetch(`${aliasItemType}/allowed/${itemType.substring(0, itemType.length - 1)}?${itemType === 'locations' ? 'id' : 'cateringId'}=${id}`).then(res => {
                        setAliasItemTypeDetails(res);
                        setIsLoading(false);
                    }).catch(e => console.log('error', e))
                })
                .catch(error => { console.log('error', error); setItemDetails({}); setSlideImages([]); });


            apiFetch(`reviews/${itemType.substring(0, itemType.length - 1)}/allowed/all?${itemType.substring(0, itemType.length - 1) + 'Id'}=${id}`)
                .then(result => setReviews(result.items))
                .catch(error => { console.log('error', error); setReviews([]) });
        }
    }, [itemType])

    useEffect(() => {
        if (itemDetails.businessHours) {
            let days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
            let bh = new Array(...itemDetails.businessHours);
            bh.sort((a, b) => (days.indexOf(a.day) > days.indexOf(b.day)) ? 1 : -1);
            setBusinessHours(bh);
        }
    }, [itemDetails])

    const changeRating = (newRating, name) => {
        setRating(newRating);
    }

    const handleSubmitReview = () => {
        if (title.length >= 3 && rating >= 1) {
            let raw = JSON.stringify({ "title": title, "comment": review, "starRating": rating });

            apiFetch(`reviews/${itemType.substring(0, itemType.length - 1)}?customerId=${props.userData.id}&${itemType.substring(0, itemType.length - 1)}Id=${id}`, "POST", raw)
                .catch(error => console.log('error', error));

            window.location.reload();
        } else {
            setReviewMessage('Please enter title and star rating')
        }

    }

    const handleAddToEvent = () => {
        if (typeOfItem === "Venue") {
            let temp = {
                "id": itemDetails.id,
                "images": itemDetails.images,
                "name": itemDetails.name,
                "address": itemDetails.address,
                "description": itemDetails.description,
                "dailyRentCost": itemDetails.dailyRentCost
            };
            window.localStorage.setItem('locationDetails', JSON.stringify(temp));
            history.push(`/EventDetailsPage/${forEventId === undefined ? 'new' : forEventId}`);
        } else if (typeOfItem === "Catering") {
            if (forEventId === undefined) {
                setIsDialog(true);
            } else {
                let temp = {
                    "id": itemDetails.id,
                    "images": itemDetails.images,
                    "name": itemDetails.name,
                    "address": itemDetails.address,
                    "description": itemDetails.description,
                    "serviceCost": itemDetails.serviceCost
                };
                if (window.localStorage.getItem('cateringInfo') !== null && window.localStorage.getItem('cateringInfo') !== undefined) {
                    let t = JSON.parse(window.localStorage.getItem('cateringInfo'));
                    if (t.indexOf(temp) === -1) {
                        t.push(temp);
                        window.localStorage.setItem("cateringInfo", JSON.stringify(t));
                    }
                    history.push(`/EventDetailsPage/${forEventId}`)
                } else {
                    let t = [];
                    t.push(temp);
                    window.localStorage.setItem("cateringInfo", JSON.stringify(t));
                    history.push(`/EventDetailsPage/${forEventId}`)
                }

            }
        } else if (typeOfItem === "Service") {
            if (forEventId === undefined) {
                setIsDialog(true);
            } else {
                if (window.localStorage.getItem('serviceInfo') !== null && window.localStorage.getItem('serviceInfo') !== undefined) {
                    let t = JSON.parse(window.localStorage.getItem('serviceInfo'));
                    if (t.indexOf(itemDetails) === -1) {
                        t.push(itemDetails);
                        window.localStorage.setItem("serviceInfo", JSON.stringify(t));
                    }
                    history.push(`/EventDetailsPage/${forEventId}`)
                } else {
                    let t = [];
                    t.push(itemDetails);
                    window.localStorage.setItem("serviceInfo", JSON.stringify(t));
                    history.push(`/EventDetailsPage/${forEventId}`)
                }

            }

        }
    }

    const handleAliasItemChoice = (id) => {
        if (aliasItemType === 'locations') {
            history.push(`/ItemDetails/Venue/${id}`);
        } else if (aliasItemType === 'services') {
            history.push(`/ItemDetails/Service/${id}`);
        } else {
            history.push(`/ItemDetails/Catering/${id}`);
        }
    }

    useEffect(() => {
        if (itemDetails.cateringItems) {
            setCateringItemTypes(itemDetails.cateringItems.map(l => l.type).filter((e, i) => itemDetails.cateringItems.map(l => l.type).indexOf(e) === i));
        }
    }, [itemDetails])

    const [isMenuEdited, setIsMenuEdited] = useState(false);
    const [dishName, setDishName] = useState(false);
    const [dishDescription, setDishDescription] = useState('');
    const [dishPrice, setDishPrice] = useState('');
    const [dishType, setDishType] = useState('');
    const [dishVegan, setDishVegan] = useState(false);
    const [dishVegetarian, setDishVegetarian] = useState(false);
    const [dishGlutenFree, setDishGlutenFree] = useState(false);
    const [availableDishTypes, setAvailableDishTypes] = useState([]);
    const handleMenuEdit = () => {
        apiFetch('catering/items/allowed/types').then(res => { setAvailableDishTypes(res) }).catch(e => console.log('error', e));
        setIsMenuEdited(true);
    }

    const handleSubmitMenu = () => {
        let body = JSON.stringify({ "name": dishName, "description": dishDescription, "servingPrice": dishPrice, "isVegan": dishVegan, "isVegetarian": dishVegetarian, "isGlutenFree": dishGlutenFree, "type": dishType });
        apiFetch(`catering/items?cateringId=${id}`, "POST", body).then(() => window.location.reload()).catch(e => console.log('error', e));
    }

    const handleDeleteMenuItem = (itemId) => {
        apiFetch(`catering/items?id=${itemId}`, "DELETE").then(() => window.location.reload()).catch(e => console.log('error', e));
    }

    const [emailText, setEmailText] = useState('');
    const [emailSubject, setEmailSubject] = useState('');

    const sendEmail = () => {
        if (emailSubject !== '' && emailText !== '') {
            let body = JSON.stringify({ "subject": emailSubject, "content": emailText });
            apiFetch(`customers/message/${itemType.substring(0, itemType.length - 1)}/send?customerId=${props.userId}&${itemType.substring(0, itemType.length - 1)}Id=${id}`, "POST", body).catch(e => console.log('error' + e));
        }
    }

    const [open, setOpen] = useState(false);
    const [isDialog, setIsDialog] = useState(false);

    useEffect(() => { setOpen(true) }, [typeOfItem])

    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => { setIsLoading(true) }, [typeOfItem])



    return (
        <div className='main'>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Dialog
                open={isDialog}
                onClose={() => setIsDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent style={{ width: '400px', height: '250px', display: 'grid', justifyContent: 'center', alignContent: "center", fontSize:'18pt' }}>
                    You have to pick venue first!
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => history.push('/ListPage/Venues')} autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
            <div className='gallery-info-div'>
                <div className='item-gallery-rect'>
                    <div>
                        {slideImages && <Slide >
                            {slideImages.map(i =>
                                <div key={i.name} className="each-slide">
                                    <div style={{ backgroundImage: `url(${'data:image/png;base64,' + i.encodedImage})` }}>
                                    </div>
                                </div>
                            )}

                        </Slide>}
                    </div>

                </div>
                <div className='item-info-div'>
                    <div className='item-info-rect'>
                        {!open && <>
                            <div className='item-info-heading'>
                                {itemDetails["name"]}
                                {typeOfItem === "Service" && <>
                                    {itemDetails["firstName"] + ' ' + itemDetails["lastName"]}<br />
                                    {itemDetails["type"]}{itemDetails.musicBandPeopleCount !== null && <>({itemDetails.musicBandPeopleCount} people)</>}
                                    {itemDetails.kidPerformerType !== null && <>, {itemDetails.kidPerformerType}</>}
                                </>}
                            </div>
                            <br />
                            <div className='item-description-p'>
                                <span style={{ fontSize: '12pt' }}>
                                    Description: </span>
                                {itemDetails["description"]} <br />
                                {typeOfItem === "Venue" && <>
                                    <span style={{ fontSize: '12pt' }}>
                                        Seats: </span>
                                    {itemDetails["seatingCapacity"]} people<br />
                                    <span style={{ fontSize: '12pt' }}>
                                        Standing capacity: </span>
                                    {itemDetails["seatingCapacity"]} people<br />
                                    <span style={{ fontSize: '12pt' }}>
                                        Square meters: </span>
                                    {itemDetails["sizeInSqMeters"]}<br />
                                    <span style={{ fontSize: '12pt' }}>
                                        Features: </span>
                                    {itemDetails["descriptions"] && itemDetails["descriptions"].map(d => <Chip key={d} label={d} style={{ marginRight: '5px' }} />)}
                                </>}
                                {typeOfItem === "Catering" && <>
                                    {itemDetails.cuisines !== null && itemDetails.cuisines !== undefined && <>
                                        <span style={{ fontSize: '12pt' }}>
                                            Cuisines: </span> {itemDetails.cuisines.map(l => <Chip label={l.name} style={{ marginRight: '5px' }} />)}<br /></>}
                                    <span style={{ fontSize: '12pt' }}>
                                        City: </span>
                                    {itemDetails.address && itemDetails.address.city}
                                </>}
                                {typeOfItem === "Service" && <>
                                    {itemDetails.translationLanguages !== null && <>{itemDetails.translationLanguages !== undefined && <><span style={{ fontSize: '12pt' }}>Languages: </span>{itemDetails.translationLanguages.map(l => <Chip label={l.name} style={{ marginRight: '5px' }} />)}<br /></>}</>}
                                    {itemDetails.musicStyle !== null && <>{itemDetails.musicStyle !== undefined && <><span style={{ fontSize: '12pt' }}>Styles: </span> {itemDetails.musicStyle.map(l => <Chip label={l.name} style={{ marginRight: '5px' }} />)}<br /></>}</>}
                                    {itemDetails.instrument !== null && <><span style={{ fontSize: '12pt' }}>Instrument: </span> {itemDetails.instrument}<br /></>}
                                    {itemDetails.kidAgeFrom !== null && <>{itemDetails.kidAgeTo !== itemDetails.kidAgeFrom && <><span style={{ fontSize: '12pt' }}>Ages: </span> {itemDetails.kidAgeFrom + '-' + itemDetails.kidAgeTo}</>}<br /></>}
                                    {itemDetails.kidAgeFrom !== null && <>{itemDetails.kidAgeTo === itemDetails.kidAgeFrom && <><span style={{ fontSize: '12pt' }}>Ages: </span> {itemDetails.kidAgeFrom}</>}<br /></>}
                                    {itemDetails.kidAgeFrom === null && <>{itemDetails.kidAgeTo !== null && <><span style={{ fontSize: '12pt' }}>Ages: </span> {0 + '-' + itemDetails.kidAgeTo}</>}<br /></>}
                                    {itemDetails.kidAgeFrom !== null && <>{itemDetails.kidAgeTo === null && <><span style={{ fontSize: '12pt' }}>Ages: </span> {itemDetails.kidAgeFrom + '+'}</>}<br /></>}
                                </>}
                            </div>
                        </>}
                    </div>
                    <div className='item-contact-rect'>
                        {!open && <>
                            <div className='contact-acc-info'>
                                <div>
                                    {itemDetails["phoneNumber"] && <><span style={{ fontSize: '12pt' }}>Phone number: </span> {itemDetails["phoneNumber"]}<br /></>}
                                    <span style={{ fontSize: '12pt' }}>Email: </span> {itemDetails["email"]}<br />
                                    {typeOfItem === "Venue" && <>
                                        <span style={{ fontSize: '12pt' }}>Address: </span> {itemDetails.address && <>{itemDetails.address.streetName + ' ' + itemDetails.address.streetNumber + ', ' + itemDetails.address.city}</>}<br />
                                        {itemDetails["dailyRentCost"] !== '0.00' && <><span style={{ fontSize: '12pt' }}>Cost: </span> {itemDetails["dailyRentCost"]} pln/day<br /></>}
                                    </>}
                                    {typeOfItem === "Catering" && <>
                                        <span style={{ fontSize: '12pt' }}>Service cost: </span> {itemDetails["serviceCost"]} pln
                                    </>}
                                    {typeOfItem === "Service" && <>
                                        <span style={{ fontSize: '12pt' }}>Service cost: </span> {itemDetails["serviceCost"]} pln
                                    </>}

                                </div>
                            </div>
                            {typeOfItem !== 'Event' && <>
                                {(props.authorized === false || (props.authorized === true && props.userData.user && props.userData.user.type === 'C')) &&
                                    <Button variant='contained' className='add-to-event-button' onClick={handleAddToEvent}>Add to event</Button>
                                }
                                {props.authorized === true && props.userData.user && props.userData.user.type === 'B' &&
                                    <Button variant='contained' className='add-to-event-button' onClick={() => { history.push(`/AddBusinessPage/${typeOfItem}/${id}`) }}>{`Edit ${typeOfItem}`}</Button>
                                }
                            </>}
                            {typeOfItem === 'Event' && <>
                                {props.authorized === true && props.userData.user && props.userData.user.type === 'C' &&
                                    <input type='button' className='add-to-event-button' value='Edit event' onClick={() => history.push(`/EventDetailsPage/${id}`)} />
                                }
                            </>}
                        </>}
                    </div>
                </div>
            </div>
            {typeOfItem === "Catering" && <>
                {itemDetails.cateringItems !== undefined && ((itemDetails.cateringItems !== null && itemDetails.cateringItems.length > 0) || (props.authorized === true && props.userData.user && props.userData.user.type === "B")) &&
                    <div className='block'>
                        <p className='item-review-heading'>Menu{props.authorized === true && props.userData.user && props.userData.user.type === "B" && !isMenuEdited && <input type='button' class='x-button' value='✎' onClick={handleMenuEdit} />}</p>
                        {cateringItemTypes.map(t => <div key={t}>
                            <p className='item-info-heading'>{t}s</p>
                            {itemDetails.cateringItems.filter(l => l.type === t).map(c => <div className="catering-menu-item" key={c.id}>
                                <div className="menu-item-left"><span style={{ fontWeight: 'bold' }}>{c.name}</span>{isMenuEdited && <input type='button' class='x-button' value='x' onClick={() => handleDeleteMenuItem(c.id)} />}<br />
                                    {c.description}<br /></div>
                                <div className="menu-item-right"><span style={{ fontWeight: 'bold' }}>{c.servingPrice}</span><br />
                                    {c.isVegan && <Tooltip title='vegan'>
                                        <img alt='vegan' src={VeganLogo} style={{ height: '30px', width: '30px' }} />
                                    </Tooltip>}
                                    {c.isVegetarian && <Tooltip title='vegetarian'>
                                        <img alt='vegan' src={VegetarianLogo} style={{ height: '30px', width: '30px' }} />
                                    </Tooltip>}
                                    {c.isGlutenFree && <Tooltip title='gluten free'>
                                        <img alt='vegan' src={GlutenFreeLogo} style={{ height: '30px', width: '30px' }} />
                                    </Tooltip>}
                                    <br />
                                </div>
                            </div>)}
                        </div>)}
                        {isMenuEdited &&
                            <>
                                <p className='item-info-heading'>New menu entry</p>
                                <TextField size='small' style={{ marginRight: "15px", width: '250px' }} margin='dense' label='Name' onChange={e => setDishName(e.target.value)} />
                                <TextField size='small' style={{ marginRight: "15px", width: '250px' }} margin='dense' label="Price" onChange={e => setDishPrice(e.target.value)} />
                                <FormControl margin='dense' >
                                    <InputLabel id='select-menu-type'>Type</InputLabel>
                                    <Select labelId="select-manu-type" label='Type' size='small' style={{ width: '250px' }} onChange={e => setDishType(e.target.value)}>
                                        {availableDishTypes.map(t => <MenuItem value={t}>{t}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <br />
                                <TextField multiline style={{ marginRight: "15px", width: '780px' }} size='small' margin='dense' label='Description' className="input" onChange={e => setDishDescription(e.target.value)} />
                                <br />
                                <FormControlLabel control={<Checkbox onChange={e => setDishVegan(e.target.value === 'on' ? true : false)} />} label='Vegan' />
                                <FormControlLabel control={<Checkbox onChange={e => setDishVegetarian(e.target.value === 'on' ? true : false)} />} label='Vegeterian' />
                                <FormControlLabel control={<Checkbox onChange={e => setDishGlutenFree(e.target.value === 'on' ? true : false)} />} label='Gluten free' />
                                <br />
                                <Button variant='contained' size='small' margin='dense' onClick={handleSubmitMenu} style={{ marginRight: "15px" }}>Submit</Button>
                                <Button variant='contained' size='small' margin='dense' onClick={() => setIsMenuEdited(false)}>Cancel</Button>
                            </>}
                    </div>}
            </>}
            {typeOfItem !== 'Event' && itemDetails.businessHours !== null && <> {itemDetails.businessHours !== undefined && itemDetails.businessHours.length > 0 && <div className='block'>
                <p className='item-info-heading'>Business hours</p>
                <div className="business-hours">
                    {businessHours.map(d =>
                        <div key={d}>
                            <span style={{ fontWeight: 'bold' }}>{d.day}</span><br />
                            {d.timeFrom}<br />
                            {d.timeTo}<br />
                        </div>)}
                </div>
            </div>}
            </>}
            {(typeOfItem === "Venue" || typeOfItem === "Catering") &&
                <div className='block' style={{ height: '700px', overflow: 'auto' }}>
                    <p className='item-info-heading'>Available {aliasItemType}</p>
                    {isLoading &&
                        <Skeleton variant='rectangular' width={1420} height={400} ></Skeleton>
                    }
                    {aliasItemTypeDetails && !isLoading && aliasItemTypeDetails.map(c => <div key={c.id} className='list-element' style={{ width: '1420px', marginBottom: '30px' }} onClick={() => handleAliasItemChoice(c.id)}>
                        <div className='list-item' style={{ width: '1420px' }}>
                            <div className='overlay-listing' style={{ width: '1420px' }}>
                                <div className='overlay-listing-left'>
                                    {aliasItemType === "services" && <>
                                        {c.type + " " + c.firstName + " " + c.lastName}<br />
                                    </>}
                                    {aliasItemType === "caterings" && <>
                                        {c.name}<br />
                                    </>}
                                    {aliasItemType === "locations" && <>
                                        {c.name}{('★').repeat(c.rating)}<br />
                                    </>}
                                    <div style={{ fontSize: '14pt', width: '800px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                        {c.description}
                                    </div>
                                </div>
                                <div className='overlay-listing-right'>
                                    {aliasItemType === "services" && <>
                                        Service cost: {c.serviceCost} pln<br />
                                        {('★').repeat(c.rating)}
                                    </>}
                                    {aliasItemType === "caterings" && <>
                                        Service cost: {c.serviceCost} pln<br />
                                        {('★').repeat(c.rating)}
                                    </>}
                                    {aliasItemType === "locations" && <>
                                        From {c.dailyRentCost}pln/day <br />
                                        {' ' + c.seatingCapacity}
                                        <AirlineSeatLegroomNormalIcon />
                                        {' ' + c.standingCapacity}
                                        <img className='ppl-icon' alt='ppl-icon' src={pplIcon} />
                                    </>}

                                </div>
                            </div>
                            <div className='list-item-pics' style={{ width: '1420px' }}>
                                {c.images && c.images.map(i => <div key={i.image}>
                                    <img alt={i.name} className='list-item-pic' src={'data:image/png;base64,' + i.encodedImage} />
                                </div>)}
                            </div>
                        </div>
                    </div>)}
                </div>
            }

            {props.authorized === true && props.userData.user && props.userData.user.type === 'C' &&
                <div className='block'>
                    <p>You can contact the business through the form below</p>
                    <TextField size='small' margin='dense' label="Subject" onChange={e => setEmailSubject(e.target.value)} /><br />
                    <TextField size='small' margin='dense' multiline label="Body" onChange={e => setEmailText(e.target.value)} style={{ width: '100%' }} /><br />
                    <Button variant='contained' size='small' margin='dense' onClick={sendEmail}>Send</Button>
                </div>
            }
            {typeOfItem !== 'Event' && <>
                <div className='block'>
                    <p className='item-info-heading'>Reviews</p>
                    {reviews.length === 0 && <p style={{ textAlign: 'center' }}>No reviews yet</p>}
                    {reviews.length > 0 &&
                        reviews.map(r =>
                            <div key={r.id} className='item-review-div'>
                                <div className='reviewer-info'>
                                    <Avatar alt={r.customer.firstName} src={'data:image/png;base64,' + (r.customer.avatar?.encodedImage)} style={{ height: '80px', width: '80px' }} />
                                    <p className='reviewer-name'> {r.customer.firstName} {r.customer.lastName} <br /> "{r.title}" {'\u{2605}'.repeat(r.starRating)} </p>
                                </div>
                                <div className='item-review-text'>
                                    {r.comment}
                                </div>
                            </div>
                        )}
                    {props.authorized === true && props.userData.user && props.userData.user.type === "C" && <>
                        <div className='reviewer-info'>
                            <Avatar alt='acc-pic' src={'data:image/png;base64,' + props.userData?.avatar?.encodedImage} style={{ height: '100px', width: '100px' }} />
                            <div className='reviewer-name'> {props.userData && props.userData.firstName + " " + props.userData.lastName} <br /> <input className='write-title-div' placeholder='Write a title here' onChange={e => setTitle(e.target.value)} />
                                <StarRatings
                                    rating={rating}
                                    starRatedColor={getComputedStyle(document.querySelector(':root')).getPropertyValue('--txt')}
                                    changeRating={changeRating}
                                    numberOfStars={5}
                                    name='rating'
                                    starDimension="40px"
                                    starSpacing="15px"
                                    starHoverColor={getComputedStyle(document.querySelector(':root')).getPropertyValue('--txt')}
                                    starEmptyColor={getComputedStyle(document.querySelector(':root')).getPropertyValue('--bg')}
                                /> </div>
                        </div>
                        <textarea className='write-review-div' type='text' placeholder='Write your review here' onChange={e => setReview(e.target.value)} />
                        {reviewMessage}
                        <Button variant='contained' size="medium" value='Submit' onClick={handleSubmitReview}>Submit</Button>
                    </>}
                    {props.authorized === false &&
                        <div className='reviewer-name' style={{ textAlign: 'center' }}>
                            <Link to='/SignIn'>Sign in</Link> to leave a review
                        </div>
                    }
                </div>
            </>}

        </div>)
}