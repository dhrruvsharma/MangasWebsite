import React, { useEffect, useState } from "react";
import "./Home.css"
import Nav from "../Nav/Nav";
import axios from "axios";
import Loader from "../Loader/Loader";
import { Link } from "react-router-dom";

const Home = () => {
    const TopRated = [
        '32d76d19-8a05-4db0-9fc2-e0b0648fe9d0',
        '478e6926-b8bc-465c-9694-2bae1dbaf32b',
        '30196491-8fc2-4961-8886-a58f898b1b3e',
        'd1a9fdeb-f713-407f-960c-8326b586e6fd'
    ]
    const Tops = {
        '32d76d19-8a05-4db0-9fc2-e0b0648fe9d0': 'Solo Leveling',
        '478e6926-b8bc-465c-9694-2bae1dbaf32b': 'Latna Saga',
        '30196491-8fc2-4961-8886-a58f898b1b3e': 'Berserk Of Gluttony',
        'd1a9fdeb-f713-407f-960c-8326b586e6fd': 'VagaBond'
    }
    const UserPicks = [
        '65498ee8-3c32-4228-b433-73a4d08f8927',
        'e5357466-c8a2-4259-9b02-2580185bd2bb',
        'bc9f897e-432e-4d11-a414-c72b80df93de',
        '69e218ec-93eb-4025-ae39-33d47b1160e0'
    ]
    const Users = {
        '65498ee8-3c32-4228-b433-73a4d08f8927': 'Daily Life With a Monster Girl',
        'e5357466-c8a2-4259-9b02-2580185bd2bb': 'Billy Bat',
        'bc9f897e-432e-4d11-a414-c72b80df93de': 'I am the Rising Villain',
        '69e218ec-93eb-4025-ae39-33d47b1160e0': 'Magic Emperor'
    }
    const [pickCover, setPickCover] = useState([])
    const [topData, setTopData] = useState([])
    const [filteredArray, setFiltered] = useState([])
    const [Load, setLoad] = useState(false)
    const [picked, setPicked] = useState([])

    const getTopCover = async () => {
        setLoad(true)
        try {
            const promises = TopRated.map(async (item) => {
                const response = await axios.get(`https://api.mangadex.org/manga/${item}?includes[]=author&includes[]=cover_art`)
                return response.data
            })
            const newData = await Promise.all(promises)
            setTopData(newData)
            newData.forEach((item) => {
                const itemData = item.data.relationships
                itemData.forEach((newItem) => {
                    if (newItem.type === 'cover_art') {
                        setTopData((prevData) => [...prevData, newItem.attributes.fileName])
                    }
                })
            })
        }
        catch (error) {
            console.error(error)
        }
        finally {
            setLoad(false)
        }
    }


    const getPickCover = async () => {
        try {
            const promises = UserPicks.map(async (item) => {
                const result = await axios.get(`https://api.mangadex.org/manga/${item}?includes[]=author&includes[]=cover_art`)
                return result.data
            })
            const newData = await Promise.all(promises)
            setPickCover(newData)
            newData.forEach((item) => {
                const itemData = item.data.relationships
                itemData.forEach((newItem) => {
                    if (newItem.type === 'cover_art') {
                        setPickCover((prevData) => [...prevData, newItem.attributes.fileName])
                    }
                })
            })
        }
        catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getTopCover()
        getPickCover()
    }, [])

    useEffect(() => {
        const stringArray = topData.flatMap(item => {
            if (typeof item === 'string') {
                return item
            }
        })
        setFiltered(stringArray.filter(Boolean))
    }, [topData])

    useEffect(() => {
        const stringArray = pickCover.flatMap(item => {
            if (typeof item === 'string') {
                return item
            }
        })
        setPicked(stringArray.filter(Boolean))
    }, [pickCover])

    return (
        <div className="home">
            <Nav />
            {!Load ? (
                <div className="home-container">
                    <div className="top-container">
                        <h1>Top Rated</h1>
                        <div className="top">
                            {filteredArray.map((item, index) => (
                                <div key={index} className="fig-container">
                                    <Link to={`/manga/${Tops[TopRated[index]]}/${TopRated[index]}`}>
                                        <figure>
                                            <img src={`https://uploads.mangadex.org/covers/${TopRated[index]}/${item}`} alt="image" />
                                            <br />
                                        </figure>
                                    </Link>
                                    <h2>{Tops[TopRated[index]]}</h2>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="top-container">
                        <h1>User Picks</h1>
                        <div className="top">
                            {picked.map((item, index) => (
                                <div className="fig-container" key={index}>
                                    <figure>
                                        <Link to={`/manga/${Users[UserPicks[index]]}/${UserPicks[index]}`}>
                                            <img src={`https://uploads.mangadex.org/covers/${UserPicks[index]}/${item}`} alt="image" />
                                            <br />
                                        </Link>
                                    </figure>
                                    <h2>{Users[UserPicks[index]]}</h2>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : <Loader />}
            <h1>Creadits to <a href="https://mangadex.org/" target="_blank">Mangadex</a>. All the APIs were provided by them. This is just a clone.</h1>
        </div>
    )
}
export default Home;