// api/widget.js
import { ImageResponse } from '@vercel/og';
// Edge runtime uses relative path from root for config if not using app router
import scheduleData from '../data/schedule.json';

export const config = { runtime: 'edge' };

const COLORS = {
    college: { bg: '#1e3a5f', border: '#3B82F6', dot: '#60A5FA', text: '#BFDBFE' },
    german: { bg: '#064e3b', border: '#10B981', dot: '#34D399', text: '#A7F3D0' },
    cyber: { bg: '#431407', border: '#F97316', dot: '#FB923C', text: '#FED7AA' },
    lecture: { bg: '#2e1065', border: '#8B5CF6', dot: '#A78BFA', text: '#DDD6FE' },
    gym: { bg: '#450a0a', border: '#EF4444', dot: '#F87171', text: '#FECACA' },
    startup: { bg: '#451a03', border: '#F59E0B', dot: '#FBBF24', text: '#FEF3C7' },
    routine: { bg: '#0f172a', border: '#475569', dot: '#64748B', text: '#CBD5E1' },
};

const SHORT = { Monday: 'MON', Tuesday: 'TUE', Wednesday: 'WED', Thursday: 'THU', Friday: 'FRI', Saturday: 'SAT', Sunday: 'SUN' };
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function getToday() {
    return new Date().toLocaleDateString('en-US', { weekday: 'long', timeZone: 'Africa/Cairo' });
}
function getTime() {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Africa/Cairo' });
}
function getDate() {
    return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'Africa/Cairo' });
}

export default function handler(req) {
    const url = new URL(req.url);
    const today = url.searchParams.get('day') || getToday();
    const time = getTime();
    const date = getDate();
    const prog = parseInt(url.searchParams.get('progress') || String(scheduleData.weekProgress), 10);

    const habitsParam = url.searchParams.get('habits');
    const habitKeys = Object.keys(scheduleData.habits);
    const habitDone = habitsParam
        ? habitsParam.split(',').map(v => v === '1')
        : habitKeys.map(k => scheduleData.habits[k]);

    const dayData = scheduleData.schedule[today] || scheduleData.schedule['Monday'];
    const blocks = dayData.blocks.slice(0, 5);

    return new ImageResponse(
        (
            <div style={{
                width: 720, height: 340,
                background: 'linear-gradient(135deg,#0a0f1e 0%,#0f172a 60%,#0a0f1e 100%)',
                display: 'flex', flexDirection: 'column',
                padding: '18px 22px 14px', fontFamily: 'sans-serif',
                position: 'relative', overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                    background: `linear-gradient(90deg, transparent, ${dayData.theme}, transparent)`,
                    display: 'flex',
                }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{ fontSize: 10, color: '#475569', fontWeight: 700, letterSpacing: '0.12em' }}>
                            3-SEMESTER PLAN
                        </span>
                        <span style={{ fontSize: 19, color: '#f8fafc', fontWeight: 800, letterSpacing: '-0.5px' }}>
                            {dayData.emoji} {today}'s Schedule
                        </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                        <span style={{ fontSize: 17, color: '#f8fafc', fontWeight: 700 }}>{time}</span>
                        <span style={{ fontSize: 10, color: '#475569' }}>{date}</span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 5, marginBottom: 10 }}>
                    {DAYS.map(day => {
                        const isToday = day === today;
                        const hasGym = scheduleData.schedule[day]?.blocks.some(b => b.type === 'gym');
                        const hasLec = scheduleData.schedule[day]?.blocks.some(b => b.type === 'lecture');
                        return (
                            <div key={day} style={{
                                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                                padding: '5px 2px', borderRadius: 8,
                                background: isToday ? dayData.theme : 'rgba(255,255,255,0.04)',
                                border: `1.5px solid ${isToday ? dayData.theme : 'rgba(255,255,255,0.07)'}`,
                            }}>
                                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.07em', color: isToday ? '#fff' : '#475569' }}>
                                    {SHORT[day]}
                                </span>
                                <div style={{ display: 'flex', gap: 2 }}>
                                    {hasGym && <div style={{ width: 4, height: 4, borderRadius: 2, background: isToday ? 'rgba(255,255,255,0.8)' : '#EF4444' }} />}
                                    {hasLec && <div style={{ width: 4, height: 4, borderRadius: 2, background: isToday ? 'rgba(255,255,255,0.8)' : '#8B5CF6' }} />}
                                    {!hasGym && !hasLec && <div style={{ width: 4, height: 4, borderRadius: 2, background: 'transparent' }} />}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                    {blocks.map((block, i) => {
                        const c = COLORS[block.type] || COLORS.routine;
                        return (
                            <div key={i} style={{
                                flex: 1, display: 'flex', flexDirection: 'column', gap: 3,
                                padding: '7px 6px', borderRadius: 9,
                                background: c.bg,
                                border: `1px solid ${c.border}50`,
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <div style={{ width: 5, height: 5, borderRadius: 3, background: c.dot, flexShrink: 0 }} />
                                    <span style={{ fontSize: 8, color: c.text, opacity: 0.7, fontWeight: 600 }}>{block.time}</span>
                                </div>
                                <span style={{ fontSize: 8, fontWeight: 800, color: c.dot, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                                    {block.label}
                                </span>
                                <span style={{ fontSize: 10, fontWeight: 600, color: '#f1f5f9', lineHeight: 1.25 }}>
                                    {block.task}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ display: 'flex', gap: 5, flex: 1, flexWrap: 'wrap' }}>
                        {habitKeys.map((name, i) => {
                            const done = habitDone[i];
                            return (
                                <div key={name} style={{
                                    display: 'flex', alignItems: 'center', gap: 3,
                                    padding: '3px 8px', borderRadius: 6,
                                    background: done ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)',
                                    border: done ? '1px solid rgba(16,185,129,0.35)' : '1px solid rgba(255,255,255,0.07)',
                                }}>
                                    <span style={{ fontSize: 9, fontWeight: 700, color: done ? '#34d399' : '#475569' }}>
                                        {done ? '✓' : '○'}
                                    </span>
                                    <span style={{ fontSize: 9, color: done ? '#a7f3d0' : '#475569', fontWeight: 500 }}>
                                        {name}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ width: 1, height: 26, background: 'rgba(255,255,255,0.07)', flexShrink: 0 }} />

                    <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                        {Object.entries(scheduleData.streaks).map(([name, count]) => (
                            <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                <span style={{ fontSize: 14, fontWeight: 800, color: '#fbbf24' }}>{count}</span>
                                <span style={{ fontSize: 8, color: '#475569', fontWeight: 600 }}>{name}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ width: 1, height: 26, background: 'rgba(255,255,255,0.07)', flexShrink: 0 }} />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0, minWidth: 72 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 8, color: '#475569', fontWeight: 700, letterSpacing: '0.08em' }}>WEEK</span>
                            <span style={{ fontSize: 9, color: '#f8fafc', fontWeight: 800 }}>{prog}%</span>
                        </div>
                        <div style={{ width: 72, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.07)', display: 'flex', overflow: 'hidden' }}>
                            <div style={{ width: `${prog}%`, height: '100%', borderRadius: 3, background: 'linear-gradient(90deg,#3B82F6,#8B5CF6)' }} />
                        </div>
                    </div>
                </div>
            </div>
        ),
        { width: 720, height: 340 }
    );
}
