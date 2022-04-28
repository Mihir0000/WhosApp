import Router from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import styles from './index.module.css';
import Backendless from 'backendless';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import { notify } from './index';
import * as EmailValidator from 'email-validator';

function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rpass, setRpass] = useState('');
    const [totalUser, setTotalUser] = useState<string[]>([]);
    const login = () => {
        Router.push('/');
    };
    useEffect(() => {
        async function userCall() {
            const url = `https://api.backendless.com/2C1B1F9E-7BEE-C020-FF8D-B4A820E4DB00/7AF7BA66-76AA-4745-9E9B-54E91012A820/data/Users`;
            const { data } = await axios.get(url);
            if (data.length > 0) {
                let totalEmail: string[] = [];
                data.map((item: any) => {
                    totalEmail.push(item.email);
                });
                // console.log(totalEmail, 'email');
                setTotalUser(totalEmail);
            }
        }
        userCall();
    }, []);
    // console.log(totalUser, 'user');

    const registerHandle = (e: any) => {
        e.preventDefault();

        if (email.length === 0 || password.length === 0) {
            notify('You Cannot put Empty Email or Password');
            return;
        } else if (password != rpass) {
            notify('Password Does Not Match');
            return;
        }
        let valid = EmailValidator.validate(email);
        if (!valid) {
            notify('Enter a Valid Email');
            return;
        }

        let exist = false;
        totalUser.map((item: string) => {
            // console.log(item, email);
            if (item === email) {
                exist = true;
                // alert('Already Exist');
                // console.log(exist);
            }
        });

        if (exist === false) {
            const data = {
                email,
                password,
            };
            Backendless.UserService.register(data)
                .then(function (registeredUser) {
                    notify('Successfully Register');
                })
                .catch(function (error) {
                    // notify('Internl Error');
                });
            console.log(email, password, rpass);
        } else {
            alert('Already Exist');
        }
        Router.push('/');
        setEmail('');
        setPassword('');
        setRpass('');
    };

    return (
        <Fragment>
            <div className={styles.hero}>
                <div className={styles.form_box}>
                    <div className={styles.btn_box}>
                        <div id={styles.btnR}></div>
                        <button
                            type="button"
                            className={styles.toggle_btn}
                            onClick={login}
                        >
                            LogIn
                        </button>
                        <button type="button" className={styles.toggle_btn}>
                            Register
                        </button>
                    </div>

                    <form
                        id={styles.register}
                        className={styles.input_group}
                        onClick={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <input
                            type="email"
                            value={email}
                            className={styles.input_field}
                            placeholder="abc@xyz.com"
                            required
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                        />
                        <input
                            type="password"
                            value={password}
                            className={styles.input_field}
                            placeholder="Password"
                            required
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                        />
                        <input
                            type="password"
                            value={rpass}
                            className={styles.input_field}
                            placeholder="Repeat Password"
                            required
                            onChange={(e) => {
                                setRpass(e.target.value);
                            }}
                        />
                        <button
                            type="submit"
                            className={styles.submit_btn}
                            onClick={registerHandle}
                        >
                            Register
                        </button>
                    </form>
                </div>
                <ToastContainer />
            </div>
        </Fragment>
    );
}

export default RegisterPage;
