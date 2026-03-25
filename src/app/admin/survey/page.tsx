"use client";

import React, { useEffect, useState, useCallback } from "react";
import Button from "@/components/ui/button/Button";
import { PlusIcon } from "@/icons";
import { useRouter } from "next/navigation";
import SurveyTable from "@/components/surveys/SurveyTable";
import SurveyFormModal from "@/components/surveys/SurveyFormModal";

export interface Survey {
  id: number;
  title: string;
  description: string;
}

const getToken = () =>
  localStorage.getItem("token") ||
  sessionStorage.getItem("token");

export default function SurveyPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchSurveys = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/survey`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await res.json();
      setSurveys(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete survey?")) return;

    await fetch(`${API_URL}/survey/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    setSurveys((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-semibold">Survey Management</h1>

        <Button onClick={() => setIsModalOpen(true)}>
          <PlusIcon /> Create Survey
        </Button>
      </div>

      <SurveyTable
        surveys={surveys}
        onEdit={(id) => router.push(`/admin/survey/${id}/edit`)}
        onDelete={handleDelete}
      />

      {isModalOpen && (
        <SurveyFormModal
          onClose={() => setIsModalOpen(false)}
          onSubmitSuccess={fetchSurveys}
        />
      )}
    </div>
  );
}