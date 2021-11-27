import React from "react";
import '../styles/RestaurantPage.css'
import 'react-slideshow-image/dist/styles.css'
import { Slide } from 'react-slideshow-image';

import image1 from '../images/image1.png'
import image2 from '../images/image2.png'
import image3 from '../images/image3.png'

import accIcon from '../images/accIcon250.png'



export default function RestaurantPage() {
    const slideImages = [
        image1,
        image2,
        image3
    ];
    return (
        <div className='restaurant-page-main'>
            <div className='gallery-info-div'>
                <div className='restaurant-gallery-rect'>
                    <div>
                        <Slide >
                            <div className="each-slide">
                                <div style={{ backgroundImage: `url(${slideImages[0]})` }}>
                                </div>
                            </div>
                            <div className="each-slide">
                                <div style={{ backgroundImage: `url(${slideImages[1]})` }}>
                                </div>
                            </div>
                            <div className="each-slide">
                                <div style={{ backgroundImage: `url(${slideImages[2]})` }}>
                                </div>
                            </div>
                        </Slide>
                    </div>

                </div>
                <div className='restaurant-info-div'>
                    <div className='restaurant-info-rect'>
                        <p className='restaurant-info-heading'>
                            Restaurant1 <br />
                            Cuisine, description
                        </p>
                        <br />
                        <p className='restaurant-description-p'>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since
                        </p>
                    </div>
                    <div className='restaurant-contact-rect'>
                        Contact<br />
                        <div className='contact-acc-info'>
                            <img alt='acc-pic' src={accIcon} className='contact-acc-pic' />
                            <div>
                                Owner John<br />
                                +1234567890<br />
                                Email@ex.com<br />
                            </div>
                        </div>
                        <input type='button' className='add-to-event-button' value='Add to event' />

                    </div>
                </div>
            </div>
            <div className='restaurant-reviews-rect'>
                <input className='write-review-div' type='text' placeholder='Write your review here' />
                <input className='review-submit-button' type='button' value='Submit' />
            </div>
            <div className='restaurant-reviews-rect1'>
            <p className='rest-review-heading'>Reviews</p>
                <div className='rest-review-div'>
                    <div className='reviewer-info'>
                        <img alt='acc-pic' src={accIcon} className='contact-acc-pic1' />
                        <p className='reviewer-name'> John Customer </p>
                    </div>
                    <div className='rest-review-text'>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since,!!
                    </div>
                </div>
                <div className='rest-review-div'>
                    <div className='reviewer-info'>
                        <img alt='acc-pic' src={accIcon} className='contact-acc-pic1' />
                        <p className='reviewer-name'> John Customer </p>
                    </div>
                    <div className='rest-review-text'>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since,!!
                    </div>
                </div>
                <div className='rest-review-div'>
                    <div className='reviewer-info'>
                        <img alt='acc-pic' src={accIcon} className='contact-acc-pic1' />
                        <p className='reviewer-name'> John Customer </p>
                    </div>
                    <div className='rest-review-text'>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since,!!
                    </div>
                </div>
            </div>
        </div>
    )
}