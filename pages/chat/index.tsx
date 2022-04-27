import { Fragment, useEffect, useState } from 'react';
import styles from './chatPage.module.css';
import ChannelSide from '../../components/layout/channelSide';
import ChatSide from '../../components/layout/chatSide';
import axios from 'axios';

function ChatPage() {
    const [channel, setChannel] = useState('First_Channel');
    const [userName, setUserName] = useState('');
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
    // console.log(userName);

    const channelData = [
        { channel: 'First_Channel' },
        { channel: 'Second_Channel' },
        { channel: 'Third_Channel' },
        { channel: '4th_Channel' },
        { channel: '5th_Channel' },
        { channel: '6th_Channel' },
        { channel: '7th_Channel' },
        { channel: '8th_Channel' },
        { channel: '9th_Channel' },
        { channel: '10th_Channel' },
    ];
    return (
        <Fragment>
            <div className={styles.container}>
                <div className={styles.left}>
                    <div className={styles.channel_top}>
                        <div>All Channel</div>
                        <div className={styles.search}>
                            <input
                                type="text"
                                className={styles.search_input}
                                placeholder="Search Here ..."
                            />
                            <button type="button">click</button>
                        </div>
                    </div>
                    <div className={styles.channel_down}>
                        {channelData &&
                            channelData.map((item: any, index: number) => (
                                <ChannelSide
                                    key={index}
                                    channel_name={item.channel}
                                    setChannel={setChannel}
                                    channel={channel}
                                />
                            ))}
                    </div>
                </div>
                <div className={styles.right}>
                    <div className={styles.chat_top}>Chat</div>
                    <div className={styles.chat_down}>
                        <ChatSide channel={channel} />
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
export default ChatPage;
