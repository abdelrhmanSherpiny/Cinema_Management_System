import React, { useState, useRef } from 'react'
import styles from './movie_card.module.css'

function movie_card() {
    const movies = [
        {
            title: "Back to the Future",
            info: "(1985) Adventure, Comedy, Sci-Fi",
            desc: "Marty McFly, a 17-year-old high school student, is accidentally sent 30 years into the past in a time-traveling DeLorean invented by his close friend, the maverick scientist Doc Brown.",
            image:
                "http://digitalspyuk.cdnds.net/15/47/1600x800/landscape-1447754794-harrison-ford-blade-runner.jpg",
        },
        {
            title: "Back to the Future",
            info: "(PG)",
            desc: "A time-travel adventure full of surprises.",
            image:
                "http://www.blastr.com/sites/blastr/files/back-to-the-future-part-ii-original.jpg",
        },
        {
            title: "Akira",
            info: "(15)",
            desc: "A legendary cyberpunk classic.",
            image:
                "http://www.dvdactive.com/images/reviews/screenshot/2011/5/akirabdcap8_original.jpg",
        },
    ];

    const AvailbeTimesRef = useRef(null);
    const [showTimes, setShowTimes] = useState("");

    function handleShowTimes() {
        console.log(AvailbeTimesRef.current.style.display);
        AvailbeTimesRef.current.style.display = AvailbeTimesRef.current.style.display === 'block' ? 'none' : 'block';
        setShowTimes(AvailbeTimesRef.current.style.display);
    }
    return (
        <>
            <div className={styles.movieCardList}>
                {movies.map((movie, index) => (
                    <div key={index}>
                        <div
                            className={styles.movieCard}
                            style={{ backgroundImage: `url(${movie.image})` }}
                        >
                            <div className={styles.colorOverlay}>

                                <div className={styles.movieContent}>
                                    <div className={styles.movieHeader}>
                                        <h1 className={styles.movieTitle}>{movie.title}</h1>
                                        <h4 className={styles.movieInfo}>{movie.info}</h4>
                                    </div>

                                    <p className={styles.movieDesc}>{movie.desc}</p>

                                    <a className={`${styles.btn} ${styles.btnOutline}`} onClick={handleShowTimes}>
                                        Show Times
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className={styles.content} ref={AvailbeTimesRef} style={{display: "none"}}>
                            <p>{showTimes}</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default movie_card