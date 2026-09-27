import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';

async function generateBplExcelTemplate() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Bidwar Premier League (BPL)';
  workbook.lastModifiedBy = 'BPL Registration Office';
  workbook.created = new Date();
  workbook.modified = new Date();

  // Color Palette (BPL Royal Navy & Sport Gold)
  const NAVY_DARK = 'FF0A1230';
  const NAVY_CARD = 'FF142250';
  const GOLD = 'FFFFB800';
  const GOLD_LIGHT = 'FFFFF2CC';
  const TEXT_WHITE = 'FFFFFFFF';
  const BORDER_COLOR = 'FFCBD5E1';
  const ROW_EVEN_BG = 'FFF8FAFC';
  const SECTION_HEADER_BG = 'FF1E293B';
  const GREEN_BG = 'FFE8F5E9';

  // -------------------------------------------------------------
  // SHEET 1: INSTRUCTIONS & GUIDELINES (निर्देश)
  // -------------------------------------------------------------
  const instructionsSheet = workbook.addWorksheet('Instructions & Guidelines', {
    views: [{ showGridLines: true }]
  });

  instructionsSheet.columns = [
    { width: 6 },
    { width: 32 },
    { width: 68 }
  ];

  // Title Banner
  instructionsSheet.mergeCells('B2:C2');
  const titleCell = instructionsSheet.getCell('B2');
  titleCell.value = '🏏 BIDWAR PREMIER LEAGUE (BPL) KIDS 2026 — REGISTRATION INSTRUCTIONS';
  titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: TEXT_WHITE } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY_DARK } };
  instructionsSheet.getRow(2).height = 36;

  instructionsSheet.mergeCells('B3:C3');
  const subTitle = instructionsSheet.getCell('B3');
  subTitle.value = 'Match Dates: 10th & 11th October 2026 | Venue: Pitch and Paddle, Sigra, Varanasi';
  subTitle.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF1E293B' } };
  subTitle.alignment = { vertical: 'middle', horizontal: 'center' };
  subTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: GOLD } };
  instructionsSheet.getRow(3).height = 24;

  const instructionsData = [
    ['', ''],
    ['1. TOURNAMENT CATEGORIES', '• Class 4–5–6 Division (Ages approx 9–12 yrs) — Students of Class 4, 5, or 6 only.\n• Class 7–8–9 Division (Ages approx 12–15 yrs) — Students of Class 7, 8, or 9 only.'],
    ['2. SQUAD SIZE (BOX CRICKET)', '• Strictly 8 Players per team (Exact 8 players required for Box Cricket format).'],
    ['3. ROLES & STYLES RULE', '• Batsman: Batting style is mandatory (Right Hand / Left Hand).\n• Bowler: Bowling style is mandatory (Fast / Medium / Spin).\n• All Rounder: Both Batting style & Bowling style are mandatory.\n• Wicket Keeper: Batting style is mandatory.'],
    ['4. HOW TO PROVIDE PHOTOS & LOGO (DRIVE LINKS)', '• Upload School Logo, Mentor Photo, Player Photos & Payment Screenshot to Google Drive.\n• Right-click image/folder in Google Drive -> "Share" -> Change General Access to "Anyone with the link can view" (Viewer access).\n• Copy and paste the link in the respective link cell in the Excel sheet.'],
    ['5. ENTRY FEE & PAYMENT', '• Base Entry Fee: ₹8,000 per team.\n• Optional Branding Package (Team name, tagline, sponsor shoutouts): ₹5,000 extra (Total: ₹13,000).\n• UPI ID / Bank transfer details:\n   UPI ID: bpl2026@upi (or scan tournament QR code)\n• Enter UTR / UPI Transaction Reference & attach payment screenshot Drive link.'],
    ['6. HOW TO SUBMIT THIS SHEET', '• After filling, send this Excel file via Email or WhatsApp:\n   Email: registrations@bidwar.in\n   WhatsApp: +91 91703 60000 / +91 98390 12345\n• Our verification team will verify UTR and issue your Official 4-Digit Team Code within 4 hours.']
  ];

  instructionsData.forEach((row, idx) => {
    const rowNum = idx + 4;
    const r = instructionsSheet.getRow(rowNum);
    r.getCell(2).value = row[0];
    r.getCell(2).font = { bold: true, color: { argb: 'FF0F172A' }, size: 11 };
    r.getCell(2).alignment = { vertical: 'top', wrapText: true };
    
    r.getCell(3).value = row[1];
    r.getCell(3).font = { color: { argb: 'FF334155' }, size: 10 };
    r.getCell(3).alignment = { vertical: 'top', wrapText: true };
    r.height = row[0] ? 45 : 12;

    if (row[0]) {
      r.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
      r.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
      r.getCell(2).border = { top: { style: 'thin', color: { argb: BORDER_COLOR } }, bottom: { style: 'thin', color: { argb: BORDER_COLOR } }, left: { style: 'thin', color: { argb: BORDER_COLOR } } };
      r.getCell(3).border = { top: { style: 'thin', color: { argb: BORDER_COLOR } }, bottom: { style: 'thin', color: { argb: BORDER_COLOR } }, right: { style: 'thin', color: { argb: BORDER_COLOR } }, left: { style: 'thin', color: { argb: BORDER_COLOR } } };
    }
  });

  // -------------------------------------------------------------
  // SHEET 2: SINGLE TEAM REGISTRATION FORM (आसान फॉर्म)
  // -------------------------------------------------------------
  const singleTeamSheet = workbook.addWorksheet('Team Registration Form', {
    views: [{ showGridLines: true }]
  });

  singleTeamSheet.columns = [
    { width: 4 },
    { width: 28 },
    { width: 45 },
    { width: 40 }
  ];

  let currRow = 2;

  // Header Banner
  singleTeamSheet.mergeCells(`B${currRow}:D${currRow}`);
  const sTitle = singleTeamSheet.getCell(`B${currRow}`);
  sTitle.value = 'BIDWAR PREMIER LEAGUE 2026 — OFFICIAL TEAM REGISTRATION ENTRY';
  sTitle.font = { name: 'Calibri', size: 15, bold: true, color: { argb: TEXT_WHITE } };
  sTitle.alignment = { vertical: 'middle', horizontal: 'center' };
  sTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY_DARK } };
  singleTeamSheet.getRow(currRow).height = 32;
  currRow++;

  singleTeamSheet.mergeCells(`B${currRow}:D${currRow}`);
  const sSubtitle = singleTeamSheet.getCell(`B${currRow}`);
  sSubtitle.value = 'Please fill all required (*) fields. Paste Google Drive public links for all photos & logos.';
  sSubtitle.font = { name: 'Calibri', size: 10.5, italic: true, bold: true, color: { argb: 'FF1E293B' } };
  sSubtitle.alignment = { vertical: 'middle', horizontal: 'center' };
  sSubtitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: GOLD } };
  singleTeamSheet.getRow(currRow).height = 22;
  currRow += 2;

  // Helper function to render section header
  const renderSectionHeader = (title: string) => {
    singleTeamSheet.mergeCells(`B${currRow}:D${currRow}`);
    const cell = singleTeamSheet.getCell(`B${currRow}`);
    cell.value = title;
    cell.font = { name: 'Calibri', size: 12, bold: true, color: { argb: TEXT_WHITE } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: SECTION_HEADER_BG } };
    cell.alignment = { vertical: 'middle', indent: 1 };
    singleTeamSheet.getRow(currRow).height = 25;
    currRow++;

    // Sub-header columns
    const r = singleTeamSheet.getRow(currRow);
    r.getCell(2).value = 'FIELD / DETAIL NAME';
    r.getCell(3).value = 'ENTER YOUR VALUE HERE';
    r.getCell(4).value = 'INSTRUCTION / EXAMPLE';
    [2, 3, 4].forEach(col => {
      r.getCell(col).font = { bold: true, size: 10, color: { argb: 'FF475569' } };
      r.getCell(col).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };
      r.getCell(col).border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    });
    singleTeamSheet.getRow(currRow).height = 20;
    currRow++;
  };

  const renderFieldRow = (label: string, defaultValue: string, note: string, dropdownOptions?: string[]) => {
    const r = singleTeamSheet.getRow(currRow);
    r.getCell(2).value = label;
    r.getCell(2).font = { bold: true, size: 10.5, color: { argb: 'FF0F172A' } };
    r.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
    
    r.getCell(3).value = defaultValue;
    r.getCell(3).font = { size: 10.5, color: { argb: 'FF000000' } };
    r.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };

    r.getCell(4).value = note;
    r.getCell(4).font = { size: 9.5, italic: true, color: { argb: 'FF64748B' } };
    r.getCell(4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };

    [2, 3, 4].forEach(col => {
      r.getCell(col).border = {
        top: { style: 'thin', color: { argb: BORDER_COLOR } },
        bottom: { style: 'thin', color: { argb: BORDER_COLOR } },
        left: { style: 'thin', color: { argb: BORDER_COLOR } },
        right: { style: 'thin', color: { argb: BORDER_COLOR } }
      };
      r.getCell(col).alignment = { vertical: 'middle', wrapText: true };
    });

    if (dropdownOptions && dropdownOptions.length > 0) {
      r.getCell(3).dataValidation = {
        type: 'list',
        allowBlank: false,
        formulae: [`"${dropdownOptions.join(',')}"`],
        showErrorMessage: true,
        errorTitle: 'Invalid Selection',
        error: `Please select one of: ${dropdownOptions.join(', ')}`
      };
    }

    singleTeamSheet.getRow(currRow).height = 24;
    currRow++;
  };

  // Section 1: Tournament & School
  renderSectionHeader('1. TOURNAMENT CATEGORY & SCHOOL / ASSOCIATION DETAILS');
  renderFieldRow('Tournament Category *', 'Class 4–5–6', 'Select: Class 4–5–6 OR Class 7–8–9', ['Class 4–5–6', 'Class 7–8–9']);
  renderFieldRow('School / Academy Name *', 'Sunbeam School', 'Official registered name of School or Academy');
  renderFieldRow('Branch / Campus *', 'Suncity Campus, Varanasi', 'Campus / Branch name');
  renderFieldRow('Official School Email *', 'sports@sunbeamschool.org', 'Official email address for communication');
  renderFieldRow('Official Mobile / WhatsApp *', '9876543210', '10-digit primary mobile number');
  renderFieldRow('School / Academy Logo Link *', 'https://drive.google.com/file/d/xxxx/view?usp=sharing', 'Public Google Drive link of PNG/JPEG logo');
  renderFieldRow('City *', 'Varanasi', 'City of Institution (e.g. Varanasi)');
  currRow++;

  // Section 2: Mentor Details
  renderSectionHeader('2. MENTOR / HEAD COACH DETAILS (EXACTLY 1 REQUIRED)');
  renderFieldRow('Mentor Full Name *', 'Rajesh Sharma', 'Full name of Head Coach or Sports Teacher');
  renderFieldRow('Mentor Designation', 'Head Cricket Coach', 'e.g. Head Coach / Physical Education Teacher');
  renderFieldRow('Mentor Primary Mobile *', '9811012345', '10-digit mobile number of mentor');
  renderFieldRow('Mentor Alternate Mobile', '', 'Optional 10-digit alternate number');
  renderFieldRow('Mentor Email *', 'coach.rajesh@gmail.com', 'Mentor personal or official email');
  renderFieldRow('Mentor Photo Link *', 'https://drive.google.com/file/d/yyyy/view?usp=sharing', 'Public Google Drive link of Mentor photo');
  currRow++;

  // Section 3: Team Branding
  renderSectionHeader('3. TEAM DETAILS & BRANDING');
  renderFieldRow('Official Team Name *', 'Sunbeam Warriors', 'Name of the cricket team (e.g. Sunbeam Warriors)');
  renderFieldRow('Team Tagline / Slogan', 'Rise, Fight, Conquer!', 'Optional team slogan');
  renderFieldRow('Include Branding Package (₹5,000)?', 'No', 'Select "Yes" for VIP sponsor branding or "No" for Base Entry', ['Yes', 'No']);
  currRow++;

  // Section 4: 8 Players Roster
  renderSectionHeader('4. EXACT 8-PLAYER SQUAD ROSTER (ALL 8 SLOTS MANDATORY)');
  
  // Players Table Header
  const pHeaderRow = singleTeamSheet.getRow(currRow);
  singleTeamSheet.mergeCells(`B${currRow}:D${currRow}`);
  pHeaderRow.getCell(2).value = 'Detailed 8-Player List (See below table / columns)';
  pHeaderRow.getCell(2).font = { bold: true, size: 10.5, color: { argb: 'FF1E293B' } };
  pHeaderRow.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: GOLD_LIGHT } };
  pHeaderRow.getCell(2).alignment = { vertical: 'middle', indent: 1 };
  currRow++;

  // Add 8 Player Sections with all required columns
  for (let i = 1; i <= 8; i++) {
    singleTeamSheet.mergeCells(`B${currRow}:D${currRow}`);
    const pSlot = singleTeamSheet.getCell(`B${currRow}`);
    pSlot.value = `PLAYER #${i} DETAILS ${i <= 2 ? '(Sample Filled)' : ''}`;
    pSlot.font = { bold: true, size: 10, color: { argb: TEXT_WHITE } };
    pSlot.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF334155' } };
    singleTeamSheet.getRow(currRow).height = 20;
    currRow++;

    const sampleName = i === 1 ? 'Aarav Sharma' : i === 2 ? 'Devansh Verma' : '';
    const sampleClass = i === 1 ? '5' : i === 2 ? '6' : '5';
    const sampleDOB = i === 1 ? '2015-05-15' : i === 2 ? '2014-08-20' : '';
    const sampleParentEmail = i === 1 ? 'parent.aarav@example.com' : i === 2 ? 'parent.devansh@example.com' : '';
    const sampleRole = i === 1 ? 'All Rounder' : i === 2 ? 'Batsman' : 'Batsman';
    const sampleBat = 'Right Hand';
    const sampleBowl = i === 1 ? 'Right Arm Medium' : '';
    const sampleJerseyNum = i === 1 ? '7' : i === 2 ? '18' : String(10 + i);

    renderFieldRow(`Player #${i} Full Name *`, sampleName, 'Full student name as per school ID');
    renderFieldRow(`Player #${i} Class *`, sampleClass, 'Class 4, 5, 6 (or 7, 8, 9)', ['4', '5', '6', '7', '8', '9']);
    renderFieldRow(`Player #${i} Date of Birth *`, sampleDOB, 'Format: YYYY-MM-DD (e.g. 2015-06-12)');
    renderFieldRow(`Player #${i} Parent Mobile`, i === 1 ? '9876500001' : '', '10-digit parent mobile number');
    renderFieldRow(`Player #${i} Parent Email *`, sampleParentEmail, 'Parent email address for notifications');
    renderFieldRow(`Player #${i} Photo Drive Link *`, 'https://drive.google.com/file/d/player_photo/view?usp=sharing', 'Public Google Drive link of player passport photo');
    renderFieldRow(`Player #${i} Cricket Role *`, sampleRole, 'Batsman / Bowler / All Rounder / Wicket Keeper', ['Batsman', 'Bowler', 'All Rounder', 'Wicket Keeper']);
    renderFieldRow(`Player #${i} Batting Style`, sampleBat, 'Mandatory for Batsman, All Rounder, Wicket Keeper', ['Right Hand', 'Left Hand']);
    renderFieldRow(`Player #${i} Bowling Style`, sampleBowl, 'Mandatory for Bowler, All Rounder', ['Right Arm Fast', 'Right Arm Medium', 'Right Arm Spin', 'Left Arm Fast', 'Left Arm Medium', 'Left Arm Spin']);
    renderFieldRow(`Player #${i} Jersey Number`, sampleJerseyNum, 'Optional unique number (1 to 99)');
    renderFieldRow(`Player #${i} Jersey Size`, '32', 'Sizes: 28, 30, 32, 34, 36, 38, 40, S, M, L', ['28', '30', '32', '34', '36', '38', '40', 'S', 'M', 'L']);
    currRow++;
  }

  // Section 5: Payment
  renderSectionHeader('5. PAYMENT & UTR TRANSACTION DETAILS');
  renderFieldRow('Payment Method *', 'UPI', 'Select: UPI OR Bank Transfer (NEFT/RTGS/IMPS)', ['UPI', 'Bank Transfer (NEFT/RTGS/IMPS)', 'Cashfree Online']);
  renderFieldRow('UTR / UPI Transaction Reference *', '426589123456', '12-digit UPI reference or Bank UTR number');
  renderFieldRow('Payment Date *', '2026-09-27', 'Date of transaction (YYYY-MM-DD)');
  renderFieldRow('Total Amount Paid (₹) *', '₹8,000', '₹8,000 (Base Entry) OR ₹13,000 (With Branding Package)', ['₹8,000', '₹13,000']);
  renderFieldRow('Payment Screenshot Link *', 'https://drive.google.com/file/d/payment_proof/view?usp=sharing', 'Public Google Drive link of payment receipt/screenshot');

  // -------------------------------------------------------------
  // SHEET 3: MULTI-TEAM SPREADSHEET (FOR BULK SCHOOLS / ACADEMIES)
  // -------------------------------------------------------------
  const bulkSheet = workbook.addWorksheet('Multi-Team Roster Format', {
    views: [{ showGridLines: true, freezePane: { ySplit: 2, xSplit: 0 } }]
  });

  const bulkColumns = [
    { header: 'Category *', key: 'category', width: 16 },
    { header: 'School Name *', key: 'schoolName', width: 26 },
    { header: 'Branch / Campus *', key: 'branch', width: 22 },
    { header: 'School Email *', key: 'schoolEmail', width: 24 },
    { header: 'School Mobile *', key: 'schoolMobile', width: 16 },
    { header: 'School Logo Link *', key: 'schoolLogo', width: 32 },
    { header: 'Team Name *', key: 'teamName', width: 22 },
    { header: 'Team Tagline', key: 'tagline', width: 20 },
    { header: 'Branding (₹5k)?', key: 'branding', width: 16 },
    { header: 'Mentor Name *', key: 'mentorName', width: 20 },
    { header: 'Mentor Mobile *', key: 'mentorMobile', width: 16 },
    { header: 'Mentor Email *', key: 'mentorEmail', width: 24 },
    { header: 'Mentor Photo Link *', key: 'mentorPhoto', width: 32 },
    // Player 1
    { header: 'P1 Name *', key: 'p1_name', width: 18 },
    { header: 'P1 Class *', key: 'p1_class', width: 10 },
    { header: 'P1 DOB *', key: 'p1_dob', width: 14 },
    { header: 'P1 Parent Email *', key: 'p1_email', width: 22 },
    { header: 'P1 Photo Link *', key: 'p1_photo', width: 30 },
    { header: 'P1 Role *', key: 'p1_role', width: 14 },
    { header: 'P1 Bat Style', key: 'p1_bat', width: 14 },
    { header: 'P1 Bowl Style', key: 'p1_bowl', width: 16 },
    { header: 'P1 Jersey No', key: 'p1_jersey', width: 12 },
    // Player 2
    { header: 'P2 Name *', key: 'p2_name', width: 18 },
    { header: 'P2 Class *', key: 'p2_class', width: 10 },
    { header: 'P2 DOB *', key: 'p2_dob', width: 14 },
    { header: 'P2 Parent Email *', key: 'p2_email', width: 22 },
    { header: 'P2 Photo Link *', key: 'p2_photo', width: 30 },
    { header: 'P2 Role *', key: 'p2_role', width: 14 },
    { header: 'P2 Bat Style', key: 'p2_bat', width: 14 },
    { header: 'P2 Bowl Style', key: 'p2_bowl', width: 16 },
    { header: 'P2 Jersey No', key: 'p2_jersey', width: 12 },
    // Payment
    { header: 'Payment Method *', key: 'payMethod', width: 16 },
    { header: 'UTR / Ref No *', key: 'utr', width: 20 },
    { header: 'Amount Paid *', key: 'amount', width: 14 },
    { header: 'Payment Proof Link *', key: 'proofLink', width: 32 }
  ];

  bulkSheet.columns = bulkColumns;

  // Style Header
  const bHeader = bulkSheet.getRow(1);
  bHeader.height = 28;
  bHeader.eachCell((cell) => {
    cell.font = { name: 'Calibri', bold: true, size: 10.5, color: { argb: TEXT_WHITE } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY_DARK } };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = { top: { style: 'thin' }, bottom: { style: 'medium', color: { argb: GOLD } }, left: { style: 'thin' }, right: { style: 'thin' } };
  });

  // Sample Row in Bulk Sheet
  bulkSheet.addRow({
    category: 'Class 4–5–6',
    schoolName: 'Sunbeam Suncity',
    branch: 'Suncity Campus',
    schoolEmail: 'sports@sunbeamschool.org',
    schoolMobile: '9876543210',
    schoolLogo: 'https://drive.google.com/file/d/sample_logo/view',
    teamName: 'Sunbeam Suncity Tigers',
    tagline: 'Roar with Pride',
    branding: 'Yes',
    mentorName: 'Vikram Singh',
    mentorMobile: '9811099999',
    mentorEmail: 'coach.vikram@gmail.com',
    mentorPhoto: 'https://drive.google.com/file/d/sample_mentor/view',
    p1_name: 'Aarav Sharma',
    p1_class: 5,
    p1_dob: '2015-05-15',
    p1_email: 'parent.aarav@gmail.com',
    p1_photo: 'https://drive.google.com/file/d/p1_photo/view',
    p1_role: 'All Rounder',
    p1_bat: 'Right Hand',
    p1_bowl: 'Right Arm Medium',
    p1_jersey: 7,
    p2_name: 'Devansh Verma',
    p2_class: 6,
    p2_dob: '2014-08-20',
    p2_email: 'parent.devansh@gmail.com',
    p2_photo: 'https://drive.google.com/file/d/p2_photo/view',
    p2_role: 'Batsman',
    p2_bat: 'Right Hand',
    p2_bowl: '',
    p2_jersey: 18,
    payMethod: 'UPI',
    utr: '426589123456',
    amount: '₹13,000',
    proofLink: 'https://drive.google.com/file/d/sample_payment/view'
  });

  const sampleBulkRow = bulkSheet.getRow(2);
  sampleBulkRow.height = 22;
  sampleBulkRow.eachCell(cell => {
    cell.font = { size: 9.5, color: { argb: 'FF0F172A' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: GREEN_BG } };
    cell.border = { top: { style: 'thin', color: { argb: BORDER_COLOR } }, bottom: { style: 'thin', color: { argb: BORDER_COLOR } }, left: { style: 'thin', color: { argb: BORDER_COLOR } }, right: { style: 'thin', color: { argb: BORDER_COLOR } } };
    cell.alignment = { vertical: 'middle' };
  });

  // Save to public and root directory
  const rootPath = path.resolve('d:/Bpl/BPL_Team_Registration_Template.xlsx');
  const publicPath = path.resolve('d:/Bpl/public/BPL_Team_Registration_Template.xlsx');

  await workbook.xlsx.writeFile(rootPath);
  await workbook.xlsx.writeFile(publicPath);

  console.log('✅ BPL Registration Excel Template successfully generated at:');
  console.log('1.', rootPath);
  console.log('2.', publicPath);
}

generateBplExcelTemplate().catch(console.error);
