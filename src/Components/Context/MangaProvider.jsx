import ChapterContext from "./MangaContext";
import React, { useState } from "react";

const MangaContextProvider = ({children}) => {
    const [data,setData] = useState({})
    const UpdateData = (newData) => {
        setData((prevData) => ({...prevData,...newData,}))
    }
    return(
        <ChapterContext.Provider value={{data,UpdateData}} >
            {children}
        </ChapterContext.Provider>
    )
}
export default MangaContextProvider