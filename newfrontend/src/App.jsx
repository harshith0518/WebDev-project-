import { useState } from 'react'
import './App.css'
// import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import Login from './components/Login'
import Home from './components/Home'
import Register from './components/Register'
import Problems from './components/Problems';
import Navbar from './components/Navbar'
import { BrowserRouter, Route,Routes } from 'react-router-dom'
import paths from './paths'
import CodeIDE from './components/CodeIDE'
import CodeSolution from './components/CodeSolution'
import Profile from './components/Profile'
import Leaderboard from './components/Leaderboard'
import Contests from './components/Contests'
import Solutions from './components/Solutions'
import EditProfile from './components/EditProfile'
import Logout from './components/Logout'  
import AddProblem from './components/AddProblem'
import ProblemSets from './components/ProblemSets'
import ProblemSetDetail from './components/ProblemSetDetail'


function App() {

  return (
    
    <BrowserRouter>
    {/* <Home/> */}
    <Routes>

    <Route path={paths.LOGIN} element={<Login/>}/>
    <Route path={paths.REGISTER} element={<Register/>}/>
    <Route path={paths.HOME} element={<Home/>}/>
    <Route path={paths.PROBLEMS} element={<Problems/>}/>
    <Route path={paths.CODEIDE} element={<CodeIDE/>}/>
    <Route path={`problems/:id/code-solution`} element={<CodeSolution/>}/>
    <Route path={paths.PROFILE} element={<Profile/>}/>
    <Route path={paths.EDITPROFILE} element={<EditProfile/>}/>
    <Route path={paths.LOGOUT} element={<Logout/>}/>
    <Route path={paths.LEADERBOARD} element={<Leaderboard/>}/>
    <Route path={paths.SOLUTIONS} element={<Solutions/>}/>
    <Route path={paths.CONTESTS} element={<Contests/>}/>
    <Route path={paths.ADDPROBLEM} element={<AddProblem/>}/>
    <Route path={paths.PROBLEMSETS} element={<ProblemSets/>}/>
    <Route path={`problem-sets/:id/problem-set`} element={<ProblemSetDetail/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App;

