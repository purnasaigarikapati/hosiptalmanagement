import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileUp, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Edit3, 
  Save, 
  Trash2, 
  Plus, 
  FileCheck, 
  RefreshCw,
  Eye,
  FileCode,
  ShieldCheck
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { LabTest, OrganSystem, ExtractedDocumentData } from '../types/health';

export const DocumentUpload: React.FC = () => {
  const { t, addRecordFromUpload, addToast, scrollToSection } = useHealth();

  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  
  // Extracted structured state (editable)
  const [extractedData, setExtractedData] = useState<ExtractedDocumentData | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndProcessFile = (file: File) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const validExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!validTypes.includes(file.type) && !validExtensions.includes(ext)) {
      addToast('error', 'Unsupported Format', 'Please upload a PDF, JPG, JPEG, or PNG document.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      addToast('error', 'File Too Large', 'Maximum file size allowed is 25 MB.');
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);

    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

    simulateExtractionPipeline(file.name, file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  // Quick Demo Preloads
  const loadDemoData = (type: 'lab' | 'rx') => {
    if (type === 'lab') {
      setFileName('apollomedics_thyroid_glucose_oct2026.pdf');
      simulateExtractionPipeline('apollomedics_thyroid_glucose_oct2026.pdf');
    } else {
      setFileName('care_rx_cardiology_oct2026.jpg');
      simulateExtractionPipeline('care_rx_cardiology_oct2026.jpg');
    }
  };

  // Multi-stage extraction pipeline
  const simulateExtractionPipeline = async (docName: string, actualFile?: File) => {
    setIsProcessing(true);
    setUploadProgress(10);
    setProcessingStage('Encrypting and uploading clinical report...');

    // Progress step 1
    await new Promise(r => setTimeout(r, 600));
    setUploadProgress(35);
    setProcessingStage('Running Optical Character Recognition (OCR) engine...');

    // Progress step 2
    await new Promise(r => setTimeout(r, 700));
    setUploadProgress(70);
    setProcessingStage('Extracting structured medical entities & reference ranges...');

    // Progress step 3
    await new Promise(r => setTimeout(r, 600));
    setUploadProgress(95);
    setProcessingStage('Synthesizing AI clinical summary...');

    // Complete
    await new Promise(r => setTimeout(r, 400));
    setUploadProgress(100);
    setIsProcessing(false);

    const nameLower = docName.toLowerCase();

    if (nameLower.includes('rx') || nameLower.includes('cardio')) {
      setExtractedData({
        title: 'Cardiovascular Care Order & Statin Prescription',
        category: 'Heart & Cardiovascular',
        organSystem: 'cardiovascular',
        documentType: 'Prescription',
        doctor: 'Dr. Arvind Rao, DM (Cardiology)',
        facility: 'Care Heart Institute',
        date: new Date().toISOString().split('T')[0],
        confidenceScore: 0.94,
        tests: [
          { name: 'Rosuvastatin Calcium', value: '10 mg', unit: 'tab', refRange: '1x daily at bedtime', status: 'normal' },
          { name: 'Aspirin (Enteric Coated)', value: '75 mg', unit: 'tab', refRange: '1x daily after lunch', status: 'normal' },
          { name: 'Blood Pressure Target', value: '< 120/80', unit: 'mmHg', refRange: 'Systolic/Diastolic', status: 'normal' },
          { name: 'Dosage Duration Note', value: 'Needs Review', unit: 'weeks', refRange: 'Prescription blur at duration line', status: 'needs_review' }
        ],
        aiSummary: 'Cardiology prescription for cardiovascular prophylaxis and lipid management. Rosuvastatin 10mg once daily at bedtime and low-dose Aspirin 75mg. Note: Duration line requires confirmation.',
        flags: ['Verification recommended for handwritten prescription duration.']
      });
    } else {
      setExtractedData({
        title: 'Comprehensive Thyroid & Glycemic Evaluation',
        category: 'Laboratory & Metabolic',
        organSystem: 'metabolic',
        documentType: 'Lab Report',
        doctor: 'Dr. Anita Verma, MD (Pathology)',
        facility: 'Apollo Diagnostics Centre',
        date: new Date().toISOString().split('T')[0],
        confidenceScore: 0.96,
        tests: [
          { name: 'Fasting Blood Sugar (FBS)', value: '106', unit: 'mg/dL', refRange: '70 - 99', status: 'high' },
          { name: 'HbA1c', value: '6.7', unit: '%', refRange: '4.0 - 5.6', status: 'high' },
          { name: 'Total T3', value: '1.2', unit: 'ng/mL', refRange: '0.8 - 2.0', status: 'normal' },
          { name: 'Free T4', value: '1.15', unit: 'ng/dL', refRange: '0.8 - 1.8', status: 'normal' },
          { name: 'Thyroid Stimulating Hormone (TSH)', value: '2.84', unit: 'µIU/mL', refRange: '0.4 - 4.5', status: 'normal' }
        ],
        aiSummary: 'Thyroid profile is euthyroid with normal TSH (2.84 µIU/mL), Free T4, and Total T3. Glycemic indicators remain slightly elevated (HbA1c 6.7%, Fasting Glucose 106 mg/dL), consistent with metabolic tracking.',
        flags: ['Glycemic markers remain slightly above standard reference limits.']
      });
    }

    addToast('info', 'OCR Extraction Completed', 'Extracted structured medical parameters. Please review below.');
  };

  // Editable test handlers
  const handleTestChange = (index: number, field: keyof LabTest, val: string) => {
    if (!extractedData) return;
    const updatedTests = [...extractedData.tests];
    updatedTests[index] = { ...updatedTests[index], [field]: val };
    setExtractedData({ ...extractedData, tests: updatedTests });
  };

  const handleAddTestRow = () => {
    if (!extractedData) return;
    const newTest: LabTest = {
      name: 'New Parameter',
      value: '0',
      unit: 'mg/dL',
      refRange: 'Needs review',
      status: 'normal'
    };
    setExtractedData({ ...extractedData, tests: [...extractedData.tests, newTest] });
  };

  const handleRemoveTestRow = (index: number) => {
    if (!extractedData) return;
    const updated = extractedData.tests.filter((_, i) => i !== index);
    setExtractedData({ ...extractedData, tests: updated });
  };

  // Save to Health Intelligence Graph
  const handleSaveToProfile = () => {
    if (!extractedData) return;
    addRecordFromUpload(extractedData, fileName || 'medical_report.pdf');
    
    // Clear upload state
    setExtractedData(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileName('');
    setUploadProgress(0);

    // Scroll to Living Health Map to see updated counts!
    scrollToSection('living-health-map-section');
  };

  return (
    <section id="upload-section" className="glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/25 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cyan-500/15">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-400/30">
              <Upload className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {t.uploadTitle}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 pl-10">
            {t.uploadSubtitle}
          </p>
        </div>

        {/* Quick Demo Preload Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => loadDemoData('lab')}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {t.tryDemoReport}
          </button>
          <button
            onClick={() => loadDemoData('rx')}
            className="px-3 py-1.5 rounded-xl bg-violet-500/15 hover:bg-violet-500/25 text-violet-300 border border-violet-500/30 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {t.tryDemoRx}
          </button>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      {!extractedData && (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative p-8 sm:p-12 rounded-3xl border-2 border-dashed transition-all duration-200 cursor-pointer text-center flex flex-col items-center justify-center ${
            dragActive
              ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_30px_rgba(0,242,254,0.25)]'
              : 'border-slate-700/80 hover:border-cyan-500/50 hover:bg-slate-900/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-16 h-16 rounded-3xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-glow-cyan mb-4 group-hover:scale-110 transition">
            <FileUp className="w-8 h-8" />
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white">
            {t.dropzoneText}
          </h3>

          <p className="text-xs text-slate-400 mt-1 max-w-md">
            {t.uploadLimit}
          </p>

          <div className="mt-4 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">PDF</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">JPG</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">JPEG</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">PNG</span>
          </div>

          {/* Processing Animation */}
          {isProcessing && (
            <div className="absolute inset-0 bg-[#060a17]/90 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-6 z-20">
              <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin mb-4" />
              <p className="text-sm font-semibold text-white">{processingStage}</p>
              
              <div className="w-64 h-2 bg-slate-800 rounded-full mt-4 overflow-hidden border border-slate-700">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-teal-400 h-full transition-all duration-300 shadow-glow-cyan"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="text-xs text-cyan-300 font-mono mt-2">{uploadProgress}%</span>
            </div>
          )}
        </div>
      )}

      {/* Structured Extraction Review & Edit Section */}
      {extractedData && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-cyan-500/30 space-y-6 animate-in fade-in duration-200">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-teal-400" />
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {t.reviewExtractedTitle}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-teal-500/15 text-teal-300 border border-teal-500/30">
                  Confidence: {Math.round(extractedData.confidenceScore * 100)}%
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Source Document: <span className="font-mono text-cyan-300">{fileName}</span>
              </p>
            </div>

            <button
              onClick={() => {
                setExtractedData(null);
                setSelectedFile(null);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition self-start sm:self-center"
            >
              Upload Different File
            </button>
          </div>

          {/* Document Metadata Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Report Title
              </label>
              <input
                type="text"
                value={extractedData.title}
                onChange={(e) => setExtractedData({ ...extractedData, title: e.target.value })}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Physiological System
              </label>
              <select
                value={extractedData.organSystem}
                onChange={(e) => setExtractedData({ ...extractedData, organSystem: e.target.value as OrganSystem })}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="metabolic">Laboratory & Metabolic</option>
                <option value="cardiovascular">Heart & Cardiovascular</option>
                <option value="respiratory">Lungs & Respiratory</option>
                <option value="neurological">Brain & Neurological</option>
                <option value="musculoskeletal">Bones & Musculoskeletal</option>
                <option value="general">General Medical Records</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Doctor / Specialist
              </label>
              <input
                type="text"
                value={extractedData.doctor}
                onChange={(e) => setExtractedData({ ...extractedData, doctor: e.target.value })}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Facility / Clinic
              </label>
              <input
                type="text"
                value={extractedData.facility}
                onChange={(e) => setExtractedData({ ...extractedData, facility: e.target.value })}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Structured Tests / Medication Items Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                Extracted Parameters & Medication Orders ({extractedData.tests.length})
              </h4>
              <button
                onClick={handleAddTestRow}
                className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
              >
                <Plus className="w-3.5 h-3.5" /> Add Parameter
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-800 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/60 text-[11px] font-mono uppercase text-slate-400">
                  <tr>
                    <th className="py-2.5 px-3">Test / Medicine</th>
                    <th className="py-2.5 px-3">Value</th>
                    <th className="py-2.5 px-3">Unit</th>
                    <th className="py-2.5 px-3">Reference / Frequency</th>
                    <th className="py-2.5 px-3">Status Flag</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {extractedData.tests.map((test, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={test.name}
                          onChange={(e) => handleTestChange(idx, 'name', e.target.value)}
                          className="w-full bg-transparent border-b border-slate-700 px-1 py-0.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                        />
                      </td>
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={test.value}
                          onChange={(e) => handleTestChange(idx, 'value', e.target.value)}
                          className="w-24 bg-transparent border-b border-slate-700 px-1 py-0.5 text-xs text-cyan-300 font-mono font-bold focus:outline-none focus:border-cyan-400"
                        />
                      </td>
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={test.unit}
                          onChange={(e) => handleTestChange(idx, 'unit', e.target.value)}
                          className="w-20 bg-transparent border-b border-slate-700 px-1 py-0.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-400"
                        />
                      </td>
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={test.refRange}
                          onChange={(e) => handleTestChange(idx, 'refRange', e.target.value)}
                          className="w-full bg-transparent border-b border-slate-700 px-1 py-0.5 text-xs text-slate-400 font-mono focus:outline-none focus:border-cyan-400"
                        />
                      </td>
                      <td className="py-2.5 px-3">
                        <select
                          value={test.status}
                          onChange={(e) => handleTestChange(idx, 'status', e.target.value as LabTest['status'])}
                          className={`bg-slate-800 rounded-lg px-2 py-1 text-[11px] font-semibold border ${
                            test.status === 'high' || test.status === 'low'
                              ? 'text-rose-300 border-rose-500/40'
                              : test.status === 'needs_review'
                              ? 'text-amber-300 border-amber-500/40'
                              : 'text-teal-300 border-teal-500/40'
                          }`}
                        >
                          <option value="normal">Normal</option>
                          <option value="high">High</option>
                          <option value="low">Low</option>
                          <option value="needs_review">Needs Review</option>
                        </select>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => handleRemoveTestRow(idx)}
                          className="p-1 rounded-lg text-slate-500 hover:text-rose-400 transition"
                          title="Remove Parameter"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Clinical Narrative Summary */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              {t.summaryNotes}
            </label>
            <textarea
              rows={3}
              value={extractedData.aiSummary}
              onChange={(e) => setExtractedData({ ...extractedData, aiSummary: e.target.value })}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 leading-relaxed"
            />
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-800">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Verified values will immediately update your Living Health Map & Timeline.
            </span>

            <button
              onClick={handleSaveToProfile}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-glow-cyan transition duration-200 active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{t.saveToProfile}</span>
            </button>
          </div>

        </div>
      )}

    </section>
  );
};
