"use client";

import React, { useState, useEffect } from 'react';
import { X, Bug, RotateCcw, Download, Database, Cpu, ExternalLink } from 'lucide-react';
import { useJobMatchStore } from '../../store/jobMatchStore';
import { api } from '../../lib/api';
import { storageDebugger } from '../../lib/debug-utils';

const DebugPanel = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'store' | 'api' | 'system'>('store');
  const [apiHealth, setApiHealth] = useState<'unknown' | 'ok' | 'error'>('unknown');
  const [isCheckingApi, setIsCheckingApi] = useState(false);
  
  const jobMatchStore = useJobMatchStore();
  
  useEffect(() => {
    // Only show in development mode
    if (process.env.NODE_ENV !== 'development') {
      return;
    }
    
    const checkApiHealth = async () => {
      try {
        setIsCheckingApi(true);
        const health = await api.checkHealth();
        setApiHealth(health.status === 'error' ? 'error' : 'ok');
      } catch (e) {
        setApiHealth('error');
        console.error('API health check failed:', e);
      } finally {
        setIsCheckingApi(false);
      }
    };
    
    checkApiHealth();
    
    // Add keyboard shortcut (Ctrl+Shift+D) to toggle panel
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setIsVisible(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  // If not in development mode, don't render anything
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  const resetApplicationState = () => {
    if (window.confirm('Reset all application state? This will clear all stored data.')) {
      // Clear localStorage
      localStorage.clear();
      // Reset stores
      jobMatchStore.resetState();
      // Force page reload
      window.location.reload();
    }
  };
  
  const downloadState = () => {
    // Collect all state
    const state = {
      jobMatchStore: jobMatchStore,
      localStorage: Object.fromEntries(
        Object.keys(localStorage).map(key => [key, localStorage.getItem(key)])
      ),
      environment: {
        apiUrl: process.env.NEXT_PUBLIC_API_URL,
        nodeEnv: process.env.NODE_ENV,
        buildId: process.env.NEXT_PUBLIC_BUILD_ID || 'unknown',
      }
    };
    
    // Convert to JSON and create download link
    const dataStr = JSON.stringify(state, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `jobfit-debug-${new Date().toISOString()}.json`);
    linkElement.click();
  };
  
  // If debug panel is not visible, just show the toggle button
  if (!isVisible) {
    return (
      <button 
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-black text-white p-2 rounded-full shadow-lg z-50 hover:bg-gray-800"
        title="Open Debug Panel (Ctrl+Shift+D)"
      >
        <Bug size={20} />
      </button>
    );
  }
  
  return (
    <div className="fixed bottom-0 right-0 w-96 bg-gray-900 text-white shadow-lg z-50 rounded-tl-lg overflow-hidden">
      <div className="flex justify-between items-center p-2 bg-black">
        <div className="flex items-center gap-2">
          <Bug size={16} />
          <h3 className="text-sm font-mono">JobFit Debug Panel</h3>
          <div className={`h-2 w-2 rounded-full ${
            apiHealth === 'ok' ? 'bg-green-500' : 
            apiHealth === 'error' ? 'bg-red-500' : 'bg-yellow-500'
          }`} />
        </div>
        <button 
          onClick={() => setIsVisible(false)} 
          className="text-gray-400 hover:text-white"
          aria-label="Close debug panel"
        >
          <X size={16} />
        </button>
      </div>
      
      <div className="flex border-b border-gray-700">
        <button 
          onClick={() => setActiveTab('store')} 
          className={`flex-1 py-1 text-xs ${activeTab === 'store' ? 'bg-gray-800' : 'bg-gray-900'}`}
        >
          State
        </button>
        <button 
          onClick={() => setActiveTab('api')} 
          className={`flex-1 py-1 text-xs ${activeTab === 'api' ? 'bg-gray-800' : 'bg-gray-900'}`}
        >
          API
        </button>
        <button 
          onClick={() => setActiveTab('system')} 
          className={`flex-1 py-1 text-xs ${activeTab === 'system' ? 'bg-gray-800' : 'bg-gray-900'}`}
        >
          System
        </button>
      </div>
      
      <div className="h-64 overflow-y-auto p-3">
        {activeTab === 'store' && (
          <div>
            <h4 className="text-xs text-gray-400 mb-1">Job Match Store</h4>
            <pre className="text-xs overflow-x-auto text-green-300 whitespace-pre-wrap">
              {JSON.stringify(jobMatchStore, null, 2)}
            </pre>
            
            <h4 className="text-xs text-gray-400 mt-4 mb-1">Local Storage</h4>
            <div className="space-y-1">
              {Object.keys(localStorage).map(key => (
                <div key={key} className="text-xs">
                  <div className="font-semibold text-blue-300">{key}</div>
                  <div className="text-gray-400 truncate">{localStorage.getItem(key)?.substring(0, 100)}...</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'api' && (
          <div>
            <div className="flex justify-between mb-3">
              <h4 className="text-xs text-gray-400">API Status</h4>
              <button 
                onClick={async () => {
                  setIsCheckingApi(true);
                  try {
                    const health = await api.checkHealth();
                    setApiHealth(health.status === 'error' ? 'error' : 'ok');
                  } catch (e) {
                    setApiHealth('error');
                  } finally {
                    setIsCheckingApi(false);
                  }
                }}
                className="text-xs bg-gray-800 px-2 py-1 rounded hover:bg-gray-700 flex items-center gap-1"
                disabled={isCheckingApi}
              >
                {isCheckingApi ? 'Checking...' : 'Check Health'}
              </button>
            </div>
            
            <div className={`p-2 rounded text-xs mb-3 ${
              apiHealth === 'ok' ? 'bg-green-900 text-green-200' : 
              apiHealth === 'error' ? 'bg-red-900 text-red-200' : 
              'bg-yellow-900 text-yellow-200'
            }`}>
              API Endpoint: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}
              <br />
              Status: {
                apiHealth === 'ok' ? 'Connected' : 
                apiHealth === 'error' ? 'Not Connected' : 
                'Unknown'
              }
            </div>
            
            <h4 className="text-xs text-gray-400 mb-1">Test API Endpoints</h4>
            <div className="space-y-1">
              <button 
                onClick={async () => {
                  try {
                    const providers = await api.listAIProviders();
                    console.log('AI Providers:', providers);
                    alert(`AI Providers: ${providers.join(', ') || 'None'}`);
                  } catch (e) {
                    console.error('Error fetching AI providers:', e);
                    alert(`Error: ${e instanceof Error ? e.message : 'Unknown error'}`);
                  }
                }}
                className="w-full text-left text-xs bg-gray-800 px-2 py-1 rounded hover:bg-gray-700"
              >
                Test: List AI Providers
              </button>
              
              <button 
                onClick={async () => {
                  try {
                    const roadmaps = await api.getUserRoadmaps();
                    console.log('User Roadmaps:', roadmaps);
                    alert(`User Roadmaps: ${JSON.stringify(roadmaps, null, 2)}`);
                  } catch (e) {
                    console.error('Error fetching roadmaps:', e);
                    alert(`Error: ${e instanceof Error ? e.message : 'Unknown error'}`);
                  }
                }}
                className="w-full text-left text-xs bg-gray-800 px-2 py-1 rounded hover:bg-gray-700"
              >
                Test: Get User Roadmaps
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'system' && (
          <div>
            <h4 className="text-xs text-gray-400 mb-1">Environment</h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Node Environment:</span>
                <span className="text-blue-300">{process.env.NODE_ENV}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">API URL:</span>
                <span className="text-blue-300">{process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Browser:</span>
                <span className="text-blue-300">{navigator.userAgent}</span>
              </div>
            </div>
            
            <h4 className="text-xs text-gray-400 mt-4 mb-1">Debug Actions</h4>
            <div className="space-y-1">
              <button 
                onClick={resetApplicationState}
                className="w-full text-left text-xs bg-red-900 px-2 py-1 rounded hover:bg-red-800 flex items-center gap-2"
              >
                <RotateCcw size={12} />
                Reset Application State
              </button>
              
              <button 
                onClick={downloadState}
                className="w-full text-left text-xs bg-blue-900 px-2 py-1 rounded hover:bg-blue-800 flex items-center gap-2"
              >
                <Download size={12} />
                Download Debug Data
              </button>
              
              <button 
                onClick={() => {
                  // Show all current store data in console
                  console.group('JobFit Debug Data');
                  console.log('Job Match Store:', jobMatchStore);
                  console.log('Local Storage:', Object.fromEntries(
                    Object.keys(localStorage).map(key => [key, localStorage.getItem(key)])
                  ));
                  console.groupEnd();
                  alert('Debug data logged to console');
                }}
                className="w-full text-left text-xs bg-gray-800 px-2 py-1 rounded hover:bg-gray-700 flex items-center gap-2"
              >
                <Database size={12} />
                Log State to Console
              </button>
              
              <button 
                onClick={() => {
                  storageDebugger.listAll();
                }}
                className="w-full text-left text-xs bg-gray-800 px-2 py-1 rounded hover:bg-gray-700 flex items-center gap-2"
              >
                <Cpu size={12} />
                Inspect LocalStorage
              </button>
              
              <a 
                href="http://localhost:8000/docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full text-left text-xs bg-gray-800 px-2 py-1 rounded hover:bg-gray-700 flex items-center gap-2"
              >
                <ExternalLink size={12} />
                Open API Docs
              </a>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-2 border-t border-gray-700 text-xs text-gray-500">
        Press Ctrl+Shift+D to toggle debug panel
      </div>
    </div>
  );
};

export default DebugPanel; 