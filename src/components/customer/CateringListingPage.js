import React from "react";
import 'react-slideshow-image/dist/styles.css'
import { Slide } from 'react-slideshow-image';
import StarRatings from 'react-star-ratings';

import accIcon from '../../images/accIcon250.png'
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";



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

    const [userName, setUserName] = useState();

    const [authorised, setAuthorised] = useState(false);

    useEffect(() => {setAuthorised(props.authorized)}, [props.authorized])

    useEffect(() => {
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

    const handleAddToEvent = () => {
        props.setCatering(cateringDetails);
        history.push('/newEventPage');
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
                    <div className='restaurant-info-rect'>
                        <p className='restaurant-info-heading'>
                            {cateringDetails["name"]}
                        </p>
                        <br />
                        <p className='restaurant-description-p'>
                            {cateringDetails["description"]}
                        </p>
                    </div>
                    <div className='restaurant-contact-rect'>
                        <div className='contact-acc-info'>
                            <div>
                                Contact<br />
                                {cateringDetails["phoneNumber"]}<br />
                                {cateringDetails["email"]}<br />
                            </div>
                        </div>
                        <input type='button' className='add-to-event-button' value='Add to event' onClick={handleAddToEvent} />

                    </div>
                </div>
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
                <div className='reviewer-name' style={{textAlign: 'center'}}>
                    <Link to='/SignIn'>Sign in</Link> to leave a review
                </div>
                }

            </div>
        </div>
    )
}