"use client";

import React, { useEffect, useState, useCallback } from "react";
import Button from "@/components/ui/button/Button";
import RoleTable from "@/components/roles/RoleTable";
import RoleFormModal from "@/components/roles/RoleFormModal";
import { PlusIcon } from "@/icons";

export interface Role {
  id: number;
  name: string;
}

const getToken = () =>
  localStorage.getItem("token") ||
  sessionStorage.getItem("token");

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/core/Roles`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await res.json();
      setRoles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete role?")) return;

    await fetch(`${API_URL}/core/Roles/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    setRoles((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-semibold">Role Management</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusIcon /> Create Role
        </Button>
      </div>

      <RoleTable
        roles={roles}
        onEdit={(r) => {
          setEditingRole(r);
          setIsModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      {isModalOpen && (
        <RoleFormModal
          key={editingRole?.id || "create"} 
          role={editingRole}
          onClose={() => {
            setIsModalOpen(false);
            setEditingRole(null);
          }}
          onSuccess={fetchRoles}
        />
      )}
    </div>
  );
}