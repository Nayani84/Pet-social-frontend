import React, { useState, useEffect } from "react";
import axios from "axios";
import PetNews from '../components/PetNews';
import './PetNewsList.css';

// Helper function for rate-limited requests
let lastRequestTime = 0;

async function rateLimitedRequest(url, options) {
    const now = Date.now();

    if (now - lastRequestTime < 1000) {
        const delay = 1000 - (now - lastRequestTime);
        await new Promise((resolve) => setTimeout(resolve, delay));
    }

    lastRequestTime = Date.now();

    return axios.get(url, options);
}


/** List of Pet News. */
function PetNewsList({ numPetNewsToGet = 2 }) {
    const [petNews, setPetNews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        /* retrieve pet news from NewsCatcher API */
        async function getPetNews() {
            try {
               console.log("**********Newscatcher", import.meta.env.VITE_NEWSCATCHER_API_KEY) ;
                const res = await rateLimitedRequest(
                    `https://api.newscatcherapi.com/v2/search?q=pet&lang=en&page_size=${numPetNewsToGet}&sort_by=relevancy&page=${Math.floor(Math.random() * 10) + 1}`,
                    {
                        headers: {
                            "x-api-key": import.meta.env.VITE_NEWSCATCHER_API_KEY,
                        },
                    }
                );

                const newsArticles = res.data.articles.map((article) => ({
                    id: article._id || article.link || Date.now().toString(),
                    text: article.title,
                    url: article.link,
                    imageUrl: article.media,
                }));

                setPetNews(newsArticles);
            } catch (err) {
                if (err.response?.status === 429) {
                    alert("API rate limit exceeded. Please try again later.");
                } else {
                    console.error("Error fetching pet news:", err);
                }
            } finally {
                setIsLoading(false);
            }
        }


        if (isLoading) getPetNews();
    }, [isLoading, numPetNewsToGet]);


    /** Trigger a new fetch */
    function generateNewPetNews() {
        setPetNews([]); 
        setIsLoading(true);
    };

    /** Render loading spinner or pet news list */
    if (isLoading) {
        return (
            <div className="loading">
                <i className="fas fa-4x fa-spinner fa-spin" />
            </div>
        );
    }

    return (
        <div className="PetNewsList">
            <h2>Pet News</h2>
            <button
                className="PetNewsList-getmore"
                onClick={generateNewPetNews}
            >
                Get More Pet News
            </button>

            {petNews.map(({ id, text, url, imageUrl }) => (

                <PetNews
                    key={id}
                    id={id}
                    text={text}
                    url={url}
                    imageUrl={imageUrl}
                />

            ))}
        </div>
    );
}

export default PetNewsList;