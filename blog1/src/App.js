import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/loginPage";
import Register from "./pages/registerPage";
import UserProfile from "../src/pages/UserProfile";
import IndexPage from "./pages/IndexPage";
import HomePage from "./pages/HomePage";
import VisitorProfile from "./pages/VisitorProfile";

function NotFound() {
    return <div>404 Not Found</div>;
}

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<IndexPage />} />
                <Route path="/login">
                    <Route index element={<Login />} />
                    <Route path="profile/:userName" element={<UserProfile />} />
                    <Route path="profile" element={<HomePage />} />
                </Route>
                <Route path="/register" element={<Register />} />
                <Route path="/visitor-profile/:userName" element={<VisitorProfile />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
}

export default App;
