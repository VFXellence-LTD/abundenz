import { useState } from "react";
import { cn } from "@/lib/utils";
import { createCampaignWithTasks, registerBrand, fileInfraTask } from "./intake.api";

type Tab = "campaign" | "brand" | "infra";
const ECO = ["content", "viral", "products", "affiliate", "apps"];

export function IntakeForm() {
  const [tab, setTab] = useState<Tab>("campaign");
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  // campaign fields
  const [cName, setCName] = useState("");
  const [cEco, setCEco] = useState("viral");
  const [cVert, setCVert] = useState("");
  const [cTarget, setCTarget] = useState(3);
  // brand fields
  const [bName, setBName] = useState("");
  const [bEco, setBEco] = useState("viral");
  const [bEmail, setBEmail] = useState("");
  // infra fields
  const [iTitle, setITitle] = useState("");
  const [iDesc, setIDesc] = useState("");

  const wrap = async (fn: () => Promise<void>, ok: string) => {
    setBusy(true);
    setMsg(null);
    try {
      await fn();
      setMsg({ kind: "ok", text: ok });
    } catch (e) {
      setMsg({ kind: "err", text: (e as Error).message });
    } finally {
      setBusy(false);
    }
  };

  const submitCampaign = () =>
    wrap(async () => {
      const { tasks } = await createCampaignWithTasks({
        name: cName, ecosystemId: cEco, verticalId: cVert || undefined, targetCount: cTarget,
      });
      setCName(""); setCVert("");
      setMsg(null);
      return void tasks;
    }, `Campaign created with ${cTarget} task(s).`);

  const submitBrand = () =>
    wrap(async () => {
      await registerBrand({ name: bName, ecosystemId: bEco, email: bEmail });
      setBName(""); setBEmail("");
    }, "Brand registered.");

  const submitInfra = () =>
    wrap(async () => {
      await fileInfraTask(iTitle, iDesc);
      setITitle(""); setIDesc("");
    }, "Infra task filed against Apps.");

  const input = "w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500";
  const label = "mb-1 block text-xs text-zinc-500";
  const tabBtn = (t: Tab, txt: string) => (
    <button
      key={t}
      onClick={() => { setTab(t); setMsg(null); }}
      className={cn(
        "rounded px-4 py-1.5 text-sm font-medium transition-colors",
        tab === t ? "bg-zinc-700 text-zinc-100" : "text-zinc-500 hover:text-zinc-300",
      )}
    >
      {txt}
    </button>
  );

  return (
    <div className="space-y-5">
      <div className="flex w-fit gap-1 rounded-lg border border-zinc-800 bg-zinc-900 p-1">
        {tabBtn("campaign", "New Campaign")}
        {tabBtn("brand", "Register Brand")}
        {tabBtn("infra", "Improve Mission Control")}
      </div>

      {msg && (
        <p className={cn("text-sm", msg.kind === "ok" ? "text-emerald-400" : "text-red-400")}>{msg.text}</p>
      )}

      {tab === "campaign" && (
        <div className="max-w-lg space-y-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <div><label className={label}>Campaign name</label><input className={input} value={cName} onChange={(e) => setCName(e.target.value)} placeholder="Surge Tech Sprint" /></div>
          <div className="flex gap-3">
            <div className="flex-1"><label className={label}>Ecosystem</label>
              <select className={input} value={cEco} onChange={(e) => setCEco(e.target.value)}>{ECO.map((x) => <option key={x} value={x}>{x}</option>)}</select>
            </div>
            <div className="flex-1"><label className={label}>Vertical (optional)</label><input className={input} value={cVert} onChange={(e) => setCVert(e.target.value)} placeholder="tech" /></div>
            <div className="w-28"><label className={label}>Targets</label><input type="number" min={1} max={50} className={input} value={cTarget} onChange={(e) => setCTarget(Math.max(1, Number(e.target.value) || 1))} /></div>
          </div>
          <button disabled={busy || !cName.trim()} onClick={submitCampaign} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50">Create campaign + tasks</button>
        </div>
      )}

      {tab === "brand" && (
        <div className="max-w-lg space-y-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <div><label className={label}>Brand name</label><input className={input} value={bName} onChange={(e) => setBName(e.target.value)} placeholder="Anon brand" /></div>
          <div className="flex gap-3">
            <div className="flex-1"><label className={label}>Ecosystem</label>
              <select className={input} value={bEco} onChange={(e) => setBEco(e.target.value)}>{ECO.map((x) => <option key={x} value={x}>{x}</option>)}</select>
            </div>
            <div className="flex-1"><label className={label}>Email</label><input className={input} value={bEmail} onChange={(e) => setBEmail(e.target.value)} placeholder="brand@example.com" /></div>
          </div>
          <button disabled={busy || !bName.trim()} onClick={submitBrand} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50">Register brand</button>
        </div>
      )}

      {tab === "infra" && (
        <div className="max-w-lg space-y-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <div><label className={label}>What should Mission Control do better?</label><input className={input} value={iTitle} onChange={(e) => setITitle(e.target.value)} placeholder="Add bulk-approve to the queue" /></div>
          <div><label className={label}>Detail</label><textarea rows={3} className={cn(input, "resize-y")} value={iDesc} onChange={(e) => setIDesc(e.target.value)} placeholder="Why and rough shape…" /></div>
          <button disabled={busy || !iTitle.trim()} onClick={submitInfra} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50">File infra task</button>
        </div>
      )}
    </div>
  );
}
