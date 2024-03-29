import { useState } from "react";
import { createAuthUserWithEmailAndPassword, signInAuthUserWithEmailAndPassword, createUserDocumentFromAuth, signInWithGooglePopup } from "../../utils/firebase/firebase.utils";
import FormInput from "../form-input/form-input.component";
import Button from '../button/button.component';
import './sign-in-form.styles.scss';



const defaultFormFields = {
    email: '',
    password: '',

}

const SignInForm = () => {

    const [formFields, setFormFields] = useState(defaultFormFields);
    const { email, password } = formFields;

    // Reset form
    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    };

    // Get google sign in method from Firebase utils
    const SignInWithGoogle = async () => {
        await signInWithGooglePopup();
    };

    // Login with email and password
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Destructure user object from the response and pass email and password to the sign in method
            const { user } = await signInAuthUserWithEmailAndPassword(email, password);
            resetFormFields();
        } catch (error) {
            switch (error.code) {
                case 'auth/wrong-password': alert('Incorrect email or password.');
                    break;
                case 'auth/user-not-found': alert('No user associated with this email.');
                    break;
                default: console.log(error);
            };
        }
    };

    // Pass user input to formFields state
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormFields({ ...formFields, [name]: value });
    }

    return (
        <div className="sign-up-container">
            <h2>Already have an account?</h2>
            <span>Sign in with email and password</span>
            <form onSubmit={(handleSubmit)}>
                <FormInput label='Email' type='email' required onChange={handleChange} name='email' value={email} />
                <FormInput label='Password' type='password' required onChange={handleChange} name='password' value={password} />
                <div className="buttons-container">
                    <Button type='submit'>Sign in</Button>
                    <Button type='button' buttonType='google' onClick={SignInWithGoogle}>Sign in with Google</Button>
                </div>
            </form>

        </div>
    )
};

export default SignInForm;