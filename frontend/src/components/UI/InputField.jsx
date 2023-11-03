import { useEffect } from "react";
import useInputValidator from "../hooks/use-input-validator";
import classes from "./InputField.module.css";

/**
 * Generic input field.
 * @param {object} props The following props are mandatory:
 * - type (string): Input field type.
 * - id (string): Field id.
 * - name (string): Field name
 * - validator (function): Function to use for field validation. The function must
 * accept the current field value as the only argument.
 *
 * Optional props:
 * - label (string): Label for the input field.
 * - placeholder (string): Placeholder for the input field.
 * - errorMsg (string): Optional error message to display when the field is invalid.
 * - value (any): Optional initial value.
 * - fieldIsValid (function): Function that will be called to let the parent know if the
 * field current value is valid.
 * - onClick (function): Function to be called when the click event is triggered.
 * - onChange (function): Function to be called when the change event is triggered.
 * - onBlur (function): Function to be called when the blur event is triggered.
 *
 * @returns JSX
 */
const InputField = (props) => {
  const [value, isValid, changeHandler, touchHandler, blurHandler] =
    useInputValidator(
      props.value ? props.value : "",
      props.validator,
      props.onClick,
      props.onChange,
      props.onBlur
    );

  let nameClases = `${classes["form-control"]} ${props.className} `;
  if (isValid === false) {
    nameClases += `${classes.invalid}`;
  }

  useEffect(() => {
    const fieldIsValid = props.fieldIsValid;
    if (fieldIsValid && typeof fieldIsValid === "function") {
      fieldIsValid(() => {
        return isValid;
      });
    }
  }, [isValid]);

  return (
    <div className={nameClases}>
      {props.label && (
        <label htmlFor={props.id} className={classes.label}>
          {props.label}
        </label>
      )}
      <input
        className={classes.input}
        type={props.type}
        id={props.id}
        name={props.name}
        placeholder={props.placeholder}
        value={value}
        onChange={changeHandler}
        onClick={touchHandler}
        onBlur={blurHandler}
      />
      {isValid === false && (
        <p className={`${classes["error-text"]}`}>{props.errorMsg}</p>
      )}
    </div>
  );
};

export default InputField;
