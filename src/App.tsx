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
import { centralizedStore } from './services/assetStore';
import { cmsStore } from './services/cmsService';
import { StudentRegistration, EventSettings, AssetUrls, GalleryItem } from './types';
import {
  fetchStudentsFromSupabase,
  insertStudentToSupabase,
  approveStudentInSupabase,
  rejectStudentInSupabase,
  deleteStudentFromSupabase
} from './services/studentService';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'students' | 'gallery'>('home');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSuperAdminOpen, setIsSuperAdminOpen] = useState(false);

  // Store data states
  const [settings, setSettings] = useState<EventSettings>(centralizedStore.getSettings());
  const [assets, setAssets] = useState<AssetUrls>(centralizedStore.getAssets());
  const [registrations, setRegistrations] = useState<StudentRegistration[]>(centralizedStore.getRegistrations());
  const [gallery, setGallery] = useState<GalleryItem[]>(centralizedStore.getGallery());

  // Subscribe to centralized store updates
  useEffect(() => {
    const unsubscribe = centralizedStore.subscribe(() => {
      setSettings({ ...centralizedStore.getSettings() });
      setAssets({ ...centralizedStore.getAssets() });
      setRegistrations([...centralizedStore.getRegistrations()]);
      setGallery([...centralizedStore.getGallery()]);
    });
    return unsubscribe;
  }, []);

  // Sync CMS and Students with Supabase on app load
  useEffect(() => {
    // 1. Sync Supabase CMS Settings
    cmsStore.syncFromSupabase().catch(err => {
      console.warn('CMS Supabase sync error on mount:', err);
    });

    // 2. Sync Students from Supabase
    async function syncFromSupabase() {
      try {
        const remoteStudents = await fetchStudentsFromSupabase();
        if (remoteStudents && remoteStudents.length > 0) {
          remoteStudents.forEach(remoteStudent => {
            const existing = centralizedStore
              .getRegistrations()
              .find(
                r =>
                  r.registrationNo === remoteStudent.registrationNo ||
                  (r.roll === remoteStudent.roll && r.section === remoteStudent.section)
              );
            if (existing) {
              centralizedStore.updateRegistration(existing.id, remoteStudent);
            } else {
              centralizedStore.addRegistration(remoteStudent);
            }
          });
        }
      } catch (err) {
        console.warn('Initial Supabase sync check:', err);
      }
    }
    syncFromSupabase();
  }, []);

  // Secret Key / Shortcut listener to trigger Super Admin Panel
  // Key requirement: "Super Admin Access Key: adminrdnic27.com. This access key must NOT be visible anywhere on the website."
  useEffect(() => {
    let keyBuffer = '';
    const secretTarget = 'adminrdnic27.com';

    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Check for keyboard combo Ctrl+Alt+S or Ctrl+Shift+A
      if ((e.ctrlKey && e.altKey && (e.key === 's' || e.key === 'S')) ||
          (e.ctrlKey && e.shiftKey && (e.key === 'a' || e.key === 'A'))) {
        e.preventDefault();
        setIsSuperAdminOpen(true);
        return;
      }

      // 2. Buffer typed characters anywhere on document (not in inputs)
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

    // 3. Check URL hash on load (e.g. #superadmin)
    if (window.location.hash === '#superadmin' || window.location.search.includes('superadmin')) {
      setIsSuperAdminOpen(true);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleRegisterSuccess = async (newReg: Omit<StudentRegistration, 'id' | 'createdAt' | 'status'>) => {
    const created = centralizedStore.addRegistration(newReg);
    try {
      await insertStudentToSupabase(created);
    } catch (err) {
      console.warn('Supabase insert notice:', err);
    }
  };

  const handleUpdateRegistration = async (id: string, updated: Partial<StudentRegistration>) => {
    centralizedStore.updateRegistration(id, updated);
    const target = centralizedStore.getRegistrations().find(r => r.id === id || r.registrationNo === id);
    if (target) {
      try {
        let result: { success: boolean; data?: any; error?: string } | undefined;
        if (updated.status === 'Approved' || updated.status === 'Verified') {
          result = await approveStudentInSupabase(target.registrationNo, target.id, target);
        } else if (updated.status === 'Rejected') {
          result = await rejectStudentInSupabase(target.registrationNo, target.id, target);
        }
        // If Supabase created or assigned a permanent UUID, keep our local store updated with it
        if (result?.success && result.data?.id && result.data.id !== target.id) {
          centralizedStore.updateRegistration(target.id, { id: result.data.id });
        }
      } catch (err) {
        console.warn('Supabase status update notice:', err);
      }
    }
  };

  const handleDeleteRegistration = async (id: string) => {
    const target = centralizedStore.getRegistrations().find(r => r.id === id || r.registrationNo === id);
    centralizedStore.deleteRegistration(id);
    if (target) {
      try {
        await deleteStudentFromSupabase(target.registrationNo, target.id, target);
      } catch (err) {
        console.warn('Supabase delete notice:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#6D28D9] selection:text-white flex flex-col justify-between">
      
      {/* Top Sticky Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        settings={settings}
        assets={assets}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenSuperAdmin={() => setIsSuperAdminOpen(true)}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <div className="space-y-8 sm:space-y-10">
            {/* Full-width Cinematic Hero Banner (Dynamic CMS) */}
            <HeroBanner settings={settings} />

            {/* Event Information Bar (Floating below banner) */}
            <EventInfoBar settings={settings} />

            {/* Main Registration & Jersey Showcase Section (Two-Column Layout) */}
            <div id="register-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: Registration Form (7 Cols) */}
                <div className="lg:col-span-7">
                  <RegistrationForm
                    settings={settings}
                    onSubmitSuccess={handleRegisterSuccess}
                    onNavigateToStudentList={() => {
                      setCurrentTab('students');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                </div>

                {/* Right Side: Jersey Showcase & Quote Panel (5 Cols) */}
                <div className="lg:col-span-5">
                  <JerseyShowcase settings={settings} />
                </div>

              </div>
            </div>
          </div>
        )}

        {currentTab === 'students' && (
          <StudentListPage
            registrations={registrations}
            settings={settings}
            onUpdateRegistration={handleUpdateRegistration}
            onDeleteRegistration={handleDeleteRegistration}
            onNavigateToRegister={() => {
              setCurrentTab('home');
              const regSection = document.getElementById('register-section');
              if (regSection) {
                regSection.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.scrollTo({ top: 350, behavior: 'smooth' });
              }
            }}
          />
        )}

        {currentTab === 'gallery' && (
          <GalleryPage gallery={gallery} />
        )}
      </main>

      {/* Footer with discreet Admin and Super Admin links */}
      <Footer
        settings={settings}
        assets={assets}
        setCurrentTab={setCurrentTab}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenSuperAdmin={() => setIsSuperAdminOpen(true)}
      />

      {/* Existing Admin Panel Modal (Strictly for Registration Approval/Rejection & PDF Export) */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        registrations={registrations}
        onUpdateRegistration={handleUpdateRegistration}
      />

      {/* Hidden Super Admin Panel Modal (Complete Website Management connected to Supabase) */}
      <SuperAdminModal
        isOpen={isSuperAdminOpen}
        onClose={() => setIsSuperAdminOpen(false)}
      />

    </div>
  );
}
