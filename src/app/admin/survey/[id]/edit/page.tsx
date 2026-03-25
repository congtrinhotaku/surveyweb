"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import QuestionEditor from "@/components/surveys/QuestionEditor";
import { Plus, Save, Trash2, FileText } from "lucide-react";

const getToken = () =>
  localStorage.getItem("token") ||
  sessionStorage.getItem("token");

export default function EditSurvey() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const { id } = useParams();

  const [survey, setSurvey] = useState<any>(null);

  // LOAD
  useEffect(() => {
    if (!id) return;

    fetch(`${API_URL}/survey/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((res) => res.json())
      .then(setSurvey);
  }, [id]);

  // ======================
  // UPDATE SURVEY
  // ======================
  const updateSurvey = async () => {
    await fetch(`${API_URL}/survey/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        title: survey.title,
        description: survey.description,
      }),
    });

    alert("Saved!");
  };

  // ======================
  // ADD PAGE
  // ======================
  const addPage = async () => {
    const res = await fetch(`${API_URL}/survey/pages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        surveyId: id,
        title: "New Page",
        orderIndex: survey.pages.length + 1,
      }),
    });

    const data = await res.json();

    setSurvey({
      ...survey,
      pages: [...survey.pages, { ...data, questions: [] }],
    });
  };

  // ======================
  // DELETE PAGE
  // ======================
  const deletePage = async (pageId: number) => {
    await fetch(`${API_URL}/survey/pages/${pageId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    setSurvey({
      ...survey,
      pages: survey.pages.filter((p: any) => p.id !== pageId),
    });
  };

  if (!survey)
    return (
      <div className="p-6 text-center text-gray-500">
        Loading survey...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-2">
          <FileText className="text-blue-600" />
          <h1 className="text-2xl font-bold">Edit Survey</h1>
        </div>

        {/* SURVEY CARD */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg space-y-3">
          <input
            className="w-full text-xl font-semibold p-2 border-b outline-none dark:bg-gray-900"
            value={survey.title}
            placeholder="Survey title..."
            onChange={(e) =>
              setSurvey({ ...survey, title: e.target.value })
            }
          />

          <textarea
            className="w-full p-2 border rounded dark:bg-gray-800"
            placeholder="Description..."
            value={survey.description}
            onChange={(e) =>
              setSurvey({ ...survey, description: e.target.value })
            }
          />

          <div className="flex justify-end">
            <button
              onClick={updateSurvey}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
            >
              <Save size={16} />
              Save
            </button>
          </div>
        </div>

        {/* PAGE HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Pages</h2>

          <button
            onClick={addPage}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg shadow"
          >
            <Plus size={16} />
            Add Page
          </button>
        </div>

        {/* PAGE LIST */}
        {survey.pages.map((page: any, index: number) => (
          <div
            key={page.id}
            className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-md hover:shadow-lg transition space-y-4"
          >
            {/* PAGE TITLE */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                Page {index + 1}
              </span>
            </div>

            <div className="flex gap-2">
              <input
                className="flex-1 p-2 border rounded dark:bg-gray-800"
                value={page.title}
                onChange={(e) => {
                  const newPages = survey.pages.map((p: any) =>
                    p.id === page.id
                      ? { ...p, title: e.target.value }
                      : p
                  );
                  setSurvey({ ...survey, pages: newPages });
                }}
              />

              <button
                onClick={() => deletePage(page.id)}
                className="flex items-center gap-1 text-red-500 hover:text-red-600"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* QUESTIONS */}
            <div className="border-t pt-4">
              <QuestionEditor
                page={page}
                survey={survey}
                setSurvey={setSurvey}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}