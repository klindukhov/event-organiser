import '../../styles/App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import React from 'react';
import { Route, Switch } from 'react-router-dom'


import HomePage from '../HomePage'
import CustomerHomePage from '../CustomerHomePage'
import SignIn from '../SignInPage'
import SignUp from '../SignUpPage'
import CreatePersonal from '../CreatePersonalPage'
import CreateBusiness from '../CreateBusinessPage'
import CreateEvent from '../CreateEventPage'
import Header from './Header'
import FetchTest from '../FetchTest'
import Users from '../Users'
import Caterings from '../Caterings'
import Review from '../Review'
import VenuesPage from '../VenuesPage'

export default function App() {

  return (
    <Switch>
      <Route exact path='/' component={HomePage} />
      <Route exact path='/' component={Header} />

      <Route path='/signIn' component={SignIn} />
      <Route path='/signUp' component={SignUp} />
      <Route path='/createPersonalAccount' component={CreatePersonal} />
      <Route path='/createBusinessAccount' component={CreateBusiness} />
      <Route path='/createEvent' component={CreateEvent} />
      <Route path='/customerHome' component={CustomerHomePage} />
      <Route path='/FetchTest' component={FetchTest} />
      <Route path='/users' component={Users} />
      <Route path='/caterings' component={Caterings} />
      <Route path='/review' component={Review} />
      <Route path='/VenuesPage' component={VenuesPage} />
      
    </Switch>
  )

}

