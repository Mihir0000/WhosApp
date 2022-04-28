import { Fragment, useState, useRef, useEffect, useCallback } from 'react';
import styles from './chatSide.module.css';
import PublishChat from '../pubSub/PublishChat';
import axios from 'axios';
import SendImg from '../images/send.png';
import LogoutBtn from '../images/logout.png';
import Image from 'next/image';
import Router from 'next/router';

function ChatSide({ channel }: any) {
    const chatRef = useRef<any>('');
    const scrollingRef = useRef<null | HTMLDivElement>(null);
    const [channelChat, setChannelChat] = useState([]);
    const [userName, setUserName] = useState<string>('');
    const [chat, setChat] = useState('');
    const [msg, setMsg] = useState('new');

    const response = useCallback(async () => {
        const url = `https://api.backendless.com/2C1B1F9E-7BEE-C020-FF8D-B4A820E4DB00/7AF7BA66-76AA-4745-9E9B-54E91012A820/data/${channel}?pageSize=100&sortBy=%60time%60%20asc`;
        const { data } = await axios.get(url);
        console.log(data);
        setChannelChat(data);
        if (data.length > 0) {
            setMsg(data[data.length - 1].message);
        }
    }, [channel]);

    useEffect(() => {
        async function userCall() {
            const value = localStorage.getItem(
                'Backendless_2C1B1F9E-7BEE-C020-FF8D-B4A820E4DB00'
            );
            if (value) {
                const singleUserData = JSON.parse(value);
                const { 'current-user-id': userID } = singleUserData;
                const url = `https://api.backendless.com/2C1B1F9E-7BEE-C020-FF8D-B4A820E4DB00/7AF7BA66-76AA-4745-9E9B-54E91012A820/data/Users/${userID}`;
                const { data } = await axios.get(url);
                // console.log(userID);
                setUserName(data.email);
            }
        }
        async function res() {
            const url = `https://api.backendless.com/2C1B1F9E-7BEE-C020-FF8D-B4A820E4DB00/7AF7BA66-76AA-4745-9E9B-54E91012A820/data/${channel}?pageSize=100&sortBy=%60time%60%20asc`;
            const { data } = await axios.get(url);
            console.log(data);
            setChannelChat(data);
            if (data.length > 0) {
                setMsg(data[data.length - 1].message);
            }
        }
        const subscribe = () => {
            var subscribeChannel = Backendless.Messaging.subscribe(channel);
            function onMessage(subMessage: any) {
                setMsg(subMessage.message);
                console.log(subMessage);
            }
            subscribeChannel.addMessageListener(onMessage);
        };

        res();
        userCall();
        subscribe();
    }, [channel]);
    useEffect(() => {
        response();
    }, [channel, response, msg]);

    useEffect(() => {
        if (scrollingRef) {
            const scrolling = () => {
                scrollingRef.current?.scrollIntoView({ behavior: 'smooth' });
            };
            scrolling();
        }
    }, [channelChat]);
    const submitHandler = (e: any) => {
        e.preventDefault();
        console.log('chat submitted');
        console.log(chatRef.current.value);

        const message = chatRef.current.value;
        const name = userName.split('@');
        PublishChat({ channel, message, pubOptions: { sender: name[0] } });
        setChat('');
        console.log(channel);

        var subscribeChannel = Backendless.Messaging.subscribe(channel);
        function onMessage(subMessage: any) {
            // console.log('Message received: ' + subMessage);
            // console.log('Message Received');
            // console.log(subMessage.message);
            // setSubMsg(subMessage);
            setMsg(subMessage.message);
            console.log(subMessage);
        }
        subscribeChannel.addMessageListener(onMessage);
    };
    const readableTime = (time: number) => {
        const date = new Date(time);
        return date.toLocaleString();
    };
    const logoutHandler = () => {
        Backendless.UserService.logout()
            .then(function () {
                console.log('Successfully LogOut');
                Router.replace("/")
            })
            .catch(function (error) {
                console.log('Logout Error');
            });
    };
    return (
        <Fragment>
            <div className={styles.chat_container}>
                <div className={styles.logout} onClick={logoutHandler}>
                    <button className={styles.logout_btn}>
                        <Image src={LogoutBtn} alt="logout" />
                    </button>
                </div>
                <div className={styles.channel_chat}>
                    <div>
                        {channelChat.length === 0 ? (
                            <div className={styles.no_chat}>No Chat Here</div>
                        ) : (
                            channelChat.map((item: any, index: number) => (
                                <div className={styles.message_box} key={index}>
                                    <div className={styles.chat_top}>
                                        <div className={styles.sender}>
                                            From : {item.sender}
                                        </div>
                                        <div className={styles.time}>
                                            {readableTime(item.time)}
                                        </div>
                                    </div>

                                    <div className={styles.message}>
                                        {item.message}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div ref={scrollingRef}></div>
                </div>
                <form className={styles.chat_form} onSubmit={submitHandler}>
                    <input
                        ref={chatRef}
                        value={chat}
                        className={styles.chat_input}
                        placeholder="Type here..."
                        type="text"
                        onChange={(e) => {
                            setChat(e.target.value);
                        }}
                    />
                    <button
                        type="submit"
                        // onClick={(e) => console.log('clicked')}
                        className={styles.send_btn}
                    >
                        <Image
                            src={SendImg}
                            alt="send"
                            width="35%"
                            height="35%"
                        />
                    </button>
                </form>
            </div>
        </Fragment>
    );
}

export default ChatSide;
