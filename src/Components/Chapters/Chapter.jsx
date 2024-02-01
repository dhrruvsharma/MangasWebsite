import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import Loader from "../Loader/Loader";
import Nav from "../Nav/Nav";
import "./Chapter.css"
import ChapterContext from "../Context/MangaContext";

const Chapter = () => {
    const { id } = useParams()
    const [img, setImg] = useState([])
    const [baseUrl, setbaseUrl] = useState('')
    const [hash, setHash] = useState()
    const [loadingImages,setLoadingImages] = useState(Array(img.length).fill(true))
    const mangaData = useContext(ChapterContext)
    const title = mangaData.data.title.en

    const getChapterImages = async () => {
        try {
            const response = await axios.get(`https://api.mangadex.org/at-home/server/${id}`)
            setbaseUrl(response.data.baseUrl)
            setImg(response.data.chapter.data)
            setHash(response.data.chapter.hash)
        }
        catch (error) {
            console.error(error)
        }
    }
    const HandleImageLoad = (index) => {
        setLoadingImages(prevLoadingImages => {
            const updateLoadingImages = [...prevLoadingImages];
            updateLoadingImages[index] = false;
            return updateLoadingImages;
        })
    }

    useEffect(() => {
        setLoadingImages(Array(img.length).fill(true))
    },[img])

    useEffect(() => {
        getChapterImages()
    }, [])
    return (
        <div className="images-main">
            <Nav />
            <h1>{title}</h1>
            <div className="images">
                {img.map((item, index) => (
                    <div key={index} className="image-container">
                        {loadingImages[index] && <Loader />}
                        <img src={`${baseUrl}/data/${hash}/${item}`} alt="image" onLoad={() => HandleImageLoad(index)} style={{display: loadingImages[index] ? 'none' : 'block'}} loading="lazy" />
                    </div>
                ))}
                <div className="controller">
                    <button>Next</button>
                    <button>Previous</button>
                </div>
            </div>
        </div>
    )
}
export default Chapter