import { FaRegUserCircle, FaShoppingCart} from "react-icons/fa"
import Logo from "../assets/Logo.webp";
import SearchBar from "./SearchBar";
import CustomLink from "./CustomLink";
import "./stylesheets/TopBar.css"

export default function TopBar() {
    return (
        <topbar className="topbar">
            <CustomLink to="/"><img src={Logo} width={125} height={97}></img></CustomLink>
            <div className="search-bar-container">
                <SearchBar />
            </div>
            <ul>
                <div className="icon"><CustomLink to="/cart"><FaShoppingCart size={35} /></CustomLink></div>
                <div className="icon"><CustomLink to="/profile"><FaRegUserCircle size={35}/></CustomLink></div>
            </ul>
        </topbar>
    )
}