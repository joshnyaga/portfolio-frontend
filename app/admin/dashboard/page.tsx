'use client';

import { useState, useEffect } from 'react';
import { projectService } from '@/services/projectService';
import { skillService } from '@/services/skillService';
import { experienceService } from '@/services/experienceService';
import { contactService } from '@/services/contactService';
import { Project, Skill, Experience, ContactMessage } from '@/lib/types';
import { FolderOpen, Wrench, Briefcase, Mail, TrendingUp, Eye } from 'lucide-react';

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
    featuredProjects: 0
  });
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [projects, skills, experience, messages] = await Promise.all([
          projectService.getAll(),
          skillService.getAll(),
          experienceService.getAll(),
          contactService.getAll()
        ]);

        setStats({
          totalProjects: projects.length,
          totalSkills: skills.length,
          totalExperience: experience.length,
          unreadMessages: messages.filter(msg => !msg.read).length,
          featuredProjects: projects.filter(p => p.featured).length
        });

        setRecentProjects(projects.slice(0, 3));
        setRecentMessages(messages.slice(0, 3));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    { name: 'Total Projects', value: stats.totalProjects, icon: FolderOpen, color: 'bg-blue-500' },
    { name: 'Featured Projects', value: stats.featuredProjects, icon: TrendingUp, color: 'bg-green-500' },
    { name: 'Skills', value: stats.totalSkills, icon: Wrench, color: 'bg-purple-500' },
    { name: 'Experience', value: stats.totalExperience, icon: Briefcase, color: 'bg-orange-500' },
    { name: 'Unread Messages', value: stats.unreadMessages, icon: Mail, color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your portfolio</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
          </div>
          <div className="p-6">
            {recentProjects.length > 0 ? (
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div key={project._id} className="flex items-center space-x-4">
                    {project.imageUrl && (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}${project.imageUrl}`}
                        alt={project.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{project.title}</h3>
                      <p className="text-xs text-gray-500">
                        {project.technologies.slice(0, 3).join(', ')}
                        {project.technologies.length > 3 && '...'}
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
            <h2 className="text-lg font-semibold text-gray-900">Recent Messages</h2>
          </div>
          <div className="p-6">
            {recentMessages.length > 0 ? (
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div key={message._id} className="border-l-4 border-blue-400 pl-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{message.name}</p>
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
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <p className="text-sm font-medium text-gray-900">Manage Skills</p>
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
                <p className="text-sm font-medium text-gray-900">Add Experience</p>
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
                <p className="text-sm font-medium text-gray-900">View Messages</p>
                <p className="text-xs text-gray-500">Check contact form</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Portfolio Performance</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.featuredProjects}</div>
                <div className="text-sm text-gray-600">Featured Projects</div>
                <div className="text-xs text-gray-400 mt-1">
                  {stats.totalProjects > 0 
                    ? `${Math.round((stats.featuredProjects / stats.totalProjects) * 100)}% of total` 
                    : 'No projects yet'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.unreadMessages}</div>
                <div className="text-sm text-gray-600">New Messages</div>
                <div className="text-xs text-gray-400 mt-1">
                  Requires attention
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Content Status</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Projects</span>
              <span className={`text-sm font-medium ${stats.totalProjects > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.totalProjects > 0 ? 'Active' : 'Empty'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Skills</span>
              <span className={`text-sm font-medium ${stats.totalSkills > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.totalSkills > 0 ? 'Active' : 'Empty'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Experience</span>
              <span className={`text-sm font-medium ${stats.totalExperience > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.totalExperience > 0 ? 'Active' : 'Empty'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Messages</span>
              <span className={`text-sm font-medium ${stats.unreadMessages === 0 ? 'text-green-600' : 'text-orange-600'}`}>
                {stats.unreadMessages === 0 ? 'All Read' : `${stats.unreadMessages} Unread`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}