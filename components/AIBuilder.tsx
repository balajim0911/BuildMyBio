import React from 'react';
import { Sparkles, X } from 'lucide-react';
import { parseResumeFromText } from '../services/geminiService';
import { ResumeData } from '../types';

interface AIBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onDataParsed: (data: Partial<ResumeData>) => void;
}

const AIBuilder: React.FC<AIBuilderProps> = ({ isOpen, onClose, onDataParsed }) => {
  const [inputText, setInputText] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const parsedData = await parseResumeFromText(inputText);
      onDataParsed(parsedData);
      onClose();
    } catch (err) {
      setError("Failed to generate resume. Please check your API key or try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-gradient-to-r from-brand-600 to-purple-600 p-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Sparkles size={24} className="animate-pulse" />
            <h2 className="text-xl font-bold">Auto-Resume Builder</h2>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Paste your LinkedIn summary, an old resume dump, or just type out your work history loosely. 
            Our AI will format it into a professional resume structure for you.
          </p>
          
          <textarea
            className="w-full h-48 p-4 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none resize-none bg-gray-50"
            placeholder="e.g. My name is John Doe. I worked at TechCorp from 2020 to 2022 as a Software Engineer where I built..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-100">
              {error}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={isLoading || !inputText.trim()}
              className="px-6 py-2 bg-brand-600 text-white rounded font-medium hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? 'Generating...' : (
                <>
                  <Sparkles size={16} /> Generate Resume
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIBuilder;
