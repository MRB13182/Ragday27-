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
import { subscribeSuperAdmin } from '../SuperAdmin';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'students' | 'gallery'>('home');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

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

  // 3. Sync registrations with Supabase (authoritative data source)
  const refreshStudentsFromSupabase = async () => {
    try {
      const remoteStudents = await fetchStudentsFromSupabase();
      if (remoteStudents !== null) {
        studentStore.setRegistrations(remoteStudents);
        setRegistrations(remoteStudents);
      }
    } catch (err) {
      console.warn('Supabase sync notice:', err);
    }
  };

  useEffect(() => {
    refreshStudentsFromSupabase();

    let channel: any = null;
    if (isSupabaseConfigured) {
      channel = supabase
        .channel('registered-students-realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'registered_students' },
          async () => {
            // When a change arrives: FETCH THE CURRENT DATA AGAIN FROM SUPABASE.
            // Do not blindly mutate local arrays from payload.
            await refreshStudentsFromSupabase();
          }
        )
        .subscribe((status) => {
          if (status === 'TIMED_OUT' || status === 'CHANNEL_ERROR') {
            setTimeout(refreshStudentsFromSupabase, 2500);
          }
        });
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const handleRegisterSuccess = async (newReg: StudentRegistration): Promise<StudentRegistration> => {
    const result = await insertStudentToSupabase(newReg);
    if (result.success && result.data) {
      await refreshStudentsFromSupabase();
      return result.data;
    }
    throw new Error(result.error || 'Registration submission failed. Please try again.');
  };

  const handleUpdateRegistration = async (
    id: string,
    updated: Partial<StudentRegistration>,
    studentObj?: StudentRegistration
  ): Promise<{ success: boolean; error?: string }> => {
    const target =
      studentObj ||
      registrations.find(r => r.id === id || r.registrationNo === id) ||
      studentStore.getRegistrations().find(r => r.id === id || r.registrationNo === id);

    if (!target) return { success: false, error: 'Student record not found.' };

    try {
      let result: { success: boolean; data?: any; error?: string } = { success: false };
      if (updated.status === 'Approved' || updated.status === 'Verified') {
        result = await approveStudentInSupabase(target.id, undefined, target);
      } else if (updated.status === 'Rejected') {
        result = await rejectStudentInSupabase(target.id, undefined, target);
      }

      if (!result.success) {
        console.error('Supabase status update failed:', result.error);
        return { success: false, error: result.error || 'Database update failed.' };
      }

      // Supabase update confirmed -> refetch all registrations from database
      await refreshStudentsFromSupabase();
      return { success: true };
    } catch (err: any) {
      console.error('Status update notice:', err);
      return { success: false, error: err?.message || 'Database error occurred.' };
    }
  };

  const handleDeleteRegistration = async (
    id: string,
    student: StudentRegistration
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await deleteStudentFromSupabase(student?.id || id, undefined, student);
      if (!result.success) {
        console.error('Supabase delete failed:', result.error);
        return { success: false, error: result.error || 'Database deletion failed.' };
      }

      // Supabase delete confirmed -> refetch all registrations from database
      await refreshStudentsFromSupabase();
      return { success: true };
    } catch (err: any) {
      console.error('Delete registration notice:', err);
      return { success: false, error: err?.message || 'Delete error occurred.' };
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#00E5FF] selection:text-black flex flex-col justify-between">
      
      {/* Top Sticky Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenRegistration={() => setIsRegistrationOpen(true)}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <div className="space-y-8 sm:space-y-10">
            {/* Full-width Cinematic Hero Banner (Directly from SUPER_ADMIN) */}
            <HeroBanner />

            {/* Event Information Bar */}
            <EventInfoBar />

            {/* Registration entry point + Jersey Showcase */}
            <div id="register-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
              {!isRegistrationOpen ? (
                <section className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-10 sm:px-10 sm:py-14 text-center shadow-2xl backdrop-blur-xl">
                  <div className="mx-auto max-w-3xl">
                    <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-[#00E5FF] font-semibold mb-4">
                      NIC27 Rag Day 2027
                    </p>
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
                      Celebrate Memories, Friendship &amp; The Spirit of NIC27
                    </h1>
                    <p className="mt-5 text-sm sm:text-base lg:text-lg leading-7 text-white/70">
                      Welcome to the official Rag Day 2027 registration portal. Join us for a memorable celebration filled with joy, unity, entertainment, and unforgettable moments. Complete your registration to become part of this special event.
                    </p>
                    <div className="mt-7 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs sm:text-sm text-white/75">
                      <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2.5">🎉 Grand Rag Day Celebration</div>
                      <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2.5">📸 Professional Photography Session</div>
                      <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2.5">🎶 Music &amp; Entertainment</div>
                      <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2.5">👕 Official Rag Day Jersey</div>
                      <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2.5">🤝 Reconnect With Friends</div>
                      <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2.5">🌟 Lifetime Memories</div>
                    </div>
                    <p className="mt-5 text-lg sm:text-xl font-semibold text-white">
                      One Day. One Batch. Endless Memories.
                    </p>
                    <div className="mt-7 text-left rounded-2xl border border-white/10 bg-black/20 px-5 py-5 sm:px-6 sm:py-6">
                      <h2 className="text-base sm:text-lg font-extrabold text-white">Why Join Rag Day?</h2>
                      <p className="mt-2 text-sm leading-6 text-white/65">
                        Rag Day is more than an event—it&apos;s a celebration of friendship, achievements, and the journey we&apos;ve shared together. Let&apos;s create memories that will stay with us forever.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsRegistrationOpen(true)}
                      className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#00E5FF] px-7 py-3.5 text-sm sm:text-base font-bold text-black shadow-lg transition hover:scale-[1.02] hover:bg-[#33eaff] focus:outline-none focus:ring-2 focus:ring-[#00E5FF] focus:ring-offset-2 focus:ring-offset-[#050505]"
                    >
                      Register for Rag Day 27
                    </button>
                  </div>
                </section>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsRegistrationOpen(false)}
                      className="rounded-lg border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/[0.08] hover:text-white"
                    >
                      Back
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Side: Registration Form (7 Cols) */}
                    <div className="lg:col-span-7">
                      <RegistrationForm
                        onSubmitSuccess={handleRegisterSuccess}
                        onNavigateToStudentList={() => {
                          setCurrentTab('students');
                          setIsRegistrationOpen(false);
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
              )}
            </div>
          </div>
        )}

        {currentTab === 'students' && (
          <StudentListPage
            registrations={registrations.filter(r => r.dbStatus === 'approved')}
            onRefresh={refreshStudentsFromSupabase}
          />
        )}

        {currentTab === 'gallery' && (
          <GalleryPage />
        )}
      </main>

      {/* Footer with discreet Admin access */}
      <Footer
        setCurrentTab={setCurrentTab}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenRegistration={() => setIsRegistrationOpen(true)}
      />

      {/* Registration Admin Panel Modal (Approve / Reject System, PDF Export, Student Database) */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        registrations={registrations}
        onUpdateRegistration={handleUpdateRegistration}
        onDeleteRegistration={handleDeleteRegistration}
      />

    </div>
  );
}
