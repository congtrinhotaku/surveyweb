"use client";

import { useEffect, useState } from "react";

type MenuItem = {
  id: number;
  name: string;
  path?: string;
  parentId?: number | null;
  functionId?: number | null;
  orderIndex?: number;
  children?: MenuItem[];
};

type FunctionItem = {
  id: number;
  name: string;
};

// ======================
// API HELPER
// ======================
const getToken = () =>
  localStorage.getItem("token") ||
  sessionStorage.getItem("token");

async function api(url: string, options: any = {}) {
  const token = getToken();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${url}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    }
  );

  if (res.status === 401) {
    alert("Hết phiên đăng nhập");
    localStorage.removeItem("token");
    window.location.href = "/signin";
  }

  return res;
}

// ======================
// MAIN PAGE
// ======================
export default function MenuManagerPage() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [functions, setFunctions] = useState<FunctionItem[]>([]);

  const fetchMenus = async () => {
    const res = await api("/core/menus/tree");
    const data = await res.json();
    setMenus(data);
  };

  const fetchFunctions = async () => {
    const res = await api("/core/functions");
    const data = await res.json();
    setFunctions(data);
  };

  useEffect(() => {
    fetchMenus();
    fetchFunctions();
  }, []);

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">
        🌳 Quản lý Menu
      </h1>

      {menus.map((item) => (
        <TreeItem
          key={item.id}
          item={item}
          allMenus={flatten(menus)}
          functions={functions}
          refresh={fetchMenus}
        />
      ))}

      {/* ADD ROOT */}
      <button
        onClick={async () => {
          await api("/core/menus", {
            method: "POST",
            body: JSON.stringify({
              name: "Menu mới",
              parentId: null,
              orderIndex: 0,
            }),
          });
          fetchMenus();
        }}
        className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
      >
        + Thêm menu gốc
      </button>
    </div>
  );
}

// ======================
// TREE ITEM
// ======================
function TreeItem({
  item,
  allMenus,
  functions,
  refresh,
}: any) {
  const [open, setOpen] = useState(true);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: item.name,
    path: item.path || "",
    parentId: item.parentId || null,
    functionId: item.functionId || null,
    orderIndex: item.orderIndex || 0,
  });

  const updateMenu = async () => {
    await api(`/core/menus/${item.id}`, {
      method: "PUT",
      body: JSON.stringify(form),
    });

    setEditing(false);
    refresh();
  };

  const deleteMenu = async () => {
    if (!confirm("Xóa menu?")) return;

    await api(`/core/menus/${item.id}`, {
      method: "DELETE",
    });

    refresh();
  };

  const createChild = async () => {
    await api("/core/menus", {
      method: "POST",
      body: JSON.stringify({
        name: "Menu mới",
        parentId: item.id,
        orderIndex: 0,
      }),
    });

    refresh();
  };

  return (
    <div className="ml-4">
      <div className="flex items-center gap-2 bg-gray-900 p-2 rounded mt-2 border border-gray-700">
        {/* TOGGLE */}
        <button onClick={() => setOpen(!open)}>
          {open ? "▼" : "▶"}
        </button>

        {/* ORDER */}
        <span className="w-10 text-gray-400">
          {item.orderIndex}
        </span>

        {/* EDIT MODE */}
        {editing ? (
          <div className="flex gap-2 flex-wrap w-full">
            <input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="px-2 text-black"
            />

            <input
              placeholder="path"
              value={form.path}
              onChange={(e) =>
                setForm({ ...form, path: e.target.value })
              }
              className="px-2 text-black"
            />

            {/* ORDER INPUT */}
            <input
              type="number"
              value={form.orderIndex}
              onChange={(e) =>
                setForm({
                  ...form,
                  orderIndex: Number(e.target.value),
                })
              }
              className="w-20 px-2 text-black"
            />

            {/* PARENT */}
            <select
              value={form.parentId || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  parentId: e.target.value
                    ? Number(e.target.value)
                    : null,
                })
              }
              className="text-black"
            >
              <option value="">Root</option>
              {allMenus.map((m: any) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>

            {/* FUNCTION */}
            <select
              value={form.functionId || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  functionId: e.target.value
                    ? Number(e.target.value)
                    : null,
                })
              }
              className="text-black"
            >
              <option value="">No Function</option>
              {functions.map((f: any) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>

            <button onClick={updateMenu}>💾</button>
          </div>
        ) : (
          <>
            <span className="flex-1">{item.name}</span>

            <div className="flex gap-2">
              {/* UP */}
              <button
                onClick={async () => {
                  await api(`/core/menus/${item.id}`, {
                    method: "PUT",
                    body: JSON.stringify({
                      orderIndex: (item.orderIndex || 0) - 1,
                    }),
                  });
                  refresh();
                }}
              >
                🔼
              </button>

              {/* DOWN */}
              <button
                onClick={async () => {
                  await api(`/core/menus/${item.id}`, {
                    method: "PUT",
                    body: JSON.stringify({
                      orderIndex: (item.orderIndex || 0) + 1,
                    }),
                  });
                  refresh();
                }}
              >
                🔽
              </button>

              <button onClick={createChild}>➕</button>
              <button onClick={() => setEditing(true)}>✏️</button>
              <button onClick={deleteMenu}>❌</button>
            </div>
          </>
        )}
      </div>

      {/* CHILDREN */}
      {open && item.children?.length > 0 && (
        <div className="ml-4 border-l border-gray-700 pl-2">
          {item.children.map((child: any) => (
            <TreeItem
              key={child.id}
              item={child}
              allMenus={allMenus}
              functions={functions}
              refresh={refresh}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ======================
// FLATTEN TREE
// ======================
function flatten(tree: any[]): any[] {
  let result: any[] = [];

  tree.forEach((item) => {
    result.push(item);
    if (item.children) {
      result = result.concat(flatten(item.children));
    }
  });

  return result;
}