"use client";
import { useState } from "react";
import axios from "axios";
import { Send, Loader2 } from "lucide-react";
export default function Home() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [emails, setEmails] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus("");
    try {
      // Split emails by commas, newlines, or spaces and clean them up
      const emailList = emails
        .split(/[\s,]+/)
        .map((email) => email.trim())
        .filter((email) => email.length > 0);
      // Validate email list
      if (emailList.length === 0) {
        throw new Error("Please enter at least one email address");
      }
      // Basic email validation
      const invalidEmails = emailList.filter(
        (email) => !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      );
      if (invalidEmails.length > 0) {
        throw new Error(`Invalid email addresses: ${invalidEmails.join(", ")}`);
      }
      // Fixed axios request
      const response = await axios.post("/api/send-email", {
        email,
        subject,
        message,
        recipients: emailList,
      });
      // Check response status
      if (response.data.success) {
        setStatus("Emails sent successfully!");
        // Clear form only on success
        setEmail("");
        setSubject("");
        setMessage("");
        setEmails("");
      } else {
        throw new Error(response.data.error || "Failed to send emails");
      }
    } catch (error) {
      // Handle both axios errors and custom errors
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Error sending emails. Please try again.";
      setStatus(`Error: ${errorMessage}`);
      console.error("Error:", error);
    } finally {
      setSending(false);
    }
  };
  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">
            Enter Your Email
          </label>
          <textarea
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-1 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="email1@example.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Email Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Email Addresses (comma or newline separated)
          </label>
          <textarea
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            className="w-full p-2 border rounded h-32 focus:ring-2 focus:ring-blue-500"
            placeholder="email1@example.com, email2@example.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Message Content
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border rounded h-48 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={sending}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {sending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send Emails
            </>
          )}
        </button>
        {status && (
          <div
            className={`p-4 rounded ${
              status.includes("Error")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {status}
          </div>
        )}
      </form>
    </div>
  );
}
