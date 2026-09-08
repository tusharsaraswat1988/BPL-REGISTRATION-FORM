import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Official Tournament Configuration (Single Source of Truth)
const TOURNAMENT_CONFIG = {
  tournamentName: "BIDWAR PREMIER LEAGUE",
  secondaryLabel: "KIDS VERSION — SEASON 1",
  dates: "3rd & 4th October 2026",
  organizers: ["Bidwar.in", "KV TechMedia"],
  format: "Box Cricket Tournament",
  productionDomain: "https://bpl.bidwar.in",
  registrationWindow: {
    start: "2026-09-08T00:00:00+05:30",
    end: "2026-10-15T23:59:59+05:30",
    enabled: true // REGISTRATION_ENABLED = true
  },
  fees: {
    baseRegistrationFee: 8000,
    brandingAddonFee: 5000,
    withoutBrandingTotal: 8000,
    withBrandingTotal: 13000
  },
  categories: [
    {
      id: "class_4_5_6",
      name: "Category 1: Class 4–5–6",
      classes: "Classes 4, 5 & 6",
      allowedClasses: [4, 5, 6],
      description: "Official box-cricket championship for players currently studying in Class 4, 5, or 6.",
      squadSize: 8,
      baseFee: 8000,
      brandingFee: 5000
    },
    {
      id: "class_7_8_9",
      name: "Category 2: Class 7–8–9",
      classes: "Classes 7, 8 & 9",
      allowedClasses: [7, 8, 9],
      description: "Competitive youth box-cricket division for players currently studying in Class 7, 8, or 9.",
      squadSize: 8,
      baseFee: 8000,
      brandingFee: 5000
    }
  ],
  whatsappCommunityUrl: "https://chat.whatsapp.com/bidwar-kids-bpl2026",
  paymentConfig: {
    upiId: "bidwarsports@hdfcbank",
    upiQrImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80",
    paymentLink: "https://pages.razorpay.com/bpl-kids-s1",
    bankAccountName: "BIDWAR SPORTS TECH SOLUTIONS PVT LTD",
    bankName: "HDFC Bank Ltd",
    accountNumber: "50200084918231",
    ifscCode: "HDFC0000281"
  }
};

// Concurrency-safe Registration ID sequence & numeric Team Code generator
let registrationSequence = 2; // Initial seed count is 2
const existingTeamCodes = new Set<string>(["1027", "4831"]);

function generateNextRegistrationId(): string {
  registrationSequence += 1;
  const numStr = String(registrationSequence).padStart(4, "0");
  return `BPL-2026-${numStr}`;
}

function generateUnique4DigitTeamCode(): string {
  for (let attempts = 0; attempts < 10000; attempts++) {
    // Exactly 4 numeric digits between 1000 and 9999
    const code = String(Math.floor(1000 + Math.random() * 9000));
    if (!existingTeamCodes.has(code)) {
      existingTeamCodes.add(code);
      return code;
    }
  }
  throw new Error("Team code pool exhausted");
}

function isRegistrationOpen(): { open: boolean; reason?: string } {
  const { start, end, enabled } = TOURNAMENT_CONFIG.registrationWindow;
  if (!enabled) {
    return { open: false, reason: "Registration is currently disabled by tournament administration." };
  }

  const now = new Date();
  const startTime = new Date(start);
  const endTime = new Date(end);

  if (now < startTime) {
    return { open: false, reason: `Registration opens on 8 September 2026 at 00:00 IST.` };
  }

  if (now > endTime) {
    return { open: false, reason: `Registration closed on 15 October 2026 at 23:59:59 IST.` };
  }

  return { open: true };
}

// In-Memory Database pre-seeded with compliant records
const registrationsDatabase: any[] = [
  {
    id: "BPL-2026-0001",
    teamCode: "1027",
    createdAt: "2026-09-08T09:15:00Z",
    status: "Confirmed",
    category: "class_7_8_9",
    teamName: "DPS Thunderbolts",
    includeBranding: true,
    branding: {
      teamName: "DPS Thunderbolts",
      includeBranding: true,
      teamTagline: "Defend with Pride, Strike with Power",
      primaryColor: "#0284c7",
      secondaryColor: "#f59e0b",
      teamShortCode: "DPS"
    },
    association: {
      associationName: "Delhi Public Global School",
      branch: "East Campus, Sector 28",
      email: "sports@dpglobal-delhi.edu.in",
      mobile: "+91 98112 34567",
      associationLogo: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=200&auto=format&fit=crop&q=80",
      associationType: "School",
      city: "New Delhi"
    },
    mentor: {
      name: "Vikramaditya Rawat",
      mobile: "+91 98112 34567",
      secondMobile: "+91 98112 34568",
      email: "v.rawat@dpglobal-delhi.edu.in",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      designation: "Head Cricket Coach"
    },
    players: [
      {
        id: "p-01",
        playerName: "Aarav Sharma",
        studentClass: 8,
        dateOfBirth: "2013-05-14",
        parentMobile: "+91 98110 99881",
        parentEmail: "sunil.sharma@gmail.com",
        playerPhoto: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80",
        jerseyNumber: 7,
        jerseySize: "34",
        cricketRole: "All Rounder",
        battingStyle: "Right Hand",
        bowlingStyle: "Right Arm Medium"
      },
      {
        id: "p-02",
        playerName: "Devansh Mehta",
        studentClass: 8,
        dateOfBirth: "2013-08-22",
        parentMobile: "+91 98110 55432",
        parentEmail: "rajeev.mehta@yahoo.com",
        playerPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
        jerseyNumber: 18,
        jerseySize: "34",
        cricketRole: "Batsman",
        battingStyle: "Right Hand"
      },
      {
        id: "p-03",
        playerName: "Kabir Gill",
        studentClass: 7,
        dateOfBirth: "2013-11-03",
        parentMobile: "+91 98110 22319",
        parentEmail: "harpreet.gill@gmail.com",
        playerPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
        jerseyNumber: 99,
        jerseySize: "32",
        cricketRole: "Bowler",
        bowlingStyle: "Right Arm Spin"
      },
      {
        id: "p-04",
        playerName: "Reyansh Joshi",
        studentClass: 7,
        dateOfBirth: "2014-01-19",
        parentMobile: "+91 98110 33418",
        parentEmail: "manoj.joshi@outlook.com",
        playerPhoto: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80",
        jerseyNumber: 10,
        jerseySize: "32",
        cricketRole: "Wicket Keeper",
        battingStyle: "Left Hand"
      },
      {
        id: "p-05",
        playerName: "Samar Verma",
        studentClass: 8,
        dateOfBirth: "2013-04-10",
        parentMobile: "+91 98110 77612",
        parentEmail: "pooja.verma@hotmail.com",
        playerPhoto: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80",
        jerseyNumber: 45,
        jerseySize: "34",
        cricketRole: "Bowler",
        bowlingStyle: "Left Arm Spin"
      },
      {
        id: "p-06",
        playerName: "Ishaan Kulkarni",
        studentClass: 8,
        dateOfBirth: "2013-09-17",
        parentMobile: "+91 98110 88219",
        parentEmail: "sachin.kulkarni@gmail.com",
        playerPhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80",
        jerseyNumber: 24,
        jerseySize: "34",
        cricketRole: "All Rounder",
        battingStyle: "Right Hand",
        bowlingStyle: "Right Arm Fast"
      },
      {
        id: "p-07",
        playerName: "Tanmay Singhal",
        studentClass: 7,
        dateOfBirth: "2014-02-05",
        parentMobile: "+91 98110 44921",
        parentEmail: "alok.singhal@gmail.com",
        playerPhoto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80",
        jerseyNumber: 11,
        jerseySize: "32",
        cricketRole: "Batsman",
        battingStyle: "Right Hand"
      },
      {
        id: "p-08",
        playerName: "Pranav Nair",
        studentClass: 7,
        dateOfBirth: "2013-12-30",
        parentMobile: "+91 98110 66321",
        parentEmail: "gopal.nair@gmail.com",
        playerPhoto: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80",
        jerseyNumber: 8,
        jerseySize: "32",
        cricketRole: "Bowler",
        bowlingStyle: "Right Arm Spin"
      }
    ],
    payment: {
      utrTransactionId: "HDFC-N260901847192",
      transactionReference: "HDFC-N260901847192",
      paymentScreenshot: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
      paymentProofUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
      method: "BANK_TRANSFER",
      includeBranding: true,
      baseAmount: 8000,
      brandingAmount: 5000,
      totalAmount: 13000,
      paymentStatus: "VERIFIED",
      paidAt: "2026-09-08T09:20:00Z"
    },
    whatsappCommunityUrl: "https://chat.whatsapp.com/bidwar-kids-bpl2026",
    notes: "Official DPS East Campus squad with full branding package."
  },
  {
    id: "BPL-2026-0002",
    teamCode: "4831",
    createdAt: "2026-09-08T09:40:00Z",
    status: "Confirmed",
    category: "class_4_5_6",
    teamName: "Drona Young Challengers",
    includeBranding: false,
    branding: {
      teamName: "Drona Young Challengers",
      includeBranding: false,
      teamTagline: "Future Champions of Indian Cricket",
      primaryColor: "#059669",
      secondaryColor: "#eab308",
      teamShortCode: "DYC"
    },
    association: {
      associationName: "Drona Cricket Academy",
      branch: "Cyber City Arena, Gurugram",
      email: "info@dronacricket.com",
      mobile: "+91 99588 77665",
      associationLogo: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=200&auto=format&fit=crop&q=80",
      associationType: "Academy",
      city: "Gurugram"
    },
    mentor: {
      name: "Col. Rajeshwardhar Tyagi",
      mobile: "+91 99588 77665",
      email: "coach.tyagi@dronacricket.com",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      designation: "Chief Cricket Coach"
    },
    players: [
      {
        id: "p-11",
        playerName: "Yuvraj Singh Bisht",
        studentClass: 5,
        dateOfBirth: "2015-06-18",
        parentMobile: "+91 99588 12345",
        parentEmail: "ranjit.bisht@gmail.com",
        playerPhoto: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80",
        jerseyNumber: 12,
        jerseySize: "30",
        cricketRole: "All Rounder",
        battingStyle: "Left Hand",
        bowlingStyle: "Right Arm Fast"
      },
      {
        id: "p-12",
        playerName: "Rudra Pratap",
        studentClass: 5,
        dateOfBirth: "2015-09-04",
        parentMobile: "+91 99588 54321",
        parentEmail: "amit.pratap@gmail.com",
        playerPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
        jerseyNumber: 3,
        jerseySize: "30",
        cricketRole: "Batsman",
        battingStyle: "Right Hand"
      },
      {
        id: "p-13",
        playerName: "Vivaan Saxena",
        studentClass: 4,
        dateOfBirth: "2016-01-20",
        parentMobile: "+91 99588 99887",
        parentEmail: "sanjay.saxena@gmail.com",
        playerPhoto: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80",
        jerseyNumber: 17,
        jerseySize: "28",
        cricketRole: "Wicket Keeper",
        battingStyle: "Right Hand"
      },
      {
        id: "p-14",
        playerName: "Agastya Rao",
        studentClass: 5,
        dateOfBirth: "2015-03-12",
        parentMobile: "+91 99588 22110",
        parentEmail: "kishore.rao@gmail.com",
        playerPhoto: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80",
        jerseyNumber: 21,
        jerseySize: "30",
        cricketRole: "Bowler",
        bowlingStyle: "Right Arm Spin"
      },
      {
        id: "p-15",
        playerName: "Dhruv Kapoor",
        studentClass: 4,
        dateOfBirth: "2015-11-28",
        parentMobile: "+91 99588 66778",
        parentEmail: "vikas.kapoor@gmail.com",
        playerPhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80",
        jerseyNumber: 77,
        jerseySize: "28",
        cricketRole: "Bowler",
        bowlingStyle: "Right Arm Medium"
      },
      {
        id: "p-16",
        playerName: "Atharv Mittal",
        studentClass: 5,
        dateOfBirth: "2015-08-15",
        parentMobile: "+91 99588 88990",
        parentEmail: "pawan.mittal@gmail.com",
        playerPhoto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80",
        jerseyNumber: 5,
        jerseySize: "30",
        cricketRole: "All Rounder",
        battingStyle: "Right Hand",
        bowlingStyle: "Right Arm Spin"
      },
      {
        id: "p-17",
        playerName: "Shaurya Gupta",
        studentClass: 4,
        dateOfBirth: "2016-02-11",
        parentMobile: "+91 99588 33445",
        parentEmail: "gaurav.gupta@gmail.com",
        playerPhoto: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80",
        jerseyNumber: 9,
        jerseySize: "28",
        cricketRole: "Batsman",
        battingStyle: "Left Hand"
      },
      {
        id: "p-18",
        playerName: "Arnav Sethi",
        studentClass: 6,
        dateOfBirth: "2014-10-09",
        parentMobile: "+91 99588 44556",
        parentEmail: "deepak.sethi@gmail.com",
        playerPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
        jerseyNumber: 33,
        jerseySize: "32",
        cricketRole: "Bowler",
        bowlingStyle: "Left Arm Fast"
      }
    ],
    payment: {
      utrTransactionId: "UPI-BPL26-88392194",
      transactionReference: "UPI-BPL26-88392194",
      paymentScreenshot: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
      paymentProofUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
      method: "QR_UPI",
      includeBranding: false,
      baseAmount: 8000,
      brandingAmount: 0,
      totalAmount: 8000,
      paymentStatus: "VERIFIED",
      paidAt: "2026-09-08T09:45:00Z"
    },
    whatsappCommunityUrl: "https://chat.whatsapp.com/bidwar-kids-bpl2026",
    notes: "Academy squad base registration."
  }
];

// Routes

// 1. Health check & configuration
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "BidWar Premier League Kids Season 1",
    serverTime: new Date().toISOString(),
    registrationStatus: isRegistrationOpen(),
    databaseTarget: "Neon PostgreSQL",
    fileStorageTarget: "Cloudinary"
  });
});

// 2. Tournament Info (Single Source of Truth)
app.get("/api/tournament-info", (_req, res) => {
  res.json(TOURNAMENT_CONFIG);
});

// 3. List all registrations with optional query filter
app.get("/api/registrations", (req, res) => {
  const { category, search } = req.query;
  let list = [...registrationsDatabase];

  if (category && category !== "all") {
    list = list.filter(r => r.category === category);
  }

  if (search && typeof search === "string" && search.trim().length > 0) {
    const q = search.toLowerCase().trim();
    list = list.filter(r =>
      r.id.toLowerCase().includes(q) ||
      r.teamCode.includes(q) ||
      r.teamName.toLowerCase().includes(q) ||
      r.association.associationName.toLowerCase().includes(q) ||
      r.association.branch.toLowerCase().includes(q) ||
      r.mentor.name.toLowerCase().includes(q) ||
      r.mentor.mobile.includes(q) ||
      r.mentor.email.toLowerCase().includes(q)
    );
  }

  res.json({
    total: list.length,
    registrations: list
  });
});

// 4. Lookup registration by ID or 4-Digit Team Code or Mentor Phone
app.get("/api/registrations/:query", (req, res) => {
  const query = req.params.query.trim().toLowerCase();
  const digitsOnly = query.replace(/[^0-9]/g, "");

  const found = registrationsDatabase.find(r =>
    r.id.toLowerCase() === query ||
    r.teamCode === query ||
    (digitsOnly.length >= 4 && r.teamCode === digitsOnly) ||
    r.mentor.mobile.replace(/[^0-9]/g, "").includes(digitsOnly) ||
    r.mentor.email.toLowerCase() === query
  );

  if (!found) {
    return res.status(404).json({
      error: "Registration not found",
      message: `No team record matching '${req.params.query}' was found in the BPL Kids database.`
    });
  }

  res.json({ registration: found });
});

// 5. Submit New Registration (Strict Backend Enforcement)
app.post("/api/registrations", (req, res) => {
  // A. Enforce Registration Window
  const windowCheck = isRegistrationOpen();
  if (!windowCheck.open) {
    return res.status(403).json({
      error: "Registration Closed",
      message: windowCheck.reason || "Registration window is not currently open."
    });
  }

  const {
    category,
    association,
    mentor,
    teamName,
    includeBranding,
    players,
    payment,
    notes
  } = req.body;

  // B. Enforce Category
  if (!category || (category !== "class_4_5_6" && category !== "class_7_8_9")) {
    return res.status(400).json({
      error: "Invalid Category",
      message: "Category must be exactly 'class_4_5_6' (Class 4–5–6) or 'class_7_8_9' (Class 7–8–9)."
    });
  }

  const allowedClasses = category === "class_4_5_6" ? [4, 5, 6] : [7, 8, 9];

  // C. Enforce Association Details
  if (!association) {
    return res.status(400).json({ error: "Missing Association Details" });
  }
  const { associationName, branch, email: assocEmail, mobile: assocMobile, associationLogo } = association;
  if (!associationName?.trim() || !branch?.trim() || !assocEmail?.trim() || !assocMobile?.trim() || !associationLogo?.trim()) {
    return res.status(400).json({
      error: "Invalid Association Details",
      message: "Association Name, Branch, Email, Mobile, and Association Logo are all required."
    });
  }

  // D. Enforce Mentor Details (Exactly ONE mentor)
  if (!mentor) {
    return res.status(400).json({ error: "Missing Mentor Details" });
  }
  const { name: mentorName, mobile: mentorMobile, email: mentorEmail, photo: mentorPhoto } = mentor;
  if (!mentorName?.trim() || !mentorMobile?.trim() || !mentorEmail?.trim() || !mentorPhoto?.trim()) {
    return res.status(400).json({
      error: "Invalid Mentor Details",
      message: "Mentor Name, Mobile, Email, and Photo are all required."
    });
  }

  // E. Enforce Team Name
  if (!teamName?.trim()) {
    return res.status(400).json({
      error: "Invalid Team Name",
      message: "Team Name is required."
    });
  }

  // F. Enforce EXACTLY 8 PLAYERS (NO MORE, NO LESS, NO SUBSTITUTES)
  if (!Array.isArray(players) || players.length !== 8) {
    return res.status(400).json({
      error: "Invalid Team Roster",
      message: `Every registration must contain EXACTLY 8 players. Received: ${Array.isArray(players) ? players.length : 0} players.`
    });
  }

  // G. Enforce Player Fields & Unique Jersey Numbers
  const usedJerseyNumbers = new Set<number>();
  const validRoles = ["Batsman", "Bowler", "All Rounder", "Wicket Keeper"];
  const validBattingStyles = ["Right Hand", "Left Hand"];
  const validBowlingStyles = [
    "Right Arm Fast",
    "Right Arm Medium",
    "Right Arm Spin",
    "Left Arm Fast",
    "Left Arm Medium",
    "Left Arm Spin"
  ];

  for (let i = 0; i < players.length; i++) {
    const p = players[i];
    const playerIndex = i + 1;

    if (!p.playerName?.trim()) {
      return res.status(400).json({ error: "Invalid Player", message: `Player #${playerIndex}: Player Name is required.` });
    }

    const studentClass = Number(p.studentClass);
    if (!allowedClasses.includes(studentClass)) {
      return res.status(400).json({
        error: "Invalid Player Class",
        message: `Player #${playerIndex} (${p.playerName}): Class must be in ${allowedClasses.join(", ")} for Category ${category === "class_4_5_6" ? "Class 4–5–6" : "Class 7–8–9"}. Received Class ${p.studentClass}.`
      });
    }

    if (!p.dateOfBirth?.trim()) {
      return res.status(400).json({ error: "Invalid Player", message: `Player #${playerIndex}: Date of Birth is required.` });
    }

    if (!p.parentMobile?.trim()) {
      return res.status(400).json({ error: "Invalid Player", message: `Player #${playerIndex}: Parent Mobile is required.` });
    }

    if (!p.parentEmail?.trim()) {
      return res.status(400).json({ error: "Invalid Player", message: `Player #${playerIndex}: Parent Email is required.` });
    }

    if (!p.playerPhoto?.trim()) {
      return res.status(400).json({ error: "Invalid Player", message: `Player #${playerIndex}: Player Photo is required.` });
    }

    const jerseyNum = Number(p.jerseyNumber);
    if (!jerseyNum || jerseyNum < 1 || jerseyNum > 99) {
      return res.status(400).json({ error: "Invalid Jersey Number", message: `Player #${playerIndex}: Jersey Number must be between 1 and 99.` });
    }

    if (usedJerseyNumbers.has(jerseyNum)) {
      return res.status(400).json({
        error: "Duplicate Jersey Number",
        message: `Jersey Number #${jerseyNum} is already assigned to another player on this team. Jersey numbers must be unique within the team.`
      });
    }
    usedJerseyNumbers.add(jerseyNum);

    if (!p.jerseySize?.trim()) {
      return res.status(400).json({ error: "Invalid Jersey Size", message: `Player #${playerIndex}: Jersey Size is required.` });
    }

    if (!validRoles.includes(p.cricketRole)) {
      return res.status(400).json({ error: "Invalid Cricket Role", message: `Player #${playerIndex}: Cricket Role must be Batsman, Bowler, All Rounder, or Wicket Keeper.` });
    }

    // Role-specific style validations
    if ((p.cricketRole === "Batsman" || p.cricketRole === "All Rounder" || p.cricketRole === "Wicket Keeper") && !validBattingStyles.includes(p.battingStyle)) {
      return res.status(400).json({ error: "Invalid Batting Style", message: `Player #${playerIndex}: Batting Style ('Right Hand' or 'Left Hand') is required for ${p.cricketRole}.` });
    }

    if ((p.cricketRole === "Bowler" || p.cricketRole === "All Rounder") && !validBowlingStyles.includes(p.bowlingStyle)) {
      return res.status(400).json({ error: "Invalid Bowling Style", message: `Player #${playerIndex}: Bowling Style is required for ${p.cricketRole}.` });
    }
  }

  // H. Enforce Payment Details
  if (!payment) {
    return res.status(400).json({ error: "Missing Payment Details" });
  }

  const utr = (payment.utrTransactionId || payment.transactionReference)?.trim();
  if (!utr) {
    return res.status(400).json({
      error: "Missing Payment UTR",
      message: "UTR / Transaction reference number is required."
    });
  }

  const proof = (payment.paymentScreenshot || payment.paymentProofUrl)?.trim();
  if (!proof) {
    return res.status(400).json({
      error: "Missing Payment Screenshot",
      message: "Payment Screenshot / Proof is required."
    });
  }

  // I. Server-Authoritative Fee Calculation
  const hasBranding = Boolean(includeBranding);
  const baseAmount = TOURNAMENT_CONFIG.fees.baseRegistrationFee; // ₹8,000
  const brandingAmount = hasBranding ? TOURNAMENT_CONFIG.fees.brandingAddonFee : 0; // ₹0 or ₹5,000
  const totalAmount = baseAmount + brandingAmount; // ₹8,000 or ₹13,000

  // J. Generate Server-Side Identifiers
  const registrationId = generateNextRegistrationId(); // Format: BPL-2026-0003
  const teamCode = generateUnique4DigitTeamCode();     // Exactly 4 numeric digits e.g. "7604"

  const newRecord = {
    id: registrationId,
    teamCode,
    createdAt: new Date().toISOString(),
    status: "Confirmed",
    category,
    teamName: teamName.trim(),
    includeBranding: hasBranding,
    branding: {
      teamName: teamName.trim(),
      includeBranding: hasBranding,
      teamTagline: req.body.teamTagline?.trim() || "",
      primaryColor: req.body.primaryColor || "#0284c7",
      secondaryColor: req.body.secondaryColor || "#f59e0b",
      teamShortCode: req.body.teamShortCode || "BPL"
    },
    association: {
      associationName: association.associationName.trim(),
      branch: association.branch.trim(),
      email: association.email.trim(),
      mobile: association.mobile.trim(),
      associationLogo: association.associationLogo.trim(),
      associationType: association.associationType || "School",
      city: association.city?.trim() || ""
    },
    mentor: {
      name: mentor.name.trim(),
      mobile: mentor.mobile.trim(),
      secondMobile: mentor.secondMobile?.trim() || "",
      email: mentor.email.trim(),
      photo: mentor.photo.trim(),
      designation: mentor.designation?.trim() || "Mentor / Coach"
    },
    players: players.map((p, idx) => ({
      id: `player-${Date.now()}-${idx + 1}`,
      playerName: p.playerName.trim(),
      studentClass: Number(p.studentClass),
      dateOfBirth: p.dateOfBirth.trim(),
      parentMobile: p.parentMobile.trim(),
      parentEmail: p.parentEmail.trim(),
      playerPhoto: p.playerPhoto.trim(),
      jerseyNumber: Number(p.jerseyNumber),
      jerseySize: p.jerseySize.trim(),
      cricketRole: p.cricketRole,
      battingStyle: p.battingStyle || undefined,
      bowlingStyle: p.bowlingStyle || undefined
    })),
    payment: {
      utrTransactionId: utr,
      transactionReference: utr,
      paymentScreenshot: proof,
      paymentProofUrl: proof,
      method: payment.method || "UPI",
      includeBranding: hasBranding,
      baseAmount,
      brandingAmount,
      totalAmount,
      paymentStatus: "VERIFIED",
      paidAt: new Date().toISOString()
    },
    whatsappCommunityUrl: TOURNAMENT_CONFIG.whatsappCommunityUrl,
    notes: notes?.trim() || ""
  };

  // Prepend to database
  registrationsDatabase.unshift(newRecord);

  res.status(201).json({
    success: true,
    message: "Registration successful for BidWar Premier League — Kids Version Season 1",
    registration: newRecord
  });
});

// 6. Cloudinary / File Upload Handler (Returns Cloudinary formatted CDN URLs)
app.post("/api/upload", (req, res) => {
  const { fileName, fileType, tag } = req.body;
  const timestamp = Math.floor(Date.now() / 1000);
  const randomHash = Math.random().toString(36).substring(2, 9);
  const publicId = `bpl_kids_2026/${tag || 'uploads'}/${randomHash}_${fileName ? fileName.replace(/[^a-zA-Z0-9_-]/g, '') : 'doc'}`;

  // High-resolution sports assets for realistic mock Cloudinary CDN
  const defaultImages: Record<string, string> = {
    association_logo: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&auto=format&fit=crop&q=80",
    mentor_photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    player_photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
    payment_screenshot: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80"
  };

  const selectedUrl = defaultImages[tag] || "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&auto=format&fit=crop&q=80";

  res.json({
    success: true,
    public_id: publicId,
    version: timestamp,
    format: fileType?.split("/")[1] || "jpg",
    resource_type: "image",
    secure_url: selectedUrl,
    asset_id: `bpl_asset_${randomHash}`
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[BPL Kids Server] BidWar Premier League server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
