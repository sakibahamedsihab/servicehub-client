"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/Skeleton";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  banned: boolean;
  createdAt: Date;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userToConfirm, setUserToConfirm] = useState<{ id: string; banned: boolean } | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // better-auth admin plugin fetch
      const res = await authClient.admin.listUsers({ query: { limit: 100 } });
      if (res.data) {
        setUsers(res.data.users as any);
      } else if (res.error) {
        setError(res.error.message || "Failed to load users");
      }
    } catch (err: any) {
      setError(err.message || "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBan = async (userId: string, currentlyBanned: boolean) => {
    try {
      if (currentlyBanned) {
        await authClient.admin.unbanUser({ userId });
      } else {
        await authClient.admin.banUser({ userId });
      }
      // Optimistic update
      setUsers(users.map(u => u.id === userId ? { ...u, banned: !currentlyBanned } : u));
      toast.success(`User successfully ${currentlyBanned ? "unbanned" : "banned"}`);
      setUserToConfirm(null);
    } catch (err: any) {
      toast.error("Failed to toggle ban status: " + err.message);
      setUserToConfirm(null);
    }
  };

  if (loading && users.length === 0) return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <Skeleton width="250px" height="32px" className="mb-2" />
        <Skeleton width="350px" height="20px" />
      </div>
      <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 p-4 border-b-2 border-gray-200 flex gap-4">
          <Skeleton width="100px" height="14px" />
          <Skeleton width="150px" height="14px" />
          <Skeleton width="80px" height="14px" />
          <Skeleton width="100px" height="14px" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex gap-4 md:gap-16">
              <Skeleton width="120px" height="16px" />
              <Skeleton width="180px" height="16px" />
              <Skeleton width="80px" height="16px" />
              <Skeleton width="100px" height="16px" />
            </div>
            <Skeleton width="80px" height="32px" borderRadius="6px" />
          </div>
        ))}
      </div>
    </div>
  );
  
  if (error) return <div className="p-8 text-red-600 font-medium">{error}</div>;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 m-0 mb-2">Manage Users</h1>
          <p className="text-gray-500 m-0">View all registered users and manage their access.</p>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className={`border-b border-gray-200 ${user.banned ? 'opacity-60 bg-gray-50' : ''}`}>
                <td className="p-4 font-semibold text-gray-900">
                  <div>
                    {user.name}
                    {user.banned && <span className="ml-2 bg-red-100 text-red-600 px-2 py-0.5 text-[10px] rounded font-bold">BANNED</span>}
                  </div>
                </td>
                <td className="p-4 text-gray-600">
                  {user.email}
                </td>
                <td className="p-4">
                  <span className="bg-gray-100 px-2 py-1 text-xs rounded-md font-bold capitalize text-gray-700">
                    {user.role || "customer"}
                  </span>
                </td>
                <td className="p-4 text-gray-500 text-sm">
                  {format(new Date(user.createdAt), "MMM d, yyyy")}
                </td>
                <td className="p-4 text-right">
                  {user.role !== "admin" ? (
                    <Button 
                      variant={user.banned ? "secondary" : "danger"} 
                      onClick={() => setUserToConfirm({ id: user.id, banned: user.banned })}
                      size="sm"
                    >
                      {user.banned ? "Unban" : "Ban"}
                    </Button>
                  ) : <span className="text-gray-400 text-xs italic">Admin</span>}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-4">
        {users.map((user) => (
          <div key={user.id} className={`bg-white border-2 border-gray-200 rounded-xl p-5 flex flex-col gap-4 shadow-sm relative overflow-hidden ${user.banned ? 'opacity-70 bg-gray-50' : ''}`}>
            {/* Status indicator bar at top */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${user.banned ? 'bg-red-500' : 'bg-gray-300'}`} />
            
            <div>
              <div className="flex justify-between items-start mb-1 mt-1">
                <div className="text-lg font-bold text-gray-900">
                  {user.name}
                </div>
                {user.banned && (
                  <span className="bg-red-100 text-red-600 px-2 py-0.5 text-[10px] rounded font-bold uppercase tracking-wide">BANNED</span>
                )}
              </div>
              <p className="text-sm text-gray-600 m-0 mb-1">{user.email}</p>
              <p className="text-xs text-gray-500 m-0">
                Joined {format(new Date(user.createdAt), "MMM d, yyyy")}
              </p>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider m-0">Role</p>
              <span className="bg-white border border-gray-200 px-2.5 py-1 text-xs rounded-md font-bold capitalize text-gray-700 shadow-sm">
                {user.role || "customer"}
              </span>
            </div>
            
            <div className="pt-2 flex justify-end">
              {user.role !== "admin" ? (
                <Button 
                  variant={user.banned ? "secondary" : "danger"} 
                  onClick={() => setUserToConfirm({ id: user.id, banned: user.banned })}
                  className="w-full text-sm py-2.5"
                >
                  {user.banned ? "Unban User" : "Ban User"}
                </Button>
              ) : (
                <div className="w-full text-center py-2 text-gray-400 text-sm font-semibold italic bg-gray-50 rounded-lg">Admin Account</div>
              )}
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <div className="bg-white border-2 border-gray-200 rounded-xl p-8 text-center text-gray-500">
            No users found.
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {userToConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 text-left">
            <div className="p-6 md:p-8 text-center md:text-left">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-5 mx-auto md:mx-0 ${userToConfirm.banned ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'}`}>
                <span className="font-extrabold text-xl">!</span>
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-2">
                {userToConfirm.banned ? "Unban User?" : "Ban User?"}
              </h3>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Are you sure you want to {userToConfirm.banned ? "unban" : "ban"} this user? 
                {userToConfirm.banned ? " They will regain access to the platform." : " They will lose all access to the platform immediately."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <Button 
                  variant="secondary" 
                  onClick={() => setUserToConfirm(null)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button 
                  variant={userToConfirm.banned ? "primary" : "danger"} 
                  onClick={() => handleToggleBan(userToConfirm.id, userToConfirm.banned)}
                  className="w-full sm:w-auto"
                >
                  Yes, {userToConfirm.banned ? "Unban" : "Ban"} User
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
