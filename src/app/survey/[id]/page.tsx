"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle, Send } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function PublicSurvey() {
  const { id } = useParams();

  const [survey, setSurvey] = useState<any>(null);
  const [answers, setAnswers] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  const [submitted, setSubmitted] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  // =========================
  // LOAD SURVEY
  // =========================
  useEffect(() => {
    if (!id) return;

    fetch(`${API_URL}/survey/PublicSurvey/${id}`)
      .then((res) => res.json())
      .then(setSurvey);
  }, [id]);

  // =========================
  // HANDLE ANSWER
  // =========================
  const updateAnswer = (qid: number, value: any, type: string) => {
    setAnswers((prev: any) => ({
      ...prev,
      [qid]: {
        ...prev[qid],
        questionId: qid,
        [type]: value,
      },
    }));

    // clear error khi user nhập lại
    setErrors((prev: any) => ({
      ...prev,
      [qid]: null,
    }));
  };

  // =========================
  // HANDLE OPTION
  // =========================
  const handleOption = (qid: number, optionId: number, multiple: boolean) => {
    setAnswers((prev: any) => {
      const current = prev[qid]?.optionIds || [];

      let updated;

      if (multiple) {
        updated = current.includes(optionId)
          ? current.filter((x: number) => x !== optionId)
          : [...current, optionId];
      } else {
        updated = [optionId];
      }

      return {
        ...prev,
        [qid]: {
          ...prev[qid],
          questionId: qid,
          optionIds: updated,
        },
      };
    });

    setErrors((prev: any) => ({
      ...prev,
      [qid]: null,
    }));
  };

  // =========================
  // VALIDATE
  // =========================
  const validatePage = () => {
    const page = survey.pages[currentPage];
    const newErrors: any = {};

    page.questions.forEach((q: any) => {
      if (!q.isRequired) return;

      const answer = answers[q.id];
      let isEmpty = false;

      switch (q.questionTypeId) {
        case 1:
        case 2:
          isEmpty = !answer?.optionIds || answer.optionIds.length === 0;
          break;
        case 3:
        case 4:
          isEmpty = !answer?.answerText;
          break;
        case 5:
          isEmpty = answer?.answerNumber === undefined;
          break;
        case 6:
          isEmpty = !answer?.answerDate;
          break;
      }

      if (isEmpty) {
        newErrors[q.id] = "Câu hỏi này là bắt buộc";
      }
    });

    setErrors(newErrors);

    // scroll tới lỗi đầu tiên
    if (Object.keys(newErrors).length > 0) {
      const firstErrorId = Object.keys(newErrors)[0];
      document
        .getElementById(`q-${firstErrorId}`)
        ?.scrollIntoView({ behavior: "smooth" });
    }

    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async () => {
    if (!validatePage()) return;

    const payload = {
      answers: Object.values(answers),
    };

    const res = await fetch(
      `${API_URL}/survey/PublicSurvey/${id}/submit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (res.ok) {
      setSubmitted(true);
    } else {
      alert("Submit lỗi");
    }
  };

  if (!survey) return <div className="p-6">Loading...</div>;

  if (submitted)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-green-600">
        <CheckCircle size={48} />
        <h2 className="text-xl font-bold mt-3">Đã gửi thành công!</h2>
      </div>
    );

  const page = survey.pages[currentPage];

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* HEADER */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold">{survey.title}</h1>
        <p className="text-gray-500 mt-2">{survey.description}</p>
      </div>

      {/* PAGE */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg">{page.title}</h2>

        {page.questions.map((q: any) => (
          <div
            key={q.id}
            id={`q-${q.id}`}
            className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow"
          >
            <p className="font-medium mb-3">
              {q.questionText}
              {q.isRequired && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </p>

            {/* TEXT */}
            {(q.questionTypeId === 3 || q.questionTypeId === 4) && (
              <textarea
                className="w-full p-2 border rounded dark:bg-gray-800"
                onChange={(e) =>
                  updateAnswer(q.id, e.target.value, "answerText")
                }
              />
            )}

            {/* NUMBER */}
            {q.questionTypeId === 5 && (
              <input
                type="number"
                className="w-full p-2 border rounded dark:bg-gray-800"
                onChange={(e) =>
                  updateAnswer(q.id, Number(e.target.value), "answerNumber")
                }
              />
            )}

            {/* DATE */}
            {q.questionTypeId === 6 && (
              <input
                type="date"
                className="w-full p-2 border rounded dark:bg-gray-800"
                onChange={(e) =>
                  updateAnswer(q.id, e.target.value, "answerDate")
                }
              />
            )}

            {/* SINGLE */}
            {q.questionTypeId === 1 && (
              <div className="space-y-2">
                {q.options.map((o: any) => (
                  <label key={o.id} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      onChange={() => handleOption(q.id, o.id, false)}
                    />
                    {o.optionText}
                  </label>
                ))}
              </div>
            )}

            {/* MULTIPLE */}
            {q.questionTypeId === 2 && (
              <div className="space-y-2">
                {q.options.map((o: any) => (
                  <label key={o.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      onChange={() => handleOption(q.id, o.id, true)}
                    />
                    {o.optionText}
                  </label>
                ))}
              </div>
            )}

            {/* ERROR */}
            {errors[q.id] && (
              <p className="text-red-500 text-sm mt-2">
                {errors[q.id]}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* NAVIGATION */}
      <div className="flex justify-between">
        {/* BACK */}
        {currentPage > 0 && (
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Back
          </button>
        )}

        {/* NEXT */}
        {currentPage < survey.pages.length - 1 && (
          <button
            onClick={() => {
              if (validatePage()) {
                setCurrentPage((p) => p + 1);
              }
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded"
          >
            Next
          </button>
        )}

        {/* SUBMIT */}
        {currentPage === survey.pages.length - 1 && (
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl"
          >
            <Send size={18} />
            Submit
          </button>
        )}
      </div>
    </div>
  );
}