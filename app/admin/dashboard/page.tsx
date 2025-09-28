"use client";

import { useState, useEffect } from "react";
import { projectService } from "@/services/projectService";
import { skillService } from "@/services/skillService";
import { experienceService } from "@/services/experienceService";
import { contactService } from "@/services/contactService";
import {
  visitorService,
  VisitorStats,
  RecentVisitor,
} from "@/services/visitorService";
import { Project, Skill, Experience, ContactMessage } from "@/lib/types";
import {
  FolderOpen,
  Wrench,
  Briefcase,
  Mail,
  TrendingUp,
  Eye,
  Users,
  Globe,
  BarChart3,
  Calendar,
} from "lucide-react";

interface DashboardStats {
  totalProjects: number;
  totalSkills: number;
  totalExperience: number;
  unreadMessages: number;
  featuredProjects: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalSkills: 0,
    totalExperience: 0,
    unreadMessages: 0,
    featuredProjects: 0,
  });

  // New visitor analytics state
  const [visitorStats, setVisitorStats] = useState<VisitorStats | null>(null);
  const [recentVisitors, setRecentVisitors] = useState<RecentVisitor[]>([]);

  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [visitorLoading, setVisitorLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [projects, skills, experience, messages] = await Promise.all([
          projectService.getAll(),
          skillService.getAll(),
          experienceService.getAll(),
          contactService.getAll(),
        ]);

        setStats({
          totalProjects: projects.length,
          totalSkills: skills.length,
          totalExperience: experience.length,
          unreadMessages: messages.filter((msg) => !msg.read).length,
          featuredProjects: projects.filter((p) => p.featured).length,
        });

        setRecentProjects(projects.slice(0, 3));
        setRecentMessages(messages.slice(0, 3));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchVisitorData = async () => {
      try {
        const [visitorStatsData, recentVisitorsResponse] = await Promise.all([
          visitorService.getStats(7), // Last 7 days
          visitorService.getRecentVisitors(5),
        ]);

        setVisitorStats(visitorStatsData);
        setRecentVisitors(recentVisitorsResponse.visitors);
      } catch (error) {
        console.error("Error fetching visitor data:", error);
        // Set empty data instead of failing
        setVisitorStats({
          totalVisits: 0,
          uniqueVisitors: 0,
          todayVisits: 0,
          popularPages: [],
          topCountries: [],
          browserStats: [],
          dailyVisits: [],
          period: "7 days",
        });
      } finally {
        setVisitorLoading(false);
      }
    };

    fetchDashboardData();
    fetchVisitorData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Enhanced stat cards with visitor analytics
  const statCards = [
    {
      name: "Total Projects",
      value: stats.totalProjects,
      icon: FolderOpen,
      color: "bg-blue-500",
    },
    {
      name: "Featured Projects",
      value: stats.featuredProjects,
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      name: "Skills",
      value: stats.totalSkills,
      icon: Wrench,
      color: "bg-purple-500",
    },
    {
      name: "Experience",
      value: stats.totalExperience,
      icon: Briefcase,
      color: "bg-orange-500",
    },
    {
      name: "Unread Messages",
      value: stats.unreadMessages,
      icon: Mail,
      color: "bg-red-500",
    },
    // New visitor stats
    {
      name: "Total Visits",
      value: visitorLoading ? "..." : visitorStats?.totalVisits || 0,
      icon: Eye,
      color: "bg-indigo-500",
    },
    {
      name: "Unique Visitors",
      value: visitorLoading ? "..." : visitorStats?.uniqueVisitors || 0,
      icon: Users,
      color: "bg-teal-500",
    },
    {
      name: "Today's Visits",
      value: visitorLoading ? "..." : visitorStats?.todayVisits || 0,
      icon: Calendar,
      color: "bg-pink-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Overview of your portfolio and visitor analytics
        </p>
      </div>

      {/* Enhanced Stats Grid - Now includes visitor analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={stat.name}
            className={`bg-white rounded-lg shadow p-6 ${
              index >= 5 ? "xl:col-span-1" : "xl:col-span-1"
            }`}
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Visitor Analytics Overview */}
      {!visitorLoading && visitorStats && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Visitor Analytics
              </h2>
              <a
                href="/admin/analytics"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View Details →
              </a>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Popular Pages */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Popular Pages
                </h3>
                <div className="space-y-2">
                  {(visitorStats?.popularPages || [])
                    .slice(0, 3)
                    .map((page, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm text-gray-600 truncate font-mono">
                          {page._id || "Unknown"}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {page.count}
                        </span>
                      </div>
                    ))}
                  {(!visitorStats?.popularPages ||
                    visitorStats.popularPages.length === 0) && (
                    <p className="text-sm text-gray-500">No page data yet</p>
                  )}
                </div>
              </div>

              {/* Top Countries */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Top Countries
                </h3>
                <div className="space-y-2">
                  {(visitorStats?.topCountries || [])
                    .slice(0, 3)
                    .map((country, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm text-gray-600 flex items-center">
                          <Globe className="h-3 w-3 mr-1" />
                          {country._id || "Unknown"}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {country.count}
                        </span>
                      </div>
                    ))}
                  {(!visitorStats?.topCountries ||
                    visitorStats.topCountries.length === 0) && (
                    <p className="text-sm text-gray-500">
                      No location data yet
                    </p>
                  )}
                </div>
              </div>

              {/* Browser Stats */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Popular Browsers
                </h3>
                <div className="space-y-2">
                  {(visitorStats?.browserStats || [])
                    .slice(0, 3)
                    .map((browser, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm text-gray-600">
                          {browser._id || "Unknown"}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {browser.count}
                        </span>
                      </div>
                    ))}
                  {(!visitorStats?.browserStats ||
                    visitorStats.browserStats.length === 0) && (
                    <p className="text-sm text-gray-500">No browser data yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Projects
            </h2>
          </div>
          <div className="p-6">
            {recentProjects.length > 0 ? (
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div
                    key={project._id}
                    className="flex items-center space-x-4"
                  >
                    {project.imageUrl && (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}${project.imageUrl}`}
                        alt={project.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {project.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {project.technologies.slice(0, 3).join(", ")}
                        {project.technologies.length > 3 && "..."}
                      </p>
                    </div>
                    {project.featured && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Featured
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No projects yet</p>
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Messages
            </h2>
          </div>
          <div className="p-6">
            {recentMessages.length > 0 ? (
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div
                    key={message._id}
                    className="border-l-4 border-blue-400 pl-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {message.name}
                      </p>
                      {!message.read && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{message.email}</p>
                    <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                      {message.message}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No messages yet</p>
            )}
          </div>
        </div>

        {/* Recent Visitors */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Visitors
            </h2>
          </div>
          <div className="p-6">
            {!visitorLoading && recentVisitors.length > 0 ? (
              <div className="space-y-4">
                {recentVisitors.map((visitor) => (
                  <div
                    key={visitor._id}
                    className="border-l-4 border-indigo-400 pl-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">
                          {visitor.city && visitor.country
                            ? `${visitor.city}, ${visitor.country}`
                            : visitor.country || "Unknown Location"}
                        </span>
                        {visitor.device && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {visitor.device}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 font-mono">
                      {visitor.pageVisited}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500">
                        {visitor.browser || "Unknown Browser"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(visitor.visitTimestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : visitorLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No visitors yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Quick Actions - Add Analytics */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <a
              href="/admin/projects/new"
              className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
            >
              <div className="p-2 bg-blue-500 rounded-lg group-hover:bg-blue-600 transition-colors">
                <FolderOpen className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Add Project</p>
                <p className="text-xs text-gray-500">Create new project</p>
              </div>
            </a>

            <a
              href="/admin/skills"
              className="flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
            >
              <div className="p-2 bg-purple-500 rounded-lg group-hover:bg-purple-600 transition-colors">
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Manage Skills
                </p>
                <p className="text-xs text-gray-500">Update your skills</p>
              </div>
            </a>

            <a
              href="/admin/experience"
              className="flex items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors group"
            >
              <div className="p-2 bg-orange-500 rounded-lg group-hover:bg-orange-600 transition-colors">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Add Experience
                </p>
                <p className="text-xs text-gray-500">Update work history</p>
              </div>
            </a>

            <a
              href="/admin/contact"
              className="flex items-center p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors group"
            >
              <div className="p-2 bg-red-500 rounded-lg group-hover:bg-red-600 transition-colors">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  View Messages
                </p>
                <p className="text-xs text-gray-500">Check contact form</p>
              </div>
            </a>

            {/* NEW: Analytics Quick Action */}
            <a
              href="/admin/analytics"
              className="flex items-center p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors group"
            >
              <div className="p-2 bg-indigo-500 rounded-lg group-hover:bg-indigo-600 transition-colors">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  View Analytics
                </p>
                <p className="text-xs text-gray-500">Visitor insights</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Enhanced Portfolio Overview with Visitor Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Portfolio Performance
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.featuredProjects}
                </div>
                <div className="text-sm text-gray-600">Featured Projects</div>
                <div className="text-xs text-gray-400 mt-1">
                  {stats.totalProjects > 0
                    ? `${Math.round(
                        (stats.featuredProjects / stats.totalProjects) * 100
                      )}% of total`
                    : "No projects yet"}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.unreadMessages}
                </div>
                <div className="text-sm text-gray-600">New Messages</div>
                <div className="text-xs text-gray-400 mt-1">
                  Requires attention
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {visitorLoading ? "..." : visitorStats?.totalVisits || 0}
                </div>
                <div className="text-sm text-gray-600">Total Visits</div>
                <div className="text-xs text-gray-400 mt-1">Last 7 days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">
                  {visitorLoading ? "..." : visitorStats?.uniqueVisitors || 0}
                </div>
                <div className="text-sm text-gray-600">Unique Visitors</div>
                <div className="text-xs text-gray-400 mt-1">Last 7 days</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Content Status
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Projects</span>
              <span
                className={`text-sm font-medium ${
                  stats.totalProjects > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stats.totalProjects > 0 ? "Active" : "Empty"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Skills</span>
              <span
                className={`text-sm font-medium ${
                  stats.totalSkills > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stats.totalSkills > 0 ? "Active" : "Empty"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Experience</span>
              <span
                className={`text-sm font-medium ${
                  stats.totalExperience > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stats.totalExperience > 0 ? "Active" : "Empty"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Messages</span>
              <span
                className={`text-sm font-medium ${
                  stats.unreadMessages === 0
                    ? "text-green-600"
                    : "text-orange-600"
                }`}
              >
                {stats.unreadMessages === 0
                  ? "All Read"
                  : `${stats.unreadMessages} Unread`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Analytics</span>
              <span
                className={`text-sm font-medium ${
                  !visitorLoading && visitorStats
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                {!visitorLoading && visitorStats ? "Active" : "Loading..."}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
