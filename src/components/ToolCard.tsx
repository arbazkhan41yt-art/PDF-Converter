import { Link } from 'react-router-dom';
import type { Tool } from '@/types';
import { getToolIcon } from './icons/ToolIcons';

interface ToolCardProps {
  tool: Tool;
}

const ToolCard = ({ tool }: ToolCardProps) => {
  return (
    <Link
      to={tool.route}
      className="tool-card block bg-white rounded-xl border border-gray-200 p-6 hover:border-red-200"
    >
      <div className="flex items-start space-x-4">
        <div 
          className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: tool.bgColor }}
        >
          {getToolIcon(tool.icon, 28)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{tool.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-2">{tool.description}</p>
        </div>
      </div>
    </Link>
  );
};

export default ToolCard;
