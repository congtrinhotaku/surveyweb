"use client";

import {
  Plus,
  Trash2,
  Save,
  CheckSquare,
  Circle,
} from "lucide-react";

const getToken = () =>
  localStorage.getItem("token") ||
  sessionStorage.getItem("token");

export default function QuestionEditor({ page, survey, setSurvey }: any) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const isChoice = (type: number) => type === 1 || type === 2;

  // ======================
  // STATE UPDATE HELPER
  // ======================
  const updateSurveyState = (callback: any) => {
    const newPages = survey.pages.map((p: any) =>
      p.id === page.id ? callback(p) : p
    );

    setSurvey({ ...survey, pages: newPages });
  };

  // ======================
  // ADD QUESTION
  // ======================
  const addQuestion = async () => {
    const res = await fetch(`${API_URL}/survey/questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        PageId: page.id,
        QuestionText: "New Question",
        QuestionTypeId: 1,
        IsRequired: false,
        OrderIndex: (page.questions?.length || 0) + 1,
        Options: [],
      }),
    });

    const data = await res.json();

    updateSurveyState((p: any) => ({
      ...p,
      questions: [...(p.questions || []), { ...data, options: [] }],
    }));
  };

  // ======================
  // SAVE QUESTION (🔥 FIXED)
  // ======================
  const saveQuestion = async (q: any) => {
  const res = await fetch(`${API_URL}/survey/questions/${q.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      questionText: q.questionText,
      questionTypeId: q.questionTypeId,
      isRequired: q.isRequired,
      orderIndex: q.orderIndex,
      options: isChoice(q.questionTypeId)
        ? q.options.map((o: any) => ({
            optionText: o.optionText,
          }))
        : [],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("❌ Save failed:", err);
    alert("Save lỗi: " + err);
  }
};

  // ======================
  // DELETE
  // ======================
  const deleteQuestion = async (qid: number) => {
    await fetch(`${API_URL}/survey/questions/${qid}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    updateSurveyState((p: any) => ({
      ...p,
      questions: p.questions.filter((q: any) => q.id !== qid),
    }));
  };

  // ======================
  // UPDATE QUESTION
  // ======================
  const updateQuestion = (qid: number, field: string, value: any) => {
    updateSurveyState((p: any) => ({
      ...p,
      questions: p.questions.map((q: any) =>
        q.id === qid ? { ...q, [field]: value } : q
      ),
    }));
  };

  // ======================
  // ADD OPTION
  // ======================
  const addOption = (qid: number) => {
    updateSurveyState((p: any) => ({
      ...p,
      questions: p.questions.map((q: any) => {
        if (q.id !== qid) return q;

        return {
          ...q,
          options: [
            ...(q.options || []),
            { id: Date.now(), optionText: "New option" },
          ],
        };
      }),
    }));
  };

  // ======================
  // UPDATE OPTION
  // ======================
  const updateOption = (qid: number, oid: number, value: string) => {
    updateSurveyState((p: any) => ({
      ...p,
      questions: p.questions.map((q: any) => {
        if (q.id !== qid) return q;

        return {
          ...q,
          options: (q.options || []).map((o: any) =>
            o.id === oid ? { ...o, optionText: value } : o
          ),
        };
      }),
    }));
  };

  // ======================
  // UI
  // ======================
  return (
    <div>
      {/* ADD QUESTION */}
      <button
        onClick={addQuestion}
        className="flex items-center gap-2 mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
      >
        <Plus size={16} />
        Add Question
      </button>

      {page.questions?.map((q: any) => (
        <div
          key={q.id}
          className="border rounded-2xl p-4 mb-4 bg-white dark:bg-gray-900 shadow hover:shadow-md transition"
        >
          {/* TEXT */}
          <input
            className="w-full p-2 border rounded mb-3 dark:bg-gray-800"
            value={q.questionText}
            onChange={(e) =>
              updateQuestion(q.id, "questionText", e.target.value)
            }
          />

          {/* TYPE */}
          <select
            className="mb-3 border p-2 rounded"
            value={q.questionTypeId}
            onChange={(e) => {
              const val = Number(e.target.value);

              updateSurveyState((p: any) => ({
                ...p,
                questions: p.questions.map((x: any) => {
                  if (x.id !== q.id) return x;

                  return {
                    ...x,
                    questionTypeId: val,
                    options: isChoice(val)
                      ? x.options?.length
                        ? x.options
                        : [
                            { id: Date.now(), optionText: "Option 1" },
                            { id: Date.now() + 1, optionText: "Option 2" },
                          ]
                      : [],
                  };
                }),
              }));
            }}
          >
            <option value={1}>Single choice</option>
            <option value={2}>Multiple choice</option>
            <option value={3}>Short text</option>
            <option value={4}>Long text</option>
            <option value={5}>Number</option>
            <option value={6}>Date</option>
          </select>

          {/* OPTIONS */}
          {isChoice(q.questionTypeId) && (
            <div className="mb-3 space-y-2">
              {(q.options || []).map((o: any) => (
                <div key={o.id} className="flex items-center gap-2">
                  {q.questionTypeId === 1 ? (
                    <Circle size={16} />
                  ) : (
                    <CheckSquare size={16} />
                  )}

                  <input
                    className="flex-1 p-2 border rounded dark:bg-gray-800"
                    value={o.optionText}
                    onChange={(e) =>
                      updateOption(q.id, o.id, e.target.value)
                    }
                  />
                </div>
              ))}

              <button
                onClick={() => addOption(q.id)}
                className="text-sm text-blue-500 hover:underline"
              >
                + Add option
              </button>
            </div>
          )}

          {/* ACTION */}
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={q.isRequired}
                onChange={(e) =>
                  updateQuestion(q.id, "isRequired", e.target.checked)
                }
              />
              Required
            </label>

            <div className="flex gap-3">
              <button
                onClick={() => saveQuestion(q)}
                className="flex items-center gap-1 text-green-600 hover:underline"
              >
                <Save size={16} />
              </button>

              <button
                onClick={() => deleteQuestion(q.id)}
                className="flex items-center gap-1 text-red-500 hover:underline"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}