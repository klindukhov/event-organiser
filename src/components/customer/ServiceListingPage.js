import React from "react";
import 'react-slideshow-image/dist/styles.css'
import { Slide } from 'react-slideshow-image';
import StarRatings from 'react-star-ratings';

import accIcon from '../../images/accIcon250.png'
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";



export default function ServiceListingPage(props) {
    const { id } = useParams();

    const history = useHistory();

    const [authorised, setAuthorised] = useState(false);

    useEffect(() => { setAuthorised(props.authorized) }, [props.authorized])

    const [serviceDetails, setServiceDetails] = useState({});
    const [slideImages, setSlideImages] = useState([]);
    const [reviews, setReviews] = useState([]);

    const [rating, setRating] = useState();
    const [review, setReview] = useState('');
    const [title, setTitle] = useState('');
    const [reviewMessage, setReviewMessage] = useState('');
    const [renderReviews, setRenderReviews] = useState(false);

    const [userName, setUserName] = useState();

    useEffect(() => {
        props.setHeaderMessage("Additional service");

        var myHeaders = new Headers();

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
            credentials: 'include'
        };

        fetch(`http://localhost:8080/api/services/allowed?id=${id}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                setServiceDetails(result);
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

        fetch(`http://localhost:8080/api/reviews/service/allowed/all?id=${id}`, requestOptions)
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

            fetch(`http://localhost:8080/api/reviews/service?id=${props.userData.id}&serviceId=${id}`, requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));

            //window.location.reload();
        } else {
            setReviewMessage('Please enter title and star rating')
        }

    }

    const handleAddToEvent = () => {
        try {
            props.setService(serviceDetails);
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
                    <div className='restaurant-info-rect' style={{ height: '430px', overflow: 'auto' }}>
                        <p className='restaurant-info-heading'>
                            {serviceDetails["firstName"] + ' ' + serviceDetails["lastName"]}<br />
                            {serviceDetails["type"]}{serviceDetails.musicBandPeopleCount !== null && <>({serviceDetails.musicBandPeopleCount} people)</>}
                            {serviceDetails.kidPerformerType !== null && <>, {serviceDetails.kidPerformerType}</>}
                        </p>
                        <br />
                        <p className='restaurant-description-p'>
                            {serviceDetails.translationLanguages !== null && <>{serviceDetails.translationLanguages !== undefined && <>Languages: {serviceDetails.translationLanguages.map(l => l.name + ' ')}<br /></>}</>}
                            {serviceDetails.musicStyle !== null && <>{serviceDetails.musicStyle !== undefined && <>Styles: {serviceDetails.musicStyle.map(l => '"' + l.name + '" ')}<br /></>}</>}
                            {serviceDetails.instrument !== null && <>Instrument: {serviceDetails.instrument}<br/></>}
                            {serviceDetails.kidAgeFrom !== null && <>{serviceDetails.kidAgeTo !== serviceDetails.kidAgeFrom && <>Ages: {serviceDetails.kidAgeFrom + '-' + serviceDetails.kidAgeTo}</>}<br/></>}
                            {serviceDetails.kidAgeFrom !== null && <>{serviceDetails.kidAgeTo === serviceDetails.kidAgeFrom && <>Ages: {serviceDetails.kidAgeFrom}</>}<br/></>}
                            {serviceDetails.kidAgeFrom === null && <>{serviceDetails.kidAgeTo !== null && <>Ages: {0 + '-' + serviceDetails.kidAgeTo}</>}<br/></>}
                            {serviceDetails.kidAgeFrom !== null && <>{serviceDetails.kidAgeTo === null && <>Ages: {serviceDetails.kidAgeFrom + '+'}</>}<br/></>}
                            Description: {serviceDetails["description"]}
                        </p>
                    </div>
                    <div className='restaurant-contact-rect' style={{ height: 'auto' }}>
                        <div className='contact-acc-info'>
                            <div >
                                Contact: {serviceDetails["email"]}<br />
                                Service cost: {serviceDetails["serviceCost"]} pln/h
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
            {serviceDetails.businessHours !== null && <> {serviceDetails.businessHours !== undefined && <div className='restaurant-reviews-rect1'>
                <p className='restaurant-info-heading'>Business hours</p>

            </div>}</>}
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