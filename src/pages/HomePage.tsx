import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Monitor, Smartphone, Building2, Crown, Zap } from 'lucide-react';
import { tools, categories } from '@/data/tools';
import ToolCard from '@/components/ToolCard';

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredTools = activeCategory === 'All' 
    ? tools 
    : activeCategory === 'Workflows' 
      ? []
      : tools.filter(tool => tool.category === activeCategory);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Every tool you need to work with{' '}
            <span className="text-red-600">files</span> in one place
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Every tool you need to use PDFs, at your fingertips. All are 100% FREE and easy to use! 
            Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.
          </p>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`filter-btn px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-16">
              <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Create custom workflows with your favorite tools</p>
              <button className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Create Workflow
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Work Your Way Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Work your way
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Desktop */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8">
              <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
                <Monitor className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Work offline with Desktop
              </h3>
              <p className="text-gray-600 mb-6">
                Batch edit and manage documents locally, with no internet and no limits.
              </p>
              <Link 
                to="/desktop" 
                className="inline-flex items-center text-red-600 font-medium hover:text-red-700"
              >
                Learn more <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            {/* Mobile */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
              <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
                <Smartphone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                On-the-go with Mobile
              </h3>
              <p className="text-gray-600 mb-6">
                Your favorite tools, right in your pocket. Keep working on your projects anytime, anywhere.
              </p>
              <Link 
                to="/mobile" 
                className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700"
              >
                Learn more <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            {/* Business */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8">
              <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
                <Building2 className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Built for business
              </h3>
              <p className="text-gray-600 mb-6">
                Automate document management, onboard teams easily, and scale with flexible plans.
              </p>
              <Link 
                to="/business" 
                className="inline-flex items-center text-purple-600 font-medium hover:text-purple-700"
              >
                Learn more <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Section */}
      <section className="py-16 bg-gradient-to-r from-amber-50 to-yellow-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-12">
                <div className="flex items-center space-x-2 mb-4">
                  <Crown className="w-6 h-6 text-amber-500" />
                  <span className="text-sm font-semibold text-amber-600 uppercase tracking-wider">Premium</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Get more with Premium
                </h2>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-600">Get full access to FileFlex and work offline with Desktop</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-600">Edit PDFs, get advanced OCR for scanned documents</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-600">Connect tools and create custom workflows</span>
                  </li>
                </ul>
                <button className="px-8 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors">
                  Get Premium
                </button>
              </div>
              <div className="bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center p-8">
                <div className="relative">
                  <div className="w-48 h-64 bg-white rounded-lg shadow-lg transform rotate-6 absolute -right-4 -top-4" />
                  <div className="w-48 h-64 bg-white rounded-lg shadow-xl relative z-10 p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                    <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-5/6 mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-4/5 mb-4" />
                    <div className="h-20 bg-gray-100 rounded mb-3" />
                    <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-3/4" />
                  </div>
                  <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center z-20">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            The PDF software trusted by millions of users
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            FileFlex is your number one web app for editing PDF with ease. Enjoy all the tools you need to work efficiently with your digital documents while keeping your data safe and secure.
          </p>
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2 text-gray-500">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span className="text-sm font-medium">ISO 27001</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
              </svg>
              <span className="text-sm font-medium">SSL Secure</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
              </svg>
              <span className="text-sm font-medium">PDF Association</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
