"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/modal/Modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";

const getToken = () =>
  localStorage.getItem("token") ||
  sessionStorage.getItem("token");

interface Role {
  id: number;
  name: string;
}

interface Props {
  role: Role | null;
  onClose: () => void;
  onSuccess: () => void;
}

const RoleFormModal: React.FC<Props> = ({
  role,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const isEditMode = !!role;

  // ======================
  // SYNC DATA (FIX LỖI KHÔNG HIỆN NAME)
  // ======================
  useEffect(() => {
    console.log("ROLE RECEIVED:", role); // 🔥 debug

    if (role && role.name) {
      setName(role.name);
    } else {
      setName("");
    }
  }, [role]);

  // ======================
  // SUBMIT
  // ======================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Role name is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const method = isEditMode ? "PUT" : "POST";
      const url = isEditMode
        ? `${API_URL}/core/Roles/${role?.id}`
        : `${API_URL}/core/Roles`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Save failed");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // UI
  // ======================
  return (
    <Modal
      isOpen
      onClose={onClose}
      title={isEditMode ? "Edit Role" : "Create Role"}
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">

          {/* NAME */}
          <div>
            <Label>
              Role Name <span className="text-error-500">*</span>
            </Label>
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter role name"
              disabled={loading}
            />
          </div>

          {/* ERROR */}
          {error && (
            <p className="text-sm text-error-500">{error}</p>
          )}

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 pt-4">

            {/* CANCEL */}
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>

            {/* SAVE */}
            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : isEditMode
                ? "Save Changes"
                : "Create Role"}
            </Button>
          </div>

        </div>
      </form>
    </Modal>
  );
};

export default RoleFormModal;