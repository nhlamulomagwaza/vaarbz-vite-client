import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import '../../styles/components/auth.scss';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useContext } from 'react';
import { ScaleLoader } from 'react-spinners';
import { useController } from 'react-hook-form';
import { VaarbzContext } from '../store/VaarbzContext';
const Sign = () => {
    const { authUser, setAuthUser } = useContext(VaarbzContext);
    // State for profile picture
    const [profilePicture, setProfilePicture] = useState(null);
    //CONSTANTS AND DECLARATIONS
    //const [toggleForms, setToggleForms] = useState(true);
    //ZOD AND REACT HOOK FORM VALIDATIONS
    let Gender;
    (function (Gender) {
        Gender["Male"] = "male";
        Gender["Female"] = "female";
    })(Gender || (Gender = {}));
    const schema = z.object({
        username: z.string().trim().min(3, { message: 'Username must have at least 3 characters' }),
        password: z.string().trim().min(6, { message: 'Password must have at least 6 characters' }),
        gender: z.nativeEnum(Gender),
        age: z.preprocess((val) => {
            const parsed = typeof val === 'string' ? parseInt(val, 10) : val;
            return isNaN(parsed) ? undefined : parsed;
        }, z.number().int().min(16, { message: 'You should be at least 16 years old to use Vaarbz' }))
            .refine(val => val !== undefined, { message: 'Your age is required' })
            .optional(),
        city: z.string().min(1, { message: 'City must be at least 1 character long' }),
    });
    const signInSchema = z.object({
        username: z.string().min(3, { message: 'Username must have at least 3 characters' }),
        password: z.string().min(6, { message: 'Password must have at least 6 characters' }),
    });
    //type FormFieldsSignIn = z.infer<typeof signInSchema>;
    const [toggleForms, setToggleForms] = useState(true);
    const { register: registerSignIn, handleSubmit: handleSubmitSignIn, setError: setErrorSignIn, formState: { errors: errorsSignIn, isSubmitting: isSubmittingSignIn }, } = useForm({
        resolver: zodResolver(signInSchema),
    });
    const { control, setValue, register: registerSignUp, handleSubmit: handleSubmitSignUp, setError: setErrorSignUp, formState: { errors: errorsSignUp, isSubmitting: isSubmittingSignUp }, } = useForm({
        resolver: zodResolver(schema),
    });
    const { control: profilePictureControl } = useController({
        name: 'profilePicture',
        control: control, // assuming you have a control object from useForm
    });
    //API CALLS
    // Handle Sign Up
  const handleRegister = async (data) => {
  console.log('Form submitted with data:', data); // Check the submitted data

  try {
    const formData = new FormData();
    formData.append('username', data.username.toLowerCase().trim());
    formData.append('password', data.password.trim());
    formData.append('gender', data.gender);

    // Check if age is defined and append it
    if (data.age !== undefined) {
      console.log('Appending age:', data.age);
      formData.append('age', data.age.toString());
    } else {
      console.error('No age provided');
    }

    formData.append('city', data.city);

    // Append profile picture from state
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    } else {
      console.error('No profile picture selected');
    }

    const response = await fetch('https://vaarbz.onrender.com/api/users/register', {
      method: 'POST',
      body: formData,
    });
    console.log(response);
    const responseData = await response.json();
    console.log('Registration response data: ', responseData);

    if (response.status === 201) {
      // Save or replace the user object in local storage
      localStorage.setItem('vaarbz-user', JSON.stringify(responseData));

      // Save or replace the user token in local storage
      localStorage.setItem('vaarbz-user-token', responseData.accessToken);

      toast.success('Registration successful!');
      setAuthUser(responseData);
      console.log(authUser);

      // Reload the page to reflect the logged-in state
      setTimeout(() => {
        location.reload();
      }, 1000);
    } else {
      // Handle errors from the server
      toast.error(responseData.message || 'Registration failed. Please try again.');
    }
  } catch (error) {
    console.error(error.message);
    setErrorSignUp('root', { message: error.message });
    toast.error('An error occurred during registration. Please try again.');
  }
};
        
    // Handle Sign In
    // Handle Sign In
    const handleSignIn = async (data) => {
        console.log('Sign In function called with data:', data);
        try {
            const formData = new FormData();
            formData.append('username', data.username.toLowerCase().trim());
            formData.append('password', data.password.trim());
            const response = await fetch('https://vaarbz.onrender.com/api/users/login', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: data.username.toLowerCase(), password: data.password }),
            });
            const responseData = await response.json();
            console.log(responseData);
            let user;
            if (responseData.message !== "Username or password is incorrect") {
                user = JSON.parse(localStorage.getItem('vaarbz-user'));
            }
            if (user && responseData.message !== "Username or password is incorrect") {
                // Update the existing user data
                user = responseData;
                localStorage.setItem('vaarbz-user', JSON.stringify(user));
            }
            else {
                // Save the new user data
                localStorage.setItem('vaarbz-user', JSON.stringify(responseData));
            }
            const accessToken = localStorage.getItem('vaarbz-user-token');
            if (accessToken) {
                // Update the existing access token
                localStorage.setItem('vaarbz-user-token', responseData.accessToken);
            }
            else {
                // Save the new access token
                localStorage.setItem('vaarbz-user-token', responseData.accessToken);
            }
            if (!response.ok) {
                toast.error(responseData.message);
            }
            else {
                toast.success('Login successful!');
                setAuthUser(responseData);
                /* setTimeout(() => {
                  location.reload();
                  
                  }, 1000) */
            }
        }
        catch (error) {
            toast.error(error.message);
            setErrorSignIn('root', { message: 'Login failed. Please check your credentials.' });
        }
    };
    return (_jsx(_Fragment, { children: _jsx("section", { className: 'sign', children: toggleForms ? (_jsxs("div", { className: 'sign-container', children: [_jsxs("div", { className: 'sign-header', children: [_jsx("h1", { className: 'sign-title', children: "Sign In" }), _jsx("p", { className: 'sign-cta', children: "please sign in with your credentials to continue" })] }), _jsxs("form", { className: 'sign-content', onSubmit: handleSubmitSignIn(handleSignIn), children: [_jsxs("div", { className: 'sign-fields', children: [_jsx("input", { ...registerSignIn('username'), type: 'text', placeholder: 'Username', className: 'sign-input-field' }), errorsSignIn.username && _jsx("div", { className: 'form-errors', children: errorsSignIn.username.message }), _jsx("input", { ...registerSignIn('password'), type: 'password', className: 'sign-input-field', placeholder: 'Password' }), errorsSignIn.password && _jsx("div", { className: 'form-errors', children: errorsSignIn.password.message })] }), _jsx("div", { className: 'sign-button', children: _jsx("button", { type: 'submit', className: 'sign-btn', children: isSubmittingSignIn ? _jsx(ScaleLoader, { color: 'white', height: 10 }) : 'Sign In' }) })] }), _jsx("div", { className: 'new-user', children: _jsxs("p", { children: ["new to vaarbz?", ' ', _jsx("a", { className: 'sign-up-link', onClick: () => setToggleForms(!toggleForms), children: "register here" })] }) }), _jsx("div", { className: 'demo-account-details', children: _jsxs("div", { className: 'demo-header', children: [_jsx("h1", { className: 'demo-title', children: "Demo Account" }), _jsx("p", { className: 'demo-user', children: "username: stefan" }), _jsx("p", { className: 'demo-pin', children: "password: password123" })] }) })] })) : (_jsxs("div", { className: 'sign-container', children: [_jsxs("div", { className: 'sign-header', children: [_jsx("h1", { className: 'sign-title', children: "Register" }), _jsx("p", { className: 'sign-cta', children: "register your with your information here" })] }), _jsxs("form", { className: 'sign-content', onSubmit: handleSubmitSignUp(handleRegister), children: [_jsxs("div", { className: 'sign-fields', children: [_jsx("input", { ...registerSignUp('username'), type: 'text', placeholder: 'Username', className: 'sign-input-field' }), errorsSignUp.username && _jsx("div", { className: 'form-errors', children: errorsSignUp.username.message }), _jsxs("select", { ...registerSignUp('gender'), className: 'sign-input-field', children: [_jsx("option", { value: '', children: "Gender" }), _jsx("option", { value: 'male', children: "Male" }), _jsx("option", { value: 'female', children: "Female" })] }), errorsSignUp.gender && _jsx("div", { className: 'form-errors', children: errorsSignUp.gender.message }), _jsx("input", { ...registerSignUp('age'), type: 'number', className: 'sign-input-field', placeholder: 'Age' }), errorsSignUp.age && _jsx("div", { className: 'form-errors', children: errorsSignUp.age.message }), _jsx("input", { ...registerSignUp('city'), type: 'text', className: 'sign-input-field', placeholder: 'City' }), errorsSignUp.city && _jsx("div", { className: 'form-errors', children: errorsSignUp.city.message }), _jsx("input", { ...registerSignUp('password'), type: 'password', className: 'sign-input-field', placeholder: 'Password' }), errorsSignUp.password && _jsx("div", { className: 'form-errors', children: errorsSignUp.password.message }), _jsx("input", { type: "file", onChange: (e) => {
                                            const files = e.target.files;
                                            if (files && files.length > 0) {
                                                setProfilePicture(files[0]); // Set the selected file
                                            }
                                            else {
                                                setProfilePicture(null); // Clear the state if no file is selected
                                            }
                                        } })] }), _jsx("div", { className: 'sign-button', children: _jsx("button", { type: 'submit', className: 'sign-btn', children: isSubmittingSignUp ? _jsx(ScaleLoader, { "aria-setsize": 6, height: 10, color: 'white', className: 'scale-loader' }) : 'Register' }) })] }), _jsx("div", { className: 'new-user', children: _jsxs("p", { children: ["already have an account?", ' ', _jsx("a", { className: 'sign-up-link', onClick: () => setToggleForms(!toggleForms), children: "sign in here" })] }) })] })) }) }));
};
export default Sign;
