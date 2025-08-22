import React, { useState } from 'react';
import { Search, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Report } from '../types';

interface PublicTrackingProps {
  reports: Report[];
}

const PublicTracking: React.FC<PublicTrackingProps> = ({ reports }) => {
  const [letterNumber, setLetterNumber] = useState('');
  const [searchResult, setSearchResult] = useState<Report | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setNotFound(false);
    setSearchResult(null);

    const report = reports.find(r => r.noSurat.toLowerCase().includes(letterNumber.toLowerCase()));
    if (report) {
      setSearchResult(report);
    } else {
      setNotFound(true);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'In Progress':
      case 'Assigned to Staff':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'Revision':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Lacak Status Surat</h1>
          <p className="text-gray-600">Masukkan nomor surat untuk melacak status dan riwayat perjalanan surat Anda</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="flex space-x-4">
            <div className="flex-1">
              <input
                type="text"
                value={letterNumber}
                onChange={(e) => setLetterNumber(e.target.value)}
                placeholder="Masukkan nomor surat (contoh: 001/SDM/2025)"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>Lacak</span>
            </button>
          </form>
        </div>

        {notFound && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 mb-2">Surat Tidak Ditemukan</h3>
            <p className="text-red-600">Nomor surat yang Anda masukkan tidak ditemukan dalam sistem. Pastikan nomor surat sudah benar.</p>
          </div>
        )}

        {searchResult && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{searchResult.noSurat}</h3>
                  <p className="text-gray-600 mt-1">{searchResult.hal}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(searchResult.status)}
                  <span className="font-medium text-gray-900">{searchResult.status}</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Layanan</h4>
                  <p className="mt-1 text-gray-900">{searchResult.layanan}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Progress</h4>
                  <div className="mt-1">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${searchResult.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{searchResult.progress}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Riwayat Perjalanan Surat</h4>
                <div className="space-y-4">
                  {searchResult.history.map((entry, index) => (
                    <div key={entry.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'
                        }`}>
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900">{entry.action}</div>
                        <div className="text-sm text-gray-500">oleh {entry.actor}</div>
                        <div className="text-xs text-gray-400 mt-1">{formatDate(entry.timestamp)}</div>
                        {entry.notes && (
                          <div className="text-sm text-gray-600 mt-1 italic">{entry.notes}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Untuk informasi lebih lanjut, silakan hubungi bagian administrasi
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicTracking;