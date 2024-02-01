import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Nav from "../Nav/Nav";
import "./Manga.css"
import { useNavigate } from "react-router-dom";
import ChapterContext from "../Context/MangaContext";

const Manga = () => {
    const { id, name } = useParams()
    const [data, setData] = useState([])
    const [title, setTitle] = useState({ 'en': 'Title' })
    const [banner, setBanner] = useState()
    const [description, setDescription] = useState({ 'en': 'Description' })
    const [tags, setTags] = useState([])
    const [chapter, setChapter] = useState([])
    const [chapterList, setChapterList] = useState([])
    const [offset, setOffset] = useState(0)
    const navigate = useNavigate()
    const mangaData = useContext(ChapterContext)

    const getManga = async () => {
        try {
            const response = await axios.get(`https://api.mangadex.org/manga/${id}`)
            setData(response.data.data)
            response.data.data.attributes.altTitles.map((item) => {
                if (item?.en) {
                    setTitle(item)
                    mangaData.UpdateData({'title':item})
                }
                else {
                    setTitle({ 'en': `${name}` })
                }
            })
        }
        catch (error) {
            console.error(error)
        }
    }

    const getBanner = async () => {
        try {
            const response = await axios.get(`https://api.mangadex.org/manga/${id}?includes[]=author&includes[]=cover_art`)
            const items = response.data.data.relationships
            items.map((newItem) => {
                if (newItem.type === 'cover_art') {
                    setBanner(newItem.attributes.fileName)
                }
            })
        }
        catch (error) {
            console.error(error)
        }
    }

    const GetChapters = async () => {
        setChapterList([])
        try {
            const response = await axios.get(`https://api.mangadex.org/manga/${id}/feed`, {
                params: {
                    "translatedLanguage": ["en"],
                    "order": { "chapter": "asc" },
                    "offset": offset,
                    "limit": 10,
                }
            })
            const data = response.data.data
            setChapterList(data)
            setChapter([])
            data.map((item) => {
                // console.log(item.id)
                // console.log(item.attributes.chapter)
                setChapter((prevData) => [...prevData, { [`${item.id}`]: `${item.attributes.chapter}` }])
            })
        }
        catch (error) {
            console.error(error)
        }
    }


    useEffect(() => {
        getManga()
        getBanner()
        GetChapters()
    }, [name, id])

    useEffect(() => {
        setDescription({ 'en': 'Description' })
        setDescription(data?.attributes?.description)
        setTags([])
        data?.attributes?.tags.map((item) => {
            setTags((prevData) => [...prevData, item.attributes.name.en])
        })
    }, [data])

    const HandleNext = () => {
        setOffset((prev) => prev + 10)
    }

    const HandlePrev = () => {
        if (offset > 9) {
            setOffset((prev) => prev - 10)
        }
    }

    const RedirectToChapter = (id) => {
        navigate(`/chapter/${id}`)
    }

    useEffect(() => {
        GetChapters()
    }, [offset])

    return (
        <React.Fragment>
            <Nav />
            <div className="manga-main">
                <div className="manga">
                    <div className="banner-image" style={{ backgroundImage: `url(https://mangadex.org/covers/${id}/${banner})` }}>
                    </div>
                    <figure className="image">
                        <div className="banner">
                            <img src={`https://mangadex.org/covers/${id}/${banner}`} alt="image" />
                        </div>
                        <div className="title">
                            <h1>{title.en}</h1>
                        </div>
                        <div className="buttons">
                            <button>Start Reading</button>
                        </div>
                        <div className="tags">
                            {tags.map((item, index) => (
                                <p key={index}>{item}</p>
                            ))}
                        </div>
                    </figure>
                    <div className="description-container">
                        <div className="description">
                            <h2>Description</h2>
                            <p>{description?.en}</p>
                        </div>
                    </div>
                    <div className="chapter-container">
                        <h1>Chapter List</h1>
                        <div className="chapters">
                            {chapterList.map((item, index) => (
                                <div className="chapter" key={index} onClick={() => RedirectToChapter(item.id)}>
                                    <div className="chapter-main">
                                        <h3>Chapter {item.attributes.chapter}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="pagination">
                            <button onClick={HandleNext}>Next</button>
                            <button onClick={HandlePrev}>Previous</button>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}
export default Manga