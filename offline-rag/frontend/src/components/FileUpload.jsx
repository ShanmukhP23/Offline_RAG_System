import React, { useState } from 'react';
import { uploadFile } from '../api/client';
import { UploadCloud, File, CheckCircle, AlertCircle } from 'lucide-react';

export default function FileUpload() {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, uploading, success, error
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setStatus('idle');
            setMessage('');
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setStatus('uploading');
        try {
            const response = await uploadFile(file);
            setStatus('success');
            setMessage(response.data.message || 'File uploaded successfully!');
        } catch (error) {
            console.error(error);
            setStatus('error');
            setMessage(error.response?.data?.detail || 'Failed to upload file.');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Knowledge Base</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                <UploadCloud className="w-12 h-12 text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-700 mb-1">Upload a document to index</p>
                <p className="text-xs text-gray-500 mb-4">PDF, DOCX, TXT, Images, Audio</p>

                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.txt,image/*,audio/*"
                />
                <label
                    htmlFor="file-upload"
                    className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-100 transition"
                >
                    Select File
                </label>
            </div>

            {file && (
                <div className="mt-4 flex items-center justify-between bg-gray-50 p-3 rounded text-sm">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <File className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span className="truncate text-gray-700">{file.name}</span>
                    </div>
                    <button
                        onClick={handleUpload}
                        disabled={status === 'uploading'}
                        className="ml-4 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {status === 'uploading' ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
            )}

            {status === 'success' && (
                <div className="mt-3 text-green-600 text-sm flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> {message}
                </div>
            )}

            {status === 'error' && (
                <div className="mt-3 text-red-600 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {message}
                </div>
            )}
        </div>
    );
}
