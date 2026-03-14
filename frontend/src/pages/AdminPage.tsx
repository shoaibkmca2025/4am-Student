import React from 'react';

const AdminPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-100 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto rounded-2xl border border-slate-200 bg-white p-8">
        <h1 className="text-3xl font-bold text-slate-900">Admin Console</h1>
        <p className="mt-3 text-slate-600">
          You are authenticated as an admin. Connect this page to your admin tools and reports.
        </p>
      </div>
    </div>
  );
};

export default AdminPage;
