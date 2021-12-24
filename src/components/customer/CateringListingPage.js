import React from "react";
import 'react-slideshow-image/dist/styles.css'
import { Slide } from 'react-slideshow-image';
import StarRatings from 'react-star-ratings';

import accIcon from '../../images/accIcon250.png'
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import pplIcon from '../../images/pplIcon.png';

import '../../styles/customer/CateringListingPage.css'



export default function CateringListingPage(props) {
    const { id } = useParams();

    const history = useHistory();

    const [cateringDetails, setCateringDetails] = useState({});
    const [slideImages, setSlideImages] = useState([]);
    const [reviews, setReviews] = useState([]);

    const [rating, setRating] = useState();
    const [review, setReview] = useState('');
    const [title, setTitle] = useState('');
    const [reviewMessage, setReviewMessage] = useState('');
    const [renderReviews, setRenderReviews] = useState(false);

    const [cateringItemTypes, setCateringItemTypes] = useState([]);

    const [userName, setUserName] = useState();

    const [authorised, setAuthorised] = useState(false);

    useEffect(() => { setAuthorised(props.authorized) }, [props.authorized])

    useEffect(() => {
        props.setHeaderMessage("Catering");
        var myHeaders = new Headers();

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
            credentials: 'include'
        };

        fetch(`http://localhost:8080/api/caterings/allowed/${id}/detail`, requestOptions)
            .then(response => response.json())
            .then(result => {
                setCateringDetails(result);
                setSlideImages(result.images);
            })
            .catch(error => console.log('error', error));
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        var myHeaders = new Headers();

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
            credentials: 'include'
        };

        fetch(`http://localhost:8080/api/reviews/catering/allowed/all?id=${id}`, requestOptions)
            .then(response => response.json())
            .then(result => setReviews(result))
            .catch(error => console.log('error', error));
        // eslint-disable-next-line
    }, [])
    // eslint-disable-next-line
    useEffect(() => { if (props.user) { setUserName(props.user.firstName + " " + props.user.lastName) } }, [props.user]);
    useEffect(() => { if (reviews.length > 0) { setRenderReviews(true) } }, [reviews])

    const changeRating = (newRating, name) => {
        setRating(newRating);
    }

    const handleSubmitReview = () => {
        if (title.length >= 3 && rating >= 1) {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({ "title": title, "comment": review, "starRating": rating });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow',
                credentials: 'include'
            };

            fetch(`http://localhost:8080/api/reviews/catering?id=${props.userData.id}&cateringId=${id}`, requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));

            // window.location.reload();
        } else {
            setReviewMessage('Please enter title and star rating')
        }

    }

    useEffect(() => {
        if (cateringDetails.cateringItems) {
            setCateringItemTypes(cateringDetails.cateringItems.map(l => l.type).filter((e, i) => cateringDetails.cateringItems.map(l => l.type).indexOf(e) === i));
        }
    }, [cateringDetails])

    const handleAddToEvent = () => {
        try {
            props.setCatering(cateringDetails);
            history.push('/newEventPage');
        } catch (e) {
            history.push('/VenuesPage');
            alert('You have to pick venue first')
        }
    }

    return (
        <div className='restaurant-page-main'>
            <div className='gallery-info-div'>
                <div className='restaurant-gallery-rect'>
                    <div>
                        {slideImages && <Slide >
                            {slideImages.map(i =>
                                <div key={i.alt} className="each-slide">
                                    <div style={{ backgroundImage: `url(${i.image})` }}>
                                    </div>
                                </div>
                            )}

                        </Slide>}
                    </div>

                </div>
                <div className='restaurant-info-div'>
                    <div className='restaurant-info-rect' style={{ height: '380px', overflow: 'auto' }}>
                        <p className='restaurant-info-heading'>
                            {cateringDetails["name"]}
                        </p>
                        <br />
                        <p className='restaurant-description-p'>
                            {cateringDetails.cuisines !== null && <>{cateringDetails.cuisines !== undefined && <>Cuisines: {cateringDetails.cuisines.map(l => '"' + l.name + '" ')}<br /></>}</>}
                            Description: {cateringDetails["description"]} <br />
                            City: {cateringDetails.address && cateringDetails.address.city}
                        </p>
                    </div>
                    <div className='restaurant-contact-rect' style={{ height: 'auto' }}>
                        <div className='contact-acc-info'>
                            <div>
                                Phone number: {cateringDetails["phoneNumber"]}<br />
                                Email: {cateringDetails["email"]}<br />
                                Service cost: {cateringDetails["serviceCost"]} pln
                            </div>
                        </div>
                        {authorised === false &&
                            <input type='button' className='add-to-event-button' value='Add to event' onClick={handleAddToEvent} />
                        }
                        {authorised === true && props.userData.type === 'C' &&
                            <input type='button' className='add-to-event-button' value='Add to event' onClick={handleAddToEvent} />
                        }

                    </div>
                </div>
            </div>
            {cateringDetails.businessHours !== undefined && <>{cateringDetails.businessHours !== null && <> {cateringDetails.businessHours.length !== 0 && <div className='restaurant-reviews-rect1'>
                <p className='restaurant-info-heading'>Business hours</p>

            </div>}</>}</>}
            {cateringDetails.cateringItems !== undefined && <>{cateringDetails.cateringItems !== null && <> {cateringDetails.cateringItems.length !== 0 && <div className='restaurant-reviews-rect1'>
                <p className='rest-review-heading'>Menu</p>
                {cateringItemTypes.map(t => <div key={t}>
                    <p className='restaurant-info-heading'>{t}s</p>
                    {cateringDetails.cateringItems.filter(l => l.type === t).map(c => <div className="catering-menu-item" key={c.id}>
                        <div className="menu-item-left">{c.name}<br />
                            {c.description}<br /></div>
                        <div className="menu-item-right">{c.servingPrice}<br />
                            {Object.keys(c).filter(k => c[k] === true).map(i => '"' + i + '" ')}<br /></div>
                    </div>)}
                </div>)
                }
            </div>}</>}</>}
            <div className='restaurant-reviews-rect1'>
                <p className='rest-review-heading'>Available locations</p>
                {cateringDetails.locations && cateringDetails.locations.map(c => <div key={c.name} className='restaurant-list-element' style={{ justifySelf: 'center', width: '1420px' }} >
                    <Link to={`/RestaurantPage${Object.values(c)[0]}`} style={{ textDecoration: 'none' }}>
                        <div className='restaurant-listing' style={{ width: '1420px' }}>
                            <div className='overlay-listing' style={{ width: '1420px' }}>
                                <div className='overlay-listing-left' >
                                    {Object.values(c)[1]} , {Object.values(c)[10].city}, {Object.values(c)[10].streetName}/{Object.values(c)[10].streetNumber}<br />
                                    {Object.values(c)[6]}
                                    <img className='ppl-icon' alt='ppl-icon' src={pplIcon} />
                                    {Object.values(c)[4]}
                                </div>
                                <div className='overlay-listing-right'>
                                    From {Object.values(c)[8]}pln/day
                                </div>
                            </div>
                            <div className='rest-listing-pics' style={{ width: '1420px' }}>
                                {Object.values(c)[18].map(i => <div key={i.id}>
                                    <img alt={Object.values(i)[1]} className='rest-listing-pic' src={Object.values(i)[0]} />
                                </div>)}
                            </div>
                        </div>
                    </Link>
                </div>)}
            </div>
            <div className='restaurant-reviews-rect1'>
                <p className='rest-review-heading'>Reviews</p>
                {renderReviews &&
                    reviews.map(r =>
                        <div key={r.id} className='rest-review-div'>
                            <div className='reviewer-info'>
                                <img alt='acc-pic' src={accIcon} className='contact-acc-pic1' />
                                <p className='reviewer-name'> {r.customer.firstName} {r.customer.lastName} <br /> "{r.title}" {'\u{2605}'.repeat(r.starRating)} </p>
                            </div>
                            <div className='rest-review-text'>
                                {r.comment}
                            </div>
                        </div>
                    )}
                {authorised === true && <div>
                    <div className='reviewer-info'>
                        <img alt='acc-pic' src={accIcon} className='contact-acc-pic1' />
                        <div className='reviewer-name'> {userName} <br /> <input className='write-title-div' placeholder='Write a title here' onChange={e => setTitle(e.target.value)} />
                            <StarRatings
                                rating={rating}
                                starRatedColor="#47525e"
                                changeRating={changeRating}
                                numberOfStars={5}
                                name='rating'
                                starDimension="40px"
                                starSpacing="15px"
                                starHoverColor="#47525e"
                            /> </div>
                    </div>
                    <textarea className='write-review-div' type='text' placeholder='Write your review here' onChange={e => setReview(e.target.value)} />
                    {reviewMessage}
                    <input className='review-submit-button' type='button' value='Submit' onClick={handleSubmitReview} />
                </div>}
                {authorised === false &&
                    <div className='reviewer-name' style={{ textAlign: 'center' }}>
                        <Link to='/SignIn'>Sign in</Link> to leave a review
                    </div>
                }

            </div>
        </div>
    )
}