"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/modal/Modal";
import Checkbox from "@/components/form/input/Checkbox";

const getToken = () =>
  localStorage.getItem("token") ||
  sessionStorage.getItem("token");

// ======================
// TYPES (ĐÚNG THEO API)
// ======================
interface Permission {
  permissionID: number;
  action: string;
  isActive: boolean;
}

interface Row {
  functionID: number;
  functionName: string;
  roleID: number;
  roleName: string;
  permissions: Permission[];
}

const PermissionMatrixModal = ({
  functionId,
  onClose,
}: any) => {
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // ======================
  // LOAD DATA
  // ======================
  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/core/Functions/${functionId}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const json = await res.json();

      // 🔥 FIX NULL / UNDEFINED
      const safeData = (json || []).map((row: any) => ({
        ...row,
        permissions: row.permissions || [],
      }));

      setData(safeData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (functionId) fetchData();
  }, [functionId]);

  // ======================
  // UPDATE PERMISSION
  // ======================
  const handleToggle = async (
    roleId: number,
    permissionId: number,
    isActive: boolean
  ) => {
    try {
      await fetch(`${API_URL}/core/Functions/update-permission`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          roleId,
          permissionId,
          isActive,
        }),
      });

      // ⚡ UPDATE UI NGAY
      setData((prev) =>
        prev.map((row) =>
          row.roleID === roleId
            ? {
                ...row,
                permissions: row.permissions.map((p) =>
                  p.permissionID === permissionId
                    ? { ...p, isActive }
                    : p
                ),
              }
            : row
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ======================
  // GET ACTIONS (SORT)
  // ======================
  const order = ["view", "create", "update", "delete"];

  const actions =
    data?.[0]?.permissions
      ?.map((p) => p.action)
      .sort((a, b) => order.indexOf(a) - order.indexOf(b)) || [];

  // ======================
  // UI
  // ======================
  return (
    <Modal
      isOpen
      onClose={onClose}
      title={`Permission - ${data?.[0]?.functionName || ""}`}
    >
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            
            {/* HEADER */}
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2">Role</th>
                {actions.map((action) => (
                  <th
                    key={action}
                    className="px-4 py-2 text-center uppercase"
                  >
                    {action}
                  </th>
                ))}
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {data.map((row) => (
                <tr
                  key={row.roleID}
                  className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {/* ROLE */}
                  <td className="px-4 py-2 font-medium">
                    {row.roleName}
                  </td>

                  {/* PERMISSIONS */}
                  {row.permissions?.map((p) => (
                    <td
                      key={p.permissionID}
                      className="text-center px-4 py-2"
                    >
                      <Checkbox
                        checked={p.isActive}
                        onChange={(checked: boolean) =>
                          handleToggle(
                            row.roleID,
                            p.permissionID,
                            checked
                          )
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
};

export default PermissionMatrixModal;