import FileUpload from './components/FileUpload';
import Chat from './components/Chat';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Offline RAG Assistant
            </h1>
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            Local Inference Enabled
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">

        {/* Left Sidebar - Utilities */}
        <aside className="w-full lg:w-1/3 flex flex-col gap-6">
          <FileUpload />

          <div className="bg-white p-6 rounded-lg shadow-md flex-1">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">System Info</h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Embedding Model</span>
                <span className="font-medium text-gray-800">all-MiniLM-L6-v2</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Vector Store</span>
                <span className="font-medium text-gray-800">FAISS (CPU)</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">LLM Engine</span>
                <span className="font-medium text-gray-800">Ollama</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-gray-500">Default Model</span>
                <span className="font-medium text-gray-800">Mistral 7B</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Content - Chat Interface */}
        <section className="w-full lg:w-2/3 h-full">
          <Chat />
        </section>

      </main>
    </div>
  );
}

export default App;
