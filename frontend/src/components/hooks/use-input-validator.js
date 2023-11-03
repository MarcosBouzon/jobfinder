import { useState } from "react";

/**
 * Custom hook for input validation.
 * @param {*} initValue Initial field value.
 * 
 * Optional arguments:
 * - validateFunc Function to be used for input validation.
 * - onClick Function to be called on click event.
 * - onChange Function to be called on change event.
 * - onBlur Function to be called on blur event.
 *
 * @returns {[]} An array with the following values:
 * - value (any): The current field value.
 * - isValid (bool): Whether the field is valid or not.
 * - changeHandler (function): Handler for the onChange event.
 * - touchHandler (funtion): Handler for the onClick event.
 * - blurHandler (function): Handler for the onBlur event.
 */
const useInputValidator = (
  initValue,
  validateFunc,
  onClick,
  onChange,
  onBlur
) => {
  const [value, setValue] = useState(initValue || "");
  const [isValid, setIsValid] = useState(null);

  const changeHandler = (e) => {
    setValue(e.target.value);
    if (typeof onChange === "function") {
      onChange(e);
    }
  };

  const touchHandler = () => {
    setIsValid(true);
    if (typeof onClick === "function") {
      onClick(e);
    }
  };

  const blurHandler = (e) => {
    if (typeof validateFunc === "function") {
      setIsValid(validateFunc(e.target.value));
    }
    if (typeof onBlur === "function") {
      onBlur(e);
    }
  };

  return [value, isValid, changeHandler, touchHandler, blurHandler];
};

export default useInputValidator;
