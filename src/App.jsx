import { useState, useEffect } from "react";
import "./App.css";

//Importing all the source elements
import weatherNowLogo from "./images/logo.svg";

//Icons
import checkMark from "./images/icon-checkmark.svg";
import iconDrizzle from "./images/icon-drizzle.webp";
import iconDropdown from "./images/icon-dropdown.svg"; //<==========
import iconError from "./images/icon-error.svg";
import iconFog from "./images/icon-fog.webp";
import iconLoading from "./images/icon-loading.svg";
import iconSearch from "./images/icon-search.svg";

import iconRetry from "./images/icon-retry.svg";
import iconUnits from "./images/icon-units.svg";
//Forcast icons
import iconOvercast from "./images/icon-overcast.webp";
import iconPartlyCloudy from "./images/icon-partly-cloudy.webp";
import iconRain from "./images/icon-rain.webp";
import iconSnow from "./images/icon-snow.webp";
import iconStorm from "./images/icon-storm.webp";
import iconSunny from "./images/icon-sunny.webp";

function App() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  //dropdown
  const [dropdownOptions, setDropdownOptions] = useState({
    temperature: "celsius",
    windSpeed: "km/h",
    precipitation: "mm",
  });
  const [switchToImperialMode, setSwitchToImperialMode] = useState(false);

  //Search nav
  const [weatherData, setWeatherData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  //======== Efects =======
  useEffect(() => {
    if (openDropdown) {
      setIsRendered(true);
    } else {
      const timer = setTimeout(() => {
        setIsRendered(false);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [openDropdown]);

  useEffect(() => {
    if (weatherData.location) {
      fetchData(searchQuery, dropdownOptions);
    }
  }, [dropdownOptions]);

  //======== functions ==========

  function toggleUnits() {
    const switchToImperial = {
      temperature: "fahrenheit",
      windSpeed: "mph",
      precipitation: "in",
    };

    if (!switchToImperialMode) {
      setDropdownOptions(switchToImperial);
      setSwitchToImperialMode(true);
    } else {
      setDropdownOptions({
        temperature: "celsius",
        windSpeed: "km/h",
        precipitation: "mm",
      });
      setSwitchToImperialMode(false);
    }
  }

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

  function buildUnitParams(opts) {
    return {
      temperature: opts.temperature === "celsius" ? "celsius" : "fahrenheit",
      wind: opts.windSpeed === "km/h" ? "kmh" : "mph",
      precipitation: opts.precipitation, // "mm" or "in"
    };
  }

  async function fetchData(query, units) {
    try {
      // Convert dropdown units to API-friendly format
      const unitParams = buildUnitParams(units);

      // 1. Search the location
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${query}`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        console.error("No results found");
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // 2. Create FULL weather request with unit options
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,precipitation&hourly=temperature_2m,precipitation,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&temperature_unit=${unitParams.temperature}&wind_speed_unit=${unitParams.wind}&precipitation_unit=${unitParams.precipitation}&timezone=auto`;

      const weatherRes = await fetch(url);
      const weather = await weatherRes.json();

      // 3. Store everything for rendering
      setWeatherData({
        location: `${name}, ${country}`,
        current: weather.current,
        hourly: weather.hourly,
        daily: weather.daily,
      });
    } catch (err) {
      console.error("Failed to fetch weather:", err);
    }
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
              <img
                className="settings-icon"
                src={iconUnits}
                alt="settings icon"
              />
              Units
              <img
                className="dropdown-icon"
                src={iconDropdown}
                alt="arrow pointing down"
              />
            </button>

            {isRendered && (
              <div
                className={
                  openDropdown
                    ? "dropdown-section dropdown-enter"
                    : "dropdown-section dropdown-section-fade"
                }
              >
                <button className="switch" onClick={() => toggleUnits()}>
                  {switchToImperialMode
                    ? "Switch to Metric"
                    : "Switch to Imperial"}
                </button>

                <div className="temperature">
                  <h4>Temperature</h4>

                  <div className="option option-f">
                    <label htmlFor="temperature-c">Celsius (°C)</label>
                    <input
                      type="radio"
                      id="temperature-c"
                      name="temperature"
                      value="celsius"
                      onClick={() =>
                        setDropdownOptions((prev) => ({
                          ...prev,
                          temperature: "celsius",
                        }))
                      }
                      defaultChecked
                    />
                    {dropdownOptions.temperature === "celsius" ? (
                      <img
                        className="full-img"
                        src={checkMark}
                        alt="check mark"
                      />
                    ) : (
                      <img className="empty-img" />
                    )}
                  </div>

                  <div className="option option-f">
                    <label htmlFor="temperature-f">Fahrenheit (°F)</label>
                    <input
                      type="radio"
                      id="temperature-f"
                      name="temperature"
                      value="fahrenheit"
                      onClick={() =>
                        setDropdownOptions((prev) => ({
                          ...prev,
                          temperature: "fahrenheit",
                        }))
                      }
                    />
                    {dropdownOptions.temperature === "fahrenheit" ? (
                      <img
                        className="full-img"
                        src={checkMark}
                        alt="check mark"
                      />
                    ) : (
                      <img className="empty-img" />
                    )}
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
                      onClick={() =>
                        setDropdownOptions((prev) => ({
                          ...prev,
                          windSpeed: "km/h",
                        }))
                      }
                      defaultChecked
                    />
                    {dropdownOptions.windSpeed === "km/h" ? (
                      <img
                        className="full-img"
                        src={checkMark}
                        alt="check mark"
                      />
                    ) : (
                      <img className="empty-img" />
                    )}
                  </div>

                  <div className="option">
                    <label htmlFor="wind-mph">mph</label>
                    <input
                      type="radio"
                      id="wind-mph"
                      name="windSpeed"
                      value="mph"
                      onClick={() =>
                        setDropdownOptions((prev) => ({
                          ...prev,
                          windSpeed: "mph",
                        }))
                      }
                    />
                    {dropdownOptions.windSpeed === "mph" ? (
                      <img
                        className="full-img"
                        src={checkMark}
                        alt="check mark"
                      />
                    ) : (
                      <img className="empty-img" />
                    )}
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
                      onClick={() =>
                        setDropdownOptions((prev) => ({
                          ...prev,
                          precipitation: "mm",
                        }))
                      }
                      defaultChecked
                    />
                    {dropdownOptions.precipitation === "mm" ? (
                      <img
                        className="full-img"
                        src={checkMark}
                        alt="check mark"
                      />
                    ) : (
                      <img className="empty-img" />
                    )}
                  </div>

                  <div className="option">
                    <label htmlFor="precip-in">Inches (in)</label>
                    <input
                      type="radio"
                      id="precip-in"
                      name="precipitation"
                      value="in"
                      onClick={() =>
                        setDropdownOptions((prev) => ({
                          ...prev,
                          precipitation: "in",
                        }))
                      }
                    />
                    {dropdownOptions.precipitation === "in" ? (
                      <img
                        className="full-img"
                        src={checkMark}
                        alt="check mark"
                      />
                    ) : (
                      <img className="empty-img" />
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>
        </nav>

        <h1 className="title">How's the sky looking today?</h1>

        <div className="search-bar">
          <div className="search-input">
            <img src={iconSearch} alt="search icon" />
            <input
              type="text"
              placeholder="Search for a place..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            className="search"
            onClick={() => fetchData(searchQuery, dropdownOptions)}
          >
            Search
          </button>
        </div>
      </header>

      {/* ========= The MAIN ========= */}
      <main>
        {/* forcast of today */}
        <section className="bg-today">
          <h3 className="city-country">
            {weatherData.location ? weatherData.location : "Berlin, Germany"}
          </h3>
          <p className="date">
            {weatherData.location
              ? (() => {
                  const d = new Date();
                  return `${d.toLocaleDateString("en-US", {
                    weekday: "long",
                  })}, ${d.toLocaleDateString("en-US", {
                    month: "short",
                  })} ${d.getDate()} ${d.getFullYear()}`;
                })()
              : "Tuesday, Aug 5 2025"}
          </p>
          <img src={iconSunny} alt="A sun icon" />
          <h1 className="degree">20º</h1>
        </section>

        {/* The 4 general forecats */}
        <section className="general-forecast">
          <article className="feels-like">
            <h3>Feels Like</h3>
            <p>18°</p>
          </article>

          <article className="humidity">
            <h3>Humidity</h3>
            <p>46%</p>
          </article>

          <article className="wind">
            <h3>Wind</h3>
            <p>14 km/h</p>
          </article>

          <article className="precipitation">
            <h3>Precipitation</h3>
            <p>0 mm</p>
          </article>
        </section>

        {/* The forecat for the week REMEMBER THAT THIS SECTION CONSIDERS ONE WEEK FROM THE DAY YOU DID FORECAST*/}
        <section className="daily-forecast">
          <h2>Daily forecast</h2>
          <div>
            <article>
              <h3>Tue</h3>
              <img src={iconRain} alt="Rain Icon" />
              <div className="dregres-range">
                <p className="max-d">20°</p>
                <p className="min-d">14°</p>
              </div>
            </article>
            <article>
              <h3>Wed</h3>
              <img src={iconDrizzle} alt="Drizzle Icon" />
              <div className="dregres-range">
                <p className="max-d">21°</p>
                <p className="min-d">15°</p>
              </div>
            </article>
            <article>
              <h3>Thu</h3>
              <img src={iconSunny} alt="Sunny Icon" />
              <div className="dregres-range">
                <p className="max-d">24°</p>
                <p className="min-d">14°</p>
              </div>
            </article>
            <article>
              <h3>Fri</h3>
              <img src={iconPartlyCloudy} alt="Partly Cloudy Icon" />
              <div className="dregres-range">
                <p className="max-d">25°</p>
                <p className="min-d">13°</p>
              </div>
            </article>
            <article>
              <h3>Sat</h3>
              <img src={iconStorm} alt="Storm Icon" />
              <div className="dregres-range">
                <p className="max-d">21°</p>
                <p className="min-d">15°</p>
              </div>
            </article>
            <article>
              <h3>Sun</h3>
              <img src={iconSnow} alt="Snow Icon" />
              <div className="dregres-range">
                <p className="max-d">25°</p>
                <p className="min-d">16°</p>
              </div>
            </article>
            <article>
              <h3>Mon</h3>
              <img src={iconFog} alt="Fog Icon" />
              <div className="dregres-range">
                <p className="max-d">24°</p>
                <p className="min-d">15°</p>
              </div>
            </article>
          </div>
        </section>

        <section className="hourly-forecast">
          <div className="top-pick-a-day">
            <h2>Hourly forecast</h2>
            <section className="dropdown-day">
              <button>
                Tuesday
                <img src={iconDropdown} alt="Dropdown icon" />
              </button>
            </section>
          </div>
          <ul className="hours-list">
            <li className="time-3pm">
              <img src={iconOvercast} alt="cloud icon" />
              <p className="hour">3 PM</p>
              <p className="deagree">20°</p>
            </li>
            <li className="time-4pm">
              <img src={iconPartlyCloudy} alt="A sun with a cloud icon" />
              <p className="hour">4 PM</p>
              <p className="deagree">20°</p>
            </li>
            <li className="time-5pm">
              <img src={iconSunny} alt="Sun Icon" />
              <p className="hour">5 PM</p>
              <p className="deagree">20°</p>
            </li>
            <li className="time-6pm">
              <img src={iconOvercast} alt="Cloud icon" />
              <p className="hour">6 PM</p>
              <p className="deagree">19°</p>
            </li>
            <li className="time-7pm">
              <img src={iconSnow} alt="Snow icon" />
              <p className="hour">7 PM</p>
              <p className="deagree">18°</p>
            </li>
            <li className="time-8pm">
              <img src={iconFog} alt="Fog icon" />
              <p className="hour">8 PM</p>
              <p className="deagree">18°</p>
            </li>
            <li className="time-9pm">
              <img src={iconSnow} alt="Snow icon" />
              <p className="hour">9 PM</p>
              <p className="deagree">17°</p>
            </li>
            <li className="time-10pm">
              <img src={iconOvercast} alt="Cloud Icon" />
              <p className="hour">10 PM</p>
              <p className="deagree">17°</p>
            </li>
          </ul>
        </section>
      </main>
    </>
  );
}

export default App;
