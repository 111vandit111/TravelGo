import { useState, useEffect } from "react";
import "./App.css";
import Map, { Marker, Popup } from "react-map-gl";
import RoomIcon from "@mui/icons-material/Room";
import StarIcon from "@mui/icons-material/Star";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";

import { format } from "timeago.js";
import Register from "./components/Register";
import Login from "./components/Login";


function App() { 
  const myStorage = window.localStorage;
  const [currentUsername, setCurrentUsername] = useState(myStorage.getItem("user"));
  
  const [pins, setPins] = useState([]);
  const [viewState, setViewState] = useState({
    longitude: 75.778885,
    latitude: 26.92207,
    zoom: 10,
    doubleClickZoom: false,
  });
  const [currentPlace, setCurrentPlace] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [rating, setRating] = useState(0);
  const [desc, setDesc] = useState(null);



  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/pins");
        setPins(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getPins();
  }, []);

  const isOpen = (p, state) => {
    console.log(state);
    setViewState({ ...state, latitude: p.lat, longitude: p.long });
    setCurrentPlace(p._id);
  };

  const handleAddClick = (e) => {
    const lng = e.lngLat.lng;
    const lat = e.lngLat.lat;

    setNewPlace({
      lat,
      lng,
    });
  };


  const handelSubmit =async (e) =>{
    e.preventDefault();
    const newPin = {
      Username:currentUsername,
      Title:title,
       desc,
       rating,
       lat:newPlace.lat,
       long:newPlace.lng
    }

    try{
       const res = await axios.post("http://localhost:8080/api/pins" , newPin);
       setPins([...pins , res.data]);
       setNewPlace(null);
    }catch(error){
      console.log(error);
      setNewPlace(null);
    }
  }

  const handleLogout = () => {
    setCurrentUsername(null);
    myStorage.removeItem("user");
  };


  return (
    <div>
      <Map
        initialViewState={{
          latitude: 26.92207,
          longitude: 75.778885,
          zoom: 5.5,
          doubleClickZoom: false,
        }}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onDblClick={handleAddClick}
        mapboxAccessToken="pk.eyJ1Ijoia2FsYWRvbiIsImEiOiJjbDJqZDBhdGgwd2xqM2VsNXRpOW1qOXlsIn0.Qb_COdupztBjR--5gmVtyQ"
      >
        {pins.map((p) => (
          <div key={p._id}>
            <Marker
              longitude={p.long}
              latitude={p.lat}
              anchor="bottom"
              onClick={() => isOpen(p, viewState)}
            >
              <RoomIcon
                style={{
                  fontSize: 50,
                  color: p.Username === currentUsername ? "slateblue" : "#FF6C62",
                  cursor: "pointer",
                }}
              />
            </Marker>

            {currentPlace === p._id && (
              <Popup
                className="popup"
                longitude={p.long}
                latitude={p.lat}
                anchor="top"
                closeOnClick={false}
                onClose={() => setCurrentPlace(null)}
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{p.Title}</h4>
                  <label>Review</label>
                  <p className="review">{p.desc}</p>
                  <label>Rating</label>
                  <div className="Star">
                    {Array(p.rating+1).fill(<StarIcon />)}
                  </div>
                  <label>Information</label>
                  <span className="username">
                    {" "}
                    Created By <b>{p.Username}</b>{" "}
                  </span>
                  <span className="timeStamp">
                    {" "}
                    <b>{format(p.createdAt)}</b>{" "}
                  </span>
                </div>
              </Popup>
            )}
          </div>
        ))}

        {newPlace && (
          <Popup
            className="popup"
            longitude={newPlace.lng}
            latitude={newPlace.lat}
            anchor="top"
            closeOnClick={false}
            onClose={() => setNewPlace(null)}
          >
            <div>
              <form onSubmit={handelSubmit}>
                <label>Title</label>
                <input placeholder="Enter a title" onChange={(e)=>setTitle(e.target.value)}/>
                <label>Review</label>
                <textarea placeholder="Enter your review" onChange={(e)=>setDesc(e.target.value)} />
                <label>Rating</label>
                <select onChange={(e)=>setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className="submitButton" type="submit">
                  Add a Pin
                </button>
              </form>
            </div>
          </Popup>
        )}
        {currentUsername ? (
          <button className="button logout" onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>
              Log in
            </button>
            <button
              className="button register"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            setCurrentUsername={setCurrentUsername}
            myStorage={myStorage}
          />
        )}
      </Map>
    </div>
  );
}

export default App;
