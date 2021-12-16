import '../../styles/App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import React from 'react';
import { Route, Switch } from 'react-router-dom'


import HomePage from '../HomePage'
import SignIn from '../SignInPage'
import SignUp from '../SignUpPage'
import Header from './Header'
import VenuesPage from '../VenuesPage'
import CustomerProfile from '../CustomerProfilePage'
import BusinessProfile from '../BusinessProfilePage';
import ContactFormPage from '../ContactFormPage';
import NewEventPage from '../NewEventPage';
import RestaurantPage from '../RestaurantPage';
import BusinessHomePage from '../BusinessHomePage';
import AdminHomePage from '../AdminHomePage';
import CateringsPage from '../CateringsPage';
import ServicesPage from '../ServicesPage';
import { useEffect, useState } from 'react/cjs/react.development';

export default function App(props) {
  const setProps = (p) =>{
    props.myProps.cach=p;
  }
  props.myProps.setProps = setProps;

  const [cart, setCart] = useState({});
  useEffect(() => {
    setCart(JSON.parse(window.localStorage.getItem('cart')));
    // eslint-disable-next-line 
  }, [])

  const setLocation = (locs) =>{
    setCart({'locationDetails':locs});
    window.localStorage.setItem('cart', JSON.stringify({'locationDetails':locs}));
  }

  const setCatering = (catering) =>{
    setCart({
      ...cart,
      "catering": catering
    });
    let temp = JSON.parse(window.localStorage.getItem('cart'));
    temp.catering = catering;
    window.localStorage.setItem('cart', JSON.stringify(temp));
  }

  const setService= (s) =>{
    setCart({
      ...cart,
      "service": s
    });
    let temp = JSON.parse(window.localStorage.getItem('cart'));
    temp.service = s;
    window.localStorage.setItem('cart', JSON.stringify(temp));
  }

  props.myProps.cart = cart;
  props.myProps.setLocation = setLocation;
  props.myProps.setCatering = setCatering;
  props.myProps.setService = setService;

  return (
    <Switch >
      <Route exact path='/'  render={() => <HomePage {...props.myProps}/>} />
      <Route exact path='/' component={Header} />

      <Route path='/signIn' render={() => <SignIn {...props.myProps}/>} />
      <Route path='/signUp' render={() => <SignUp {...props.myProps}/>} />
      <Route path='/VenuesPage'  render={() => <VenuesPage {...props.myProps}/>}/>
      <Route path='/CustomerProfilePage' render={() => <CustomerProfile {...props.myProps}/>} />
      <Route path='/BusinessProfilePage' render={() => <BusinessProfile {...props.myProps}/>} />
      <Route path='/ContactFormPage' render={() => <ContactFormPage {...props.myProps}/>} />
      <Route path='/NewEventPage' render={() => <NewEventPage {...props.myProps}/>} />
      <Route path='/RestaurantPage:id' render={() => <RestaurantPage {...props.myProps}/>} />
      <Route path='/AdminHomePage' render={() => <AdminHomePage {...props.myProps}/>} />
      <Route path='/BusinessHomePage' render={() => <BusinessHomePage {...props.myProps}/>} />
      <Route path='/CateringsPage' render={() => <CateringsPage {...props.myProps}/>} />
      <Route path='/ServicesPage' render={() => <ServicesPage {...props.myProps}/>} />
      
    </Switch>
  )

}

