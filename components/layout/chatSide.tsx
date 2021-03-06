import { Fragment, useState, useRef, useEffect, useCallback } from 'react';
import styles from './chatSide.module.css';
import PublishChat from '../pubSub/PublishChat';
import axios from 'axios';
import SendImg from '../images/send.png';
import LogoutBtn from '../images/logout.png';
import Image from 'next/image';
import DoubbleTick from '../images/doubleTick.png';
import Router from 'next/router';

function ChatSide({ receiver, name }: any) {
    const chatRef = useRef<any>('');
    const scrollingRef = useRef<null | HTMLDivElement>(null);
    const [channelChat, setChannelChat] = useState([]);
    const [userName, setUserName] = useState<string>('');
    const [chat, setChat] = useState('');
    const [msg, setMsg] = useState('new');

    useEffect(() => {
        var subscribeChannel = Backendless.Messaging.subscribe(receiver);
        function onMessage(subMessage: any) {
            setMsg(subMessage.message);
            // console.log(subMessage);
        }
        subscribeChannel.addMessageListener(onMessage);
    });

    // console.log(msg);

    const response = useCallback(async () => {
        const reveiverUrl = `https://api.backendless.com/2C1B1F9E-7BEE-C020-FF8D-B4A820E4DB00/7AF7BA66-76AA-4745-9E9B-54E91012A820/data/${receiver}?pageSize=100&sortBy=%60time%60%20asc`;
        const { data: receiverData } = await axios.get(reveiverUrl);
        setTimeout(() => {
            setMsg(receiverData[receiverData.length - 1].message);
        }, 300);
        // var m1 = receiverData[receiverData.length - 1].message;

        if (name) {
            const senderUrl = `https://api.backendless.com/2C1B1F9E-7BEE-C020-FF8D-B4A820E4DB00/7AF7BA66-76AA-4745-9E9B-54E91012A820/data/${name}?pageSize=100&sortBy=%60time%60%20asc`;
            var { data: senderData } = await axios.get(senderUrl);
            setTimeout(() => {
                setMsg(senderData[senderData.length - 1].message);
            }, 300);
            // var m2 = senderData[senderData.length - 1].message;
            // console.log('senderdata', senderData);
        }

        // if(msg === m2){
        //     setMsg(m2)
        // }
        // else{
        //     setMsg(m1);
        // }

        const twoUserData: any = [];

        receiverData.map((item: any) => {
            if (
                (item.sender === name && item.receiver === receiver) ||
                (item.receiver === name && item.sender === receiver)
            ) {
                twoUserData.push(item);
            }
        });
        if (senderData) {
            senderData.map((item: any) => {
                if (
                    (item.sender === name && item.receiver === receiver) ||
                    (item.receiver === name && item.sender === receiver)
                ) {
                    twoUserData.push(item);
                }
            });
        }

        twoUserData.sort(function (a: any, b: any) {
            return a.created - b.created;
        });
        // if (twoUserData.length > 0) {
        //     setMsg(twoUserData[twoUserData.length - 1].message);
        // }
        // console.log('data2user', twoUserData);
        setChannelChat(twoUserData);
        // callFunction();
    }, [receiver, msg, name]);

    useEffect(() => {
        setTimeout(() => {
            response();
        }, 100);
    }, [receiver, response, msg]);
    // console.log(name);

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

        const message = chatRef.current.value;
        // const name = userName.split('@');
        PublishChat({ receiver, message, pubOptions: { sender: name } });
        setChat('');

        console.log(receiver, 'receiver');

        setMsg(message);
        const subscribeChannel = Backendless.Messaging.subscribe(receiver);
        function onMessage(subMessage: any) {
            setMsg(subMessage.message);
            console.log('subscribed');
            console.log(subMessage.message);
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
                Router.replace('/');
            })
            .catch(function (error) {
                console.log('Logout Error');
            });
    };
    // console.log('sender', name);
    // console.log('receiver', receiver);

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
                                <div
                                    className={
                                        name === item.sender
                                            ? styles.sender_message
                                            : styles.message_box
                                    }
                                    key={index}
                                >
                                    <div className={styles.chat_top}>
                                        <div className={styles.sender}>
                                            From : {item.sender}
                                        </div>
                                        <div className={styles.time}>
                                            {readableTime(item.time)}
                                        </div>
                                    </div>

                                    <div className={styles.msg}>
                                        <div className={styles.message}>
                                            {item.message}
                                        </div>
                                        <div className={styles.tick}>
                                            <Image
                                                src={DoubbleTick}
                                                alt="tick"
                                                width="20%"
                                                height="20%"
                                            />
                                        </div>
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
