"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  Mail,
  MailOpen,
  Trash2,
  Filter,
  Search,
  Calendar,
  User,
  AtSign,
  MessageSquare,
  CheckCircle,
  Circle,
} from "lucide-react";
import { contactService } from "@/services/contactService";
import { ContactMessage } from "@/lib/types";

type FilterType = "all" | "unread" | "read";

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await contactService.getAll();
      setMessages(data);
    } catch (error) {
      toast.error("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string, read: boolean) => {
    try {
      await contactService.markAsRead(id, read);
      setMessages(
        messages.map((msg) => (msg._id === id ? { ...msg, read } : msg))
      );

      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage({ ...selectedMessage, read });
      }

      toast.success(read ? "Marked as read" : "Marked as unread");
    } catch (error) {
      toast.error("Failed to update message status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      await contactService.delete(id);
      setMessages(messages.filter((msg) => msg._id !== id));

      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage(null);
      }

      toast.success("Message deleted successfully");
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  const handleSelectMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);

    // Auto-mark as read when opened
    if (!message.read) {
      await handleMarkAsRead(message._id, true);
    }
  };

  const filteredMessages = messages.filter((message) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "read" && message.read) ||
      (filter === "unread" && !message.read);

    const matchesSearch =
      searchTerm === "" ||
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const sortedMessages = filteredMessages.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return "Today";
    } else if (diffDays === 2) {
      return "Yesterday";
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const unreadCount = messages.filter((msg) => !msg.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">
            Contact form submissions ({unreadCount} unread)
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Messages</option>
            <option value="unread">Unread ({unreadCount})</option>
            <option value="read">Read</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        {/* Messages List */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Messages ({sortedMessages.length})
            </h2>
          </div>

          <div className="overflow-y-auto max-h-96 lg:max-h-full">
            {sortedMessages.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {sortedMessages.map((message) => (
                  <div
                    key={message._id}
                    className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedMessage?._id === message._id
                        ? "bg-blue-50 border-r-2 border-blue-500"
                        : ""
                    } ${!message.read ? "bg-blue-25" : ""}`}
                    onClick={() => handleSelectMessage(message)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {message.read ? (
                            <MailOpen className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Mail className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <span
                          className={`font-medium ${
                            !message.read ? "text-gray-900" : "text-gray-700"
                          }`}
                        >
                          {message.name}
                        </span>
                        {!message.read && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            New
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>

                    <div className="text-sm text-gray-600 mb-1">
                      {message.email}
                    </div>

                    <div className="text-sm text-gray-700 line-clamp-2">
                      {message.message}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <MessageSquare className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium">No messages found</p>
                <p className="text-sm">
                  {searchTerm
                    ? "Try adjusting your search"
                    : "No contact form submissions yet"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          {selectedMessage ? (
            <div className="h-full flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                      {selectedMessage.name}
                    </h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <AtSign className="h-4 w-4 mr-1" />
                        <a
                          href={`mailto:${selectedMessage.email}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {selectedMessage.email}
                        </a>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDateTime(selectedMessage.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        handleMarkAsRead(
                          selectedMessage._id,
                          !selectedMessage.read
                        )
                      }
                      className={`p-2 rounded-lg transition-colors ${
                        selectedMessage.read
                          ? "text-gray-600 hover:bg-gray-100"
                          : "text-blue-600 hover:bg-blue-50"
                      }`}
                      title={
                        selectedMessage.read ? "Mark as unread" : "Mark as read"
                      }
                    >
                      {selectedMessage.read ? (
                        <Circle className="h-5 w-5" />
                      ) : (
                        <CheckCircle className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(selectedMessage._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-6 overflow-y-auto">
                <div className="prose prose-sm max-w-none">
                  {selectedMessage.message
                    .split("\n")
                    .map((paragraph, index) => (
                      <p
                        key={index}
                        className="mb-3 text-gray-700 leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Status:{" "}
                    {selectedMessage.read ? (
                      <span className="text-green-600 font-medium">Read</span>
                    ) : (
                      <span className="text-blue-600 font-medium">Unread</span>
                    )}
                  </div>
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: Contact Form Message&body=Hi ${selectedMessage.name},%0D%0A%0D%0AThank you for your message:%0D%0A"${selectedMessage.message}"%0D%0A%0D%0A`}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Reply via Email
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Mail className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg font-medium">Select a message</p>
                <p className="text-sm">
                  Choose a message from the list to view details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
