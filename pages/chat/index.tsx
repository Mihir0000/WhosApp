import { Fragment, useEffect, useRef, useState } from 'react';
import styles from './chatPage.module.css';
import ChannelSide from '../../components/layout/channelSide';
import ChatSide from '../../components/layout/chatSide';
import AuthLoader from '../../components/Loader/AuthLoader';

function ChatPage() {
    const [channel, setChannel] = useState('Channel_I');
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const inputRef = useRef<HTMLInputElement>(null);
    const [search, setSearch] = useState('');
    const [focus, setFocus] = useState(false);  
    const channelData = [
        { channel: 'Channel_I' },
        { channel: 'Channel_II' },
        { channel: 'Channel_III' },
        { channel: 'Channel_IV' },
        { channel: 'Channel_V' },
        { channel: 'Channel_VI' },
        { channel: 'Channel_VII' },
        { channel: 'Channel_VIII' },
        { channel: 'Channel_IX' },
        { channel: 'Channel_X' },
    ];
    const [c, setC] = useState(channelData);
    const searchChannel = (word: string) => {
        let x = channelData.filter((i: any) => {
            return (
                i.channel.toLowerCase().startsWith(word.toLowerCase()) ||
                i.channel.toLowerCase().includes(word.toLowerCase())
            );
        });
        return x;
    };
    useEffect(() => {
        setC(searchChannel(search));
    }, [search]);

    useEffect(() => {
        async function userCall() {
            const value = await localStorage.getItem(
                'Backendless_2C1B1F9E-7BEE-C020-FF8D-B4A820E4DB00'
            );
            // console.log(value.length);

            // if (value !== null || value.length > 3) {
            //     Router.replace('/');
            // }
            if (value) {
                const singleUserData = JSON.parse(value);
                const { 'current-user-id': userID } = singleUserData;
                if (!!userID) {
                    setLoading(false);
                }
            }
        }
        userCall();
    });
    // console.log(userName);

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
                                    <div>All Channel</div>
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
                                    {c &&
                                        c.map((item: any, index: number) => (
                                            <ChannelSide
                                                key={index}
                                                channel_name={item.channel}
                                                setChannel={setChannel}
                                                channel={channel}
                                            />
                                        ))}
                                </div>
                            </div>
                            <div id={styles.right}>
                                <div className={styles.chat_top}>{channel}</div>
                                <div className={styles.chat_down}>
                                    <ChatSide channel={channel} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
}
export default ChatPage;
