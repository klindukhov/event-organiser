import '../../styles/general/App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import React from 'react';
import { Route, Switch } from 'react-router-dom'


import HomePage from '../customer/HomePage'
import SignIn from '../general/SignInPage'
import SignUp from '../general/SignUpPage'
import CustomerProfile from '../customer/CustomerProfilePage'
import BusinessProfile from '../business/BusinessProfilePage';
import ContactFormPage from '../general/ContactFormPage';
import EventDetailsPage from '../customer/EventDetailsPage';
import UsersPage from '../admin/UsersPage';
import ProblemsPage from '../admin/ProblemsPage';
import VerificationRequestsPage from '../admin/VerificationRequestsPage';
import GuestBookPage from '../customer/GuestBookPage';
import ProblemDetailsPage from '../admin/ProblemDetailsPage';
import UserDetailsPage from '../admin/UserDetailsPage'
import ReservationRequestsPage from '../business/ReservationRequestsPage';
import AddBusinessPage from '../business/AddBusinessPage';
import ForgotPassword from '../general/ForgotPassword';

import ItemDetailsPage from '../customer/ItemDetailsPage';
import ListPage from '../customer/ListPage';

import ResetPasswordPage from '../general/ResetPassword';

const ROUTES = {
  '/': HomePage,
  '/signIn': SignIn,
  '/signUp': SignUp,
  '/CustomerProfilePage': CustomerProfile,
  '/BusinessProfilePage': BusinessProfile,
  '/ContactFormPage': ContactFormPage,
  '/EventDetailsPage/:id/:adminUserId?': EventDetailsPage,
  '/UsersPage': UsersPage,
  '/ProblemsPage': ProblemsPage,
  '/VerificationRequestsPage': VerificationRequestsPage,
  '/GuestBookPage': GuestBookPage,
  '/ProblemDetailsPage:id': ProblemDetailsPage,
  '/UserDetailsPage:id': UserDetailsPage,
  '/ReservationRequestsPage': ReservationRequestsPage,
  '/AddBusinessPage/:businessType/:id?': AddBusinessPage,
  '/ItemDetails/:typeOfItem/:id/:forEventId?': ItemDetailsPage,
  '/ListPage/:typeOfList/:forEventId?': ListPage,
  '/reset:token' : ResetPasswordPage,
  '/forgotPassword' : ForgotPassword,
  '*': NotFound
}

export default function App({ myProps }) {
  return (
    <Switch >
      {Object.entries(ROUTES).map(([path, Component]) => (
        <Route key={path} exact path={path} render={() => <Component {...myProps} />} />
      ))}
    </Switch>
  )
}

function NotFound(){
  return(
    <div className='main'>
      <h1>404</h1>
    </div>
  )
}