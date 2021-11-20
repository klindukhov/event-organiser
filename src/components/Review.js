import React, {useState} from 'react';
import '../styles/CateringsDetail.css';


export default function CaterngDetail() {
    const [titleField, setTitleField] = useState('');
    const [commentField, setCommentField] = useState('');
    const [ratingField, setRatingField] = useState('');
    const [cat, setCat] = useState([]);
    const [cats_rev, setCats_rev] = useState([]);
    

    
    const handleTitleInput = (event) => setTitleField(event.target.value);

    const handleCommentInput = (event) => setCommentField(event.target.value);

    const handleRatingInput = (event) => setRatingField(event.target.value);
    
    const handleReview = () => {
        let myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");

        let raw = JSON.stringify({ "Title": titleField, "comment": commentField , "starRating": ratingField});

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw
        };

        fetch("http://localhost:8080/api/catering_review/add", requestOptions)
            .then(response => {
                console.log(response.status);
                if(response.status !== 200){
                    alert('Something went wrong');
                }else{
                   alert('review posted')
                }})
            .catch(error => console.log('error', error));
    }

    window.onload = (event) => {
        fetch("http://localhost:8080/api/caterings/allowed?id="+localStorage.getItem('idCatering')).then(res => res.json()).then(cat => setCat(cat));
    };
    //const showReview = () =>  {
        window.onload = (event) => {
        fetch("http://localhost:8080/api/catering_review/by_catering?id_catering="+localStorage.getItem('idCatering')).then(res => res.json()).then(cats_rev => setCats_rev(cats_rev));
    };
    return(
        <div className='review-page-content'>
            <p> You are reviewing:  {cat.length} </p>
            <div className="details-rect">
                     <p> You are reviewing:  {Object.values(cat)[1]} </p>
                     <p> name: {Object.values(cat)[1]}</p>
                     <p> email: {Object.values(cat)[2]} </p>
                     <p> number: {Object.values(cat)[3]} </p>
                     <p> service cost: {Object.values(cat)[4]}</p>
                     <p> {Object.values(cat)[10]} </p>
                </div>  
            {/* <button onClick={showReview}>
               Show reviews
            </button> */}
             {cats_rev.map(c => <lo key={c.name}>
                 <div className='list-elements'>
                     <p> title: {Object.values(c)[1]}</p>
                     <p> comment: {Object.values(c)[2]} </p>
                     <p> star rating: {Object.values(c)[3]} </p>
                  </div>
                  </lo>)}
             <br></br>
             <div className="sign-in-rect">
                <div className="sign-in-h1">
                Leave a review
                </div>
                <p>Title</p>
                <input className="input-title" type="text" onChange={handleTitleInput}>
                </input>
                <p>Rating</p>
                <input className="input-rating" type="int" onChange={handleRatingInput}>
                </input>
                <br></br>
                <p>Comment</p>
                <input className="input-comment" type="text" onChange={handleCommentInput}>
                </input>
                <br></br>
                <button className="handle-rev"
                    onClick={handleReview}
                >
                    Submit
                </button>
                {/* </Link> */}
                <br></br>
           
        </div>
        </div>
    )
}

