import { ReactNode } from 'react';
import { Sparkles, Bot, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from './Header';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans">
      <Header />

      {/* Hero Section with Enhanced Background */}
      <div className="relative flex flex-col overflow-hidden bg-gradient-to-b from-gray-50 via-white to-red-50 min-h-[90vh] items-start pb-12">
        {/* Abstract Shapes Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-red-100/40 via-transparent to-blue-50/30"></div>

          {/* Animated Circles */}
          <div className="absolute top-20 right-20 w-64 h-64 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 left-20 w-80 h-80 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 right-40 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

          {/* Mesh Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute w-full h-full" style={{
              backgroundImage: 'radial-gradient(#e74c3c 1px, transparent 1px), radial-gradient(#e74c3c 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 10px 10px'
            }}></div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-10 -left-10 w-40 h-40 border border-red-200 rounded-full"></div>
          <div className="absolute top-1/3 -right-20 w-80 h-80 border border-red-100 rounded-full"></div>
          <div className="absolute bottom-10 left-10 w-20 h-20 bg-gradient-to-r from-red-400 to-red-500 rounded-full opacity-10"></div>
        </div>

        <div className="relative flex flex-col items-center justify-start px-6 md:px-10 text-center pt-20 pb-12 w-full">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-50 text-red-700 font-medium text-sm mb-8 border border-red-100 shadow-sm">
            <span className="flex h-3 w-3 relative mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            Introducing Chat0sm AI
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-b from-gray-800 via-gray-700 to-red-800 animate-fade-up max-w-4xl leading-tight">
            Transform Ideas into Reality with AI
          </h1>

          <p className="text-lg md:text-xl mb-10 max-w-2xl font-normal text-gray-600 leading-relaxed animate-fade-up animate-delay-150">
            Unlock powerful AI solutions that deliver answers instantly and help you build efficiently.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-up animate-delay-200">
            <Link to="/chat">
              <button className="inline-flex items-center justify-center text-lg px-8 py-4 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-all shadow-lg hover:shadow-red-100 hover:shadow-xl">
                Start Now <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </Link>
            {/* <button className="inline-flex items-center justify-center text-lg px-8 py-4 rounded-lg font-medium bg-white text-gray-700 border border-gray-200 hover:border-gray-300 transition-all shadow-sm hover:shadow-md">
              <Play className="mr-2 h-5 w-5" /> Watch Demo
            </button> */}
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-6 ">
          <div className="aspect-video bg-white rounded-xl shadow-xl flex items-center justify-center overflow-hidden group cursor-pointer relative border border-gray-100 shadow-[0px_-9px_37px_-15px_#f7b2b2]">
            <div className="absolute bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-30 transition-all duration-300 z-10">
              {/* <div className="text-center transform group-hover:scale-105 transition-transform duration-300">
                <div className="bg-red-600 p-6 rounded-full mb-4">
                  <Play className="h-12 w-12 text-white" />
                </div>
                <p className="text-xl font-medium text-white">Watch Our Demo</p>
              </div> */}
            </div>
            <video autoPlay muted loop className="w-full h-full border border-red-600 ">
              <source src="pn.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>

      {/* Video Section */}
      {/* <div className="w-full bg-gray-50 py-16">

      </div> */}

      {/* Features Section */}
      <section id="features" className="py-20 w-full max-w-6xl mx-auto px-6 bg-white">
        <h2 className="text-3xl font-bold mb-16 text-center">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-700">
            Powerful Features
          </span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Bot className="h-10 w-10 text-white" />}
            title="Advanced AI Model"
            description="No Bullshit, Answer to your query with Detail and Summary."
          />
          <FeatureCard
            icon={<Zap className="h-10 w-10 text-white" />}
            title="Multi Chat Support"
            description="Process and analyze data for different topics"
          />
          <FeatureCard
            icon={<Sparkles className="h-10 w-10 text-white" />}
            title="Customizable Solutions"
            description="Tailor our AI solutions to fit your specific needs and integrate seamlessly with your existing systems."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Amplify Your Ideas?</h2>
          <p className="text-lg mb-10 max-w-2xl mx-auto opacity-90">
            Join thousands of users who are already transforming their workflow with Chat0sm AI.
          </p>
          <Link to="/chat">
            <button className="text-lg px-10 py-4 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl">
              Get Started Now
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 text-center text-sm text-gray-600 border-t border-gray-100">
        <p>&copy; 2025 Chat0sm. All rights reserved.</p>
      </footer>
    </div>
  );
}

// Add these animations to your CSS


function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:border-red-100">
      <div className="mb-6 bg-gradient-to-br from-red-600 to-red-700 p-4 inline-flex rounded-xl group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

export default HomePage;