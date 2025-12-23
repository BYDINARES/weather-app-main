import { useState, useEffect } from "react";
import "./App.css";
import LoadingSkeleton from "./loadingComp";

//Importing all the source elements
import weatherNowLogo from "./images/logo.svg";

//Icons
import checkMark from "./images/icon-checkmark.svg";
import iconDrizzle from "./images/icon-drizzle.webp";
import iconDropdown from "./images/icon-dropdown.svg"; //<==========
// import iconError from "./images/icon-error.svg";
import iconFog from "./images/icon-fog.webp";
// import iconLoading from "./images/icon-loading.svg";
import iconSearch from "./images/icon-search.svg";

// import iconRetry from "./images/icon-retry.svg";
import iconUnits from "./images/icon-units.svg";
import iconError from "./images/icon-error.svg";
//Forcast icons
import iconOvercast from "./images/icon-overcast.webp";
import iconPartlyCloudy from "./images/icon-partly-cloudy.webp";
import iconRain from "./images/icon-rain.webp";
import iconSnow from "./images/icon-snow.webp";
import iconStorm from "./images/icon-storm.webp";
import iconSunny from "./images/icon-sunny.webp";

function App() {
  //======== STATES ==========
  //loading
  const [isLoading, setIsLoading] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [hasError, setHasError] = useState(false);

  //dropdown
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState({
    temperature: "celsius",
    windSpeed: "km/h",
    precipitation: "mm",
  });
  const [switchToImperialMode, setSwitchToImperialMode] = useState(false);

  //Search nav
  const [weatherData, setWeatherData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  //Hourly dropdown
  const [openHourlyDropdown, setOpenHourlyDropdown] = useState(false);
  const [isRenderedHour, setIsRenderedHour] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

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

  useEffect(() => {
    if (openHourlyDropdown) {
      setIsRenderedHour(true);
    } else {
      const timer = setTimeout(() => {
        setIsRenderedHour(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [openHourlyDropdown]);

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
      precipitation: opts.precipitation === "mm" ? "mm" : "inch", // "mm" or "in"
    };
  }

  async function fetchData(query, units) {
    try {
      setIsLoading(true);
      setHasError(false); // reset previous errors

      const unitParams = buildUnitParams(units);

      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${query}`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error("Location not found");
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m,precipitation&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=${unitParams.temperature}&wind_speed_unit=${unitParams.wind}&precipitation_unit=${unitParams.precipitation}&timezone=auto`;

      const weatherRes = await fetch(url);
      const weather = await weatherRes.json();

      setWeatherData({
        location: `${name}, ${country}`,
        current: weather.current,
        hourly: weather.hourly,
        daily: weather.daily,
      });
    } catch (err) {
      console.error(err);
      setHasError(true);
      setWeatherData({});
    } finally {
      setIsLoading(false);
    }
  }

  //Values of the weather Icons
  const weatherIcons = {
    0: iconSunny,
    1: iconPartlyCloudy,
    2: iconPartlyCloudy,
    3: iconOvercast,
    45: iconFog,
    48: iconFog,
    51: iconDrizzle,
    53: iconDrizzle,
    55: iconDrizzle,
    61: iconRain,
    63: iconRain,
    65: iconRain,
    71: iconSnow,
    73: iconSnow,
    75: iconSnow,
    80: iconRain,
    81: iconRain,
    82: iconRain,
    95: iconStorm,
    96: iconStorm,
    99: iconStorm,
  };
  //Today's icon
  const todayIcon =
    weatherData.current?.weather_code !== undefined
      ? weatherIcons[weatherData.current.weather_code] || iconOvercast
      : null;

  function HourlyForecast({ weatherData, selectedDay }) {
    if (!weatherData?.hourly?.time) {
      return (
        <div>
          <p className="" style={{ padding: 16 }}>
            Loading hours...
          </p>
        </div>
      );
    }

    // Build hourly objects
    const hourly = weatherData.hourly.time.map((t, i) => ({
      date: new Date(t),
      temp: weatherData.hourly.temperature_2m[i],
      code: weatherData.hourly.weather_code[i],
    }));

    // If selectedDay is missing, default to today's date
    const now = new Date();
    const selectedDate = selectedDay
      ? new Date(selectedDay)
      : new Date(now.toISOString().split("T")[0]); // midnight today

    selectedDate.setHours(0, 0, 0, 0);

    // TODAY? → start at current hour
    let startMoment;
    if (selectedDate.toDateString() === now.toDateString()) {
      startMoment = new Date(now);
      startMoment.setMinutes(0, 0, 0);
    } else {
      // FUTURE DAY → start at midnight
      startMoment = new Date(selectedDate);
    }

    // Find hour in global hourly array
    const startIndex = hourly.findIndex(
      (h) => h.date.getTime() >= startMoment.getTime()
    );

    if (startIndex === -1) {
      return <p style={{ padding: 16 }}>No hours available.</p>;
    }

    // Always return exactly 10 hours
    const next8 = hourly.slice(startIndex, startIndex + 8);

    return (
      <ul className="hours-list">
        {next8.map((h, i) => {
          const hr = h.date.getHours();
          const label =
            hr === 0
              ? "12 AM"
              : hr < 12
              ? `${hr} AM`
              : hr === 12
              ? "12 PM"
              : `${hr - 12} PM`;

          return (
            <li key={i}>
              <img src={weatherIcons[h.code] || iconOvercast} />
              <p className="hour">{label}</p>
              <p className="deagree">{Math.round(h.temp)}°</p>
            </li>
          );
        })}
      </ul>
    );
  }

  function getWeekday(dateISO) {
    const date = new Date(dateISO);
    return date.toLocaleDateString("en-US", { weekday: "long" });
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
      {hasError && !isLoading ? (
        <section className="error-page">
          <img src={iconError} alt="An Icon Error" />
        </section>
      ) : (
        <main>
          <>
            {/* forcast of today */}
            <section
              className={
                !isLoading && weatherData.location
                  ? "bg-today"
                  : "bg-today loading"
              }
            >
              {isLoading ? (
                <LoadingSkeleton />
              ) : (
                <>
                  {" "}
                  <h3 className="city-country">
                    {weatherData.location ? weatherData.location : ""}
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
                      : ""}
                  </p>
                  {todayIcon && <img src={todayIcon} alt="Weather icon" />}
                  <h1 className="degree">
                    {weatherData.current &&
                      `${Math.round(weatherData.current.temperature_2m)}°`}
                  </h1>
                </>
              )}
            </section>

            {/* The 4 general forecats */}
            <section className="general-forecast">
              <article className="feels-like">
                <h3>Feels Like</h3>
                {isLoading ? (
                  <p>-</p>
                ) : (
                  <p>
                    {weatherData.current ? (
                      `${Math.round(weatherData.current.apparent_temperature)}°`
                    ) : (
                      <>
                        <p>-</p>
                      </>
                    )}
                  </p>
                )}
              </article>

              <article className="humidity">
                <h3>Humidity</h3>
                {isLoading ? (
                  <p>-</p>
                ) : (
                  <p>
                    {weatherData.current ? (
                      `${weatherData.current.relative_humidity_2m}%`
                    ) : (
                      <>
                        <p>-</p>
                      </>
                    )}
                  </p>
                )}
              </article>

              <article className="wind">
                <h3>Wind</h3>
                {isLoading ? (
                  <p>-</p>
                ) : (
                  <p>
                    {weatherData.current ? (
                      `${Math.round(weatherData.current.wind_speed_10m)} ${
                        dropdownOptions.windSpeed
                      }`
                    ) : (
                      <>
                        <p>-</p>
                      </>
                    )}
                  </p>
                )}
              </article>

              <article className="precipitation">
                <h3>Precipitation</h3>
                {isLoading ? (
                  <p>-</p>
                ) : (
                  <p>
                    {weatherData.current ? (
                      `${weatherData.current.precipitation} ${dropdownOptions.precipitation}`
                    ) : (
                      <>
                        <p>-</p>
                      </>
                    )}
                  </p>
                )}
              </article>
            </section>

            {/* The forecat for the week REMEMBER THAT THIS SECTION CONSIDERS ONE WEEK FROM THE DAY YOU DID FORECAST*/}
            <section className="daily-forecast">
              <h2>Daily forecast</h2>

              <div>
                {weatherData.daily && !isLoading ? (
                  weatherData.daily.time
                    .map((day, i) => ({
                      date: new Date(day),
                      code: weatherData.daily.weather_code[i],
                      max: weatherData.daily.temperature_2m_max[i],
                      min: weatherData.daily.temperature_2m_min[i],
                    }))
                    .filter((item) => {
                      // keep ONLY today and the future
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return item.date >= today;
                    })
                    .slice(0, 7) // ensure EXACTLY 7 days
                    .map((item, i) => {
                      const weekday = item.date.toLocaleDateString("en-US", {
                        weekday: "short",
                      });

                      return (
                        <article key={i}>
                          <h3>{weekday}</h3>

                          <img
                            src={weatherIcons[item.code] || iconOvercast}
                            alt="Weather icon"
                          />

                          <div className="degres-range">
                            <p className="max-d">{item.max}°</p>
                            <p className="min-d">{item.min}°</p>
                          </div>
                        </article>
                      );
                    })
                ) : (
                  // ===== fallback UI before search =====
                  <>
                    {Array.from({ length: 7 }).map(() => (
                      <article className="empty-days"></article>
                    ))}
                  </>
                )}
              </div>
            </section>

            <section className="hourly-forecast">
              <div className="top-pick-a-day">
                <h2>Hourly forecast</h2>
                <section className="dropdown-day">
                  <button
                    onClick={() => setOpenHourlyDropdown((prev) => !prev)}
                  >
                    {selectedDay ? getWeekday(selectedDay) : "Today"}
                    <img src={iconDropdown} alt="Dropdown icon" />
                  </button>

                  {isRenderedHour && weatherData.location && (
                    <section
                      className={
                        openHourlyDropdown
                          ? "dropdown-container enter"
                          : "dropdown-container fade"
                      }
                    >
                      {weatherData.daily.time
                        .map((day) => new Date(day))
                        .filter((date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date >= today;
                        })
                        .map((date) => {
                          const dayISO = date.toISOString().split("T")[0];
                          const weekday = date.toLocaleDateString("en-US", {
                            weekday: "long",
                          });

                          return (
                            <label key={dayISO} className="day-option">
                              <span>{weekday}</span>
                              <input
                                type="radio"
                                name="day-option"
                                checked={selectedDay === dayISO}
                                onChange={() => {
                                  setSelectedDay(dayISO);
                                  setOpenHourlyDropdown(false);
                                }}
                              />

                              {selectedDay === dayISO ? (
                                <img
                                  src={checkMark}
                                  alt="check mark"
                                  className="full-img"
                                />
                              ) : (
                                <span className="empty-img"></span>
                              )}
                            </label>
                          );
                        })}
                    </section>
                  )}
                </section>
              </div>
              {weatherData.location && !isLoading ? (
                <HourlyForecast
                  weatherData={weatherData}
                  selectedDay={selectedDay}
                />
              ) : (
                <ul className="hours-list">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <li className="empty-container" key={i}></li>
                  ))}
                </ul>
              )}
            </section>
          </>
        </main>
      )}
    </>
  );
}
export default App;
