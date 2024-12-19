import { Link, useMatch, useResolvedPath, useNavigate } from "react-router-dom";

export default function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true });
    return (
        
            <Link className={isActive ? "active" : ""} to={to} {...props}>{children}</Link>
        
    )
}