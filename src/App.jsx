import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Components/Home/Home'
import Manga from './Components/Manga/Manga'
import Chapter from './Components/Chapters/Chapter'
import MangaContextProvider from './Components/Context/MangaProvider'
function App() {

  return (
    <BrowserRouter>
      <MangaContextProvider>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/manga/:name/:id/' element={<Manga />}></Route>
          <Route path='/chapter/:id' element={<Chapter />}></Route>
        </Routes>
      </MangaContextProvider>
    </BrowserRouter>
  )
}

export default App
