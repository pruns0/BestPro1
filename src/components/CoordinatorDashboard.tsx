import React, { useState } from 'react';
import { Filter, Eye, CheckCircle, XCircle, ArrowLeft, FileText, Users } from 'lucide-react';
import { Report, LAYANAN_OPTIONS, DOCUMENT_REQUIREMENTS, STAFF_MEMBERS, TODO_ITEMS } from '../types';

interface CoordinatorDashboardProps {
  reports: Report[];
  currentUser: { name: string };
  onUpdateReport: (id: string, updates: Partial<Report>) => void;
  onAddHistory: (reportId: string, entry: { action: string; actor: string; notes?: string }) => void;
}

const CoordinatorDashboard: React.FC<CoordinatorDashboardProps> = ({
  reports,
  currentUser,
  onUpdateReport,
  onAddHistory
}) => {
  const [selectedService, setSelectedService] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [documentVerification, setDocumentVerification] = useState<Record<string, 'Ada' | 'Tidak Ada'>>({});
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [taskNotes, setTaskNotes] = useState('');
  const [revisionNotes, setRevisionNotes] = useState('');

  const coordinatorReports = reports.filter(report => 
    report.assignedCoordinators.includes(currentUser.name)
  );

  const filteredReports = selectedService
    ? coordinatorReports.filter(report => report.layanan === selectedService)
    : coordinatorReports;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
      case 'Assigned to Staff':
      case 'Document Verification':
        return 'bg-yellow-100 text-yellow-800';
      case 'Revision':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    
    // Initialize document verification if it exists, or create new one
    if (report.documentVerification) {
      setDocumentVerification(report.documentVerification);
    } else {
      const requirements = DOCUMENT_REQUIREMENTS[report.layanan] || [];
      const initialVerification: Record<string, 'Ada' | 'Tidak Ada'> = {};
      requirements.forEach(doc => {
        initialVerification[doc] = 'Tidak Ada';
      });
      setDocumentVerification(initialVerification);
    }
  };

  const handleDocumentVerificationChange = (document: string, status: 'Ada' | 'Tidak Ada') => {
    setDocumentVerification(prev => ({
      ...prev,
      [document]: status
    }));
  };

  const allDocumentsAvailable = () => {
    return Object.values(documentVerification).every(status => status === 'Ada');
  };

  const handleAssignToStaff = () => {
    if (!selectedReport || selectedStaff.length === 0 || selectedTasks.length === 0) return;

    const updates = {
      documentVerification,
      assignedStaff: selectedStaff,
      tasks: selectedStaff.map(staffId => ({
        id: `${selectedReport.id}_${staffId}_${Date.now()}`,
        staffId,
        items: selectedTasks,
        completed: false
      })),
      notes: taskNotes,
      status: 'Assigned to Staff' as const
    };

    onUpdateReport(selectedReport.id, updates);
    onAddHistory(selectedReport.id, {
      action: `Documents verified and assigned to ${selectedStaff.length} staff member(s)`,
      actor: currentUser.name,
      notes: taskNotes
    });

    // Reset form
    setSelectedStaff([]);
    setSelectedTasks([]);
    setTaskNotes('');
    setSelectedReport(null);
  };

  const handleApprove = () => {
    if (!selectedReport) return;

    onUpdateReport(selectedReport.id, {
      status: 'Completed',
      progress: 100
    });
    onAddHistory(selectedReport.id, {
      action: 'Approved and completed',
      actor: currentUser.name
    });
    setSelectedReport(null);
  };

  const handleRevise = () => {
    if (!selectedReport || !revisionNotes) return;

    onUpdateReport(selectedReport.id, {
      status: 'Revision',
      revisionNotes,
      progress: 0
    });
    onAddHistory(selectedReport.id, {
      action: 'Sent for revision',
      actor: currentUser.name,
      notes: revisionNotes
    });
    setRevisionNotes('');
    setSelectedReport(null);
  };

  const handleReturnToTU = () => {
    if (!selectedReport) return;

    onUpdateReport(selectedReport.id, {
      status: 'Revision',
      progress: 0
    });
    onAddHistory(selectedReport.id, {
      action: 'Returned to TU - incomplete documents',
      actor: currentUser.name
    });
    setSelectedReport(null);
  };

  if (selectedReport) {
    const requiredDocuments = DOCUMENT_REQUIREMENTS[selectedReport.layanan] || [];
    
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <button
            onClick={() => setSelectedReport(null)}
            className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{selectedReport.noSurat}</h1>
          <p className="text-gray-600 mt-1">{selectedReport.hal}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Report Details */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detail Laporan</h3>
            <div className="space-y-3">
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
              <div>
                <span className="text-sm font-medium text-gray-500">Progress:</span>
                <div className="mt-1">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${selectedReport.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{selectedReport.progress}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lembar Disposisi */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Lembar Disposisi</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-500">Sifat:</span>
                  <p>{selectedReport.lembarDisposisi.sifat.join(', ')}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Derajat:</span>
                  <p>{selectedReport.lembarDisposisi.derajat.join(', ')}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">No. Agenda:</span>
                  <p>{selectedReport.lembarDisposisi.noAgenda}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Dari:</span>
                  <p>{selectedReport.lembarDisposisi.dari}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Document Verification */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Verifikasi Dokumen</h3>
            {requiredDocuments.length > 0 ? (
              <div className="space-y-3">
                {requiredDocuments.map((document) => (
                  <div key={document} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 flex-1">{document}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDocumentVerificationChange(document, 'Ada')}
                        className={`px-3 py-1 text-xs rounded-full ${
                          documentVerification[document] === 'Ada'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600 hover:bg-green-50'
                        }`}
                      >
                        Ada
                      </button>
                      <button
                        onClick={() => handleDocumentVerificationChange(document, 'Tidak Ada')}
                        className={`px-3 py-1 text-xs rounded-full ${
                          documentVerification[document] === 'Tidak Ada'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-600 hover:bg-red-50'
                        }`}
                      >
                        Tidak Ada
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Tidak ada dokumen yang diperlukan untuk layanan ini.</p>
            )}

            {/* Assignment Form - Only show if all documents are available */}
            {allDocumentsAvailable() && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Penugasan Staff</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pilih Staff:
                    </label>
                    <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
                      {STAFF_MEMBERS.map((staff) => (
                        <label key={staff} className="flex items-center py-1">
                          <input
                            type="checkbox"
                            checked={selectedStaff.includes(staff)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedStaff([...selectedStaff, staff]);
                              } else {
                                setSelectedStaff(selectedStaff.filter(s => s !== staff));
                              }
                            }}
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          />
                          <span className="ml-2 text-sm text-gray-700">{staff}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Daftar To-Do:
                    </label>
                    <div className="space-y-2">
                      {TODO_ITEMS.map((item) => (
                        <label key={item} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedTasks.includes(item)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedTasks([...selectedTasks, item]);
                              } else {
                                setSelectedTasks(selectedTasks.filter(t => t !== item));
                              }
                            }}
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          />
                          <span className="ml-2 text-sm text-gray-700">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Catatan:
                    </label>
                    <textarea
                      value={taskNotes}
                      onChange={(e) => setTaskNotes(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Tambahkan catatan untuk staff..."
                    />
                  </div>

                  <button
                    onClick={handleAssignToStaff}
                    disabled={selectedStaff.length === 0 || selectedTasks.length === 0}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <Users className="w-4 h-4" />
                    <span>Tugaskan ke Staff</span>
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
              {selectedReport.progress === 100 && (
                <button
                  onClick={handleApprove}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Setujui & Kirim ke TU</span>
                </button>
              )}
              
              {selectedReport.status === 'Assigned to Staff' && (
                <div className="space-y-2">
                  <textarea
                    value={revisionNotes}
                    onChange={(e) => setRevisionNotes(e.target.value)}
                    placeholder="Catatan revisi..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                  />
                  <button
                    onClick={handleRevise}
                    disabled={!revisionNotes}
                    className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Revisi & Kirim Kembali ke Staff</span>
                  </button>
                </div>
              )}

              <button
                onClick={handleReturnToTU}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembalikan ke TU</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Koordinator</h1>
          <p className="text-gray-600 mt-1">Verifikasi dokumen dan tugaskan kepada staff</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Semua Layanan</option>
              {LAYANAN_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No. Surat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pengirim (TU)
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
            {filteredReports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {report.noSurat}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {report.hal}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {report.createdBy}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 w-16">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${report.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs">{report.progress}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleViewReport(report)}
                    className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Lihat
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;