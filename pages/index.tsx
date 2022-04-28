import React, { Fragment, useState } from 'react';
import styles from './index.module.css';
import Router from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as EmailValidator from 'email-validator';

export const notify = (text: string) => {
    toast(text);
};

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const register = () => {
        Router.push('/register');
    };
    const loginHandle = (e: any) => {
        e.preventDefault();
        if (email.length === 0 || password.length === 0) {
            notify('Empty Email or Password are Invalid');
            return;
        }
        let valid = EmailValidator.validate(email);
        if(valid){
            Backendless.UserService.login(email, password, true)
                .then(function (loggedInUser: any) {
                    notify("Successfully LoggedIn")
                    setTimeout(()=>{
                        Router.push('/chat');
                    },500)
                })
                .catch(function (error) {
                    notify('Login Error');
                });
        }
        else{
            notify('Enter a valid Email')
        }  
    };

    return (
        <Fragment>
            <div className={styles.hero}>
                <div className={styles.form_box}>
                    <div className={styles.btn_box}>
                        <div id={styles.btnL}></div>
                        <button type="button" className={styles.toggle_btn}>
                            LogIn
                        </button>
                        <button
                            type="button"
                            className={styles.toggle_btn}
                            onClick={register}
                        >
                            Register
                        </button>
                    </div>
                    <form
                        id={styles.login}
                        className={styles.input_group}
                        onClick={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <input
                            type="email"
                            className={styles.input_field}
                            placeholder="abc@xyz.com"
                            required
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                        />
                        <input
                            type="password"
                            className={styles.input_field}
                            placeholder="Password"
                            required
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                        />
                        <button
                            type="submit"
                            className={styles.submit_btn}
                            onClick={loginHandle}
                        >
                            LogIn
                        </button>
                    </form>
                </div>
            </div>
            <ToastContainer/>
        </Fragment>
    );
}

export default LoginPage;
