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
    try {
      const result = await insertStudentToSupabase(newReg);
      if (result.success && result.data) {
        await refreshStudentsFromSupabase();
        return result.data;
      }
    } catch (err) {
      console.warn('Supabase registration insert notice:', err);
    }

    // Fallback if offline or DB not reachable
    const fallbackRecord: StudentRegistration = {
      ...newReg,
      id: `REG-${Date.now()}`,
      registrationNo: newReg.registrationNo || 'RD27-001'
    };
    studentStore.addRegistration(fallbackRecord);
    return fallbackRecord;
  };

  const handleUpdateRegistration = async (
    id: string,
    updated: Partial<StudentRegistration>,
    studentObj?: StudentRegistration
  ): Promise<boolean> => {
    const target =
      studentObj ||
      registrations.find(r => r.id === id || r.registrationNo === id) ||
      studentStore.getRegistrations().find(r => r.id === id || r.registrationNo === id);

    if (!target) return false;

    try {
      let result: { success: boolean; data?: any; error?: string } = { success: false };
      if (updated.status === 'Approved' || updated.status === 'Verified') {
        result = await approveStudentInSupabase(target.registrationNo, target.id, { ...target, ...updated });
      } else if (updated.status === 'Rejected') {
        result = await rejectStudentInSupabase(target.registrationNo, target.id, { ...target, ...updated });
      }

      if (!result.success) {
        console.error('Supabase update failed:', result.error);
        // Do NOT update UI permanently before Supabase confirms success
        await refreshStudentsFromSupabase();
        return false;
      }

      // After successful update: fetch latest students from Supabase and replace state
      await refreshStudentsFromSupabase();
      return true;
    } catch (err: any) {
      console.error('Supabase status update error:', err);
      await refreshStudentsFromSupabase();
      return false;
    }
  };

  const handleDeleteRegistration = async (
    id: string,
    student: StudentRegistration
  ): Promise<boolean> => {
    try {
      const result = await deleteStudentFromSupabase(student.registrationNo, student.id, student);
      if (!result.success) {
        console.error('Supabase delete failed:', result.error);
        await refreshStudentsFromSupabase();
        return false;
      }

      // After successful delete: fetch latest Supabase data
      await refreshStudentsFromSupabase();
      return true;
    } catch (err) {
      console.error('Supabase delete registration error:', err);
      await refreshStudentsFromSupabase();
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#00E5FF] selection:text-black flex flex-col justify-between">
      
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
