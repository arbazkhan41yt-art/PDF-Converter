import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Grid3X3, Menu, X } from 'lucide-react';
import { LogoIcon } from './icons/ToolIcons';
import { tools } from '@/data/tools';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [convertDropdownOpen, setConvertDropdownOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  const convertToPDFTools = tools.filter(t => 
    ['jpg-to-pdf', 'word-to-pdf', 'powerpoint-to-pdf', 'excel-to-pdf', 'html-to-pdf'].includes(t.id)
  );
  
  const convertFromPDFTools = tools.filter(t => 
    ['pdf-to-jpg', 'pdf-to-word', 'pdf-to-powerpoint', 'pdf-to-excel', 'pdf-to-html'].includes(t.id)
  );

  const organizeTools = tools.filter(t => t.category === 'Organize PDF');
  const optimizeTools = tools.filter(t => t.category === 'Optimize PDF');
  const editTools = tools.filter(t => t.category === 'Edit PDF');
  const securityTools = tools.filter(t => t.category === 'PDF Security');

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <LogoIcon size={32} />
            <span className="text-xl font-bold text-gray-900">FileFlex</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link 
              to="/merge-pdf" 
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md transition-colors"
            >
              MERGE PDF
            </Link>
            <Link 
              to="/split-pdf" 
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md transition-colors"
            >
              SPLIT PDF
            </Link>
            <Link 
              to="/compress-pdf" 
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md transition-colors"
            >
              COMPRESS PDF
            </Link>
            
            {/* Convert PDF Dropdown */}
            <div className="relative">
              <button
                onClick={() => setConvertDropdownOpen(!convertDropdownOpen)}
                onMouseEnter={() => setConvertDropdownOpen(true)}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md transition-colors"
              >
                CONVERT PDF
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              
              {convertDropdownOpen && (
                <div 
                  className="absolute top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                  onMouseLeave={() => setConvertDropdownOpen(false)}
                >
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Convert to PDF</div>
                  {convertToPDFTools.map(tool => (
                    <Link
                      key={tool.id}
                      to={tool.route}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600"
                      onClick={() => setConvertDropdownOpen(false)}
                    >
                      {tool.name}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 my-1" />
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Convert from PDF</div>
                  {convertFromPDFTools.map(tool => (
                    <Link
                      key={tool.id}
                      to={tool.route}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600"
                      onClick={() => setConvertDropdownOpen(false)}
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* All PDF Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                onMouseEnter={() => setToolsDropdownOpen(true)}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md transition-colors"
              >
                ALL PDF TOOLS
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              
              {toolsDropdownOpen && (
                <div 
                  className="absolute top-full right-0 mt-1 w-[600px] bg-white rounded-lg shadow-xl border border-gray-200 py-4 z-50"
                  onMouseLeave={() => setToolsDropdownOpen(false)}
                >
                  <div className="grid grid-cols-3 gap-4 px-4">
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Organize PDF</div>
                      {organizeTools.map(tool => (
                        <Link
                          key={tool.id}
                          to={tool.route}
                          className="block py-1 text-sm text-gray-700 hover:text-red-600"
                          onClick={() => setToolsDropdownOpen(false)}
                        >
                          {tool.name}
                        </Link>
                      ))}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Optimize & Edit</div>
                      {optimizeTools.map(tool => (
                        <Link
                          key={tool.id}
                          to={tool.route}
                          className="block py-1 text-sm text-gray-700 hover:text-red-600"
                          onClick={() => setToolsDropdownOpen(false)}
                        >
                          {tool.name}
                        </Link>
                      ))}
                      <div className="border-t border-gray-100 my-2" />
                      {editTools.slice(0, 3).map(tool => (
                        <Link
                          key={tool.id}
                          to={tool.route}
                          className="block py-1 text-sm text-gray-700 hover:text-red-600"
                          onClick={() => setToolsDropdownOpen(false)}
                        >
                          {tool.name}
                        </Link>
                      ))}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-2">PDF Security</div>
                      {securityTools.map(tool => (
                        <Link
                          key={tool.id}
                          to={tool.route}
                          className="block py-1 text-sm text-gray-700 hover:text-red-600"
                          onClick={() => setToolsDropdownOpen(false)}
                        >
                          {tool.name}
                        </Link>
                      ))}
                      <div className="border-t border-gray-100 my-2" />
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-2">More Tools</div>
                      {editTools.slice(3).map(tool => (
                        <Link
                          key={tool.id}
                          to={tool.route}
                          className="block py-1 text-sm text-gray-700 hover:text-red-600"
                          onClick={() => setToolsDropdownOpen(false)}
                        >
                          {tool.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link 
              to="/login" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            >
              Sign up
            </Link>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
              <Grid3X3 className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-2">
            <Link 
              to="/merge-pdf" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Merge PDF
            </Link>
            <Link 
              to="/split-pdf" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Split PDF
            </Link>
            <Link 
              to="/compress-pdf" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Compress PDF
            </Link>
            <div className="border-t border-gray-100 my-2" />
            <div className="px-3 py-2 text-sm font-semibold text-gray-500 uppercase">Convert to PDF</div>
            {convertToPDFTools.map(tool => (
              <Link
                key={tool.id}
                to={tool.route}
                className="block px-3 py-2 text-base text-gray-700 hover:bg-gray-50 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                {tool.name}
              </Link>
            ))}
            <div className="border-t border-gray-100 my-2" />
            <div className="px-3 py-2 text-sm font-semibold text-gray-500 uppercase">Convert from PDF</div>
            {convertFromPDFTools.map(tool => (
              <Link
                key={tool.id}
                to={tool.route}
                className="block px-3 py-2 text-base text-gray-700 hover:bg-gray-50 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                {tool.name}
              </Link>
            ))}
            <div className="border-t border-gray-100 my-2" />
            <div className="flex items-center space-x-3 px-3 py-2">
              <Link 
                to="/login" 
                className="flex-1 text-center px-4 py-2 text-base font-medium text-gray-700 border border-gray-300 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="flex-1 text-center px-4 py-2 text-base font-medium text-white bg-red-600 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
