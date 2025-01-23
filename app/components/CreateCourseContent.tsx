"use client";

import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import "easymde/dist/easymde.min.css";
import { debounce } from "lodash";

interface CreateCourseContentProps {
  courseId: number;
  userId: number;
}

const CreateCourseContent: React.FC<CreateCourseContentProps> = ({ courseId, userId }) => {
  const [title, setTitle] = useState<string>('');
  const [markdown, setMarkdown] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showMarkdownEditor, setShowMarkdownEditor] = useState<boolean>(false);

  const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });

  const handleMarkdownChange = useCallback(
    debounce((value: string) => {
      setMarkdown(value);
    }, 50000),
    []
  );

  const handleToggleEditor = () => {
    setShowMarkdownEditor(!showMarkdownEditor);
  };

  const handleCloseEditor = () => {
    setShowMarkdownEditor(false);
  };

  const handleSubmit = async () => {

    if (!title || !markdown) {
      setError("Title and content are required.");
      return;
    }

    setLoading(true);
    setError(null);

    console.log(
      `Title: ${title}, Markdown: ${markdown}, Course ID: ${JSON.stringify(courseId)}, User ID: ${JSON.stringify(userId.user_id)}`
    );


    try {
      const response = await fetch("/api/topic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content: markdown,
          course_id: parseInt(courseId), // Use passed courseId
          creator_id: parseInt(userId.user_id) , // Use passed userId
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Topic created:", data);
        setShowMarkdownEditor(false);
      } else {
        setError(data.error || "Failed to create topic.");
      }
    } catch (error) {
      console.error("Error creating topic:", error);
      setError("An error occurred while creating the topic.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {showMarkdownEditor && (
        <div className="m-5 border card bg-base-100 shadow-xl mt-6">
          <div className="card-body">
            <h1 className="text-lg font-bold mb-4">Write a Topic</h1>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Write a Title"
              className="input input-bordered w-full mb-4"
            />
            <div className="mb-6">
              <SimpleMDE
                value={markdown}
                onChange={handleMarkdownChange}
                options={{
                  spellChecker: false,
                  placeholder: "Type your markdown here...",
                }}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-end space-x-4 mt-4">
              <button className="btn btn-ghost" onClick={handleCloseEditor}>
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {!showMarkdownEditor && (
        <div
          className="m-5 border card bg-base-100 shadow-xl mt-6 cursor-pointer"
          onClick={handleToggleEditor}
        >
          <div className="card-body">
            <h1>Make a Topic</h1>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCourseContent;
