import '../../styles/App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import React from 'react';
import { Route, Switch } from 'react-router-dom'


import HomePage from '../HomePage'
import CustomerHomePage from '../CustomerHomePage'
import SignIn from '../SignInPage'
import SignInTest from '../SignInPageTest'
import SignUp from '../SignUpPage'
import CreateEvent from '../CreateEventPage'
import Header from './Header'
import VenuesPage from '../VenuesPage'
import CustomerProfile from '../CustomerProfilePage'
import BusinessProfile from '../BusinessProfilePage';
import ContactFormPage from '../ContactFormPage';
import NewEventPage from '../NewEventPage';
import RestaurantPage from '../RestaurantPage';

export default function App(props) {
  const setProps = (p) =>{
    props.myProps.cach=p;
  }

  props.myProps.setProps = setProps;

  return (
    <Switch >
      <Route exact path='/'  render={() => <HomePage {...props.myProps}/>} />
      <Route exact path='/' component={Header} />

      <Route path='/signIn' render={() => <SignIn {...props.myProps}/>} />
      <Route path='/signInTest' render={() => <SignInTest {...props.myProps}/>} />
      <Route path='/signUp' render={() => <SignUp {...props.myProps}/>} />
      <Route path='/createEvent' render={() => <CreateEvent {...props.myProps}/>} />
      <Route path='/customerHome' render={() => <CustomerHomePage {...props.myProps}/>} />
      <Route path='/VenuesPage'  render={() => <VenuesPage {...props.myProps}/>}/>
      <Route path='/CustomerProfilePage' render={() => <CustomerProfile {...props.myProps}/>} />
      <Route path='/BusinessProfilePage' render={() => <BusinessProfile {...props.myProps}/>} />
      <Route path='/ContactFormPage' render={() => <ContactFormPage {...props.myProps}/>} />
      <Route path='/NewEventPage' render={() => <NewEventPage {...props.myProps}/>} />
      <Route path='/RestaurantPage' render={() => <RestaurantPage {...props.myProps}/>} />
      
    </Switch>
  )

}

