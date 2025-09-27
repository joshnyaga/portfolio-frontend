"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Plus, Edit, Trash2, Save, X, Upload } from "lucide-react";
import AdminLayout from "../layout";
import { skillService } from "@/services/skillService";
import { Skill } from "@/lib/types";

interface SkillFormData {
  name: string;
  category: "frontend" | "backend" | "tools" | "languages";
  level: 1 | 2 | 3 | 4 | 5;
  order: number;
  icon?: File;
}

const categoryOptions = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "tools", label: "Tools" },
  { value: "languages", label: "Languages" },
];

const levelLabels = {
  1: "Beginner",
  2: "Novice",
  3: "Intermediate",
  4: "Advanced",
  5: "Expert",
};

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<SkillFormData>({
    name: "",
    category: "frontend",
    level: 3,
    order: 0,
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const data = await skillService.getAll();
      setSkills(data);
    } catch (error) {
      toast.error("Failed to fetch skills");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingSkill) {
        const updated = await skillService.update(editingSkill._id, formData);
        setSkills(
          skills.map((skill) =>
            skill._id === editingSkill._id ? updated : skill
          )
        );
        toast.success("Skill updated successfully");
        setEditingSkill(null);
      } else {
        // Set order to be the highest + 1 if not specified
        const maxOrder =
          skills.length > 0 ? Math.max(...skills.map((s) => s.order)) : 0;
        const submitData = {
          ...formData,
          order: formData.order || maxOrder + 1,
        };

        const newSkill = await skillService.create(submitData);
        setSkills([...skills, newSkill]);
        toast.success("Skill added successfully");
        setShowAddForm(false);
      }

      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to save skill");
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      order: skill.order,
    });
    setShowAddForm(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    try {
      await skillService.delete(id);
      setSkills(skills.filter((skill) => skill._id !== id));
      toast.success("Skill deleted successfully");
    } catch (error) {
      toast.error("Failed to delete skill");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "frontend",
      level: 3,
      order: 0,
    });
    setEditingSkill(null);
    setShowAddForm(false);
  };

  const getSkillsByCategory = () => {
    const skillsByCategory = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>);

    // Sort skills within each category by order
    Object.keys(skillsByCategory).forEach((category) => {
      skillsByCategory[category].sort((a, b) => a.order - b.order);
    });

    return skillsByCategory;
  };

  const renderLevelStars = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${i < level ? "text-yellow-400" : "text-gray-300"}`}
      >
        ★
      </span>
    ));
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );
  }

  const skillsByCategory = getSkillsByCategory();

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Skills</h1>
            <p className="text-gray-600">
              Manage your technical skills by category
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Skill
          </button>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || editingSkill) && (
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {editingSkill ? "Edit Skill" : "Add New Skill"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skill Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., React, Python, Figma"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skill Level
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        level: Number(e.target.value) as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Object.entries(levelLabels).map(([value, label]) => (
                      <option key={value} value={Number(value)}>
                        Level {value} - {label}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 flex items-center space-x-1">
                    {renderLevelStars(formData.level)}
                  </div>
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
                      setFormData({
                        ...formData,
                        order: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Lower numbers appear first
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon (Optional)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload an icon</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setFormData({ ...formData, icon: file });
                            }
                          }}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, SVG up to 2MB
                    </p>
                  </div>
                </div>
                {formData.icon && (
                  <p className="text-sm text-green-600 mt-2">
                    Selected: {formData.icon.name}
                  </p>
                )}
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
                  {editingSkill ? "Update" : "Add"} Skill
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Skills by Category */}
        {Object.keys(skillsByCategory).length > 0 ? (
          <div className="space-y-8">
            {categoryOptions.map(({ value: category, label }) => {
              const categorySkills = skillsByCategory[category] || [];
              if (categorySkills.length === 0) return null;

              return (
                <div
                  key={category}
                  className="bg-white rounded-lg shadow border border-gray-200 p-6"
                >
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
                    {label} ({categorySkills.length})
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categorySkills.map((skill) => (
                      <div
                        key={skill._id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center space-x-3">
                            {skill.iconUrl && (
                              <img
                                src={skill.iconUrl}
                                alt={skill.name}
                                className="w-8 h-8 object-contain"
                              />
                            )}
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {skill.name}
                              </h3>
                              <p className="text-xs text-gray-500">
                                Order: {skill.order}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleEdit(skill)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(skill._id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            {renderLevelStars(skill.level)}
                          </div>
                          <span className="text-sm text-gray-600">
                            {levelLabels[skill.level]}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.78 0-2.678-2.153-1.415-3.414l5-5A2 2 0 009 9.172V5L8 4z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No skills yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start building your skills portfolio
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Skill
            </button>
          </div>
        )}
      </div>
  );
}

