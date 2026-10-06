import React, { useState, useMemo } from 'react';
import { useApp } from '../store/AppContext';
import { EmissionRecord } from '../types';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { 
  Search, 
  Download, 
  Trash2, 
  Edit3, 
  Eye, 
  Car, 
  Zap, 
  Flame, 
  Package, 
  ChevronLeft, 
  ChevronRight, 
  Plus 
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { records, deleteEmissionRecord, updateEmissionRecord, setCurrentPage, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [minEmission, setMinEmission] = useState<string>('');
  const [maxEmission, setMaxEmission] = useState<string>('');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const itemsPerPage = 8;

  // Modals state
  const [viewRecord, setViewRecord] = useState<EmissionRecord | null>(null);
  const [editRecord, setEditRecord] = useState<EmissionRecord | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Edit form state
  const [editActivity, setEditActivity] = useState('');
  const [editQuantity, setEditQuantity] = useState(0);
  const [editCO2, setEditCO2] = useState(0);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter(rec => {
      // Search
      const matchesSearch =
        rec.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (rec.notes && rec.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category
      const matchesCategory = selectedCategory === 'all' || rec.category === selectedCategory;

      // Min / Max
      const matchesMin = minEmission === '' || rec.co2Emission >= Number(minEmission);
      const matchesMax = maxEmission === '' || rec.co2Emission <= Number(maxEmission);

      return matchesSearch && matchesCategory && matchesMin && matchesMax;
    });
  }, [records, searchQuery, selectedCategory, minEmission, maxEmission]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / itemsPerPage));
  const paginatedRecords = filteredRecords.slice(
    (currentPageNum - 1) * itemsPerPage,
    currentPageNum * itemsPerPage
  );

  const categoryIcons = {
    transport: <Car className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
    electricity: <Zap className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />,
    fuel: <Flame className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />,
    other: <Package className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />,
  };

  // CSV Export
  const handleExportCSV = () => {
    if (records.length === 0) {
      showToast('No records available to export', 'warning');
      return;
    }
    const headers = ['Date', 'Category', 'Activity', 'Quantity', 'Unit', 'EmissionFactor', 'CO2_kg', 'Notes'];
    const rows = records.map(r => [
      r.date,
      r.category,
      `"${r.activity.replace(/"/g, '""')}"`,
      r.quantity,
      r.unit,
      r.emissionFactor,
      r.co2Emission,
      `"${(r.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `carbonwise_emissions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV export downloaded', 'success');
  };

  const openEditModal = (rec: EmissionRecord) => {
    setEditRecord(rec);
    setEditActivity(rec.activity);
    setEditQuantity(rec.quantity);
    setEditCO2(rec.co2Emission);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editRecord) return;
    await updateEmissionRecord(editRecord.id, {
      activity: editActivity,
      quantity: Number(editQuantity),
      co2Emission: Number(editCO2),
    });
    setEditRecord(null);
  };

  const handleDelete = async (id: string) => {
    await deleteEmissionRecord(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Emission History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Audit trail of all tracked activities with verified emission factors
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#11192d] hover:bg-slate-50 dark:hover:bg-[#162038] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setCurrentPage('calculator')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Entry</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#0b1120] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-4 shadow-xs space-y-3 transition-colors">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search activity..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPageNum(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 bg-white dark:bg-[#11192d] placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={e => {
                setSelectedCategory(e.target.value);
                setCurrentPageNum(1);
              }}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 bg-white dark:bg-[#11192d] focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All Categories</option>
              <option value="transport">Transport</option>
              <option value="electricity">Electricity</option>
              <option value="fuel">Fuel</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Min Emission */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 dark:text-slate-500">Min:</span>
            <input
              type="number"
              placeholder="0 kg"
              value={minEmission}
              onChange={e => {
                setMinEmission(e.target.value);
                setCurrentPageNum(1);
              }}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 bg-white dark:bg-[#11192d] focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Max Emission */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 dark:text-slate-500">Max:</span>
            <input
              type="number"
              placeholder="Max kg"
              value={maxEmission}
              onChange={e => {
                setMaxEmission(e.target.value);
                setCurrentPageNum(1);
              }}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 bg-white dark:bg-[#11192d] focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <span>
            Showing <strong className="text-slate-800 dark:text-slate-200">{filteredRecords.length}</strong> recorded activities
          </span>
          {(searchQuery || selectedCategory !== 'all' || minEmission || maxEmission) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setMinEmission('');
                setMaxEmission('');
              }}
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Main Table / Mobile Cards */}
      {filteredRecords.length === 0 ? (
        <EmptyState
          title="No matching activities found"
          description="Try broadening your search filters, or calculate a new emission event."
          actionText="Log New Activity"
          onAction={() => setCurrentPage('calculator')}
        />
      ) : (
        <div className="bg-white dark:bg-[#0b1120] rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs overflow-hidden transition-colors">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Activity</th>
                  <th className="px-5 py-3.5">Quantity</th>
                  <th className="px-5 py-3.5">Factor</th>
                  <th className="px-5 py-3.5 text-right">CO₂ Emission</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
                {paginatedRecords.map(rec => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {rec.date}
                    </td>
                    <td className="px-5 py-3 font-medium whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {categoryIcons[rec.category]}
                        <span className="capitalize text-slate-800 dark:text-slate-200">{rec.category}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-medium text-slate-900 dark:text-slate-100 max-w-xs truncate">
                      {rec.activity}
                    </td>
                    <td className="px-5 py-3 font-mono text-slate-600 dark:text-slate-300">
                      {rec.quantity} {rec.unit}
                    </td>
                    <td className="px-5 py-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      {rec.emissionFactor} kg/{rec.unit}
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {rec.co2Emission} <span className="font-normal text-slate-500 dark:text-slate-400 text-[11px]">kg</span>
                    </td>
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewRecord(rec)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="View details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(rec)}
                          className="p-1.5 text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit record"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(rec.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800/80">
            {paginatedRecords.map(rec => (
              <div key={rec.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {categoryIcons[rec.category]}
                    <span className="capitalize">{rec.category}</span>
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-500">{rec.date}</span>
                </div>

                <div className="text-xs font-medium text-slate-900 dark:text-slate-100">{rec.activity}</div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="font-mono text-slate-500 dark:text-slate-400">
                    {rec.quantity} {rec.unit}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {rec.co2Emission} kg CO₂
                  </span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-50 dark:border-slate-800/60">
                  <button
                    onClick={() => setViewRecord(rec)}
                    className="text-xs text-slate-600 dark:text-slate-400 hover:underline"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => openEditModal(rec)}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(rec.id)}
                    className="text-xs text-rose-600 dark:text-rose-400 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              Page <strong className="text-slate-800 dark:text-slate-200">{currentPageNum}</strong> of <strong className="text-slate-800 dark:text-slate-200">{totalPages}</strong>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPageNum(p => Math.max(1, p - 1))}
                disabled={currentPageNum === 1}
                className="p-1 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPageNum(p => Math.min(totalPages, p + 1))}
                disabled={currentPageNum === totalPages}
                className="p-1 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      <Modal
        isOpen={!!viewRecord}
        onClose={() => setViewRecord(null)}
        title="Activity Audit Details"
        subtitle="Traceability information for logged emission event"
      >
        {viewRecord && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-[#11192d] p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-slate-400 dark:text-slate-500">Activity</p>
                <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{viewRecord.activity}</p>
              </div>
              <div>
                <p className="text-slate-400 dark:text-slate-500">Category</p>
                <p className="font-semibold text-slate-900 dark:text-slate-100 capitalize mt-0.5">{viewRecord.category}</p>
              </div>
              <div>
                <p className="text-slate-400 dark:text-slate-500">Date Recorded</p>
                <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{viewRecord.date}</p>
              </div>
              <div>
                <p className="text-slate-400 dark:text-slate-500">Recorded Quantity</p>
                <p className="font-mono text-slate-900 dark:text-slate-100 mt-0.5">{viewRecord.quantity} {viewRecord.unit}</p>
              </div>
              <div>
                <p className="text-slate-400 dark:text-slate-500">Emission Factor</p>
                <p className="font-mono text-slate-900 dark:text-slate-100 mt-0.5">{viewRecord.emissionFactor} kg CO₂/{viewRecord.unit}</p>
              </div>
              <div>
                <p className="text-slate-400 dark:text-slate-500">Total Calculated</p>
                <p className="font-bold text-emerald-700 dark:text-emerald-400 text-sm mt-0.5">{viewRecord.co2Emission} kg CO₂</p>
              </div>
            </div>

            {viewRecord.notes && (
              <div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Notes & Traceability</p>
                <p className="text-slate-700 dark:text-slate-300 mt-1 p-2.5 bg-slate-50 dark:bg-[#11192d] rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed">
                  {viewRecord.notes}
                </p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewRecord(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        isOpen={!!editRecord}
        onClose={() => setEditRecord(null)}
        title="Edit Emission Record"
        subtitle="Modify quantity or activity description"
      >
        {editRecord && (
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300">Activity Title</label>
              <input
                type="text"
                required
                value={editActivity}
                onChange={e => setEditActivity(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 bg-white dark:bg-[#11192d] focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300">Quantity ({editRecord.unit})</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={editQuantity}
                  onChange={e => {
                    const q = Number(e.target.value);
                    setEditQuantity(q);
                    setEditCO2(Number((q * editRecord.emissionFactor).toFixed(2)));
                  }}
                  className="mt-1 w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 bg-white dark:bg-[#11192d] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300">CO₂ Emission (kg)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={editCO2}
                  onChange={e => setEditCO2(Number(e.target.value))}
                  className="mt-1 w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 bg-white dark:bg-[#11192d] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditRecord(null)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Deletion"
        subtitle="This action will permanently remove this record from your history."
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Are you sure you want to remove this emission record? Your monthly totals and Eco Score will be recalculated automatically.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setDeleteConfirmId(null)}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-colors"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
