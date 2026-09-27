import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Key, 
  Lock, 
  UserCheck, 
  Plus, 
  CheckCircle2, 
  FileLock2,
  Sliders
} from 'lucide-react';
import { User } from '../types';

export const Administration: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: 'usr-1',
      username: 'sovrix_admin',
      email: 'chief.engineer@refinery.internal',
      full_name: 'Chief Asset Integrity Engineer',
      role: 'Admin',
      department: 'Asset Integrity & Reliability',
      is_active: true,
      created_at: '2026-09-24T08:00:00Z'
    },
    {
      id: 'usr-2',
      username: 'ndt_inspector_04',
      email: 'inspector04@refinery.internal',
      full_name: 'Senior NDT Testing Specialist',
      role: 'Engineer',
      department: 'Non-Destructive Testing',
      is_active: true,
      created_at: '2026-09-25T09:30:00Z'
    },
    {
      id: 'usr-3',
      username: 'safety_auditor_psu',
      email: 'auditor@defense-gov.internal',
      full_name: 'Statutory Safety Lead Auditor',
      role: 'Auditor',
      department: 'Industrial Safety Bureau',
      is_active: true,
      created_at: '2026-09-26T11:15:00Z'
    }
  ]);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-white font-mono flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <span>ROLE-BASED ACCESS CONTROL (RBAC) & SECURITY POLICIES</span>
          </h1>
          <p className="text-xs text-slate-400">
            Enterprise identity governance, role permissions, and air-gapped authentication parameters.
          </p>
        </div>

        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold shadow-lg shadow-cyan-600/20 transition-all">
          <Plus className="w-4 h-4" />
          <span>Add Operator Account</span>
        </button>
      </div>

      {/* Security Policies Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">Air-Gap Policy</span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-base font-bold text-emerald-400 font-mono">ZERO_EXTERNAL_EGRESS</div>
          <span className="text-[10px] text-slate-500 block">Outbound sockets null-routed at kernel level</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">Token Cryptography</span>
            <Key className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-base font-bold text-cyan-300 font-mono">HS256 (Local Secret)</div>
          <span className="text-[10px] text-slate-500 block">24-hour expiration on-premise session key</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">Sandbox Containment</span>
            <FileLock2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-base font-bold text-indigo-300 font-mono">ISOLATED_PROCESS</div>
          <span className="text-[10px] text-slate-500 block">Restricted environment & temporary scratch bounds</span>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-slate-100 font-mono uppercase flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-cyan-400" />
            <span>Authorized Operators & Reliability Engineers</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">{users.length} Active Accounts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                <th className="py-2.5 px-3">Username</th>
                <th className="py-2.5 px-3">Full Name</th>
                <th className="py-2.5 px-3">Assigned Role</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-3 text-cyan-300 font-bold">{u.username}</td>
                  <td className="py-3 px-3 text-slate-200">{u.full_name}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-indigo-300 border border-slate-700">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400">{u.department}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      ACTIVE
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
