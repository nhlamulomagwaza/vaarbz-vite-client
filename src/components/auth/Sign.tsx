
import React, { useState } from 'react';
import '../../styles/components/auth.scss';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useContext } from 'react';

type SubmitHandler<T> = (data: T) => void | Promise<void>;

import { ScaleLoader } from 'react-spinners';
import { useController } from 'react-hook-form';
import { VaarbzContext } from '../store/VaarbzContext';

const Sign = () => {

  const {authUser, setAuthUser}= useContext(VaarbzContext);


 // State for profile picture
 const [profilePicture, setProfilePicture] = useState<File | null>(null);

  //CONSTANTS AND DECLARATIONS

  

  //const [toggleForms, setToggleForms] = useState(true);

  //ZOD AND REACT HOOK FORM VALIDATIONS
  enum Gender {
    Male = 'male',
    Female = 'female',
  }

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

  type FormFields = z.infer<typeof schema>;
  //type FormFieldsSignIn = z.infer<typeof signInSchema>;
  const [toggleForms, setToggleForms] = useState(true);

  const { 
  register: registerSignIn,
  handleSubmit: handleSubmitSignIn,
  setError: setErrorSignIn,
  formState: { errors: errorsSignIn, isSubmitting: isSubmittingSignIn },
} = useForm<{ username: string, password: string }>({
  resolver: zodResolver(signInSchema),
});

  const { control, setValue,
    register: registerSignUp,
    handleSubmit: handleSubmitSignUp,
    setError: setErrorSignUp,
    formState: { errors: errorsSignUp, isSubmitting: isSubmittingSignUp },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const { control:profilePictureControl} = useController({
    name: 'profilePicture',
    control: control, // assuming you have a control object from useForm
  });

 //API CALLS

  // Handle Sign Up
 const handleRegister: SubmitHandler<FormFields> = async (data) => {
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
console.log(response)
    const responseData = await response.json();
    console.log("registration response data: ", responseData);

    if (response.status === 201) {
      toast.success('got 201');
      // Save the user object and token to local storage
      localStorage.setItem('vaarbz-user', JSON.stringify(responseData));
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
const handleSignIn: SubmitHandler<{ username: string, password: string }> = async (data) => {
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
    console.log(responseData)
let user;
    if(responseData.message !== "Username or password is incorrect" ){
      user = JSON.parse(localStorage.getItem('vaarbz-user'));
    }
 

    if (user && responseData.message !== "Username or password is incorrect") {
      // Update the existing user data
      user = responseData;
      localStorage.setItem('vaarbz-user', JSON.stringify(user));
    } else {
      // Save the new user data
      localStorage.setItem('vaarbz-user', JSON.stringify(responseData));
    }
  
    const accessToken = localStorage.getItem('vaarbz-user-token');

    if (accessToken) {
      // Update the existing access token
      localStorage.setItem('vaarbz-user-token', responseData.accessToken);
    } else {
      // Save the new access token
      localStorage.setItem('vaarbz-user-token', responseData.accessToken);
    }


    if (!response.ok) {
    
      toast.error(responseData.message);
      
    }else{
      toast.success('Login successful!');
      setAuthUser(responseData);
      
     setTimeout(() => {
      location.reload();   
      
      }, 1000) 
  
          }

   


 
  } catch (error) {
    toast.error(error.message);
      setErrorSignIn('root', { message: 'Login failed. Please check your credentials.' });
  }
};

  return (
    <>
      <section className='sign'>
        {toggleForms ? (
          <div className='sign-container'>
            <div className='sign-header'>
              <h1 className='sign-title'>Sign In</h1>
              <p className='sign-cta'>please sign in with your credentials to continue</p>
            </div>
            <form className='sign-content' onSubmit={handleSubmitSignIn(handleSignIn)}>
              <div className='sign-fields'>
                <input {...registerSignIn('username')} type='text' placeholder='Username' className='sign-input-field' />
                {errorsSignIn.username && <div className='form-errors'>{errorsSignIn.username.message}</div>}
                <input {...registerSignIn('password')} type='password' className='sign-input-field' placeholder='Password' />
                {errorsSignIn.password && <div className='form-errors'>{errorsSignIn.password.message}</div>}
              </div>
              <div className='sign-button'>
                <button   
                type='submit' className='sign-btn'>{isSubmittingSignIn ? <ScaleLoader color='white' height={10}/> : 'Sign In'}</button>
              </div>
            </form>
            <div className='new-user'>
              <p>
                new to vaarbz?{' '}
                <a className='sign-up-link' onClick={() => setToggleForms(!toggleForms)}>
                  register here
                </a>
              </p>
            </div>
            <div className='demo-account-details'>
              <div className='demo-header'>
                <h1 className='demo-title'>Demo Account</h1>
                <p className='demo-user'>username: stefan</p>
                <p className='demo-pin'>password: password123</p>
              </div>
            </div>
          </div>
        ) : (
          <div className='sign-container'>
            <div className='sign-header'>
              <h1 className='sign-title'>Register</h1>
              <p className='sign-cta'>register your with your information here</p>
            </div>
            <form className='sign-content' onSubmit={handleSubmitSignUp(handleRegister)}>
              <div className='sign-fields'>
                <input {...registerSignUp('username')} type='text' placeholder='Username' className='sign-input-field' />
                {errorsSignUp.username && <div className='form-errors'>{errorsSignUp.username.message}</div>}
                
                
                
                <select {...registerSignUp('gender')} className='sign-input-field'>
                  <option value=''>Gender</option>
                  <option value='male'>Male</option>
                  <option value='female'>Female</option>
                </select>
                {errorsSignUp.gender && <div className='form-errors'>{errorsSignUp.gender.message}</div>}
              
                <input {...registerSignUp('age')} type='number' className='sign-input-field' placeholder='Age' />
                {errorsSignUp.age && <div className='form-errors'>{errorsSignUp.age.message}</div>}
                <input {...registerSignUp('city')} type='text' className='sign-input-field' placeholder='City' />
                {errorsSignUp.city && <div className='form-errors'>{errorsSignUp.city.message}</div>}
                <input {...registerSignUp('password')} type='password' className='sign-input-field' placeholder='Password' />
                {errorsSignUp.password && <div className='form-errors'>{errorsSignUp.password.message}</div>}
               
               
                <input
        type="file"
        onChange={(e) => {
          const files = e.target.files;
          if (files && files.length > 0) {
            setProfilePicture(files[0]); // Set the selected file
          } else {
            setProfilePicture(null); // Clear the state if no file is selected
          }
        }}
      />


              </div>
              <div className='sign-button'>
                <button type='submit' className='sign-btn'>{isSubmittingSignUp? <ScaleLoader aria-setsize={6}  height={10} color='white' className='scale-loader' /> : 'Register'}</button>
              </div>
            </form>
            <div className='new-user'>
              <p>
                already have an account?{' '}
                <a className='sign-up-link' onClick={() => setToggleForms(!toggleForms)}>
                  sign in here
                </a>
              </p>

              
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default Sign;