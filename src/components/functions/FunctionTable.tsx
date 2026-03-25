import React from "react";

const FunctionTable = ({ functions, onPermission }: any) => {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Code</th>
            <th className="px-6 py-3 text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {functions.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-4 text-center">
                No functions found.
              </td>
            </tr>
          ) : (
            functions.map((f: any) => (
              <tr
                key={f.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4">{f.id}</td>
                <td className="px-6 py-4">{f.name}</td>

                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                    {f.code}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onPermission(f.id)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Phân quyền
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FunctionTable;