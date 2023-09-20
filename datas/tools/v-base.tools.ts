import {
    isValidEmail,
    isValidPhoneNumber,
    isNullOrEmptyString,
  } from 'x-framework-core';
  
  /**
   * generate an href string for linking to email addresses ...
   *
   * @param email the propper email address ...
   */
  export function getEmailHref(email: string) {
    //
    if (isNullOrEmptyString(email) || !isValidEmail(email)) {
      return '';
    }
  
    //
    return `mailto:${email}`;
  }
  
  /**
   * generate an href string for linking to phoneNumber ...
   *
   * @param phoneNumber the propper phone number ...
   */
  export function getPhoneNumberHref(phoneNumber: string) {
    //
    if (isNullOrEmptyString(phoneNumber) || !isValidPhoneNumber(phoneNumber)) {
      return '';
    }
  
    //
    return `tel:${phoneNumber}`;
  }
  