"use client";

import { useRouter } from "next/navigation";
import { LayoutDashboard, ClipboardList } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full text-center space-y-10">
        
        {/* TITLE */}
        <div>
          <h1 className="text-4xl font-bold">
            Survey System
          </h1>
          <p className="text-gray-500 mt-2">
            Chọn chức năng bạn muốn sử dụng
          </p>
        </div>

        {/* OPTIONS */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* DASHBOARD */}
          <div
            onClick={() => router.push("/admin")}
            className="cursor-pointer bg-white dark:bg-gray-900 p-8 rounded-2xl shadow hover:shadow-lg transition border hover:border-blue-500"
          >
            <LayoutDashboard size={40} className="mx-auto text-blue-600" />
            <h2 className="text-xl font-semibold mt-4">
              Dashboard
            </h2>
            <p className="text-gray-500 mt-2">
              Quản lý survey, tạo câu hỏi và xem kết quả
            </p>
          </div>

          {/* SURVEY */}
          <div
            onClick={() => router.push("/survey")}
            className="cursor-pointer bg-white dark:bg-gray-900 p-8 rounded-2xl shadow hover:shadow-lg transition border hover:border-green-500"
          >
            <ClipboardList size={40} className="mx-auto text-green-600" />
            <h2 className="text-xl font-semibold mt-4">
              Làm khảo sát
            </h2>
            <p className="text-gray-500 mt-2">
              Trả lời các khảo sát công khai
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}