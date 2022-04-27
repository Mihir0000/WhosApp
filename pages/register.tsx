import Router from 'next/router';
import { Fragment, useState } from 'react';
import styles from './index.module.css';

function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rpass, setRpass] = useState('');
    const login = () => {
        Router.push('/');
    };
    const registerHandle = (e: any) => {
        e.preventDefault();
        if (email.length === 0 || password.length === 0 || password != rpass) {
            alert('Invalid login');
        }
        const data = {
            email,
            password,
        };
        Backendless.UserService.register(data)
            .then(function (registeredUser) {
                console.log('Successfully register');
            })
            .catch(function (error) {
                console.log('Error', error);
            });
        console.log(email, password, rpass);
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
                            placeholder="abc@gmail.com"
                            required
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                        />
                        <input
                            type="text"
                            value={password}
                            className={styles.input_field}
                            placeholder="Password"
                            required
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                        />
                        <input
                            type="text"
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
            </div>
        </Fragment>
    );
}

export default RegisterPage;
