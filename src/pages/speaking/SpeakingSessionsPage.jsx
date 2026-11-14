import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CalendarClock, ExternalLink, Mic2 } from "lucide-react";
import { api } from "../../services/api.js";
import { useAuth } from "../../context/useAuth.js";

const dashboardFor = {
  INSTITUTE_STUDENT: "/dashboard",
  TRAINER: "/trainer/evaluations",
  INSTITUTE_ADMIN: "/institute/dashboard",
  SUPER_ADMIN: "/admin/tests",
};

function toLocalDateTime(value) {
  const date = new Date(value);
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export default function SpeakingSessionsPage() {
  const { user } = useAuth();
  const role = user?.role;
  const [sessions, setSessions] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [trainerId, setTrainerId] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [studentNotes, setStudentNotes] = useState("");
  const [meetingLinks, setMeetingLinks] = useState({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    try {
      const [sessionResponse, trainerResponse] = await Promise.all([
        api.getSpeakingSessions(),
        role === "INSTITUTE_STUDENT" ? api.getMyLinkedTrainers() : Promise.resolve(null),
      ]);
      setSessions(sessionResponse.data.sessions || []);
      if (trainerResponse) setTrainers(trainerResponse.data.trainers || []);
    } catch (loadError) {
      setError(loadError.message || "Could not load Speaking sessions.");
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    let active = true;
    Promise.all([
      api.getSpeakingSessions(),
      role === "INSTITUTE_STUDENT" ? api.getMyLinkedTrainers() : Promise.resolve(null),
    ])
      .then(([sessionResponse, trainerResponse]) => {
        if (!active) return;
        setSessions(sessionResponse.data.sessions || []);
        if (trainerResponse) setTrainers(trainerResponse.data.trainers || []);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || "Could not load Speaking sessions.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [role]);

  const requestSession = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await api.requestSpeakingSession({
        trainerId,
        scheduledAt: new Date(scheduledAt).toISOString(),
        durationMinutes: Number(durationMinutes),
        studentNotes,
      });
      setScheduledAt("");
      setStudentNotes("");
      setNotice("Session request sent.");
      await load();
    } catch (requestError) {
      setError(requestError.message || "Could not request the session.");
    } finally {
      setBusy(false);
    }
  };

  const update = async (session, status) => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const meetingUrl = meetingLinks[session.id]?.trim();
      await api.updateSpeakingSession(session.id, {
        status,
        ...(meetingUrl ? { meetingUrl } : {}),
      });
      setNotice("Speaking session updated.");
      await load();
    } catch (updateError) {
      setError(updateError.message || "Could not update the session.");
    } finally {
      setBusy(false);
    }
  };

  const isStudent = role === "INSTITUTE_STUDENT";
  const isTrainer = role === "TRAINER";
  const isAdmin = ["INSTITUTE_ADMIN", "SUPER_ADMIN"].includes(role);

  return (
    <main className="min-h-screen bg-[#F8F9FA] px-4 py-8 text-slate-800 dark:bg-[#17151b] dark:text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link to={dashboardFor[role] || "/"} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#EB455F]">
          <ArrowLeft size={16} /> Dashboard
        </Link>
        <div className="mt-6 flex items-center gap-3">
          <span className="rounded-xl bg-rose-100 p-3 text-[#EB455F] dark:bg-[#402a32]"><Mic2 size={22} /></span>
          <div><h1 className="text-2xl font-bold">Live Speaking sessions</h1><p className="mt-1 text-sm text-slate-500 dark:text-slate-300">Schedule and manage sessions with linked Institute Trainers.</p></div>
        </div>

        {error && <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {notice && <p role="status" className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{notice}</p>}

        {isStudent && <form onSubmit={requestSession} className="mt-7 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#49313a] dark:bg-[#211b22] sm:grid-cols-2">
          <h2 className="font-bold sm:col-span-2">Request a Speaking session</h2>
          <label className="grid gap-1 text-sm font-medium">Linked Trainer
            <select required value={trainerId} onChange={(event) => setTrainerId(event.target.value)} className="rounded-lg border border-slate-300 bg-white p-2.5 dark:border-[#49313a] dark:bg-[#17151b]">
              <option value="">Choose a Trainer</option>{trainers.map((trainer) => <option key={trainer.id} value={trainer.id}>{trainer.fullName}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-sm font-medium">Preferred time
            <input required type="datetime-local" value={scheduledAt} onChange={(event) => setScheduledAt(event.target.value)} className="rounded-lg border border-slate-300 bg-white p-2.5 dark:border-[#49313a] dark:bg-[#17151b]" />
          </label>
          <label className="grid gap-1 text-sm font-medium">Duration (minutes)
            <input required type="number" min="1" value={durationMinutes} onChange={(event) => setDurationMinutes(event.target.value)} className="rounded-lg border border-slate-300 bg-white p-2.5 dark:border-[#49313a] dark:bg-[#17151b]" />
          </label>
          <label className="grid gap-1 text-sm font-medium sm:col-span-2">What would you like to practice?
            <textarea value={studentNotes} maxLength={2000} onChange={(event) => setStudentNotes(event.target.value)} rows={3} className="rounded-lg border border-slate-300 bg-white p-2.5 dark:border-[#49313a] dark:bg-[#17151b]" />
          </label>
          <button disabled={busy || !trainers.length} className="rounded-lg bg-[#EB455F] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50 sm:col-span-2">{busy ? "Sending…" : "Request session"}</button>
          {!trainers.length && <p className="text-sm text-slate-500 sm:col-span-2">No active Trainer is linked to your account yet. Ask your Institute Admin to link a Trainer.</p>}
        </form>}

        <section className="mt-8 space-y-3">
          <h2 className="font-bold">Your sessions</h2>
          {loading ? <p className="text-sm text-slate-500">Loading sessions…</p> : sessions.length === 0 ? <p className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">No Speaking sessions found.</p> : sessions.map((session) => <article key={session.id} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-[#49313a] dark:bg-[#211b22]">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <p className="font-semibold">{isStudent ? `Trainer: ${session.trainer.fullName}` : `Student: ${session.student.fullName}`}</p>
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-500"><CalendarClock size={15} />{toLocalDateTime(session.scheduledAt)} · {session.durationMinutes} minutes</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-wide text-[#EB455F]">{session.status}</p>
                {session.studentNotes && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Student note: {session.studentNotes}</p>}
                {session.trainerNotes && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Trainer note: {session.trainerNotes}</p>}
                {session.meetingUrl && <a className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#EB455F]" href={session.meetingUrl} target="_blank" rel="noreferrer">Open meeting link <ExternalLink size={14} /></a>}
              </div>
              <div className="flex min-w-52 flex-col gap-2">
                {isTrainer && session.status === "REQUESTED" && <>
                  <input type="url" placeholder="https:// meeting link" value={meetingLinks[session.id] || ""} onChange={(event) => setMeetingLinks((current) => ({ ...current, [session.id]: event.target.value }))} className="rounded-lg border border-slate-300 bg-white p-2 text-sm dark:border-[#49313a] dark:bg-[#17151b]" />
                  <button disabled={busy} onClick={() => update(session, "CONFIRMED")} className="rounded-lg bg-[#EB455F] px-3 py-2 text-sm font-bold text-white disabled:opacity-50">Confirm with meeting link</button>
                </>}
                {isTrainer && session.status === "CONFIRMED" && <button disabled={busy} onClick={() => update(session, "COMPLETED")} className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-bold text-white disabled:opacity-50">Mark completed</button>}
                {((isStudent && session.status === "REQUESTED") || ((isTrainer || isAdmin) && ["REQUESTED", "CONFIRMED"].includes(session.status))) && <button disabled={busy} onClick={() => update(session, "CANCELLED")} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 disabled:opacity-50 dark:border-[#49313a] dark:text-slate-300">Cancel session</button>}
              </div>
            </div>
          </article>)}
        </section>
        <p className="mt-6 text-xs text-slate-500">This workflow schedules sessions and shares an HTTPS meeting link. It does not provide in-app video calling or audio recording.</p>
      </div>
    </main>
  );
}
