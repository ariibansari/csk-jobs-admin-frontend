import { NavLink, useLocation } from 'react-router-dom'

const CustomNavLink = ({ to, label, className }: { to: string, label: string, className?: string, type?: "default" | "dropdown-item" }) => {
    let { pathname } = useLocation()

    return (
        <NavLink to={to} className={`text-sm text-muted-foreground link ${pathname === to && 'text-primary '} ${className}`}>{label}</NavLink>
    )
}

export default CustomNavLink