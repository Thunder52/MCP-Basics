import React, { useState, useEffect } from 'react';
import { Upload, File, Edit3, Trash2, Download, Folder, Terminal, Sparkles, Code } from 'lucide-react';
import axios from 'axios';

function App() {
  const [files, setFiles] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [selectedFile, setSelectedFile] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newFileName, setNewFileName] = useState('');
const [newFileContent, setNewFileContent] = useState('');

  useEffect(() => {
    fetchFiles();
  }, []);

  const uploadFolder = async (e) => {
    const formData = new FormData();
    Array.from(e.target.files).forEach(file => formData.append('files', file));
    await axios.post('http://localhost:5000/upload', formData);
    fetchFiles();
  };

  const fetchFiles = async () => {
    const res = await axios.get('http://localhost:5000/files');
    setFiles(res.data.files);
  };

  const createFile = async () => {
  if (!newFileName.trim()) return alert("Enter a file name!");
  try {
    await axios.post('http://localhost:5000/create', {
      fileName: newFileName,
      content: newFileContent,
    });
    alert(`Created file: ${newFileName}`);
    setNewFileName('');
    setNewFileContent('');
    fetchFiles();
  } catch (err) {
    alert(err?.response?.data?.error || "Error creating file.");
  }
};
  const editFile = async () => {
    if (!selectedFile || !prompt.trim()) return alert("Select file and enter a prompt.");
    setIsEditing(true);
    await axios.post('http://localhost:5000/edit', { fileName: selectedFile, prompt });
    alert(`Edited "${selectedFile}" successfully!`);
    setPrompt('');
    setIsEditing(false);
  };

  const editFileWithAI = async () => {
  if (!selectedFile || !prompt.trim()) return alert("Provide a prompt.");
  setIsEditing(true);
  try {
    await axios.post('http://localhost:5000/ai-edit', {
    fileName: selectedFile,
    instruction: prompt
  });
  setIsEditing(false);
    setPrompt('');
  alert(`AI edited "${selectedFile}" successfully!`);
  } catch (error) {
    setIsEditing(false);
    alert(`Error editing "${selectedFile}": ${error.message}`);
  }
};

  const deleteFile = async (fileName) => {
    await axios.delete('http://localhost:5000/delete', { data: { fileName } });
    fetchFiles();
  };

  const downloadFile = (fileName) => {
    window.open(`http://localhost:5000/download/${fileName}`, '_blank');
  };

    const getFileIcon = (fileName) => {
    if (fileName.endsWith('.js') || fileName.endsWith('.jsx')) return <Code className="w-4 h-4 text-yellow-500" />;
    if (fileName.endsWith('.css')) return <File className="w-4 h-4 text-blue-500" />;
    return <File className="w-4 h-4 text-gray-500" />;
  };
  const setExamplePrompt = (example) => setPrompt(example);

    const examplePrompts = [
    "Replace 'foo' with 'bar'",
    "Add 'Hello World' at start",
    "Add 'Goodbye' at end",
    "Delete 'debugger;'",
    "Format code with prettier",
    "Add TypeScript types"
  ];
   return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-lg">
              <Folder className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              MCP File System Editor
            </h1>
          </div>
          <p className="text-gray-400 text-lg">Transform your code with AI-powered editing</p>
        </div>

        {/* Upload Section */}
        <div className="mb-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Upload className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-semibold text-white">Upload Files</h2>
            </div>
            <label className="group cursor-pointer">
              <input 
                type="file" 
                webkitdirectory="true" 
                multiple 
                onChange={uploadFolder}
                className="hidden"
              />
              <div className="border-2 border-dashed border-purple-400/30 rounded-xl p-8 text-center hover:border-purple-400/60 transition-all duration-300 group-hover:bg-purple-500/5">
                <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <p className="text-white font-medium mb-2">Drop your folder here or click to browse</p>
                <p className="text-gray-400 text-sm">Upload an entire folder to get started</p>
              </div>
            </label>
          </div>
        </div>

        {/* Files Grid */}
        {files.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              Your Files
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map(file => (
                <div 
                  key={file} 
                  className={`group relative bg-white/5 backdrop-blur-sm border rounded-xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                    file === selectedFile 
                      ? 'border-purple-400 bg-purple-500/10 shadow-lg shadow-purple-500/25' 
                      : 'border-white/10 hover:border-purple-400/50'
                  }`}
                  onClick={() => setSelectedFile(file)}
                >
                  <div className="flex items-start gap-3 mb-4">
                    {getFileIcon(file)}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium truncate">{file}</h4>
                      <p className="text-gray-400 text-sm">Ready to edit</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedFile(file); }}
                      className="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); downloadFile(file); }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteFile(file); }}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Edit Panel */}
        {selectedFile && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Terminal className="w-6 h-6 text-green-400" />
              <h3 className="text-2xl font-semibold text-white">
                Editing: <span className="text-purple-400 font-mono">{selectedFile}</span>
              </h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-3">Command Prompt:</label>
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="Describe what you want to change in your file..."
                    className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 resize-none"
                    rows="3"
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={editFile}
                disabled={!prompt.trim() || isEditing}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 text-white px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isEditing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Apply Edit
                  </>
                )}
              </button>
              <button
                onClick={editFileWithAI}
                disabled={!prompt.trim() || isEditing}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 text-white px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isEditing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Apply AI Edit
                  </>
                )}
              </button>
              </div>
              <div>
                <p className="text-white font-medium mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Quick Examples:
                </p>
                <div className="flex flex-wrap gap-2">
                  {examplePrompts.map(example => (
                    <button
                      key={example}
                      onClick={() => setExamplePrompt(example)}
                      className="bg-white/10 hover:bg-purple-500/20 text-gray-300 hover:text-white px-3 py-2 rounded-lg text-sm transition-all duration-300 border border-white/10 hover:border-purple-400/50"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="mt-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
  <div className="flex items-center gap-3 mb-6">
    <File className="w-6 h-6 text-blue-400" />
    <h3 className="text-2xl font-semibold text-white">Create New File</h3>
  </div>

  <div className="space-y-6">
    <div>
      <label className="block text-white font-medium mb-2">File Name:</label>
      <input
        type="text"
        placeholder="e.g., utils.js"
        value={newFileName}
        onChange={e => setNewFileName(e.target.value)}
        className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
      />
    </div>

    <div>
      <label className="block text-white font-medium mb-2">Initial Content:</label>
      <textarea
        rows="5"
        placeholder="// Optional content here..."
        value={newFileContent}
        onChange={e => setNewFileContent(e.target.value)}
        className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 resize-none"
      />
    </div>

    <button
      onClick={createFile}
      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
    >
      <File className="w-5 h-5" />
      Create File
    </button>
  </div>
</div>
        {files.length === 0 && (
          <div className="text-center py-12">
            <Folder className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No files uploaded yet. Start by uploading a folder!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
