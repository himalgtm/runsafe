import { useEffect, useRef, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '@clerk/clerk-react';
import { useUser } from "@clerk/clerk-react";


const LS_KEY = 'runsafe_diary';

function loadLocal() {
	try {
		return JSON.parse(localStorage.getItem(LS_KEY) || '[]');
	} catch {
		return [];
	}
}
function saveLocal(list) {
	localStorage.setItem(LS_KEY, JSON.stringify(list));
}

export default function Diary() {
	const { isSignedIn, isLoaded, getToken } = useAuth();
	const { user } = useUser();
	
	const [cough, setCough] = useState(0);
	const [wheeze, setWheeze] = useState(0);
	const [sob, setSob] = useState(0);
	const [notes, setNotes] = useState('');
	const [all, setAll] = useState(loadLocal());
	const [saving, setSaving] = useState(false);
	const coordRef = useRef(null);

	useEffect(() => {
		if (!('geolocation' in navigator)) return;
		const id = navigator.geolocation.watchPosition(
			(pos) => (coordRef.current = { lat: pos.coords.latitude, lon: pos.coords.longitude }),
			() => {},
			{ enableHighAccuracy: true, maximumAge: 15000, timeout: 10000 }
		);
		return () => navigator.geolocation.clearWatch(id);
	}, []);

	useEffect(() => {
		if (!isLoaded || !isSignedIn) return;
		(async () => {
			try {
				const token = await getToken();
				const data = await api('/api/diary/list', { token });
				if (Array.isArray(data?.entries)) {
					setAll(data.entries);
					saveLocal(data.entries);
				}
			} catch (e) {
				console.warn('load diary failed:', e?.message || e);
			}
		})();
	}, [isSignedIn, isLoaded, getToken]);

	async function snapshotAQI() {
		try {
			const c = coordRef.current;
			if (!c) return null;
			const r = await api(`/api/air/now?lat=${c.lat}&lon=${c.lon}`);
			return { aqi: r.aqi ?? null, city: r.city ?? null, pm25: r.pm25 ?? null };
		} catch {
			return null;
		}
	}

	async function handleSave(e) {
		e.preventDefault();
		setSaving(true);
		var email = user.primaryEmailAddress.emailAddress;
		try {
			const entry = {
				userId: email,
				id: crypto.randomUUID(),
				ts: Date.now(),
				cough,
				wheeze,
				sob,
				notes: notes?.trim() || '',
				coords: coordRef.current ? { ...coordRef.current } : null,
				aqi: await snapshotAQI(),
			};

			// local first
			const next = [entry, ...all].sort((a, b) => b.ts - a.ts).slice(0, 200);
			setAll(next);
			saveLocal(next);

			if (isSignedIn) {
				try {
					const token = await getToken();
					await api('/api/diary/log', { method: 'POST', token, body: entry });
					const data = await api('/api/diary/list', { token });
					if (Array.isArray(data?.entries)) {
						setAll(data.entries);
						saveLocal(data.entries);
					}
				} catch (err) {
					console.warn('server sync failed:', err?.message || err);
				}
			}

			setCough(0);
			setWheeze(0);
			setSob(0); // keep notes
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className="min-h-[calc(100vh-56px)] bg-[radial-gradient(900px_600px_at_10%_0%,#e9d5ff33,transparent),radial-gradient(900px_600px_at_90%_0%,#a7f3d033,transparent)]">
			<main className="mx-auto max-w-6xl px-4 py-8 grid lg:grid-cols-3 gap-6">
				<section className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
					<h2 className="text-lg font-semibold mb-4">Daily symptoms</h2>

					{!isSignedIn && isLoaded && <div className="mb-4 text-sm text-slate-600">Optional sign-in: Log in to sync securely; otherwise entries stay on your device.</div>}

					<form onSubmit={handleSave} className="space-y-6">
						<Slider label="Cough (0–3)" value={cough} setValue={setCough} />
						<Slider label="Wheeze (0–3)" value={wheeze} setValue={setWheeze} />
						<Slider label="Shortness of breath (0–3)" value={sob} setValue={setSob} />
						<div>
							<label className="text-sm block mb-1 text-slate-700">Notes</label>
							<textarea rows={4} className="w-full rounded border border-slate-300 p-2 text-sm" placeholder="Optional notes…" value={notes} onChange={(e) => setNotes(e.target.value)} />
						</div>
						<button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 disabled:opacity-60">
							{saving ? 'Saving…' : 'Save entry'}
						</button>
					</form>
				</section>

				<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
					<h3 className="font-semibold mb-3">Recent entries</h3>
					<ul className="space-y-3 max-h-[55vh] overflow-auto pr-1">
						{all.length === 0 && <li className="text-sm text-slate-500">No entries yet.</li>}
						{all.map((e) => (
							<li key={e.id} className="text-sm rounded-lg border border-slate-200 p-3">
								<div className="font-medium">{new Date(e.ts).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</div>
								<div className="mt-1 text-slate-700">
									c{e.cough} / w{e.wheeze} / b{e.sob}
									{e.aqi?.aqi != null && (
										<span className="ml-2 text-xs text-slate-500">
											• AQI {e.aqi.aqi} {e.aqi.city ? `(${e.aqi.city})` : ''}
										</span>
									)}
								</div>
								{e.notes && <div className="mt-1 text-slate-600">{e.notes}</div>}
							</li>
						))}
					</ul>
					<div className="mt-5 text-sm text-slate-600">
						We combine your diary with local AQI in the <b>Summary</b> page to create a weekly provider brief.
					</div>
				</section>
			</main>
		</div>
	);
}

function Slider({ label, value, setValue }) {
	return (
		<div>
			<div className="flex items-center justify-between">
				<label className="text-sm text-slate-700">{label}</label>
				<span className="text-sm font-medium">{value}</span>
			</div>
			<input type="range" min="0" max="3" value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-full accent-indigo-600" />
		</div>
	);
}
