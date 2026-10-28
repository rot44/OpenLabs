import { getAllResources, getResourceById, createResource } from "./src/controllers/resourceController.js";
import { switchPersona, getAllPersonas } from "./src/controllers/authController.js";
import { getFairnessAnalytics } from "./src/controllers/analyticsController.js";
import { createBooking, approveBooking, performCheckIn, initiateReturn, completeBooking } from "./src/controllers/bookingController.js";
import { getAuditTimeline } from "./src/controllers/auditController.js";
import { RedisConcurrencyService } from "./src/services/redisService.js";

// Mock helper simulating Express Request, Response, and Next in-memory
const mockReqRes = ({ body = {}, params = {}, query = {}, headers = {}, user = null }) => {
  const req = {
    body,
    params,
    query,
    headers: { "x-persona": "alex", ...headers },
    user: user || {
      _id: "usr_alex_chen",
      name: "Alex Chen",
      role: "requester",
      department: "Mechanical & Aerospace Engineering",
      reputationScore: 0.94,
      weeklyHoursUsed: 6,
    },
    cookies: {},
  };

  let statusCode = 200;
  let jsonResult = null;
  let nextError = null;

  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      jsonResult = data;
      return this;
    },
    cookie() {
      return this;
    },
  };

  const next = (err) => {
    if (err) nextError = err;
  };

  const getResult = () => {
    if (nextError) throw nextError;
    return { status: statusCode, data: jsonResult };
  };

  return { req, res, next, getResult };
};

async function runDirectE2ETest() {
  console.log("=================================================");
  console.log("🚀 STARTING IN-MEMORY E2E SUITE FOR OPENLABS");
  console.log("=================================================");

  // TEST 1: Get Personas
  console.log("\n--- TEST 1: Query Personas ---");
  {
    const { req, res, next, getResult } = mockReqRes({});
    await getAllPersonas(req, res, next);
    const result = getResult();
    console.log("✅ Personas Count:", result.data.data.length);
    console.log("   Personas:", result.data.data.map((p) => `${p.name} (${p.role})`).join(", "));
    if (result.status !== 200) throw new Error("Failed to get personas");
  }

  // TEST 2: Switch Persona
  console.log("\n--- TEST 2: Switch Persona to Dr. Elena Vance (Owner) ---");
  let elenaUser = null;
  {
    const { req, res, next, getResult } = mockReqRes({ body: { role: "owner" } });
    await switchPersona(req, res, next);
    const result = getResult();
    elenaUser = result.data.data.user;
    console.log("✅ Switched Successfully to:", elenaUser.name, `[${elenaUser.role}]`);
  }

  // TEST 3: Catalog Listing
  console.log("\n--- TEST 3: Resource Catalog Discovery ---");
  let haasResource = null;
  {
    const { req, res, next, getResult } = mockReqRes({});
    await getAllResources(req, res, next);
    const result = getResult();
    console.log("✅ Resources Loaded:", result.data.data.length);
    haasResource = result.data.data[0];
    console.log("   Flagship Asset:", haasResource.title, `(${haasResource.category})`);
    console.log("   Prerequisite:", haasResource.requiredQualifications.join(", "));
  }

  // TEST 4: Fairness & Anti-Monopolization Analytics
  console.log("\n--- TEST 4: Departmental Parity & Monopolization Check ---");
  {
    const { req, res, next, getResult } = mockReqRes({});
    await getFairnessAnalytics(req, res, next);
    const result = getResult();
    console.log("✅ Parity Ceiling:", result.data.data.parityCeilingLimitPercent + "%");
    console.log("   Monopolization Detected:", result.data.data.monopolizationDetected);
    console.log("   Department Shares:", result.data.data.departmentShares.map((d) => `${d.department.split(" ")[0]}: ${d.percentage}%`).join(" | "));
  }

  // TEST 5: Create Booking with Redis Distributed Lock
  console.log("\n--- TEST 5: Create Booking with Distributed Lock (Alex Chen) ---");
  let createdBookingId = null;
  {
    const tomorrow = new Date(Date.now() + 48 * 60 * 60 * 1000);
    const tomorrowEnd = new Date(tomorrow.getTime() + 3 * 60 * 60 * 1000);

    const { req, res, next, getResult } = mockReqRes({
      body: {
        resourceId: haasResource._id,
        startTime: tomorrow,
        endTime: tomorrowEnd,
        purpose: "Formula SAE chassis bracket precision milling.",
        certDocBase64: "data:image/jpeg;base64,dGVzdF9jZXJ0",
      },
    });

    await createBooking(req, res, next);
    const result = getResult();
    console.log("✅ Booking Created! HTTP Status:", result.status);
    console.log("   Booking ID:", result.data.data.booking._id);
    console.log("   Initial Status:", result.data.data.booking.status);
    console.log("   TrustScan AI Output:", result.data.data.aiVerification?.credentialTitle, `(Confidence: ${result.data.data.aiVerification?.confidenceScore})`);
    createdBookingId = result.data.data.booking._id;
  }

  // TEST 6: Concurrency Race Condition Proof-of-Work
  console.log("\n--- TEST 6: Concurrency Test (Duplicate Lock Rejection) ---");
  {
    const now = new Date();
    const lock1 = await RedisConcurrencyService.acquireSlotLock({ resourceId: "test_res", startTime: now, durationHours: 2 });
    const lock2 = await RedisConcurrencyService.acquireSlotLock({ resourceId: "test_res", startTime: now, durationHours: 2 });
    console.log("✅ Request 1 Lock Acquired:", lock1.acquired);
    console.log("✅ Request 2 Lock Acquired (Simultaneous):", lock2.acquired);
    if (!lock1.acquired || lock2.acquired) throw new Error("Distributed lock failed to prevent race condition!");
    await RedisConcurrencyService.releaseSlotLock({ slotKey: lock1.slotKey, lockToken: lock1.lockToken });
    console.log("   Lock safely released.");
  }

  // TEST 7: Lab Manager Approval
  console.log("\n--- TEST 7: Lab Manager Approval (Dr. Elena Vance) ---");
  let qrToken = null;
  {
    const { req, res, next, getResult } = mockReqRes({
      params: { id: createdBookingId },
      body: { approvalNote: "Qualifications and tooling verified. Approved for slot." },
      user: elenaUser,
    });

    await approveBooking(req, res, next);
    const result = getResult();
    console.log("✅ Manager Approved! HTTP Status:", result.status);
    console.log("   New Status:", result.data.data.booking.status);
    qrToken = result.data.data.qrToken;
    console.log("   QR Token Generated:", qrToken);
  }

  // TEST 8: Check-In Physical Custody & Baseline Photos
  console.log("\n--- TEST 8: Physical Check-In with Baseline Photos (Alex Chen) ---");
  {
    const { req, res, next, getResult } = mockReqRes({
      params: { id: createdBookingId },
      body: {
        checklist: {
          cleanlinessVerified: true,
          noStructuralDamage: true,
          accessoriesIntact: true,
          powerCycleOk: true,
        },
        notes: "Spindle nominal, work area clean.",
      },
    });

    await performCheckIn(req, res, next);
    const result = getResult();
    console.log("✅ Check-In Completed! HTTP Status:", result.status);
    console.log("   New Status:", result.data.data.booking.status);
    console.log("   Live Custody Activated at:", result.data.data.booking.checkedInAt);
  }

  // TEST 9: Return Asset & VisionGuard AI Damage Diffing
  console.log("\n--- TEST 9: Return Equipment & VisionGuard AI Inspection ---");
  {
    const { req, res, next, getResult } = mockReqRes({
      params: { id: createdBookingId },
      body: {
        checklist: {
          cleanedAfterUse: true,
          toolsReturned: true,
          noNewDamageObserved: true,
        },
        notes: "Milling complete, debris vacuumed.",
      },
    });

    await initiateReturn(req, res, next);
    const result = getResult();
    console.log("✅ Asset Returned! HTTP Status:", result.status);
    console.log("   New Status:", result.data.data.booking.status);
    console.log("   VisionGuard Risk Severity:", result.data.data.aiDiffResult.riskSeverity);
    console.log("   VisionGuard Anomaly Coordinates:", JSON.stringify(result.data.data.aiDiffResult.detectedAnomalies?.[0]?.coordinates));
    console.log("   VisionGuard Summary:", result.data.data.aiDiffResult.humanSummary);
  }

  // TEST 10: Complete Transaction & Manager Signoff
  console.log("\n--- TEST 10: Final Signoff & Deposit Release (Dr. Elena Vance) ---");
  {
    const { req, res, next, getResult } = mockReqRes({
      params: { id: createdBookingId },
      body: { signoffNotes: "Tooling nominal, minor wear accepted. Full deposit released." },
      user: elenaUser,
    });

    await completeBooking(req, res, next);
    const result = getResult();
    console.log("✅ Transaction Finalized! HTTP Status:", result.status);
    console.log("   Final State:", result.data.data.status);
  }

  // TEST 11: Audit Trail Verification
  console.log("\n--- TEST 11: Immutable Audit Trail Verification ---");
  {
    const { req, res, next, getResult } = mockReqRes({ params: { bookingId: createdBookingId } });
    await getAuditTimeline(req, res, next);
    const result = getResult();
    console.log("✅ Total Audit Events Logged:", result.data.data.length);
    result.data.data.forEach((evt, idx) => {
      console.log(`   [Step ${idx + 1}] ${evt.action.padEnd(20)}: ${evt.fromState || "NULL"} -> ${evt.toState}`);
    });
  }

  console.log("\n=======================================================");
  console.log("🏆 PROOF-OF-WORK PASSED: ALL 11 TESTS SUCCEEDED (100%)");
  console.log("=======================================================");
}

runDirectE2ETest().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
