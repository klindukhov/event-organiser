import '../../styles/general/App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import React from 'react';
import { Route, Switch } from 'react-router-dom'


import HomePage from '../customer/HomePage'
import SignIn from '../general/SignInPage'
import SignUp from '../general/SignUpPage'
import Header from './Header'
import VenuesPage from '../customer/VenuesPage'
import CustomerProfile from '../customer/CustomerProfilePage'
import BusinessProfile from '../business/BusinessProfilePage';
import ContactFormPage from '../general/ContactFormPage';
import NewEventPage from '../customer/NewEventPage';
import RestaurantPage from '../customer/RestaurantPage';
import BusinessHomePage from '../business/BusinessHomePage';
import AdminHomePage from '../admin/AdminHomePage';
import CateringsPage from '../customer/CateringsPage';
import ServicesPage from '../customer/ServicesPage';
import UsersPage from '../admin/UsersPage';
import ProblemsPage from '../admin/ProblemsPage';
import VerificationRequestsPage from '../admin/VerificationRequestsPage';
import ReservationsPage from '../admin/ReservationsPage';
import AdminSettingsPage from '../admin/AdminSettings';
import GuestBookPage from '../customer/GuestBookPage';

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

  const setGuests= (s) =>{
    setCart({
      ...cart,
      "guests": s
    });
    let temp = JSON.parse(window.localStorage.getItem('cart'));
    temp.guests = s;
    window.localStorage.setItem('cart', JSON.stringify(temp));
    console.log('guests updated')
  }

  props.myProps.cart = cart;
  props.myProps.setLocation = setLocation;
  props.myProps.setCatering = setCatering;
  props.myProps.setService = setService;
  props.myProps.setGuests = setGuests;


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
      <Route path='/UsersPage' render={() => <UsersPage {...props.myProps}/>} />
      <Route path='/ProblemsPage' render={() => <ProblemsPage {...props.myProps}/>} />
      <Route path='/VerificationRequestsPage' render={() => <VerificationRequestsPage {...props.myProps}/>} />
      <Route path='/ReservationsPage' render={() => <ReservationsPage {...props.myProps}/>} />
      <Route path='/AdminSettingsPage' render={() => <AdminSettingsPage {...props.myProps}/>} />
      <Route path='/GuestBookPage' render={() => <GuestBookPage {...props.myProps}/>} />
      
    </Switch>
  )

}

