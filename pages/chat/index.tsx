import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import styles from './chatPage.module.css';
import ChannelSide from '../../components/layout/channelSide';
import ChatSide from '../../components/layout/chatSide';
import AuthLoader from '../../components/Loader/AuthLoader';
import axios from 'axios';

function ChatPage({ channelData }: any) {
    const [channel, setChannel] = useState('aakash');
    const [userName, setUserName] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const inputRef = useRef<HTMLInputElement>(null);
    const [search, setSearch] = useState('');
    const [focus, setFocus] = useState(false);
    const [name, setName] = useState('');
    const [newData, setNewData] = useState<any>();
    const [searchChannelData, setSearchChannelData] = useState(channelData);
    // const [newUser, setNewUser] = useState([]);
    // console.log(channelData);

    // const channelData = [
    //     { channel: 'Channel_I' },
    //     { channel: 'Channel_II' },
    //     { channel: 'Channel_III' },
    //     { channel: 'Channel_IV' },
    //     { channel: 'Channel_V' },
    //     { channel: 'Channel_VI' },
    //     { channel: 'Channel_VII' },
    //     { channel: 'Channel_VIII' },
    //     { channel: 'Channel_IX' },
    //     { channel: 'Channel_X' },
    // ];
    useCallback(async () => {
        const url = `https://api.backendless.com/2C1B1F9E-7BEE-C020-FF8D-B4A820E4DB00/7AF7BA66-76AA-4745-9E9B-54E91012A820/data/Users`;
        const { data } = await axios.get(url);
        setNewData(data);
    }, [newData]);

    const searchChannel = (word: string) => {
        if (channelData) {
            let x = channelData.filter((i: any) => {
                return (
                    i.channelName
                        .toLowerCase()
                        .startsWith(word.toLowerCase()) ||
                    i.channelName.toLowerCase().includes(word.toLowerCase())
                );
            });
            x.sort(function (a: any, b: any) {
                return a.channelName.localeCompare(b.channelName);
            });
            return x;
        }
        return;
    };
    useEffect(() => {
        setSearchChannelData(searchChannel(search));
    }, [search]);

    useEffect(() => {
        async function userCall() {
            const value = await localStorage.getItem(
                'Backendless_2C1B1F9E-7BEE-C020-FF8D-B4A820E4DB00'
            );
            if (value) {
                const singleUserData = JSON.parse(value);
                const { 'current-user-id': userID } = singleUserData;
                if (!!userID) {
                    setLoading(false);
                }
                const url = `https://api.backendless.com/2C1B1F9E-7BEE-C020-FF8D-B4A820E4DB00/7AF7BA66-76AA-4745-9E9B-54E91012A820/data/Users/${userID}`;
                const { data } = await axios.get(url);
                const name2 = data.email.split('@');
                setName(name2[0]);
            }
        }
        userCall();
        // totalUserCall();
    }, []);

    // useEffect(() => {
    //     async function newUsers() {
    //         const url = `https://api.backendless.com/2C1B1F9E-7BEE-C020-FF8D-B4A820E4DB00/7AF7BA66-76AA-4745-9E9B-54E91012A820/data/Users`;
    //         const { data } = await axios.get(url);
    //         setNewData(data);
    //         setNewUser(data);
    //     }
    //     newUsers();
    // }, [newUser]);

    const searchHandler = (e: any) => {
        e.preventDefault();
        if (focus) {
            setSearch('');
            inputRef.current?.blur();
            setFocus(false);
        } else {
            inputRef.current?.focus();
            setFocus(true);
        }
    };
    return (
        <Fragment>
            {loading ? (
                <AuthLoader />
            ) : (
                <Fragment>
                    <div className={styles.bg}>
                        <div className={styles.container}>
                            <div id={styles.left}>
                                <div className={styles.channel_top}>
                                    <div>All Contacts</div>
                                    <form
                                        className={styles.search}
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                        }}
                                    >
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={search}
                                            className={styles.search_input}
                                            placeholder="Search Here ..."
                                            onFocus={() => setFocus(true)}
                                            onBlur={() => {
                                                setTimeout(() => {
                                                    setFocus(false);
                                                }, 500);
                                            }}
                                            onChange={(e) => {
                                                setSearch(e.target.value);
                                                if (e.target.value === '') {
                                                    setFocus(true);
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={searchHandler}
                                            className={styles.search_btn}
                                        >
                                            Clear
                                        </button>
                                    </form>
                                </div>
                                <div className={styles.channel_down}>
                                    {searchChannelData &&
                                        searchChannelData.map(
                                            (item: any, index: number) => (
                                                <ChannelSide
                                                    key={index}
                                                    channel_name={
                                                        item.channelName
                                                    }
                                                    setChannel={setChannel}
                                                    channel={channel}
                                                />
                                            )
                                        )}
                                </div>
                            </div>
                            <div id={styles.right}>
                                <div className={styles.username}>
                                    Hi, {name}
                                </div>
                                <div className={styles.chat_top}>{channel}</div>
                                <div className={styles.chat_down}>
                                    <ChatSide receiver={channel} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
}

export async function getStaticProps() {
    const url = `https://api.backendless.com/2C1B1F9E-7BEE-C020-FF8D-B4A820E4DB00/7AF7BA66-76AA-4745-9E9B-54E91012A820/data/Users`;
    const { data } = await axios.get(url);
    let channelData: {
        channelName: string;
        email: string;
        objectId: string;
    }[] = [];
    if (data.length > 0) {
        data.map((item: any) => {
            let mail = item.email.split('@');
            channelData.push({
                channelName: mail[0],
                email: item.email,
                objectId: item.objectId,
            });
        });
        // setUserName(totalEmail);
        // setChannelData(totalEmail);
    }
    // console.log(data);
    return {
        props: {
            channelData,
        },
    };
}
export default ChatPage;
