import CustomLink from "./CustomLink";
import "./stylesheets/CategoryBar.css"

export default function CategoryBar() {
    return (
        <cat className="cat">
            <ul>
                <li><CustomLink to="/search?category=books">Books</CustomLink></li>
                <li><CustomLink to="/search?category=games">Games</CustomLink></li>
                <li><CustomLink to="/search?category=movies">Movies</CustomLink></li>
            </ul>
        </cat>
    )
}