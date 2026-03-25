"use client";

import React from "react";
import { PencilIcon, TrashBinIcon } from "@/icons";

type Survey = {
  id: number;
  title: string;
  description: string;
};

type Props = {
  surveys: Survey[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function SurveyTable({
  surveys,
  onEdit,
  onDelete,
}: Props) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">

        {/* HEADER */}
        <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Title</th>
            <th className="px-6 py-3">Description</th>
            <th className="px-6 py-3">API</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {surveys.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-4">
                No surveys found
              </td>
            </tr>
          ) : (
            surveys.map((s) => (
              <tr
                key={s.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {s.id}
                </td>

                <td className="px-6 py-4">{s.title}</td>

                <td className="px-6 py-4">{s.description}</td>

                {/* API */}
                <td className="px-6 py-4">
                  <a
                    href={`${API_URL}/survey/publicsurvey/${s.id}`}
                    target="_blank"
                    className=" hover:underline"
                  >
                    {`${API_URL}/survey/publicsurvey/${s.id}`}
                  </a>
                </td>

                {/* ACTION */}
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => onEdit(s.id)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => onDelete(s.id)}
                    className="p-2 rounded-lg text-error-500 hover:bg-gray-100 dark:hover:bg-gray-700"
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
}