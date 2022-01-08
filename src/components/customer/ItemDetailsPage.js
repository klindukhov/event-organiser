/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import '../../styles/customer/ItemDetailsPage.css'
import 'react-slideshow-image/dist/styles.css'
import { Slide } from 'react-slideshow-image';
import StarRatings from 'react-star-ratings';

import pplIcon from '../../images/pplIcon.png';

import accIcon from '../../images/accIcon250.png'
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

    useEffect(() => {
        if (itemType !== '') {
            apiFetch(`${itemType}/allowed/${id}/detail`)
                .then(result => {
                    setItemDetails(result);
                    setSlideImages(result.images);
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
            window.localStorage.setItem('locationDetails', JSON.stringify(itemDetails));
            history.push('/EventDetailsPage/new');
        } else if (typeOfItem === "Catering") {
            if (forEventId === undefined) {
                alert('You have to pick venue first');
                history.push('/ListPage/Venues');
            } else {
                if (window.localStorage.getItem('cateringInfo') !== null && window.localStorage.getItem('cateringInfo') !== undefined) {
                    let t = JSON.parse(window.localStorage.getItem('cateringInfo'));
                    if (t.indexOf(itemDetails) === -1) {
                        t.push(itemDetails);
                        window.localStorage.setItem("cateringInfo", JSON.stringify(t));
                    }
                    history.push(`/EventDetailsPage/${forEventId}`)
                } else {
                    let t = [];
                    t.push(itemDetails);
                    window.localStorage.setItem("cateringInfo", JSON.stringify(t));
                    history.push(`/EventDetailsPage/${forEventId}`)
                }

            }
        } else if (typeOfItem === "Service") {
            if (forEventId === undefined) {
                alert('You have to pick venue first');
                history.push('/ListPage/Venues');
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

    const handleDeleteBusiness = () => {
        if (typeOfItem === 'Catering') {
            apiFetch(`caterings/delete?id=${id}`, 'DELETE').then(() => history.push('/ListPage/Caterings')).catch(error => console.log('error', error))
        }
        if (typeOfItem !== 'Catering') {
            apiFetch(`${itemType}?id=${id}`, 'DELETE').then(() => history.push(`/ListPage/${typeOfItem}s`)).catch(error => console.log('error', error))
        }
    }

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


    return (
        <div className='main'>
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
                            Description: {itemDetails["description"]} <br />
                            {typeOfItem === "Venue" && <>
                                Seats: {itemDetails["seatingCapacity"]} people<br />
                                Standing capacity: {itemDetails["seatingCapacity"]} people<br />
                                Square meters: {itemDetails["sizeInSqMeters"]}<br />
                                Features: {itemDetails["descriptions"] && itemDetails["descriptions"].map(d => <div key={d}>"{d}"</div>)}
                            </>}
                            {typeOfItem === "Catering" && <>
                                {itemDetails.cuisines !== null && itemDetails.cuisines !== undefined && <>Cuisines: {itemDetails.cuisines.map(l => '"' + l.name + '" ')}<br /></>}
                                City: {itemDetails.address && itemDetails.address.city}
                            </>}
                            {typeOfItem === "Service" && <>
                                {itemDetails.translationLanguages !== null && <>{itemDetails.translationLanguages !== undefined && <>Languages: {itemDetails.translationLanguages.map(l => l.name + ' ')}<br /></>}</>}
                                {itemDetails.musicStyle !== null && <>{itemDetails.musicStyle !== undefined && <>Styles: {itemDetails.musicStyle.map(l => '"' + l.name + '" ')}<br /></>}</>}
                                {itemDetails.instrument !== null && <>Instrument: {itemDetails.instrument}<br /></>}
                                {itemDetails.kidAgeFrom !== null && <>{itemDetails.kidAgeTo !== itemDetails.kidAgeFrom && <>Ages: {itemDetails.kidAgeFrom + '-' + itemDetails.kidAgeTo}</>}<br /></>}
                                {itemDetails.kidAgeFrom !== null && <>{itemDetails.kidAgeTo === itemDetails.kidAgeFrom && <>Ages: {itemDetails.kidAgeFrom}</>}<br /></>}
                                {itemDetails.kidAgeFrom === null && <>{itemDetails.kidAgeTo !== null && <>Ages: {0 + '-' + itemDetails.kidAgeTo}</>}<br /></>}
                                {itemDetails.kidAgeFrom !== null && <>{itemDetails.kidAgeTo === null && <>Ages: {itemDetails.kidAgeFrom + '+'}</>}<br /></>}
                            </>}
                        </div>
                    </div>
                    <div className='item-contact-rect'>
                        <div className='contact-acc-info'>
                            <div>
                                Phone number: {itemDetails["phoneNumber"]}<br />
                                Email: {itemDetails["email"]}<br />
                                {typeOfItem === "Venue" && <>
                                    Address: {itemDetails.address && <>{itemDetails.address.streetName + ' ' + itemDetails.address.streetNumber + ', ' + itemDetails.address.city}</>}<br />
                                    {itemDetails["dailyRentCost"] !== '0.00' && <>Cost: {itemDetails["dailyRentCost"]} pln/day<br /></>}
                                </>}
                                {typeOfItem === "Catering" && <>
                                    Service cost: {itemDetails["serviceCost"]} pln
                                </>}
                                {typeOfItem === "Service" && <>
                                    Service cost: {itemDetails["serviceCost"]} pln
                                </>}

                            </div>
                        </div>
                        {typeOfItem !== 'Event' && <>
                            {props.authorized === false &&
                                <input type='button' className='add-to-event-button' value='Add to event' onClick={handleAddToEvent} />
                            }
                            {props.authorized === true && props.userData.user.type === 'C' &&
                                <input type='button' className='add-to-event-button' value='Add to event' onClick={handleAddToEvent} />
                            }
                            {props.authorized === true && props.userData.user.type === 'B' &&
                                <input type='button' className='add-to-event-button' value={`Delete ${typeOfItem}`} onClick={handleDeleteBusiness} />
                            }
                        </>}
                        {typeOfItem === 'Event' && <>
                            {props.authorized === true && props.userData.user.type === 'C' &&
                                <input type='button' className='add-to-event-button' value='Edit event' onClick={() => history.push(`/EventDetailsPage/${id}`)} />
                            }
                        </>}
                    </div>
                </div>
            </div>
            {typeOfItem === "Catering" && <>
                {itemDetails.cateringItems !== undefined && ((itemDetails.cateringItems !== null && itemDetails.cateringItems.length > 0) || (props.authorized === true && props.userData.user.type === "B")) &&
                    <div className='block'>
                        <p className='item-review-heading'>Menu{props.authorized === true && props.userData.user.type === "B" && !isMenuEdited && <input type='button' class='x-button' value='✎' onClick={handleMenuEdit} />}</p>
                        {cateringItemTypes.map(t => <div key={t}>
                            <p className='item-info-heading'>{t}s</p>
                            {itemDetails.cateringItems.filter(l => l.type === t).map(c => <div className="catering-menu-item" key={c.id}>
                                <div className="menu-item-left">{c.name}{isMenuEdited && <input type='button' class='x-button' value='x' onClick={() => handleDeleteMenuItem(c.id)} />}<br />
                                    {c.description}<br /></div>
                                <div className="menu-item-right">{c.servingPrice}<br />
                                    {Object.keys(c).filter(k => c[k] === true).map(i => '"' + i + '" ')}<br /></div>
                            </div>)}
                        </div>)}
                        {isMenuEdited &&
                            <>
                                <p className='item-info-heading'>New menu entry</p>
                                Name
                                <input className="input" onChange={e => setDishName(e.target.value)} />
                                Price
                                <input className="input" onChange={e => setDishPrice(e.target.value)} />
                                Type
                                <select className="input" onChange={e => setDishType(e.target.value)}>
                                    <option value=''>choose</option>
                                    {availableDishTypes.map(t => <option value={t}>{t}</option>)}
                                </select><br />
                                Description
                                <textarea className="input" onChange={e => setDishDescription(e.target.value)} />
                                Vegan
                                <input type="checkbox" onChange={e => setDishVegan(e.target.value === 'on' ? true : false)} /> Vegeterian
                                <input type="checkbox" onChange={e => setDishVegetarian(e.target.value === 'on' ? true : false)} /> Gluten free
                                <input type="checkbox" onChange={e => setDishGlutenFree(e.target.value === 'on' ? true : false)} /><br />
                                <input type="button" value='Submit' className="button" onClick={handleSubmitMenu} style={{marginRight: "15px"}}/>
                                <input type="button" value='Cancel' className="button" onClick={() => setIsMenuEdited(false)} />
                            </>}
                    </div>}
            </>}
            {(typeOfItem === "Venue" || typeOfItem === "Catering") &&
                <div className='block'>
                    <p className='item-review-heading'>Available {aliasItemType}</p>
                    {itemDetails[aliasItemType] && itemDetails[aliasItemType].map(c => <div key={c.id} className='list-element' style={{ width: '1420px', marginBottom: '30px' }} onClick={() => handleAliasItemChoice(c.id)}>
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
                                        {c.name}, {c.address.city}, {c.address.streetName}, {c.address.streetNumber}<br />
                                    </>}
                                    {c.description}
                                    {aliasItemType === "locations" && <>
                                        <img className='ppl-icon' alt='ppl-icon' src={pplIcon} />
                                        {c.seatingCapacity}
                                    </>}
                                </div>
                                <div className='overlay-listing-right'>
                                    {aliasItemType === "services" && <>
                                        Service cost: {c.serviceCost} pln<br />
                                    </>}
                                    {aliasItemType === "caterings" && <>
                                        Service cost: {c.serviceCost} pln<br />
                                    </>}
                                    {aliasItemType === "locations" && <>
                                        From {c.dailyRentCost}pln/day
                                    </>}

                                </div>
                            </div>
                            <div className='list-item-pics' style={{ width: '1420px' }}>
                                {aliasItemType === "locations" && c.images.map(i => <div key={i.image}>
                                    <img alt={i.name} className='list-item-pic' src={'data:image/png;base64,' + i.encodedImage} />
                                </div>)}
                            </div>
                        </div>
                    </div>)}
                </div>
            }
            {typeOfItem !== 'Event' && <>
                {itemDetails.businessHours !== null && <> {itemDetails.businessHours !== undefined && <div className='block'>
                    <p className='item-info-heading'>Business hours</p>
                    <div className="business-hours">
                        {businessHours.map(d =>
                            <div key={d}>
                                {d.day}<br />
                                {d.timeFrom}<br />
                                {d.timeTo}<br />
                            </div>)}
                    </div>

                </div>}</>}
                <div className='block'>
                    <p className='item-review-heading'>Reviews</p>
                    {reviews.length > 0 &&
                        reviews.map(r =>
                            <div key={r.id} className='item-review-div'>
                                <div className='reviewer-info'>
                                    <img alt='acc-pic' src={accIcon} className='contact-acc-pic1' />
                                    <p className='reviewer-name'> {r.customer.firstName} {r.customer.lastName} <br /> "{r.title}" {'\u{2605}'.repeat(r.starRating)} </p>
                                </div>
                                <div className='item-review-text'>
                                    {r.comment}
                                </div>
                            </div>
                        )}
                    {props.authorized === true && props.userData.user.type === "C" && <>
                        <div className='reviewer-info'>
                            <img alt='acc-pic' src={accIcon} className='contact-acc-pic1' />
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
                        <input className='review-submit-button' type='button' value='Submit' onClick={handleSubmitReview} />
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