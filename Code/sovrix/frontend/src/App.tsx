import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { Workbench } from './pages/Workbench';
import { Documents } from './pages/Documents';
import { KnowledgeBase } from './pages/KnowledgeBase';
import { CodeLab } from './pages/CodeLab';
import { Deliverables } from './pages/Deliverables';
import { ModelRegistry } from './pages/ModelRegistry';
import { SovereigntyMonitor } from './pages/SovereigntyMonitor';
import { AuditLogs } from './pages/AuditLogs';
import { SystemStatus } from './pages/SystemStatus';
import { Administration } from './pages/Administration';

export const App: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  return (
    <Router>
      <div className="flex h-screen w-screen overflow-hidden bg-[#EFEDF5] text-[#1A1B3B] antialiased selection:bg-[#E9D1F1] selection:text-[#121334]">
        {/* Persistent Collapsible Left Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          mobileOpen={isMobileSidebarOpen}
          setMobileOpen={setIsMobileSidebarOpen}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header
            onToggleSidebar={() => setIsSidebarCollapsed(prev => !prev)}
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          />
          <main className="flex-1 overflow-y-auto bg-[#EFEDF5] custom-scrollbar">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/workbench" element={<Workbench />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/knowledge" element={<KnowledgeBase />} />
              <Route path="/code-lab" element={<CodeLab />} />
              <Route path="/deliverables" element={<Deliverables />} />
              <Route path="/models" element={<ModelRegistry />} />
              <Route path="/sovereignty" element={<SovereigntyMonitor />} />
              <Route path="/admin" element={<AuditLogs />} />
              <Route path="/rbac" element={<Administration />} />
              <Route path="/status" element={<SystemStatus />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;

