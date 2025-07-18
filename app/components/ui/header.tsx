import { useState } from "react"


export default function Header() {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);



    return <nav className="flex flex-row justify-end gap-4 bg-slate-500 w-[100vw] h-12">
        {/* {
            links.map((item, index) => (
                <a href={`${item.href}`} className="m-4" >{item.text}</a>
            ))
        } */}
        <div className="flex flex-col justify-center align-middle">
            <img alt="hamburger menu" src="/icons/hamburger.svg" className="p-4 hover:scale-105 active:scale-95"
                onClick={() => { setMenuOpen(!menuOpen) }}
            />
            {menuOpen ? (

                <div className="absolute flex flex-col top-12 right-0 bg-slate-400 justify-center align-middle mx-4">
                {links.map((item, index) => (
                    <a href={`${item.href}`} className="m-4" >{item.text}</a>
                ))}
                </div>

            ) : (
                <></>
            )}
        </div>
    </nav>
}



export const links = [
    { href: "/", text: "Home" },
    { href: "/about", text: "About" },
    { href: "/contact", text: "Contact" }
]