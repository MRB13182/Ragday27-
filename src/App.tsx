/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { EventInfoBar } from './components/EventInfoBar';
import { RegistrationForm } from './components/RegistrationForm';
import { JerseyShowcase } from './components/JerseyShowcase';
import { StudentListPage } from './components/StudentListPage';
import { GalleryPage } from './components/GalleryPage';
import { Footer } from './components/Footer';
import { AdminPanelModal } from './components/AdminPanelModal';
import { SuperAdminModal } from './components/SuperAdminModal';
import { studentStore } from './services/studentStore';
import { StudentRegistration } from './types';
import { supabase, isSupabaseConfigured } from './services/supabaseClient';
import {
  fetchStudentsFromSupabase,
  insertStudentToSupabase,
  approveStudentInSupabase,
  rejectStudentInSupabase,
  deleteStudentFromSupabase
} from './services/studentService';
import { subscribeSuperAdmin } from '../Super-admin-file';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'students' | 'gallery'>('home');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSuperAdminOpen, setIsSuperAdminOpen] = useState(false);

  // Student registrations state from studentStore
  const [registrations, setRegistrations] = useState<StudentRegistration[]>(() =>
    studentStore.getRegistrations()
  );

  // Force re-render key when Super Admin updates content in memory
  const [, setContentVersion] = useState(0);

  // 1. Subscribe to student store changes
  useEffect(() => {
    const unsubscribe = studentStore.subscribe(() => {
      setRegistrations([...studentStore.getRegistrations()]);
    });
    return unsubscribe;
  }, []);

  // 2. Subscribe to Super Admin content updates
  useEffect(() => {
    const unsubscribe = subscribeSuperAdmin(() => {
      setContentVersion(v => v + 1);
    });
    return unsubscribe;
  }, []);

  // 3. Sync registrations with Supabase (Persistence layer)
  useEffect(() => {
    async function syncFromSupabase() {
      try {
        const remoteStudents = await fetchStudentsFromSupabase();
        if (remoteStudents && remoteStudents.length > 0) {
          studentStore.setRegistrations(remoteStudents);
        }
      } catch (err) {
        console.warn('Initial Supabase registration sync check:', err);
      }
    }
    syncFromSupabase();

    let channel: any = null;
    if (isSupabaseConfigured) {
      channel = supabase
        .channel('public-students-sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'registered_students' }, async () => {
          const remote = await fetchStudentsFromSupabase();
          if (remote && remote.length > 0) {
            studentStore.setRegistrations(remote);
          }
        })
        .subscribe();
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  // 4. Secret Key / Shortcut / URL route listener to trigger Super Admin Panel
  // Key requirement: "Super Admin Access Key: adminrdnic27.com. This access key must NOT be visible anywhere on the website."
  useEffect(() => {
    let keyBuffer = '';
    const secretTarget = 'adminrdnic27.com';

    const checkPath = () => {
      const path = (window.location.pathname || '').toLowerCase();
      const hash = (window.location.hash || '').toLowerCase();
      const search = (window.location.search || '').toLowerCase();
      if (
        path === '/super-admin' ||
        path === '/superadmin' ||
        hash === '#superadmin' ||
        hash === '#super-admin' ||
        search.includes('superadmin')
      ) {
        setIsSuperAdminOpen(true);
      }
    };
    checkPath();

    window.addEventListener('popstate', checkPath);
    window.addEventListener('hashchange', checkPath);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for keyboard combo Ctrl+Alt+S or Ctrl+Shift+A
      if (
        (e.ctrlKey && e.altKey && (e.key === 's' || e.key === 'S')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'a' || e.key === 'A'))
      ) {
        e.preventDefault();
        setIsSuperAdminOpen(true);
        return;
      }

      // Buffer typed characters anywhere on document (not inside inputs)
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') {
        return;
      }

      keyBuffer = (keyBuffer + e.key.toLowerCase()).slice(-30);
      if (keyBuffer.includes(secretTarget)) {
        keyBuffer = '';
        setIsSuperAdminOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', checkPath);
      window.removeEventListener('hashchange', checkPath);
    };
  }, []);

  const handleRegisterSuccess = async (newReg: StudentRegistration) => {
    studentStore.addRegistration(newReg);
    try {
      const result = await insertStudentToSupabase(newReg);
      if (result.success && result.data) {
        studentStore.updateRegistration(newReg.id, result.data);
      }
    } catch (err) {
      console.warn('Supabase registration insert background sync notice:', err);
    }
  };

  const handleUpdateRegistration = async (id: string, updated: Partial<StudentRegistration>) => {
    studentStore.updateRegistration(id, updated);
    const target = studentStore.getRegistrations().find(r => r.id === id || r.registrationNo === id);
    if (target) {
      try {
        let result: { success: boolean; data?: any; error?: string } | undefined;
        if (updated.status === 'Approved' || updated.status === 'Verified') {
          result = await approveStudentInSupabase(target.registrationNo, target.id, target);
        } else if (updated.status === 'Rejected') {
          result = await rejectStudentInSupabase(target.registrationNo, target.id, target);
        }
        if (result?.success && result.data?.id && result.data.id !== target.id) {
          studentStore.updateRegistration(target.id, { id: result.data.id });
        }
      } catch (err) {
        console.warn('Supabase status update notice:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#6D28D9] selection:text-white flex flex-col justify-between">
      
      {/* Top Sticky Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <div className="space-y-8 sm:space-y-10">
            {/* Full-width Cinematic Hero Banner (Directly from SUPER_ADMIN) */}
            <HeroBanner />

            {/* Event Information Bar */}
            <EventInfoBar />

            {/* Main Registration & Jersey Showcase Section */}
            <div id="register-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: Registration Form (7 Cols) */}
                <div className="lg:col-span-7">
                  <RegistrationForm
                    onSubmitSuccess={handleRegisterSuccess}
                    onNavigateToStudentList={() => {
                      setCurrentTab('students');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                </div>

                {/* Right Side: Jersey Showcase & Quote Panel (5 Cols) */}
                <div className="lg:col-span-5">
                  <JerseyShowcase />
                </div>

              </div>
            </div>
          </div>
        )}

        {currentTab === 'students' && (
          <StudentListPage
            registrations={registrations}
          />
        )}

        {currentTab === 'gallery' && (
          <GalleryPage />
        )}
      </main>

      {/* Footer with discreet Admin and Super Admin access */}
      <Footer
        setCurrentTab={setCurrentTab}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenSuperAdmin={() => setIsSuperAdminOpen(true)}
      />

      {/* Registration Admin Panel Modal (Approve / Reject System, PDF Export, Student Database) */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        registrations={registrations}
        onUpdateRegistration={handleUpdateRegistration}
      />

      {/* Super Admin Controller Modal (Content Management mapped to /Super-admin-file.ts) */}
      <SuperAdminModal
        isOpen={isSuperAdminOpen}
        onClose={() => setIsSuperAdminOpen(false)}
      />

    </div>
  );
}
