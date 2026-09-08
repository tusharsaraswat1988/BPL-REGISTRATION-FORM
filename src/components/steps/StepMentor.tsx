import React from 'react';
import { MentorDetails } from '../../types';
import { UserCheck, Phone, Mail, Shield } from 'lucide-react';
import { ImageUploadField } from '../ImageUploadField';

interface StepMentorProps {
  mentor: MentorDetails;
  setMentor: React.Dispatch<React.SetStateAction<MentorDetails>>;
  errors: Record<string, string>;
}

export const StepMentor: React.FC<StepMentorProps> = ({ mentor, setMentor, errors }) => {
  const handleChange = (field: keyof MentorDetails, value: string) => {
    setMentor(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#1A2C68]">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2 font-heading">
            <UserCheck className="w-5 h-5 text-[#FFB800]" />
            Mentor In-Charge (Exactly ONE per Team)
          </h3>
          <p className="text-xs text-slate-400">
            The official designated mentor/coach responsible for official tournament communication and team coordination.
          </p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0A1230] border border-[#1A2C68] text-[11px] text-slate-300 font-medium font-mono-sport">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          Official Team Mentor
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Mentor Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Mentor Full Name <span className="text-[#FFB800]">*</span>
          </label>
          <input
            type="text"
            value={mentor.name}
            onChange={e => handleChange('name', e.target.value)}
            placeholder="e.g. Vikramaditya Rawat"
            className={`w-full px-4 py-3 bg-[#0A1230] border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 transition-all ${
              errors.mentorName ? 'border-red-500' : 'border-[#1A2C68] focus:border-[#FFB800]'
            }`}
          />
          {errors.mentorName && (
            <p className="text-[11px] text-red-400 mt-1.5">{errors.mentorName}</p>
          )}
        </div>

        {/* Designation */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Designation / Role in School / Academy
          </label>
          <input
            type="text"
            value={mentor.designation || ''}
            onChange={e => handleChange('designation', e.target.value)}
            placeholder="e.g. Head Cricket Coach / Sports Director"
            className="w-full px-4 py-3 bg-[#0A1230] border border-[#1A2C68] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800]/50 transition-all"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            Official Email <span className="text-[#FFB800]">*</span>
          </label>
          <input
            type="email"
            value={mentor.email}
            onChange={e => handleChange('email', e.target.value)}
            placeholder="coach@school.edu.in or personal email"
            className={`w-full px-4 py-3 bg-[#0A1230] border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 transition-all ${
              errors.mentorEmail ? 'border-red-500' : 'border-[#1A2C68] focus:border-[#FFB800]'
            }`}
          />
          {errors.mentorEmail && (
            <p className="text-[11px] text-red-400 mt-1.5">{errors.mentorEmail}</p>
          )}
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            Contact Mobile <span className="text-[#FFB800]">*</span>
          </label>
          <input
            type="tel"
            value={mentor.mobile}
            onChange={e => handleChange('mobile', e.target.value)}
            placeholder="e.g. +91 98112 34567"
            className={`w-full px-4 py-3 bg-[#0A1230] border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 transition-all ${
              errors.mentorMobile ? 'border-red-500' : 'border-[#1A2C68] focus:border-[#FFB800]'
            }`}
          />
          {errors.mentorMobile && (
            <p className="text-[11px] text-red-400 mt-1.5">{errors.mentorMobile}</p>
          )}
        </div>

        {/* Second Mobile */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            Alternative Mobile <span className="text-slate-500 text-[11px] normal-case font-normal">(Optional secondary emergency contact)</span>
          </label>
          <input
            type="tel"
            value={mentor.secondMobile || ''}
            onChange={e => handleChange('secondMobile', e.target.value)}
            placeholder="e.g. +91 98112 34568"
            className="w-full px-4 py-3 bg-[#0A1230] border border-[#1A2C68] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800]/50 transition-all"
          />
        </div>
      </div>

      {/* Mentor Photo Upload via ImageUploadField */}
      <div className="mt-4">
        <ImageUploadField
          label="Mentor Photo"
          required
          value={mentor.photo}
          onChange={url => handleChange('photo', url)}
          error={errors.mentorPhoto}
          aspectRatio="square"
          helperText="Recent passport-style photo for official coordinator pass"
        />
      </div>
    </div>
  );
};
