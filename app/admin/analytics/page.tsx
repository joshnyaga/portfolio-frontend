"use client";

import React, { useState } from "react";
import {
  useVisitorAnalytics,
  useVisitorStats,
} from "@/hooks/useVisitorAnalytics";
import {
  Eye,
  Users,
  Calendar,
  Globe,
  Monitor,
  Clock,
  TrendingUp,
  MapPin,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";

// Stats Card Component
const StatsCard = ({
  title,
  value,
  icon: Icon,
  color = "blue",
  subtitle,
}: {
  title: string;
  value: string | number;
  icon: any;
  color?: string;
  subtitle?: string;
}) => {
  const colorClasses = {
    blue: "bg-blue-500 text-blue-100",
    green: "bg-green-500 text-green-100",
    purple: "bg-purple-500 text-purple-100",
    orange: "bg-orange-500 text-orange-100",
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div
          className={`p-3 rounded-lg ${
            colorClasses[color as keyof typeof colorClasses]
          }`}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

// Chart Component (Simple Bar Chart)
const SimpleBarChart = ({
  data,
  title,
}: {
  data: Array<{ _id: string; count: number }>;
  title: string;
}) => {
  const maxCount = Math.max(...data.map((item) => item.count));

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.slice(0, 10).map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-24 text-sm text-gray-600 truncate">
              {item._id || "Unknown"}
            </div>
            <div className="flex-1 mx-3">
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(item.count / maxCount) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div className="w-12 text-right text-sm font-medium text-gray-900">
              {item.count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Dashboard Component
export default function VisitorAnalyticsDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState(30);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    pageFilter: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const { stats, loading: statsLoading } = useVisitorStats(dateRange);
  const {
    visitors,
    pagination,
    loading: visitorsLoading,
    refetch,
  } = useVisitorAnalytics(currentPage, filters);

  const handleExport = async () => {
    try {
      const response = await fetch("/api/admin/visitors/export", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `visitor-analytics-${
          new Date().toISOString().split("T")[0]
        }.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const applyFilters = () => {
    setCurrentPage(1);
    refetch();
  };

  const resetFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      pageFilter: "",
    });
    setCurrentPage(1);
  };

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Visitor Analytics
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and analyze your portfolio visitors
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(Number(e.target.value))}
            className="rounded-md border-gray-300 text-sm"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
          <button
            onClick={handleExport}
            className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value })
                }
                className="w-full rounded-md border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
                className="w-full rounded-md border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Page Filter
              </label>
              <input
                type="text"
                placeholder="e.g., /projects"
                value={filters.pageFilter}
                onChange={(e) =>
                  setFilters({ ...filters, pageFilter: e.target.value })
                }
                className="w-full rounded-md border-gray-300 text-sm"
              />
            </div>
          </div>
          <div className="mt-4 flex space-x-3">
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Apply Filters
            </button>
            <button
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Visits"
            value={stats.totalVisits.toLocaleString()}
            icon={Eye}
            color="blue"
            subtitle={`Last ${stats.period}`}
          />
          <StatsCard
            title="Unique Visitors"
            value={stats.uniqueVisitors.toLocaleString()}
            icon={Users}
            color="green"
            subtitle="Based on IP hash"
          />
          <StatsCard
            title="Today's Visits"
            value={stats.todayVisits.toLocaleString()}
            icon={Calendar}
            color="purple"
            subtitle={new Date().toLocaleDateString()}
          />
          <StatsCard
            title="Avg. Daily Visits"
            value={Math.round(
              stats.totalVisits / parseInt(stats.period.split(" ")[0])
            ).toLocaleString()}
            icon={TrendingUp}
            color="orange"
            subtitle="Calculated average"
          />
        </div>
      )}

      {/* Charts Section */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <SimpleBarChart data={stats.popularPages} title="Popular Pages" />
          <SimpleBarChart data={stats.topCountries} title="Top Countries" />
          <SimpleBarChart data={stats.browserStats} title="Browser Usage" />
        </div>
      )}

      {/* Daily Visits Chart */}
      {stats && stats.dailyVisits.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Daily Visits Trend
          </h3>
          <div className="h-64 flex items-end justify-between space-x-1">
            {stats.dailyVisits.map((day, index) => {
              const maxVisits = Math.max(
                ...stats.dailyVisits.map((d) => d.count)
              );
              const height = (day.count / maxVisits) * 100;
              const date = new Date(
                day._id.year,
                day._id.month - 1,
                day._id.day
              );

              return (
                <div
                  key={index}
                  className="flex flex-col items-center group relative"
                >
                  <div
                    className="bg-blue-500 rounded-t w-3 transition-all duration-200 hover:bg-blue-600"
                    style={{ height: `${height}%`, minHeight: "2px" }}
                  />
                  <div className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-center whitespace-nowrap">
                    {date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                    {day.count} visits on {date.toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Visitor Details Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Visitors
            </h3>
            <button
              onClick={refetch}
              className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </button>
          </div>
        </div>

        {visitorsLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        ) : visitors.length === 0 ? (
          <div className="text-center py-12">
            <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No visitors found
            </h3>
            <p className="text-gray-500">
              No visitor data matches your current filters.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visitor Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Page Visited
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Technology
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visit Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {visitors.map((visitor) => (
                    <tr key={visitor._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <Users className="h-4 w-4 text-gray-600" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {visitor.hashedIp.substring(0, 8)}...
                            </div>
                            <div className="text-sm text-gray-500">
                              {visitor.device || "Unknown Device"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm text-gray-900">
                              {visitor.city
                                ? `${visitor.city}, ${visitor.country}`
                                : visitor.country || "Unknown"}
                            </div>
                            {visitor.region && (
                              <div className="text-xs text-gray-500">
                                {visitor.region}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-mono">
                          {visitor.pageVisited}
                        </div>
                        {visitor.referer && (
                          <div className="text-xs text-gray-500 truncate max-w-xs">
                            From: {new URL(visitor.referer).hostname}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">
                            {visitor.browser || "Unknown Browser"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {visitor.os || "Unknown OS"}
                          </div>
                          {visitor.screenResolution && (
                            <div className="text-xs text-gray-500">
                              {visitor.screenResolution}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm text-gray-900">
                              {new Date(
                                visitor.visitTimestamp
                              ).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(
                                visitor.visitTimestamp
                              ).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {visitor.timeOnPage ? (
                            <div className="text-sm text-gray-900">
                              {visitor.timeOnPage < 60
                                ? `${visitor.timeOnPage}s`
                                : `${Math.floor(visitor.timeOnPage / 60)}m ${
                                    visitor.timeOnPage % 60
                                  }s`}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-400">-</div>
                          )}
                          {visitor.exitPage && (
                            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Exit
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="bg-white px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={!pagination.hasPrevPage}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, pagination.totalPages)
                      )
                    }
                    disabled={!pagination.hasNextPage}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">
                        {(pagination.currentPage - 1) * 50 + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(
                          pagination.currentPage * 50,
                          pagination.totalVisitors
                        )}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">
                        {pagination.totalVisitors}
                      </span>{" "}
                      results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={!pagination.hasPrevPage}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>

                      {/* Page Numbers */}
                      {Array.from(
                        { length: Math.min(5, pagination.totalPages) },
                        (_, i) => {
                          const pageNum =
                            Math.max(1, pagination.currentPage - 2) + i;
                          if (pageNum > pagination.totalPages) return null;

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                pageNum === pagination.currentPage
                                  ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                  : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}

                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, pagination.totalPages)
                          )
                        }
                        disabled={!pagination.hasNextPage}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
