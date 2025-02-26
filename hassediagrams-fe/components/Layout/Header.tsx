import NavItem from "../UI/NavItem";
import { SlHome, SlPlus, SlOrganization } from "react-icons/sl";
import { FiGrid } from 'react-icons/fi';

export default function Header() {
    return (
        <header className="h-16 flex items-center px-6">
            <div className="flex-1 flex items-center justify-start space-x-4">
                <FiGrid className="text-3xl" />
                <span className="text-2xl">Hasse Diagrams</span>
            </div>

            <div className="flex flex-row h-16 items-center justify-center space-x-20">
                <NavItem name="Home" link="/" Icon={SlHome} />
                <NavItem name="Create" link="/create" Icon={SlPlus} />
                <NavItem name="Diagrams" link="/diagrams" Icon={SlOrganization} />
            </div>

            <div className="flex-1 flex items-center justify-end">
                Profile
            </div>
        </header>
    );
}