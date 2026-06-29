import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import ScrollToTop from '@/components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import PageNotFound from '@/lib/PageNotFound';

// Admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminServices from '@/pages/admin/AdminServices';
import AdminIndustries from '@/pages/admin/AdminIndustries';
import AdminProcess from '@/pages/admin/AdminProcess';
import AdminFAQ from '@/pages/admin/AdminFAQ';
import AdminTestimonials from '@/pages/admin/AdminTestimonials';
import AdminSubmissions from '@/pages/admin/AdminSubmissions';
import AdminAnnouncements from '@/pages/admin/AdminAnnouncements';
import AdminContent from '@/pages/admin/AdminContent';
import AdminSEO from '@/pages/admin/AdminSEO';
import AdminTheme from '@/pages/admin/AdminTheme';
import AdminSettings from '@/pages/admin/AdminSettings';
import AdminAudit from '@/pages/admin/AdminAudit';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Admin routes - protected */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/services" element={<AdminServices />} />
        <Route path="/admin/industries" element={<AdminIndustries />} />
        <Route path="/admin/process" element={<AdminProcess />} />
        <Route path="/admin/faq" element={<AdminFAQ />} />
        <Route path="/admin/testimonials" element={<AdminTestimonials />} />
        <Route path="/admin/submissions" element={<AdminSubmissions />} />
        <Route path="/admin/announcements" element={<AdminAnnouncements />} />
        <Route path="/admin/content" element={<AdminContent />} />
        <Route path="/admin/seo" element={<AdminSEO />} />
        <Route path="/admin/theme" element={<AdminTheme />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/audit" element={<AdminAudit />} />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}
