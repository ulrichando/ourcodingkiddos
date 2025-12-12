"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../../../../components/admin/AdminLayout";
import { Activity, CheckCircle, AlertCircle, Database, Globe, Server, Zap, Clock } from "lucide-react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';


type ServiceStatus = "operational" | "degraded" | "down";



type Service = {
  name: string;
  status: ServiceStatus;
  responseTime: number;
  uptime: number;
  lastChecked: string;
  icon: any;
};

export default function HealthMonitorPage() {
  const [services, setServices] = useState<Service[]>([
    {
      name: "Database",
      status: "operational",
      responseTime: 12,
      uptime: 99.99,
      lastChecked: new Date().toISOString(),
      icon: Database,
    },
    {
      name: "API Server",
      status: "operational",
      responseTime: 45,
      uptime: 99.95,
      lastChecked: new Date().toISOString(),
      icon: Server,
    },
    {
      name: "Authentication",
      status: "operational",
      responseTime: 89,
      uptime: 99.98,
      lastChecked: new Date().toISOString(),
      icon: Zap,
    },
    {
      name: "External APIs",
      status: "operational",
      responseTime: 234,
      uptime: 99.87,
      lastChecked: new Date().toISOString(),
      icon: Globe,
    },
  ]);

  const [systemMetrics, setSystemMetrics] = useState({
    cpu: 23,
    memory: 45,
    disk: 67,
    network: 12,
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setSystemMetrics({
        cpu: Math.floor(Math.random() * 40) + 10,
        memory: Math.floor(Math.random() * 30) + 40,
        disk: Math.floor(Math.random() * 20) + 60,
        network: Math.floor(Math.random() * 20) + 5,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: ServiceStatus) => {
    switch (status) {
      case "operational":
        return "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20";
      case "degraded":
        return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20";
      case "down":
        return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
    }
  };

  const getStatusIcon = (status: ServiceStatus) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case "degraded":
        return <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case "down":
        return <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
    }
  };

  const allOperational = services.every((s) => s.status === "operational");

  return (
    <AdminLayout>
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Admin / System</p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Health Monitor</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Monitor system health, service status, and performance metrics in real-time
          </p>
        </div>

        {/* Overall Status */}
        <div
          className={`rounded-xl p-6 border ${
            allOperational
              ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
              : "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
          }`}
        >
          <div className="flex items-center gap-3">
            {allOperational ? (
              <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            )}
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {allOperational ? "All Systems Operational" : "Some Services Degraded"}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Last updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Services Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.name}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <Icon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100">{service.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Response: {service.responseTime}ms
                        </p>
                      </div>
                    </div>
                    {getStatusIcon(service.status)}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Status</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          service.status
                        )} capitalize`}
                      >
                        {service.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Uptime</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {service.uptime}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Last Check</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(service.lastChecked).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Metrics */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">System Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">CPU Usage</span>
                <Activity className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                {systemMetrics.cpu}%
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${systemMetrics.cpu}%` }}
                />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Memory</span>
                <Activity className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                {systemMetrics.memory}%
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-purple-500 transition-all duration-500"
                  style={{ width: `${systemMetrics.memory}%` }}
                />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Disk Usage</span>
                <Activity className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                {systemMetrics.disk}%
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-500"
                  style={{ width: `${systemMetrics.disk}%` }}
                />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Network</span>
                <Activity className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                {systemMetrics.network}%
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${systemMetrics.network}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Incident History */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Recent Incidents</h2>
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <CheckCircle className="w-12 h-12 mx-auto mb-2 text-emerald-500" />
            <p className="text-sm">No incidents in the past 30 days</p>
          </div>
        </div>
      </main>
    </AdminLayout>
  );
}
