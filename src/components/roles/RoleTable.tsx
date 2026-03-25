import React from "react";
import { Role } from "@/app/admin/roles/page";
import { PencilIcon, TrashBinIcon } from "@/icons";

interface RoleTableProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (roleId: number) => void;
}

const RoleTable: React.FC<RoleTableProps> = ({
  roles,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        
        {/* HEADER */}
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {roles.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-6 py-4 text-center">
                No roles found.
              </td>
            </tr>
          ) : (
            roles.map((role) => (
              <tr
                key={role.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                {/* ID */}
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {role.id}
                </td>

                {/* NAME */}
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                    {role.name}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => onEdit(role)}
                    className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => onDelete(role.id)}
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

export default RoleTable;