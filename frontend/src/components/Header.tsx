import { Link } from "react-router-dom"


const Header = () => {
  return (
    <header className="p-4 flex justify-evenly items-center bg-red-50">
        <div className="flex items-center space-x-2">
          <img src='p.png' className='w-6'/>
          <Link to={'/'}><span className="font-extrabold text-xl tracking-tight text-red-600">Chat0sm</span></Link>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="/login" className="text-purple-600 hover:text-pink-600 transition-colors font-medium">Login</a></li>
            <li><a href="/register" className="text-purple-600 hover:text-pink-600 transition-colors font-medium">Register</a></li>
            {/* <li><a href="#contact" className="text-purple-600 hover:text-pink-600 transition-colors font-medium">Contact</a></li> */}
          </ul>
        </nav>
      </header>
  )
}

export default Header
