import { useState, useEffect } from 'react';
import { Report, WorkflowHistory } from '../types';

const SAMPLE_REPORTS: Report[] = [
  {
    id: 'RPT001',
    noSurat: '001/SDM/2025',
    hal: 'Pengangkatan PNS Atas Nama Budi Santoso',
    layanan: 'Layanan Pengangkatan PNS',
    status: 'In Progress',
    createdBy: 'Bagian TU',
    createdAt: '2025-01-15T08:00:00Z',
    assignedCoordinators: ['Suwarti, S.H'],
    assignedStaff: [],
    documents: [],
    lembarDisposisi: {
      sifat: ['Biasa'],
      derajat: ['Segera'],
      noAgenda: 'AG001/2025',
      kelompokAsalSurat: 'Kepegawaian',
      agendaSestama: 'AS001/2025',
      dari: 'Kabag Kepegawaian',
      tglAgenda: '2025-01-15',
      tanggalSurat: '2025-01-14'
    },
    progress: 0,
    history: [
      {
        id: 'H001',
        action: 'Report created by TU',
        actor: 'Bagian TU',
        timestamp: '2025-01-15T08:00:00Z'
      },
      {
        id: 'H002',
        action: 'Forwarded to Coordinator',
        actor: 'Bagian TU',
        timestamp: '2025-01-15T08:15:00Z'
      }
    ]
  },
  {
    id: 'RPT002',
    noSurat: '002/SDM/2025',
    hal: 'Kenaikan Pangkat Periode Januari 2025',
    layanan: 'Layanan Kenaikan Pangkat',
    status: 'Completed',
    createdBy: 'Bagian TU',
    createdAt: '2025-01-10T09:00:00Z',
    assignedCoordinators: ['Achamd Evianto'],
    assignedStaff: ['Budi Santoso', 'Sari Wijaya'],
    documents: [],
    lembarDisposisi: {
      sifat: ['Penting'],
      derajat: ['Biasa'],
      noAgenda: 'AG002/2025',
      kelompokAsalSurat: 'Kepegawaian',
      agendaSestama: 'AS002/2025',
      dari: 'Kabag Kepegawaian',
      tglAgenda: '2025-01-10',
      tanggalSurat: '2025-01-09'
    },
    progress: 100,
    history: [
      {
        id: 'H003',
        action: 'Report created by TU',
        actor: 'Bagian TU',
        timestamp: '2025-01-10T09:00:00Z'
      },
      {
        id: 'H004',
        action: 'Documents verified and assigned to staff',
        actor: 'Achamd Evianto',
        timestamp: '2025-01-10T10:30:00Z'
      },
      {
        id: 'H005',
        action: 'Task completed by staff',
        actor: 'Budi Santoso',
        timestamp: '2025-01-12T14:00:00Z'
      },
      {
        id: 'H006',
        action: 'Approved and sent back to TU',
        actor: 'Achamd Evianto',
        timestamp: '2025-01-12T16:00:00Z'
      }
    ]
  }
];

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>(SAMPLE_REPORTS);

  const createReport = (reportData: Omit<Report, 'id' | 'createdAt' | 'history' | 'progress'>) => {
    const newReport: Report = {
      ...reportData,
      id: `RPT${String(reports.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      progress: 0,
      history: [
        {
          id: `H${Date.now()}`,
          action: 'Report created by TU',
          actor: reportData.createdBy,
          timestamp: new Date().toISOString()
        }
      ]
    };
    setReports(prev => [...prev, newReport]);
    return newReport;
  };

  const updateReport = (id: string, updates: Partial<Report>) => {
    setReports(prev => prev.map(report => 
      report.id === id ? { ...report, ...updates } : report
    ));
  };

  const addHistoryEntry = (reportId: string, entry: Omit<WorkflowHistory, 'id' | 'timestamp'>) => {
    const historyEntry: WorkflowHistory = {
      ...entry,
      id: `H${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, history: [...report.history, historyEntry] }
        : report
    ));
  };

  const getReportById = (id: string): Report | undefined => {
    return reports.find(report => report.id === id);
  };

  const getReportsByRole = (role: string, userId: string) => {
    switch (role) {
      case 'TU':
        return reports.filter(report => report.createdBy === userId || report.createdBy === 'Bagian TU');
      case 'Coordinator':
        return reports.filter(report => report.assignedCoordinators.includes(userId));
      case 'Staff':
        return reports.filter(report => report.assignedStaff.includes(userId));
      default:
        return reports;
    }
  };

  return {
    reports,
    createReport,
    updateReport,
    addHistoryEntry,
    getReportById,
    getReportsByRole
  };
};