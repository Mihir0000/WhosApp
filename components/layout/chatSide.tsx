import { Fragment, useState, useRef, useEffect } from 'react';
import styles from './chatSide.module.css';
import PublishChat from '../pubSub/PublishChat';
import axios from 'axios';

function ChatSide({ channel }: any) {
    const chatRef = useRef<any>('');
    const [channelChat, setChannelChat] = useState([]);
    const [userName, setUserName] = useState<string>('');
    const [chat, setChat] = useState('');
    useEffect(() => {
        async function userCall() {
            const value = localStorage.getItem(
                'Backendless_2C1B1F9E-7BEE-C020-FF8D-B4A820E4DB00'
            );
            const singleUserData = JSON.parse(value);
            const { 'current-user-id': userID } = singleUserData;
            const url = `https://fastsand.backendless.app/api/data/Users/${userID}`;
            const { data } = await axios.get(url);
            // console.log(userID);
            setUserName(data.email);
            // console.log(userName);
            // console.log(data.email);
        }
        userCall();
    }, []);
    const submitHandler = (e: any) => {
        e.preventDefault();
        console.log('chat submitted');
        console.log(chatRef.current.value);

        const message = chatRef.current.value;
        const name = userName.split('@');
        PublishChat({ channel, message, pubOptions: { sender: name[0] } });
        setChat('');
    };
    return (
        <Fragment>
            <div className={styles.chat_container}>
                <div className={styles.channel_chat}>
                    hi {channel}
                    {/* {
                        channelChat.map((item:any, index:number)=>(

                        ))
                    } */}
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
                        onClick={(e) => console.log('clicked')}
                        className={styles.send_btn}
                    >
                        send me
                    </button>
                </form>
            </div>
        </Fragment>
    );
}

export default ChatSide;
