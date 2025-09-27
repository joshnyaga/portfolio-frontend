"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Calendar,
  MapPin,
  Building,
  ExternalLink,
  Briefcase,
} from "lucide-react";
import { experienceService } from "@/services/experienceService";
import { Experience } from "@/lib/types";

interface ExperienceFormData {
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location: string;
  companyUrl: string;
  order: number;
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(
    null
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<ExperienceFormData>({
    company: "",
    position: "",
    description: "",
    startDate: "",
    endDate: "",
    current: false,
    location: "",
    companyUrl: "",
    order: 0,
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const data = await experienceService.getAll();
      setExperiences(data);
    } catch (error) {
      toast.error("Failed to fetch experiences");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Clean up the data before submitting
      const submitData = {
        ...formData,
        endDate: formData.current ? undefined : formData.endDate,
        location: formData.location || undefined,
        companyUrl: formData.companyUrl || undefined,
      };

      if (editingExperience) {
        const updated = await experienceService.update(
          editingExperience._id,
          submitData
        );
        setExperiences(
          experiences.map((exp) =>
            exp._id === editingExperience._id ? updated : exp
          )
        );
        toast.success("Experience updated successfully");
        setEditingExperience(null);
      } else {
        // Set order to be the highest + 1 if not specified
        const maxOrder =
          experiences.length > 0
            ? Math.max(...experiences.map((e) => e.order))
            : 0;
        const finalData = {
          ...submitData,
          order: submitData.order || maxOrder + 1,
        };

        const newExperience = await experienceService.create(finalData);
        setExperiences([...experiences, newExperience]);
        toast.success("Experience added successfully");
        setShowAddForm(false);
      }

      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to save experience");
    }
  };

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    setFormData({
      company: experience.company,
      position: experience.position,
      description: experience.description,
      startDate: experience.startDate.split("T")[0],
      endDate: experience.endDate ? experience.endDate.split("T")[0] : "",
      current: experience.current,
      location: experience.location || "",
      companyUrl: experience.companyUrl || "",
      order: experience.order,
    });
    setShowAddForm(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;

    try {
      await experienceService.delete(id);
      setExperiences(experiences.filter((exp) => exp._id !== id));
      toast.success("Experience deleted successfully");
    } catch (error) {
      toast.error("Failed to delete experience");
    }
  };

  const resetForm = () => {
    setFormData({
      company: "",
      position: "",
      description: "",
      startDate: "",
      endDate: "",
      current: false,
      location: "",
      companyUrl: "",
      order: 0,
    });
    setEditingExperience(null);
    setShowAddForm(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const calculateDuration = (
    startDate: string,
    endDate: string | undefined
  ) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();

    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years === 0) {
      return `${remainingMonths} month${remainingMonths !== 1 ? "s" : ""}`;
    } else if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? "s" : ""}`;
    } else {
      return `${years} year${years !== 1 ? "s" : ""} ${remainingMonths} month${
        remainingMonths !== 1 ? "s" : ""
      }`;
    }
  };

  const sortedExperiences = experiences.sort((a, b) => a.order - b.order);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Work Experience</h1>
          <p className="text-gray-600">Manage your professional work history</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingExperience) && (
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">
              {editingExperience ? "Edit Experience" : "Add New Experience"}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <input
                  type="text"
                  required
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Senior Full Stack Developer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Tech Solutions Inc."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location (Optional)
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., San Francisco, CA or Remote"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.companyUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, companyUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://company.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  disabled={formData.current}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({ ...formData, order: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="current"
                checked={formData.current}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    current: e.target.checked,
                    endDate: e.target.checked ? "" : formData.endDate,
                  })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="current" className="ml-2 text-sm text-gray-700">
                This is my current position
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your role, responsibilities, and achievements..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                {editingExperience ? "Update" : "Add"} Experience
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Experience Timeline */}
      {sortedExperiences.length > 0 ? (
        <div className="space-y-6">
          {sortedExperiences.map((experience, index) => (
            <div
              key={experience._id}
              className="bg-white rounded-lg shadow border border-gray-200 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {experience.position}
                    </h3>
                    {experience.current && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Current
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-1" />
                      {experience.companyUrl ? (
                        <a
                          href={experience.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          {experience.company}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      ) : (
                        experience.company
                      )}
                    </div>

                    {experience.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {experience.location}
                      </div>
                    )}

                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(experience.startDate)} -{" "}
                      {experience.current
                        ? "Present"
                        : formatDate(experience.endDate!)}
                      <span className="ml-1 text-gray-400">
                        (
                        {calculateDuration(
                          experience.startDate,
                          experience.endDate
                        )}
                        )
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-1 ml-4">
                  <span className="text-xs text-gray-500 mr-2">
                    #{experience.order}
                  </span>
                  <button
                    onClick={() => handleEdit(experience)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(experience._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="prose prose-sm max-w-none text-gray-700">
                {experience.description.split("\n").map((paragraph, pIndex) => (
                  <p key={pIndex} className="mb-2">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Briefcase className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No work experience yet
          </h3>
          <p className="text-gray-600 mb-4">
            Start building your professional timeline
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Experience
          </button>
        </div>
      )}
    </div>
  );
}
