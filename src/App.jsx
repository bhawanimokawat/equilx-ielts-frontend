
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";

function StudentDashboard() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] p-6 text-[#2B3467] dark:bg-[#17151b] dark:text-white sm:p-10">
      <div className="mx-auto max-w-6xl">
        <a href="/" className="text-sm text-[#EB455F]">
          ← Equilx IELTS
        </a>

        <h1 className="mt-8 text-3xl font-bold">
          Student Dashboard
        </h1>

        <p className="mt-3 text-slate-600 dark:text-slate-300">
          Your IELTS preparation workspace starts here.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {["Listening", "Reading", "Writing", "Speaking"].map((skill) => (
            <article
              key={skill}
              className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-[#49313a] dark:bg-[#211b22]"
            >
              <h2 className="text-lg font-semibold">{skill}</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
                Practice module
              </p>
              <button
                type="button"
                onClick={() => alert("We will build this practice module next.")}
                className="mt-5 rounded-xl bg-[#EB455F] px-4 py-2 text-sm font-semibold text-white"
              >
                Open practice
              </button>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
