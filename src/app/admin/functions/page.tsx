"use client";

import React, { useEffect, useState } from "react";
import FunctionTable from "@/components/functions/FunctionTable";
import PermissionMatrixModal from "@/components/functions/PermissionMatrixModal";

const getToken = () =>
  localStorage.getItem("token") ||
  sessionStorage.getItem("token");

interface Func {
  id: number;
  name: string;
  code: string;
}

export default function FunctionsPage() {
  const [functions, setFunctions] = useState<Func[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFunction, setSelectedFunction] = useState<number | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // ======================
  // FETCH FUNCTIONS
  // ======================
  const fetchFunctions = async () => {
    try {
      const res = await fetch(`${API_URL}/core/Functions`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await res.json();
      setFunctions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunctions();
  }, []);

  // ======================
  // UI
  // ======================
  return (
    <div className="p-6">

      <h1 className="text-2xl font-semibold mb-6">
        Function Permissions
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <FunctionTable
          functions={functions}
          onPermission={(id: number) => setSelectedFunction(id)}
        />
      )}

      {/* MODAL */}
      {selectedFunction && (
        <PermissionMatrixModal
          functionId={selectedFunction}
          onClose={() => setSelectedFunction(null)}
        />
      )}
    </div>
  );
}