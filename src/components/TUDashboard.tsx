import React, { useState } from 'react';
import { Plus, Edit, Trash2, Send, FileText, Upload, X } from 'lucide-react';
import { Report, LAYANAN_OPTIONS, COORDINATORS } from '../types';

interface TUDashboardProps {
  reports: Report[];
  onCreateReport: (reportData: Omit<Report, 'id' | 'createdAt' | 'history' | 'progress'>) => void;
  onUpdateReport: (id: string, updates: Partial<Report>) => void;
  onForwardReport: (reportId: string, coordinators: string[]) => void;
}

const TUDashboard: React.FC<TUDashboardProps> = ({
  reports,
  onCreateReport,
  onUpdateReport,
  onForwardReport
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [forwardingReport, setForwardingReport] = useState<string | null>(null);
  const [selectedCoordinators, setSelectedCoordinators] = useState<string[]>([]);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  
  const [formData, setFormData] = useState({
    noSurat: '',
    hal: '',
    layanan: '',
    lembarDisposisi: {
      sifat: [] as string[],
      derajat: [] as string[],
      noAgenda: '',
      kelompokAsalSurat: '',
      agendaSestama: '',
      dari: '',
      tglAgenda: '',
      tanggalSurat: ''
    }
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const reportData = {
      ...formData,
      status: 'In Progress' as const,
      createdBy: 'Bagian TU',
      assignedCoordinators: [],
      assignedStaff: [],
      documents: []
    };

    if (editingReport) {
      onUpdateReport(editingReport.id, reportData);
    } else {
      onCreateReport(reportData);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      noSurat: '',
      hal: '',
      layanan: '',
      lembarDisposisi: {
        sifat: [],
        derajat: [],
        noAgenda: '',
        kelompokAsalSurat: '',
        agendaSestama: '',
        dari: '',
        tglAgenda: '',
        tanggalSurat: ''
      }
    });
    setEditingReport(null);
    setIsFormOpen(false);
  };

  const handleEdit = (report: Report) => {
    setEditingReport(report);
    setFormData({
      noSurat: report.noSurat,
      hal: report.hal,
      layanan: report.layanan,
      lembarDisposisi: report.lembarDisposisi
    });
    setIsFormOpen(true);
  };

  const handleForward = () => {
    if (forwardingReport && selectedCoordinators.length > 0) {
      onForwardReport(forwardingReport, selectedCoordinators);
      setForwardingReport(null);
      setSelectedCoordinators([]);
    }
  };

  const handleCheckboxChange = (field: 'sifat' | 'derajat', value: string) => {
    setFormData(prev => ({
      ...prev,
      lembarDisposisi: {
        ...prev.lembarDisposisi,
        [field]: prev.lembarDisposisi[field].includes(value)
          ? prev.lembarDisposisi[field].filter(item => item !== value)
          : [...prev.lembarDisposisi[field], value]
      }
    }));
  };

  const isFormValid = () => {
    return formData.noSurat && formData.hal && formData.layanan &&
           formData.lembarDisposisi.noAgenda && formData.lembarDisposisi.dari &&
           formData.lembarDisposisi.tglAgenda && formData.lembarDisposisi.tanggalSurat;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard TU</h1>
          <p className="text-gray-600 mt-1">Kelola laporan dan forward ke koordinator</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Laporan</span>
        </button>
      </div>

      {/* Reports Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
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
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Layanan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {report.noSurat}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {report.hal}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                  {report.layanan}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEdit(report)}
                    className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => setForwardingReport(report.id)}
                    disabled={report.assignedCoordinators.length > 0}
                    className="text-green-600 hover:text-green-900 inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4 mr-1" />
                    Forward
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Report Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto m-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                {editingReport ? 'Edit Laporan' : 'Buat Laporan Baru'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    No. Surat *
                  </label>
                  <input
                    type="text"
                    value={formData.noSurat}
                    onChange={(e) => setFormData({ ...formData, noSurat: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hal *
                  </label>
                  <input
                    type="text"
                    value={formData.hal}
                    onChange={(e) => setFormData({ ...formData, hal: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Layanan *
                </label>
                <select
                  value={formData.layanan}
                  onChange={(e) => setFormData({ ...formData, layanan: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Pilih Layanan</option>
                  {LAYANAN_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              {/* Lembar Disposisi */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Lembar Disposisi</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sifat</label>
                    <div className="space-y-2">
                      {['Biasa', 'Penting', 'Rahasia'].map((option) => (
                        <label key={option} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.lembarDisposisi.sifat.includes(option)}
                            onChange={() => handleCheckboxChange('sifat', option)}
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          />
                          <span className="ml-2 text-sm text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Derajat</label>
                    <div className="space-y-2">
                      {['Biasa', 'Segera', 'Kilat'].map((option) => (
                        <label key={option} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.lembarDisposisi.derajat.includes(option)}
                            onChange={() => handleCheckboxChange('derajat', option)}
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          />
                          <span className="ml-2 text-sm text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      No. Agenda *
                    </label>
                    <input
                      type="text"
                      value={formData.lembarDisposisi.noAgenda}
                      onChange={(e) => setFormData({
                        ...formData,
                        lembarDisposisi: { ...formData.lembarDisposisi, noAgenda: e.target.value }
                      })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kelompok Asal Surat
                    </label>
                    <input
                      type="text"
                      value={formData.lembarDisposisi.kelompokAsalSurat}
                      onChange={(e) => setFormData({
                        ...formData,
                        lembarDisposisi: { ...formData.lembarDisposisi, kelompokAsalSurat: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Agenda Sestama
                    </label>
                    <input
                      type="text"
                      value={formData.lembarDisposisi.agendaSestama}
                      onChange={(e) => setFormData({
                        ...formData,
                        lembarDisposisi: { ...formData.lembarDisposisi, agendaSestama: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dari *
                    </label>
                    <input
                      type="text"
                      value={formData.lembarDisposisi.dari}
                      onChange={(e) => setFormData({
                        ...formData,
                        lembarDisposisi: { ...formData.lembarDisposisi, dari: e.target.value }
                      })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tgl. Agenda *
                    </label>
                    <input
                      type="date"
                      value={formData.lembarDisposisi.tglAgenda}
                      onChange={(e) => setFormData({
                        ...formData,
                        lembarDisposisi: { ...formData.lembarDisposisi, tglAgenda: e.target.value }
                      })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal Surat *
                    </label>
                    <input
                      type="date"
                      value={formData.lembarDisposisi.tanggalSurat}
                      onChange={(e) => setFormData({
                        ...formData,
                        lembarDisposisi: { ...formData.lembarDisposisi, tanggalSurat: e.target.value }
                      })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unggah Berkas
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Klik untuk mengunggah atau drag & drop file</p>
                    <p className="text-xs text-gray-500 mt-1">PDF, DOC, JPG, PNG (Max 10MB)</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={!isFormValid()}
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingReport ? 'Update' : 'Simpan'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Forward Modal */}
      {forwardingReport && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Forward ke Koordinator
            </h3>
            
            <div className="space-y-3 mb-6">
              {COORDINATORS.map((coordinator) => (
                <label key={coordinator} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedCoordinators.includes(coordinator)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCoordinators([...selectedCoordinators, coordinator]);
                      } else {
                        setSelectedCoordinators(selectedCoordinators.filter(c => c !== coordinator));
                      }
                    }}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">{coordinator}</span>
                </label>
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleForward}
                disabled={selectedCoordinators.length === 0}
                className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Forward
              </button>
              <button
                onClick={() => {
                  setForwardingReport(null);
                  setSelectedCoordinators([]);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TUDashboard;