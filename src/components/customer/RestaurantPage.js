import React from "react";
import '../../styles/customer/RestaurantPage.css'
import 'react-slideshow-image/dist/styles.css'
import { Slide } from 'react-slideshow-image';
import StarRatings from 'react-star-ratings';

import accIcon from '../../images/accIcon250.png'
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";



export default function RestaurantPage(props) {
    const { id } = useParams();

    const history = useHistory();

    const [locationDetails, setLocationDetails] = useState({});
    const [slideImages, setSlideImages] = useState([]);
    const [reviews, setReviews] = useState([]);

    const [rating, setRating] = useState();
    const [review, setReview] = useState('');
    const [title, setTitle] = useState('');
    const [reviewMessage, setReviewMessage] = useState('');
    const [renderReviews, setRenderReviews] = useState(false);

    const [userName, setUserName] = useState();

    const [authorised, setAuthorised] = useState(false);

    useEffect(() => { setAuthorised(props.authorized) }, [props.authorized])

    useEffect(() => {
        props.setHeaderMessage("Venue");

        var myHeaders = new Headers();

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
            credentials: 'include'
        };

        fetch(`http://localhost:8080/api/locations/allowed/${id}/detail`, requestOptions)
            .then(response => response.json())
            .then(result => {
                setLocationDetails(result);
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

        fetch(`http://localhost:8080/api/reviews/location/allowed/all?locationId=${id}`, requestOptions)
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

            fetch(`http://localhost:8080/api/reviews/location?customerId=${props.userData.id}&locationId=${id}`, requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));

            window.location.reload();
        } else {
            setReviewMessage('Please enter title and star rating')
        }

    }

    const handleAddToEvent = () => {
        props.setLocation(locationDetails);
        history.push('/newEventPage');
    }

    return (
        <div className='restaurant-page-main'>
            <div className='gallery-info-div'>
                <div className='restaurant-gallery-rect'>
                    <div>
                        <Slide >
                            {slideImages.map(i =>
                                <div key={i.alt} className="each-slide">
                                    <div style={{ backgroundImage: `url(${i.image})` }}>
                                    </div>
                                </div>
                            )}

                        </Slide>
                    </div>

                </div>
                <div className='restaurant-info-div'>
                    <div className='restaurant-info-rect'>
                        <p className='restaurant-info-heading'>
                            {locationDetails["name"]}
                        </p>
                        <br />
                        <p className='restaurant-description-p'>
                            {locationDetails["description"]}<br />
                            Seats: {locationDetails["seatingCapacity"]} people<br />
                            Standing capacity: {locationDetails["seatingCapacity"]} people<br />
                            Square meters: {locationDetails["sizeInSqMeters"]}<br />
                            Features: {locationDetails["descriptions"] && locationDetails["descriptions"].map(d => <div key={d}>"{d}"</div>)}
                        </p>
                    </div>
                    <div className='restaurant-contact-rect'>
                        <div className='contact-acc-info'>
                            <div>
                                Phone number: {locationDetails["phoneNumber"]}<br />
                                Email: {locationDetails["email"]}<br />
                                Address: {locationDetails.address && <>{locationDetails.address.streetName + ' ' + locationDetails.address.streetNumber + ', ' + locationDetails.address.city}</>}<br/>
                                {locationDetails["dailyRentCost"] !== '0.00' && <>Cost: {locationDetails["dailyRentCost"]} pln/day<br /></>}

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
            <div className='restaurant-reviews-rect1'>
                <p className='rest-review-heading'>Available caterings</p>
                {locationDetails.caterings && locationDetails.caterings.map(c => <div key={c.name} className='restaurant-list-element' style={{ justifySelf: 'center', width: '1420px' }} onClick={() => history.push(`/CateringListingPage${c.id}`)}>
                    <div className='restaurant-listing' style={{ width: '1420px' }}>
                        <div className='overlay-listing' style={{ width: '1420px' }}>
                            <div className='overlay-listing-left'>
                                {c.name}<br />
                                {c.description}
                            </div>
                            <div className='overlay-listing-right'>
                                Service cost: {c.serviceCost} pln<br />
                            </div>
                        </div>
                        <div className='rest-listing-pics' style={{ width: '1420px' }}>
                        </div>
                    </div>
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
                {authorised === true && <>
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
                </>}
                {authorised === false &&
                    <div className='reviewer-name' style={{ textAlign: 'center' }}>
                        <Link to='/SignIn'>Sign in</Link> to leave a review
                    </div>
                }

            </div>
        </div>
    )
}