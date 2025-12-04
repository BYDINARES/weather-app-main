import { useState } from "react";
import "./App.css";
import weatherNowLogo from "./images/logo.svg";

function App() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [temperature, setTemperature] = useState("celsius");

  function Option({ name, value, label, selected, onChange }) {
    return (
      <label className="option">
        <input
          type="radio"
          name={name}
          value={value}
          checked={selected === value}
          onChange={() => onChange(value)}
        />

        <span className="text">{label}</span>
        <span className="check"></span>
      </label>
    );
  }

  return (
    <>
      <header>
        <nav>
          <img src={weatherNowLogo} alt="The App Logo" />

          <section className="dropdown">
            <button
              className="dropdown-toggle"
              onClick={() => setOpenDropdown((prev) => !prev)}
            >
              Units ▼
            </button>

            {openDropdown && (
              <div className="dropdown-section">
                <button className="switch">Switch to Imperial</button>

                <div className="temperature">
                  <h4>Temperature</h4>

                  <div className="option option-f">
                    <label htmlFor="temperature-c">Celsius (°C)</label>
                    <input
                      type="radio"
                      id="temperature-c"
                      name="temperature"
                      value="celsius"
                      defaultChecked
                    />
                  </div>

                  <div className="option option-f">
                    <label htmlFor="temperature-f">Fahrenheit (°F)</label>
                    <input
                      type="radio"
                      id="temperature-f"
                      name="temperature"
                      value="fahrenheit"
                    />
                  </div>
                </div>

                <div className="wind-speed">
                  <h4>Wind Speed</h4>

                  <div className="option">
                    <label htmlFor="wind-kmh">km/h</label>
                    <input
                      type="radio"
                      id="wind-kmh"
                      name="windSpeed"
                      value="kmh"
                      defaultChecked
                    />
                  </div>

                  <div className="option">
                    <label htmlFor="wind-mph">mph</label>
                    <input
                      type="radio"
                      id="wind-mph"
                      name="windSpeed"
                      value="mph"
                    />
                  </div>
                </div>

                <div className="precipitation">
                  <h4>Precipitation</h4>

                  <div className="option">
                    <label htmlFor="precip-mm">Millimeters (mm)</label>
                    <input
                      type="radio"
                      id="precip-mm"
                      name="precipitation"
                      value="mm"
                      defaultChecked
                    />
                  </div>

                  <div className="option">
                    <label htmlFor="precip-in">Inches (in)</label>
                    <input
                      type="radio"
                      id="precip-in"
                      name="precipitation"
                      value="in"
                    />
                  </div>
                </div>
              </div>
            )}
          </section>
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
