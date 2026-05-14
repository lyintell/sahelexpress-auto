"use client";

import { useEffect } from "react";

export default function EditorBodyMode() {
  useEffect(() => {
    document.body.classList.add("editor-mode");

    return () => {
      document.body.classList.remove("editor-mode");
    };
  }, []);

  return null;
}