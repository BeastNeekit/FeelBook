import Header from "../header";
import React from "react";
import Post from "../post";
import "./css/indexPage.css";
export default function IndexPage() {
  return (
    <>
        <Header />
        <div className="header-content">
            <img src="Background.png" alt="Post Image" className="header-image" />
            <div className="banner">
                <h1>Explore, Connect, Share</h1>
                <p>Thanks for stopping by! </p>
                    <p>We hope to see you again soon.</p>
            </div>
        </div>
        <h1>Team Members</h1>
            <Post role="Manager" name="Susan Shrestha" description="A skilled project manager as a team leader." email=" neek.sv.np@gmail.com"/>
            <Post role="Programmer" name="Susmita Shrestha" description="Passionate programmer with expertise in multiple languages." email="sus.sv.np@gmail.com" />
            <Post role="Analyzer" name="Samikshya Sapkota" description="Data analyst specializing in extracting insights from complex datasets." email=""/>
            <Post role="Graphic-designer" name="Santa Thapa" description="Graphic Designer."email="" />
            <Post role="Tester" name="Rajendra Karki" description="Tester." email=" rajendrakarki851@gmail.com" />

</>
  );
}
