import React from "react";
import { User } from "@/app/admin/users/page";
import { PencilIcon, TrashBinIcon } from "@/icons";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: number) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete }) => {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        
        {/* HEADER */}
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Username</th>
            <th className="px-6 py-3">Role</th> {/* ✅ thêm */}
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={user.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {user.id}
                </td>

                <td className="px-6 py-4">{user.username}</td>

                {/* ✅ ROLE */}
                <td className="px-6 py-4">
                  {user.roles && user.roles.length > 0 ? (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                      {user.roles.join(", ")}
                    </span>
                  ) : (
                    <span className="text-gray-400">No role</span>
                  )}
                </td>

                {/* STATUS */}
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.isActive
                        ? "bg-success-100 text-success-800 dark:bg-success-900/50 dark:text-success-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => onDelete(user.id)}
                    className="p-2 text-error-500 rounded-lg hover:bg-gray-100 dark:text-error-400 dark:hover:bg-gray-700"
                  >
                    <TrashBinIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;