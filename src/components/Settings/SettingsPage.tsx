import React, { useState } from 'react';
import { useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Shield, Users, Key, Eye, EyeOff, UserCheck, UserX, Crown, Briefcase, User, Menu, ExternalLink } from 'lucide-react';
import UserModal from './UserModal';
import ClientPortalDashboard from '../ClientPortal/ClientPortalDashboard';
import { useAppStore } from '../../store/AppStore';

interface SettingsPageProps {
  onToggleSidebar?: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onToggleSidebar }) => {
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showClientPortal, setShowClientPortal] = useState(false);
  const [selectedClientUser, setSelectedClientUser] = useState<any>(null);

  const { 
    users, 
    loading,
    fetchUsers,
    addUser, 
    updateUser, 
    deleteUser 
  } = useAppStore();

  useEffect(() => {
    // Fetch initial data
    fetchUsers();
  }, [fetchUsers]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Super Admin':
        return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'Team':
        return <Briefcase className="w-4 h-4 text-blue-600" />;
      case 'Client Admin':
        return <User className="w-4 h-4 text-green-600" />;
      case 'Client Team':
        return <User className="w-4 h-4 text-green-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Super Admin':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Team':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Client Admin':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Client Team':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = () => {
    setSelectedUser(null);
    setShowUserModal(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
    }
  };

  const handleSaveUser = (userData: any) => {
    if (selectedUser) {
      // Update existing user
      updateUser(selectedUser.id, userData);
    } else {
      // Add new user
      addUser({
        ...userData,
        lastLogin: null
      });
    }
    setShowUserModal(false);
  };

  const handleViewClientPortal = (user: any) => {
    setSelectedClientUser(user);
    setShowClientPortal(true);
  };

  const handleBackFromClientPortal = () => {
    setShowClientPortal(false);
    setSelectedClientUser(null);
  };

  const roleStats = {
    'Super Admin': users.filter(u => u.role === 'Super Admin').length,
    'Team': users.filter(u => u.role === 'Team').length,
    'Client Admin': users.filter(u => u.role === 'Client Admin').length,
    'Client Team': users.filter(u => u.role === 'Client Team').length
  };

  const totalUsers = users.length;

  if (showClientPortal && selectedClientUser) {
    return (
      <ClientPortalDashboard
        user={selectedClientUser}
        onBack={handleBackFromClientPortal}
      />
    );
  }

  if (loading.users) {
    return (
      <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Settings</h1>
            <p className="text-slate-600 mt-1 lg:mt-2 text-sm lg:text-base">Manage system settings and user access</p>
        </div>
        </div>
      </div>

      {/* Settings Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 lg:p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 rounded-lg p-1.5 lg:p-2">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg lg:text-xl font-semibold text-slate-900">User Management</h2>
              <p className="text-xs lg:text-sm text-slate-600">Manage system users and their roles</p>
            </div>
          </div>
        </div>

        {/* User Management Content */}
        <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 lg:p-6 border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-700 font-semibold text-xs lg:text-sm uppercase tracking-wide">Super Admins</p>
                  <p className="text-xl lg:text-2xl font-bold text-yellow-900 mt-1">{roleStats['Super Admin']}</p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                  <Crown className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 lg:p-6 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-700 font-semibold text-xs lg:text-sm uppercase tracking-wide">Team Members</p>
                  <p className="text-xl lg:text-2xl font-bold text-blue-900 mt-1">{roleStats['Team']}</p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 lg:p-6 border border-green-200 md:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-700 font-semibold text-xs lg:text-sm uppercase tracking-wide">Client Users</p>
                  <p className="text-xl lg:text-2xl font-bold text-green-900 mt-1">{roleStats['Client Admin'] + roleStats['Client Team']}</p>
                  <p className="text-xs text-green-600 mt-1">Admin: {roleStats['Client Admin']} | Team: {roleStats['Client Team']}</p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Add User */}
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 lg:py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-sm lg:text-base"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 lg:px-4 py-2 lg:py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-w-[120px] lg:min-w-[150px] transition-all duration-200 text-sm lg:text-base"
              >
                <option value="all">All Roles</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Team">Team</option>
                <option value="Client Admin">Client Admin</option>
                <option value="Client Team">Client Team</option>
              </select>
            </div>
            <button
              onClick={handleAddUser}
              className="bg-blue-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl flex items-center space-x-2 hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm text-sm lg:text-base"
            >
              <Plus className="w-5 h-5" />
              <span>Add User</span>
            </button>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto -mx-4 lg:mx-0">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                  <tr>
                    <th className="text-left py-3 lg:py-4 px-3 lg:px-6 font-semibold text-slate-900 text-xs lg:text-sm min-w-[200px]">User</th>
                    <th className="text-left py-3 lg:py-4 px-3 lg:px-6 font-semibold text-slate-900 text-xs lg:text-sm min-w-[120px]">Role</th>
                    <th className="text-left py-3 lg:py-4 px-3 lg:px-6 font-semibold text-slate-900 text-xs lg:text-sm min-w-[120px] hidden md:table-cell">Last Login</th>
                    <th className="text-left py-3 lg:py-4 px-3 lg:px-6 font-semibold text-slate-900 text-xs lg:text-sm min-w-[100px] hidden lg:table-cell">Created</th>
                    <th className="text-center py-3 lg:py-4 px-3 lg:px-6 font-semibold text-slate-900 text-xs lg:text-sm min-w-[100px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors duration-150 border-b border-slate-100">
                      <td className="py-3 lg:py-4 px-3 lg:px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-slate-500 rounded-full flex items-center justify-center text-white font-medium text-sm lg:text-base">
                            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900 text-sm lg:text-base">{user.name}</h4>
                            <p className="text-xs lg:text-sm text-slate-600 truncate max-w-[150px] lg:max-w-none">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 lg:py-4 px-3 lg:px-6">
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(user.role)}
                          <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 lg:py-4 px-3 lg:px-6 hidden md:table-cell">
                        <span className="text-xs lg:text-sm text-slate-600">
                          {user.lastLogin === 'Never' ? 'Never' : new Date(user.lastLogin).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-3 lg:py-4 px-3 lg:px-6 hidden lg:table-cell">
                        <span className="text-xs lg:text-sm text-slate-600">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-3 lg:py-4 px-3 lg:px-6 text-center">
                        <div className="flex flex-col lg:flex-row items-center justify-center space-y-1 lg:space-y-0 lg:space-x-2">
                          {(user.role === 'Client Admin' || user.role === 'Client Team') && (
                            <button 
                              onClick={() => handleViewClientPortal(user)}
                              className="p-1.5 lg:p-2 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-200"
                              title="View Client Portal"
                            >
                              <Eye className="w-3 h-3 lg:w-4 lg:h-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleEditUser(user)}
                            className="p-1.5 lg:p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          >
                            <Edit className="w-3 h-3 lg:w-4 lg:h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-1.5 lg:p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                          >
                            <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* User Modal */}
      {showUserModal && (
        <UserModal
          user={selectedUser}
          onClose={() => setShowUserModal(false)}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
};

export default SettingsPage;