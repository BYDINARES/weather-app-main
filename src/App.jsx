// import { useState } from "react";
// import "./App.css";
import weatherNowLogo from "./images/logo.svg";

function App() {
  return (
    <>
      <header>
        <nav>
          <img src={weatherNowLogo} alt="The App Logo" />
          <div class="dropdown">
            <button class="dropdown-toggle">Units ▼</button>
            <div>
              <label className="temperature" htmlFor="">
                <input type="radio" />
              </label>

              <label className="wind-speed" htmlFor="">
                <input type="radio" />
              </label>
            </div>

            <div>
              <label className="temperature" htmlFor="">
                <input type="radio" />
              </label>

              <label className="wind-speed" htmlFor="">
                <input type="radio" />
              </label>
            </div>

            <div>
              <label className="temperature" htmlFor="">
                <input type="radio" />
              </label>

              <label className="wind-speed" htmlFor="">
                <input type="radio" />
              </label>
            </div>
          </div>
        </nav>

        <h1 className="title">How's the sky looking today?</h1>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for a place..."
            className="search-input"
          />
          <button className="search">Search</button>
        </div>
      </header>

      <main>
        <img src="" alt="" />
        <section className="general-forecast">
          <img src="" alt="" />
          <img src="" alt="" />
          <img src="" alt="" />
          <img src="" alt="" />
        </section>
        <section className="daily-forecast">
          <img src="" alt="" />
          <img src="" alt="" />
          <img src="" alt="" />
          <img src="" alt="" />
          <img src="" alt="" />
          <img src="" alt="" />
          <img src="" alt="" />
        </section>
        <section className="hourly-forecast">
          <img src="" alt="" />
          <img src="" alt="" />
          <img src="" alt="" />
          <img src="" alt="" />
          <img src="" alt="" />
          <img src="" alt="" />
          <img src="" alt="" />
          <img src="" alt="" />
          <img src="" alt="" />
          <img src="" alt="" />
        </section>
      </main>
    </>
  );
}

export default App;
