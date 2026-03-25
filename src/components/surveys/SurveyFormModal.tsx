"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/modal/Modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";

interface Props {
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export default function SurveyFormModal({
  onClose,
  onSubmitSuccess,
}: Props) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      // LOGIN
      const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!loginRes.ok) throw new Error("Login failed");

      const { token } = await loginRes.json();
      if (!token) throw new Error("No token");

      const getToken = () =>
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      const userstoken = getToken();

      // CREATE
      const createRes = await fetch(`${API_URL}/survey/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userstoken}`,
        },
        body: JSON.stringify({
          title,
          description,
          username,
          password,
        }),
      });

      if (!createRes.ok) {
        throw new Error("403 - Không có quyền survey_create");
      }

      onSubmitSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Create Survey">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">

          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <Label>Description</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div>
            <Label>Username</Label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          <div>
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {error && (
            <p className="text-sm text-error-500">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Create"}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}