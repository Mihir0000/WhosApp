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
            // console.log(data);

            if (data.length > 0) {
                let totalName: string[] = [];
                data.map((item: any) => {
                    const name = item.email.split('@')[0];
                    totalName.push(name);
                });
                setTotalUser(totalName);
            }
        }
        userCall();
    }, []);
    // console.log(totalUser);

    const registerHandle = (e: any) => {
        e.preventDefault();
        if (email.length === 0 || password.length === 0) {
            notify('Empty Email or Password are Invalid');
            return;
        } else if (password != rpass) {
            notify('Password Does Not Match');
            return;
        }
        const name = email.split('@')[0];
        let exist = false;
        totalUser.map((item: string) => {
            if (item === name) {
                exist = true;
                alert('Already Exist');
                return;
                // console.log(exist);
            }
        });
        let valid = EmailValidator.validate(email);
        if (!valid) {
            notify('Enter a Valid Email');
            return;
        }

        if (exist === false) {
            const data = {
                email,
                password,
            };
            const time = new Date().getTime();
            const dbData = {
                email,
                time
            }
            const name = email.split('@')[0];
            Backendless.UserService.register(data)
                .then(function (registeredUser) {
                    notify('Successfully Register');
                })
                .catch(function (error) {
                    // notify('Internl Error');
                });
            Backendless.Data.of(name)
                .save(dbData)
                .then(function (savedObject) {
                    console.log('new Contact instance has been saved');
                })
                .catch(function (error) {
                    console.log('an error has occurred ' + error.message);
                });
            console.log(email, password, rpass);
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
                            type="text"
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
