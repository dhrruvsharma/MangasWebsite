import React, { useEffect, useState } from "react";
import Logo from "../../assets/Logo.svg"
import './Nav.css'
import axios from "axios";
import { Link } from "react-router-dom";

const Nav = () => {
    const [query, Setquery] = useState()
    const [search, setSearch] = useState(false)
    const [load, setLoad] = useState(false)
    const [names, setNames] = useState([])
    const [id, setId] = useState([])
    const HandleChange = (e) => {
        const { value } = e.target
        Setquery(value)
    }
    const handleSearch = async () => {
        try {
            setLoad(true)
            setSearch(true)
            const response = await axios.get(`https://api.mangadex.org/manga`, {
                params: {
                    title: `${query}`
                }
            })
            response.data.data.map((item) => {
                setNames((prevData) => [...prevData, item.attributes.title.en])
                setId((prevData) => [...prevData, item.id])
            })
            setLoad(false)
        }
        catch (error) {
            console.error(error)
            setLoad(false)
        }
    }
    useEffect(() => {
        const id = setTimeout(() => {
            if (query) {
                handleSearch()
                Setquery()
                setId([])
                setNames([])
            }
        }, 1000)
        return () => clearTimeout(id)
    }, [query])
    
    const HandleClick = (e) => {
        const  searchResultDiv = document.querySelector('.search-main')

        if (searchResultDiv && searchResultDiv.contains(e.relatedTarget)){
            setSearch(true)
        }
        else {
            setSearch(false)
        }
    }
    return (
        <React.Fragment>
            <div className="nav" onClick={HandleClick}>
                <figure className="fig">
                    <img src={Logo} alt="Logo" />
                    <p>ReadManga</p>
                </figure>
                <div className="search-main" onClick={HandleClick}>
                    <div className="search">
                        <input type="text" name="query" id="" onChange={HandleChange} autoComplete="off" placeholder="Enter title" onFocus={HandleChange}/>
                        <button>Search</button>
                    </div>
                    <div className="search-results">
                        {search && load && (
                            <div className="loading-container">
                                <div className="loads">
                                </div>
                                <p>Searching...</p>
                            </div>
                        )}
                        {search && !load && (
                            <div className="query-result">
                                {names.map((item, index) => (
                                    <div className="item-container" key={index}>
                                        <Link to={`/manga/${item}/${id[index]}`}>
                                            <h3>{item}</h3>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}
export default Nav