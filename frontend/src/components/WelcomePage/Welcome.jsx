import logo from "../../Images/chat.png";
import "./Welcome.css";
import { useSelector } from "react-redux";

function Welcome(){
    const darkTheme = useSelector((state)=>state.darkMode);

    return(
        <div className="welcome-container">
            <img src={logo} alt="Logo" className="welcome-logo" />
            <p className={darkTheme ? "dark-theme-font" : ""}>View and chat directly with your friends.</p>
        </div>
    );
}

export default Welcome;