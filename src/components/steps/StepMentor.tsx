import React, { useRef, useState } from 'react';
import { MentorDetails } from '../../types';
import { UserCheck, Phone, Mail, Shield, AlertCircle, Upload, Image as ImageIcon } from 'lucide-react';

interface StepMentorProps {
  mentor: MentorDetails;
  setMentor: React.Dispatch<React.SetStateAction<MentorDetails>>;
  errors: Record<string, string>;
}

export const StepMentor: React.FC<StepMentorProps> = ({ mentor, setMentor, errors }) => {
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof MentorDetails, value: string) => {
    setMentor(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          tag: 'mentor_photo'
        })
      });
      const data = await res.json();
      if (data.secure_url) {
        handleChange('photo', data.secure_url);
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2 font-heading">
            <UserCheck className="w-5 h-5 text-amber-400" />
            Mentor In-Charge (Exactly ONE per Team)
          </h3>
          <p className="text-xs text-slate-400">
            The adult liaison responsible for official communications, match fixtures, and tournament pass verification.
          </p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-medium">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          Official Team Mentor
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Mentor Name * */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Mentor Name *
          </label>
          <input
            type="text"
            value={mentor.name}
            onChange={e => handleChange('name', e.target.value)}
            placeholder="e.g. Vikramaditya Rawat"
            className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 ${
              errors.mentorName ? 'border-red-500' : 'border-slate-800 focus:border-amber-500'
            }`}
          />
          {errors.mentorName && (
            <p className="text-[11px] text-red-400 mt-1">{errors.mentorName}</p>
          )}
        </div>

        {/* Designation */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Designation / Role in Association
          </label>
          <input
            type="text"
            value={mentor.designation || ''}
            onChange={e => handleChange('designation', e.target.value)}
            placeholder="e.g. Head Cricket Coach, Sports Director, PE Teacher"
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Email * */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            Email *
          </label>
          <input
            type="email"
            value={mentor.email}
            onChange={e => handleChange('email', e.target.value)}
            placeholder="coach@school.edu.in or personal email"
            className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 ${
              errors.mentorEmail ? 'border-red-500' : 'border-slate-800 focus:border-amber-500'
            }`}
          />
          {errors.mentorEmail && (
            <p className="text-[11px] text-red-400 mt-1">{errors.mentorEmail}</p>
          )}
        </div>

        {/* Mobile * */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            Mobile *
          </label>
          <input
            type="tel"
            value={mentor.mobile}
            onChange={e => handleChange('mobile', e.target.value)}
            placeholder="e.g. +91 98112 34567"
            className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 ${
              errors.mentorMobile ? 'border-red-500' : 'border-slate-800 focus:border-amber-500'
            }`}
          />
          {errors.mentorMobile && (
            <p className="text-[11px] text-red-400 mt-1">{errors.mentorMobile}</p>
          )}
        </div>

        {/* Second Mobile (Optional) */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            Second Mobile (Optional)
          </label>
          <input
            type="tel"
            value={mentor.secondMobile || ''}
            onChange={e => handleChange('secondMobile', e.target.value)}
            placeholder="e.g. +91 98112 34568"
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
          <span className="text-[11px] text-slate-500">Secondary contact in case of emergency.</span>
        </div>
      </div>

      {/* Mentor Photo * */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Mentor Photo *
        </label>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {mentor.photo ? (
            <div className="w-16 h-16 rounded-xl border border-slate-700 bg-slate-950 p-0.5 flex-shrink-0 flex items-center justify-center overflow-hidden">
              <img
                src={mentor.photo}
                alt="Mentor Photo"
                className="w-full h-full object-cover rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-700 bg-slate-950/50 flex-shrink-0 flex items-center justify-center text-slate-500">
              <ImageIcon className="w-6 h-6" />
            </div>
          )}

          <div className="flex-1 space-y-2 w-full">
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPhoto}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>{isUploadingPhoto ? 'Uploading to Cloudinary...' : 'Upload Mentor Photo'}</span>
              </button>
              <span className="text-[11px] text-slate-500">Passport style portrait photo</span>
            </div>
            <input
              type="url"
              value={mentor.photo}
              onChange={e => handleChange('photo', e.target.value)}
              placeholder="Or paste direct image URL (e.g. Cloudinary)..."
              className={`w-full px-3 py-1.5 bg-slate-950 border rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none ${
                errors.mentorPhoto ? 'border-red-500' : 'border-slate-800 focus:border-amber-500'
              }`}
            />
          </div>
        </div>
        {errors.mentorPhoto && (
          <p className="text-[11px] text-red-400 mt-2">{errors.mentorPhoto}</p>
        )}
      </div>
    </div>
  );
};
