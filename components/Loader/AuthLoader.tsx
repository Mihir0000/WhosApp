import Router from 'next/router';
import { Fragment } from 'react';
import styles from './AuthLoader.module.css';

function Loader() {

    const clickBtn = () => {
        Router.push("/")
    }
    return (
        <Fragment>
            <div className={styles.loading}>
                <div className={styles.mid}></div>
            </div>
            <div className={styles.text_container}>
                <div className={styles.text}>Please Go to SignIn Page</div>
                <button className={styles.btn} onClick={clickBtn}>SignIn</button>
            </div>
        </Fragment>
    );
}

export default Loader;
