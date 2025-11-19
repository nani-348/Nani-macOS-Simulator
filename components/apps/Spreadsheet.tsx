
import React, { useState, useMemo } from 'react';
import { generateSpreadsheetData } from '../../services/geminiService';

type SheetData = Record<string, string>[];

export const Spreadsheet: React.FC = () => {
  const [data, setData] = useState<SheetData>([
    { A: '', B: '', C: '', D: '' },
    { A: '', B: '', C: '', D: '' },
    { A: '', B: '', C: '', D: '' },
    { A: '', B: '', C: '', D: '' },
  ]);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const headers = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  const handleGenerateData = async () => {
    if (!prompt) return;
    setIsLoading(true);
    const generatedData = await generateSpreadsheetData(prompt);
    if (generatedData && generatedData.length > 0) {
      setData(generatedData);
    }
    setIsLoading(false);
    setPrompt('');
  };

  const handleCellChange = (rowIndex: number, colKey: string, value: string) => {
    const newData = [...data];
    newData[rowIndex] = { ...newData[rowIndex], [colKey]: value };
    setData(newData);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
      <div className="p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 flex items-center space-x-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe table data (e.g., '5 employees')..."
          className="flex-grow p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
          disabled={isLoading}
        />
        <button
          onClick={handleGenerateData}
          disabled={isLoading || !prompt}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : 'Generate'}
        </button>
      </div>
      <div className="flex-grow overflow-auto">
        <table className="w-full h-full border-collapse">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="p-2 border dark:border-gray-600 sticky top-0 left-0 bg-gray-200 dark:bg-gray-700 z-10 w-12"></th>
              {headers.map((header) => (
                <th key={header} className="p-2 border dark:border-gray-600 font-semibold text-center sticky top-0 bg-gray-200 dark:bg-gray-700 min-w-[120px]">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="p-2 border dark:border-gray-600 text-center bg-gray-200 dark:bg-gray-700 sticky left-0 z-10 font-mono text-xs text-gray-500">{rowIndex + 1}</td>
                {headers.map((header) => (
                  <td key={`${rowIndex}-${header}`} className="border dark:border-gray-600 p-0">
                    <input
                      type="text"
                      value={row[header] || ''}
                      onChange={(e) => handleCellChange(rowIndex, header, e.target.value)}
                      className="w-full h-12 lg:h-full p-2 outline-none bg-transparent focus:bg-green-100 dark:focus:bg-green-900/50 min-w-[120px] text-base lg:text-sm"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};