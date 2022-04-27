import React, { Fragment, useState } from 'react';
import styles from './index.module.css';
import Router from 'next/router';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const register = () => {
        Router.push('/register');
    };
    const loginHandle = (e: any) => {
        e.preventDefault();
        if (email.length === 0 || password.length === 0) {
            alert('Invalid login');
        }

        Backendless.UserService.login(email, password, true)
            .then(function (loggedInUser: any) {
                Router.push('/chat');
            })
            .catch(function (error) {
                console.log(error, 'Login Error');
            });
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
                            type="text"
                            className={styles.input_field}
                            placeholder="abc@gmail.com"
                            required
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                        />
                        <input
                            type="text"
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
        </Fragment>
    );
}

export default LoginPage;
