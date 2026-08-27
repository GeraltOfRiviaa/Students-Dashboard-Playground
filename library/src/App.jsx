import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import  Home  from "./pages/home";
import  Detail  from "./pages/detail";
import Layout from "./Layout"

const App = () => {
    return (
        <Router>
            <Routes>
                <Route element={<Layout/>}>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/detail" element={<Detail/>}/>
                </Route>
                
            </Routes>
        </Router>
    )
}

export default App