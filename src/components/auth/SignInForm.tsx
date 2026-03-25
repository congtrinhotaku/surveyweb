"use client";

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // ======================
  // AUTO REDIRECT nếu đã login
  // ======================
  useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
  }, []);

  // ======================
  // HANDLE LOGIN
  // ======================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Response không hợp lệ từ server");
      }

      if (!res.ok) {
        alert(data?.message || "Login failed");
        return;
      }

    // ======================
    // ✅ LƯU TRỰC TIẾP LOCAL STORAGE
    // ======================
    const storage = isChecked ? localStorage : sessionStorage;

    storage.setItem("token", data.token);
    storage.setItem("user", JSON.stringify({
      id: data.id,
      username: data.username,
      roles: data.roles,
      permissions: data.permissions,
    }));


    window.dispatchEvent(new Event("userChanged"));
      // ======================
      // REDIRECT
      // ======================
      router.push("/admin");
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Server error");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // UI
  // ======================
  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      {/* BACK */}
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronLeftIcon />
          Back to dashboard
        </Link>
      </div>

      {/* FORM */}
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-6">
            <h1 className="mb-2 font-semibold text-2xl">Sign In</h1>
            <p className="text-sm text-gray-500">
              Enter your username and password
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="space-y-6">
              {/* USERNAME */}
              <div>
                <Label>
                  Username <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUsername(e.target.value)
                  }
                />
              </div>

              {/* PASSWORD */}
              <div>
                <Label>
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPassword(e.target.value)
                    }
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
                  </span>
                </div>
              </div>

              {/* REMEMBER */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={isChecked}
                    onChange={(checked: boolean) =>
                      setIsChecked(checked)
                    }
                  />
                  <span className="text-sm">Keep me logged in</span>
                </div>

                <Link
                  href="/reset-password"
                  className="text-sm text-blue-500"
                >
                  Forgot password?
                </Link>
              </div>

              {/* BUTTON */}
              <Button
                type="submit"
                className="w-full"
                size="sm"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}