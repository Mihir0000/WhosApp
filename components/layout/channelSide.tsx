import styles from './channelSide.module.css';

function channelSide({ channel, setChannel, channel_name }: any) {
    
    const onClick = (e: any) => {
        // console.log(e.target.textContent);
        setChannel(e.target.textContent);
        console.log(channel, channel_name);
    };

    return (
        <div>
            <button onClick={onClick} className={styles.channel_btn}>
                <div className={styles.channel_side}>
                    {/* <div className={styles.c_name}>{channel_name}</div> */}
                    {channel === channel_name ? (
                        <div className={styles.activeChannel}>
                            {channel_name}
                        </div>
                    ) : (
                        <div className={styles.channel_name}>
                            {channel_name}
                        </div>
                    )}
                </div>
            </button>
        </div>
    );
}

export default channelSide;
