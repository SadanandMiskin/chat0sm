import  { ReactNode } from 'react';
import { Sparkles, Bot, Zap, ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from './Header';


interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export  function HomePage() {
  // const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans ">
      <Header />

      <div className="flex-grow flex flex-col items-center justify-start px-4 text-center pt-20 bg-gradient-to-tr from-cyan-100 to-red-100">
        <h1 className="text-7xl md:text-8xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-b from-gray-700 to-zinc-900 animate-fade-up">
         Get Answers at your<br />fingertips
        </h1>
        <p className="text-md md:text-xl mb-10 max-w-2xl font-light text-gray-700 leading-relaxed animate-fade-up animate-delay-[180ms]">
          Unlocks the power of AI to build efficient solution effortlessly.
        </p>
        <Link to={'/chat'}><button className="inline-flex items-center text-lg px-8 py-4 mb-20 rounded-lg font-semibold tracking-wide bg-gradient-to-tr from-orange-600 to-lime-500 text-white hover:bg-gradient-to-br hover:from-orange-600 hover:to-lime-600 transition-colors animate-fade-up animate-delay-[280ms] " >
          Get Started <ArrowRight className="ml-2 h-5 w-5" />
        </button></Link>

        <div id="video" className="w-full max-w-5xl aspect-video bg-gradient-to-br from-pink-100 to-blue-100 rounded-2xl shadow-2xl flex items-center justify-center mb-20 overflow-hidden group cursor-pointer animate-fade-up animate-delay-[380ms]">
  <div className="text-center">
    <Play className="h-20 w-20 text-purple-600 mb-4" />
    <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-blue-600">Watch Our Demo</p>
  </div>
  <video autoPlay muted loop className="absolute top-0 left-0 w-full h-full object-cover">
    <source src="pn.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
</div>
        <section id="features" className="py-20  ">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-extrabold mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-blue-600">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<Bot className="h-12 w-12 text-red-600" />}
              title="Advanced AI Model"
              description="No Bullshit, Answer to your query with Detail and Summary."
            />
            <FeatureCard
              icon={<Zap className="h-12 w-12 text-purple-600" />}
              title="Multi Chat Support"
              description="Process and analyze data for different topics"
            />
            <FeatureCard
              icon={<Sparkles className="h-12 w-12 text-blue-600" />}
              title="Customizable Solutions"
              description="Tailor our AI solutions to fit your specific needs and integrate seamlessly with your existing systems."
            />
          </div>
        </div>
      </section>
      </div>



      <section id="contact" className="py-20 bg-gradient-to-b from-white to-pink-50">
        <div className="max-w-md mx-auto px-4 ">
          <h2 className="text-4xl font-extrabold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-blue-600">Amplify you Ideas!</h2>
          <form className="flex flex-wrap justify-center gap-3 space-x-2">
            {/* <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow text-lg px-4 py-4 rounded-lg border border-purple-200 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-colors"
            /> */}
            <Link to={'/chat'}>
            <button
              type="submit"
              className="text-lg px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-red-500 to-purple-600 text-white hover:from-red-600 hover:to-purple-700 transition-colors"
            >
              Lets Go
            </button>
            </Link>
          </form>
        </div>
      </section>

      <footer className="bg-red-50 py-10 text-center text-sm text-gray-600">
        <p>&copy; 2025 Chat0sm. All rights reserved.</p>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-pink-100">
      <div className="mb-6">{icon}</div>
      <h3 className="text-2xl font-bold mb-4 text-purple-800">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}

export default HomePage;