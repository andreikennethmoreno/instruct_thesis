"use client";

import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import "easymde/dist/easymde.min.css";
import { debounce } from "lodash";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });

const CreateCourseContent: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>("");
  const [showMarkdownEditor, setShowMarkdownEditor] = useState<boolean>(false); // Control markdown editor visibility

  const handleMarkdownChange = useCallback(
    debounce((value: string) => {
      setMarkdown(value);
    }, 100000), // 500ms debounce
    []
  );

  const handleToggleEditor = () => {
    setShowMarkdownEditor(!showMarkdownEditor); // Toggle editor visibility
  };

  const handleCloseEditor = () => {
    setShowMarkdownEditor(false); // Close editor
  };

  const handleSubmit = () => {
    // Handle form submission logic
    console.log("Markdown Submitted:", markdown);
    // You can add any API request here to submit the markdown content
    setShowMarkdownEditor(false); // Optionally close editor after submission
  };

  return (
    <div>
      {showMarkdownEditor && (
         <div className="m-5 border card bg-base-100 shadow-xl mt-6">
         <div className="card-body">
           <h1 className="text-lg font-bold mb-4">Markdown Editor</h1>

           {/* Markdown Input */}
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

           {/* Action Buttons */}
           <div className="flex justify-end space-x-4 mt-4">
             <button
               className="btn btn-ghost"
               onClick={handleCloseEditor}
             >
               Close
             </button>
             <button
               className="btn btn-primary"
               onClick={handleSubmit}
             >
               Submit
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
          <h1>
            Make a Topic
          </h1>
        </div>
      </div>
      )}

      
    </div>
  );
};

export default CreateCourseContent;
