// this is  billing detail that show on checkout page and than it show
//   room detail page where left side detail show and other side summary show
 
import { useState, useEffect } from "react";
import { Grid, TextField, MenuItem } from "@mui/material";
import { isValid } from "date-fns";

const countries = [
  "India",
  "USA",
  "Canada",
  "Australia",
  "Japan",
  "Germany",
  "Brazil",
  "South Africa",
  "France",
  "China",
  "UK",
  "Mexico",
  "Italy",
  "Spain",
  "Russia",
];

const BillingDetails = ({ onBillingDetailsChange }) => {
  const [formData, setFormData] = useState({
    country: "India",
    name: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    zipCode: "",
  });
//   Stores all input values
// Default country = India

   const [errors, setErrors] = useState({
//   Each field has:
// isError → true/false
// message → error text
    name: {
      isError: false,
      message: "",
    },

    email: {
      isError: false,
      message: "",
    },

    phone: {
      isError: false,
      message: "",
    },
    address: {
      isError: false,
      message: "",
    },

    state: {
      isError: false,
      message: "",
    },

    zipCode: {
      isError: false,
      message: "",
    },
  });

  const [isTouched, setIsTouched] = useState({
    name: false,
    email: false,
    phone: false,
    address: "",
    state: "",
    zipCode: "",
  });
  // you're creating a state object to track whether a user has interacted with each field.

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return re.test(email);
  };
  // Regex checks basic email format

  const validateField = (name, value) => {
    // function validates each field based on its name.
    switch (name) {
      case "name":
        return value.trim() === "" ? "name  is  required" : "";
        // If empty → return error message
      case "email":
        if (value.trim() === "") return "email is required";

        if (!validateEmail(value)) return "please  enter a valid email";

        return "";

      case "phone":
        return value.trim() === "" ? " phone is required" : "";

      case "address":
        return value.trim() === "" ? " address is required" : "";

      case "state":
        return value.trim() === "" ? " state is required" : "";

      case "zipCode":
        return value.trim() === "" ? " zipCode is required" : "";

      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Gets field name + value from input
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Keeps old data
    // Updates only changed field
    setIsTouched((prev) => ({ ...prev, [name]: true }));
    // Tracks user interaction
//     prev → previous state of isTouched
// { ...prev } → copy all existing fields
// [name]: true → update ONLY the field that changed
// This is dynamic key
// It means:
// If name = "email" → updates email
    const errorMessage = validateField(name, value);
    // name → which field (email, phone, etc.)
    // value → what user typed
    setErrors((prev) => ({
      ...prev,
     
// Copies all existing errors
      [name]: {
        isError: !!errorMessage,
        // !!errorMessage → converts to boolean
//         If error exists → true
// If no error → false/
        message: errorMessage,
        // Stores actual error text
      },
    }));
  };

  const handleBlur = (e) => {
//     Runs when user leaves input field
// Validates again
// Updates errors
    const { name, value } = e.target;
    // the input field that triggered the event
    const errorMessage = validateField(name, value);
    // Calls your validation function
    setErrors((prev) => ({
      ...prev,
      // Copies all existing errors
      [name]: {
        isError: !!errorMessage,
        // Converts message → boolean
        message: errorMessage,
        // Stores actual error text
      },
    }));
  };

  const validateForm = () => {
    let isValid = true;

    const newErrors = { ...errors };
    // Creates a copy of existing error state
    Object.keys(formData).forEach((key) => {  
//       bject.keys(formData) gives:
// ["country", "name", "email", "phone", "address", "state", "zipCode"]
// Loop runs once for each field
      if (key !== "country") {

        const errorMessage = validateField(key, formData[key]);
// Validate each field
        newErrors[key] = {
          isError: !!errorMessage,
          message: errorMessage,
          // message exists → isError: true
// no message → false
        };

        if (errorMessage) isValid = false;
        // If even ONE field has error:
// → whole form = invalid
      }
    });

    setErrors(newErrors);
    // Push updated errors to UI
    return isValid;
  };

  useEffect(() => {
    // Runs when formData changes
    if (onBillingDetailsChange) {
      // Passes data to parent component
      onBillingDetailsChange({
        data: formData,
        // Entire form values
        isValid: validateForm(),
        // Runs full validation AGAIN
      });
    }
  }, [formData]);
  // This effect runs EVERY TIME formData changes
  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <TextField
          select
          fullWidth
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange}
        >
          {/* value={formData.country} → controlled input
          onChange={handleChange} → event trigger */}
          {countries.map((country) => (
            <MenuItem key={country} value={country}>
              {country}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid size={12}>
        <TextField
          fullWidth
          label="Name *"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.name.isError}
         
// error is a boolean prop in MUI TextField
// It controls whether the field shows error styling
          helperText={errors.name.message}
//           helperText is what shows below the input field
// Usually used for hints or error messages
        />
      </Grid>
      <Grid size={12}>
        <TextField
          fullWidth
          label="Email *"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email.isError}
          helperText={errors.email.message}
        />
      </Grid>
      <Grid size={12}>
        <TextField
          fullWidth
          label="Phone *"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.phone.isError}
          helperText={errors.phone.message}
        />
      </Grid>
      <Grid size={12}>
        <TextField
          fullWidth
          label="Address *"
          name="address"
          value={formData.address}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.address.isError}
          helperText={errors.address.message}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="State *"
          name="state"
          value={formData.state}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.state.isError}
          helperText={errors.state.message}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Zip Code *"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.zipCode.isError}
          helperText={errors.zipCode.message}
        />
      </Grid>
    </Grid>
  );
};

export default BillingDetails;