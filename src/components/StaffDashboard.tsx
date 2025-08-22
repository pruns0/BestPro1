import React, { useState } from 'react';
import { CheckCircle, FileText, Send, Eye } from 'lucide-react';
import { Report, Task } from '../types';

interface StaffDashboardProps {
  reports: Report[];
  currentUser: { name: string };
  onUpdateReport: (id: string, updates: Partial<Report>) => void;
  onAddHistory: (reportId: string, entry: { action: string; actor: string; notes?: string }) => void;
}

const StaffDashboard: React.FC<StaffDashboardProps> = ({
  reports,
  currentUser,
  onUpdateReport,
  onAddHistory
}) => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const staffReports = reports.filter(report => 
    report.assignedStaff.includes(currentUser.name)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
      case 'Assigned to Staff':
        return 'bg-yellow-100 text-yellow-800';
      case 'Revision':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserTask = (report: Report): Task | undefined => {
    return report.tasks?.find(task => task.staffId === currentUser.name);
  };

  const handleTaskComplete = (reportId: string, taskId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report || !report.tasks) return;

    const updatedTasks = report.tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: true, completedAt: new Date().toISOString() }
        : task
    );

    // Calculate progress
    const completedTasks = updatedTasks.filter(task => task.completed).length;
    const progress = (completedTasks / updatedTasks.length) * 100;

    onUpdateReport(reportId, {
      tasks: updatedTasks,
      progress,
      status: progress === 100 ? 'Completed' : 'Assigned to Staff'
    });

    onAddHistory(reportId, {
      action: `Task completed by ${currentUser.name}`,
      actor: currentUser.name
    });
  };

  const handleSendToCoordinator = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    onAddHistory(reportId, {
      action: `Work sent back to coordinator by ${currentUser.name}`,
      actor: currentUser.name
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (selectedReport) {
    const userTask = getUserTask(selectedReport);
    
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <button
            onClick={() => setSelectedReport(null)}
            className="text-indigo-600 hover:text-indigo-800 mb-4"
          >
            ← Kembali ke Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{selectedReport.noSurat}</h1>
          <p className="text-gray-600 mt-1">{selectedReport.hal}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Task Details */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detail Tugas</h3>
            
            <div className="space-y-3 mb-6">
              <div>
                <span className="text-sm font-medium text-gray-500">Layanan:</span>
                <p className="text-gray-900">{selectedReport.layanan}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Status:</span>
                <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedReport.status)}`}>
                  {selectedReport.status}
                </span>
              </div>
            </div>

            {userTask && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Daftar To-Do:</h4>
                <div className="space-y-2">
                  {userTask.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={userTask.completed}
                        onChange={() => !userTask.completed && handleTaskComplete(selectedReport.id, userTask.id)}
                        disabled={userTask.completed}
                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                      <span className={`text-sm ${userTask.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Progress Tugas:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {userTask.completed ? '100%' : '0%'}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: userTask.completed ? '100%' : '0%' }}
                      ></div>
                    </div>
                  </div>
                </div>

                {userTask.completed && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Tugas Selesai</span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      Diselesaikan pada {formatDate(userTask.completedAt!)}
                    </p>
                  </div>
                )}
              </div>
            )}

            {selectedReport.notes && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Catatan Koordinator:</h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                  {selectedReport.notes}
                </p>
              </div>
            )}

            {selectedReport.revisionNotes && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Catatan Revisi:</h4>
                <p className="text-sm text-red-700 bg-red-50 p-3 rounded-md">
                  {selectedReport.revisionNotes}
                </p>
              </div>
            )}
          </div>

          {/* Documents */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dokumen Terkait</h3>
            
            {selectedReport.documents.length > 0 ? (
              <div className="space-y-3">
                {selectedReport.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">Diunggah pada {formatDate(doc.uploadedAt)}</p>
                      </div>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Belum ada dokumen yang diunggah.</p>
            )}

            {userTask && userTask.completed && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => handleSendToCoordinator(selectedReport.id)}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim ke Koordinator</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Staff</h1>
        <p className="text-gray-600 mt-1">Kelola dan selesaikan tugas yang diberikan</p>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No. Surat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tugas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {staffReports.map((report) => {
              const userTask = getUserTask(report);
              return (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {report.noSurat}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {userTask ? `${userTask.items.length} item tugas` : 'Tidak ada tugas'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      userTask?.completed ? 'bg-green-100 text-green-800' : getStatusColor(report.status)
                    }`}>
                      {userTask?.completed ? 'Selesai' : 'Belum Selesai'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {userTask?.completed ? '100%' : '0%'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Lihat
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffDashboard;