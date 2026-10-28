import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { User } from "../models/user.model.js";
import { Resource } from "../models/resource.model.js";
import { Booking } from "../models/booking.model.js";
import { ConditionInspection } from "../models/conditionInspection.model.js";
import { AuditLog } from "../models/auditLog.model.js";
import { Incident } from "../models/incident.model.js";
import {
  USER_ROLES,
  RESOURCE_CATEGORIES,
  RESOURCE_STATUS,
  BOOKING_STATUS,
  AUDIT_ACTIONS,
  RISK_SEVERITY,
  DB_NAME,
} from "../constants.js";
import crypto from "crypto";

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
    console.log(`Connecting to MongoDB for seeding: ${mongoUri}/${DB_NAME}`);
    await mongoose.connect(`${mongoUri}/${DB_NAME}`);
    console.log("MongoDB connection established.");

    // Clean existing records
    await User.deleteMany({});
    await Resource.deleteMany({});
    await Booking.deleteMany({});
    await ConditionInspection.deleteMany({});
    await AuditLog.deleteMany({});
    await Incident.deleteMany({});
    console.log("Cleared existing database records.");

    // 1. Seed Personas (Judges can toggle between them)
    const elena = await User.create({
      name: "Dr. Elena Vance",
      email: "elena.vance@university.edu",
      role: USER_ROLES.OWNER,
      department: "Advanced Manufacturing & Robotics Lab",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250",
      reputationScore: 0.99,
      weeklyHoursUsed: 0,
      safetyCertificates: [
        {
          name: "Master Machine Shop Supervisor",
          credentialId: "MSS-9901",
          issuingAuthority: "College of Engineering",
          issueDate: new Date("2024-01-10"),
          expiryDate: new Date("2028-01-10"),
          verified: true,
        },
      ],
    });

    const alex = await User.create({
      name: "Alex Chen",
      email: "alex.chen@student.university.edu",
      role: USER_ROLES.REQUESTER,
      department: "Mechanical & Aerospace Engineering",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
      reputationScore: 0.94,
      weeklyHoursUsed: 6, // 6 hrs used out of 10 hr weekly quota
      safetyCertificates: [
        {
          name: "Haas CNC Safety Level 2",
          credentialId: "CNC-L2-4821",
          issuingAuthority: "College Makerspace Safety Board",
          issueDate: new Date("2026-02-15"),
          expiryDate: new Date("2027-02-15"),
          verified: true,
          documentUrl: "https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&q=80&w=400",
        },
        {
          name: "Resin & Chemical Safety Pass",
          credentialId: "RCS-3109",
          issuingAuthority: "Campus EHS",
          issueDate: new Date("2025-09-01"),
          expiryDate: new Date("2026-09-01"),
          verified: true,
        },
      ],
    });

    const marcus = await User.create({
      name: "Marcus Thorne",
      email: "m.thorne@safety.university.edu",
      role: USER_ROLES.ADMIN,
      department: "Campus Safety & Risk Management",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
      reputationScore: 1.0,
      weeklyHoursUsed: 0,
      safetyCertificates: [],
    });

    console.log("Seeded 3 Core Personas (Elena: Owner, Alex: Requester, Marcus: Admin)");

    // 2. Seed 6 Flagship Institutional Resources
    const resources = await Resource.create([
      {
        title: "Haas VF-2 Super Speed CNC Mill",
        category: RESOURCE_CATEGORIES.MACHINERY,
        description: "High-precision 3-axis vertical machining center with 30-hp vector drive, 12,000-rpm spindle, and 30+1 side-mount tool changer. Suitable for aluminum, titanium, and engineering plastics.",
        department: "Mechanical & Aerospace Engineering",
        location: { building: "Engineering High Bay", room: "Shop 104" },
        images: [
          "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=800",
        ],
        owner: elena._id,
        requiredQualifications: ["Haas CNC Safety Level 2"],
        hourlyRate: 15,
        weeklyQuotaLimit: 10,
        isInstantApproval: false,
        status: RESOURCE_STATUS.AVAILABLE,
        specs: {
          "Travel (X, Y, Z)": "30 x 16 x 20 in",
          "Max Spindle Speed": "12,000 RPM",
          "Coolant": "High-Pressure Flood Coolant",
          "Work Envelope": "36 x 14 in T-Slot Table",
        },
      },
      {
        title: "Nikon Eclipse Ti2 Confocal Microscope",
        category: RESOURCE_CATEGORIES.LAB_SPACE,
        description: "Inverted research microscope featuring resonant scanning, 4-laser combiner (405/488/561/640nm), and live-cell environmental incubator chamber for multi-channel fluorescence imaging.",
        department: "Biomedical & Neural Engineering",
        location: { building: "Life Sciences Center", room: "B-212" },
        images: [
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800",
        ],
        owner: elena._id,
        requiredQualifications: ["Bio-imaging Laser Safety Level 1"],
        hourlyRate: 25,
        weeklyQuotaLimit: 8,
        isInstantApproval: false,
        status: RESOURCE_STATUS.AVAILABLE,
        specs: {
          "Laser Lines": "405nm, 488nm, 561nm, 640nm",
          "Resolution": "120nm with Deconvolution",
          "Objectives": "10x, 20x, 40x Oil, 60x Oil, 100x TIRF",
        },
      },
      {
        title: "Formlabs Form 3L Large-Format SLA 3D Printer",
        category: RESOURCE_CATEGORIES.PROTOTYPING,
        description: "Stereolithography (SLA) resin 3D printer with 33.5 x 20 x 30 cm build volume. Capable of printing Tough 2000, Rigid 10K, and Clear resins with 25-micron layer resolution.",
        department: "Makerspace Central Hub",
        location: { building: "Design Innovation Hall", room: "FabLab 12" },
        images: [
          "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=800",
        ],
        owner: elena._id,
        requiredQualifications: ["Resin & Chemical Safety Pass"],
        hourlyRate: 8,
        weeklyQuotaLimit: 16,
        isInstantApproval: true,
        status: RESOURCE_STATUS.AVAILABLE,
        specs: {
          "Build Volume": "33.5 x 20 x 30 cm",
          "XY Resolution": "25 microns",
          "Resin Types": "Standard, Tough, Castable, BioMed",
        },
      },
      {
        title: "RED V-Raptor 8K VV Cinema Camera Package",
        category: RESOURCE_CATEGORIES.MEDIA,
        description: "Multi-format 8K Large Format CMOS sensor camera with REDCODE RAW, 120fps at 8K 17:9, Canon RF mount, 2TB CFexpress cards, and DJI Ronin 2 gimbal integration.",
        department: "Creative Media & VR Lab",
        location: { building: "Fine Arts Center", room: "Studio C" },
        images: [
          "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&q=80&w=800",
        ],
        owner: elena._id,
        requiredQualifications: ["Cinema Gear Field Certification"],
        hourlyRate: 20,
        weeklyQuotaLimit: 12,
        isInstantApproval: false,
        status: RESOURCE_STATUS.AVAILABLE,
        specs: {
          "Sensor": "35.4 Megapixel Full-Frame V-RAPTOR",
          "Dynamic Range": "17+ Stops",
          "Mount": "RF Mount (EF Adapter Included)",
        },
      },
      {
        title: "ISO 5 Photolithography Cleanroom Wet Bench",
        category: RESOURCE_CATEGORIES.LAB_SPACE,
        description: "Dedicated microfluidics and semiconductor fabrication wet bench with spin coater (100–10,000 RPM), automated solvent hood, and UV mask aligner with sub-micron precision.",
        department: "Nanotechnology Institute",
        location: { building: "Nano Fab Facility", room: "Cleanroom 01" },
        images: [
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800",
        ],
        owner: elena._id,
        requiredQualifications: ["Cleanroom Protocol & PPE L3"],
        hourlyRate: 40,
        weeklyQuotaLimit: 6,
        isInstantApproval: false,
        status: RESOURCE_STATUS.AVAILABLE,
        specs: {
          "Cleanliness": "ISO Class 5 (Class 100)",
          "Spin Coater": "Suss Delta 80 (up to 8 inch wafers)",
          "Exposure": "i-line 365nm UV Light Source",
        },
      },
      {
        title: "Rohde & Schwarz 40GHz Spectrum Analyzer Bench",
        category: RESOURCE_CATEGORIES.TESTING_DEVICE,
        description: "FSW43 Signal and Spectrum Analyzer with 2GHz internal analysis bandwidth, ultra-low phase noise, and calibrated microwave test cables up to 40 GHz for RF capstones.",
        department: "Electrical & Computer Engineering",
        location: { building: "Tesla Hall", room: "RF Lab 310" },
        images: [
          "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=800",
        ],
        owner: elena._id,
        requiredQualifications: ["RF Hazard & High-Voltage Lab Safety"],
        hourlyRate: 12,
        weeklyQuotaLimit: 10,
        isInstantApproval: true,
        status: RESOURCE_STATUS.AVAILABLE,
        specs: {
          "Frequency Range": "2 Hz to 43.5 GHz",
          "Analysis Bandwidth": "2 GHz",
          "Noise Figure": "Low-Noise Preamplifier Integrated",
        },
      },
    ]);

    console.log(`Seeded ${resources.length} Flagship Institutional Resources.`);

    // 3. Seed an active booking and audit history for the Haas CNC Mill
    const cncMill = resources[0];
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const tomorrowEnd = new Date(tomorrow.getTime() + 3 * 60 * 60 * 1000);

    const pastBooking = await Booking.create({
      resource: cncMill._id,
      requester: alex._id,
      startTime: tomorrow,
      endTime: tomorrowEnd,
      durationHours: 3,
      purpose: "Precision milling of aluminum brackets for Formula SAE chassis prototype.",
      status: BOOKING_STATUS.APPROVED,
      fairUsageScore: 0.92,
      checkInQrToken: "QR-HAAS-VF2-ALEXCHEN-2026",
    });

    // Create Initial Audit Logs
    const makeAudit = async (action, fromState, toState, justification) => {
      const ts = new Date();
      const hash = crypto
        .createHash("sha256")
        .update(`${pastBooking._id}-${action}-${ts.toISOString()}`)
        .digest("hex");

      return await AuditLog.create({
        booking: pastBooking._id,
        resource: cncMill._id,
        actor: alex._id,
        actorName: alex.name,
        actorRole: alex.role,
        action,
        fromState,
        toState,
        justification,
        tamperHash: hash,
        timestamp: ts,
      });
    };

    await makeAudit(
      AUDIT_ACTIONS.SUBMIT_REQUEST,
      null,
      BOOKING_STATUS.REQUESTED,
      "Submitted reservation for 3 hours with Haas Level 2 safety certificate attached."
    );

    await makeAudit(
      AUDIT_ACTIONS.VERIFY_CREDENTIAL,
      BOOKING_STATUS.REQUESTED,
      BOOKING_STATUS.VERIFYING,
      "Gemini TrustScan verified Haas CNC Level 2 safety cert (Confidence: 0.98)."
    );

    const approvalHash = crypto
      .createHash("sha256")
      .update(`${pastBooking._id}-APPROVE-VANCE`)
      .digest("hex");

    await AuditLog.create({
      booking: pastBooking._id,
      resource: cncMill._id,
      actor: elena._id,
      actorName: elena.name,
      actorRole: elena.role,
      action: AUDIT_ACTIONS.APPROVE_BOOKING,
      fromState: BOOKING_STATUS.VERIFYING,
      toState: BOOKING_STATUS.APPROVED,
      justification: "Safety qualifications verified. Machine window allocated.",
      tamperHash: approvalHash,
      timestamp: new Date(),
    });

    console.log("Seeded sample booking and verifiable audit trail.");
    console.log("Database Seeding Completed Successfully! 🚀");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed with error:", error);
    process.exit(1);
  }
};

seedData();

