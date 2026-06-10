:root{
  --ink:#15171C;--paper:#FBFAF6;--slate:#5C6470;--hair:#E5E1D7;
  --up:#147A52;--down:#BE3A2B;--signal:#E8590C;--card:#FFFFFF;
  --edu:#1F5C8A;--edu-bg:#EFF5FA;--edu-hair:#CFE0EC;
  --display:'Space Grotesk',sans-serif;--body:'Newsreader',Georgia,serif;--mono:'IBM Plex Mono',ui-monospace,monospace;
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:var(--paper);color:var(--ink);font-family:var(--body);-webkit-font-smoothing:antialiased}
body{font-size:16.5px;line-height:1.55}
.wrap{max-width:820px;margin:0 auto;padding:24px 16px 80px}

/* login */
.login{min-height:100vh;background:var(--ink);color:var(--paper);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px}
.login-eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:var(--signal)}
.login-wm{font-family:var(--display);font-weight:700;font-size:clamp(48px,12vw,84px);line-height:.9;letter-spacing:-.03em;margin:8px 0 28px}
.login input{font-family:var(--body);font-size:16px;padding:12px 16px;border:none;border-radius:6px;width:min(320px,80vw);margin-bottom:12px}
.login button{font-family:var(--display);font-weight:600;font-size:15px;background:var(--paper);color:var(--ink);border:none;border-radius:6px;padding:12px 28px;cursor:pointer}
.login-err{color:#FF9A8A;font-family:var(--mono);font-size:12px;margin-top:12px}
.login-note{font-family:var(--mono);font-size:11px;color:#8A8F98;margin-top:22px}

/* topbar */
.topbar{position:sticky;top:0;background:rgba(251,250,246,.92);backdrop-filter:blur(8px);border-bottom:2px solid var(--ink);z-index:20}
.topbar-in{max-width:820px;margin:0 auto;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px}
.tb-left{display:flex;align-items:baseline;gap:12px}
.tb-wm{font-family:var(--display);font-weight:700;font-size:20px;letter-spacing:-.02em}
.tb-date{font-family:var(--mono);font-size:11px;color:var(--slate);text-transform:uppercase;letter-spacing:.05em}
.tb-actions{display:flex;gap:8px}
.tb-actions button{font-family:var(--mono);font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;background:var(--ink);color:var(--paper);border:none;border-radius:5px;padding:7px 12px;cursor:pointer}
.tb-actions .ghost{background:transparent;color:var(--slate);border:1px solid var(--hair)}

/* tabs */
.tabs{border-bottom:1px solid var(--hair);background:var(--paper);position:sticky;top:49px;z-index:19;overflow-x:auto}
.tabs-in{max-width:820px;margin:0 auto;padding:0 16px;display:flex;gap:2px}
.tab{font-family:var(--display);font-weight:500;font-size:13.5px;color:var(--slate);background:none;border:none;padding:13px 14px;cursor:pointer;white-space:nowrap;border-bottom:2.5px solid transparent;margin-bottom:-1px}
.tab.active{color:var(--ink);border-bottom-color:var(--signal);font-weight:600}

.panel{animation:fade .35s ease}
@keyframes fade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
h2{font-family:var(--display);font-weight:600;font-size:24px;letter-spacing:-.01em;margin-bottom:4px}
h3{font-family:var(--display);font-weight:600;font-size:16px;margin:22px 0 6px}
h4{font-family:var(--display);font-weight:600;font-size:12px;letter-spacing:.05em;text-transform:uppercase;color:var(--slate);margin:18px 0 4px}
.kicker{font-family:var(--mono);font-size:11px;color:var(--signal);text-transform:uppercase;letter-spacing:.08em;font-weight:600;margin-bottom:14px}
p{margin:10px 0}
.hero-val{display:flex;align-items:flex-end;gap:16px;flex-wrap:wrap}
.big-num{font-family:var(--display);font-weight:700;font-size:clamp(40px,9vw,60px);letter-spacing:-.02em;line-height:1}
.day-move{font-family:var(--mono);font-size:15px;font-weight:600;padding-bottom:6px}
.day-move.neg{color:var(--down)}.day-move.pos{color:var(--up)}
.sub{font-family:var(--mono);font-size:12px;color:var(--slate);text-transform:uppercase;letter-spacing:.05em;margin:6px 0 16px}
table{width:100%;border-collapse:collapse;font-family:var(--mono);font-size:13px;margin:10px 0}
th{text-align:left;font-weight:600;font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--slate);padding:7px 8px 7px 0;border-bottom:1.5px solid var(--ink)}
td{padding:7px 8px 7px 0;border-bottom:1px solid var(--hair)}
td.r,th.r{text-align:right}.ticker{font-weight:600}.pos{color:var(--up)}.neg{color:var(--down)}
.info{background:#F4F2EC;border-radius:6px;padding:16px 18px;margin:16px 0;font-size:15px}
.story{margin:14px 0}.story .src{font-family:var(--mono);font-size:11px;letter-spacing:.04em;text-transform:uppercase;color:var(--slate)}
.story p{margin:3px 0}
.define{background:var(--edu-bg);border:1px solid var(--edu-hair);border-left:3px solid var(--edu);border-radius:4px;padding:12px 15px;margin:12px 0;font-size:14.5px}
.define b{font-family:var(--display);color:var(--edu);font-size:12px}
.watch{background:#FFF7F1;border:1px solid #F3D9C6;border-left:3px solid var(--signal);border-radius:4px;padding:16px 18px;margin:14px 0}
.watch .q{font-style:italic;color:#7A4A28;margin:7px 0}
.dd{background:#FCFBF8;border:1px solid var(--hair);border-radius:8px;padding:6px 20px 18px;margin-top:4px}
.dd li{margin:6px 0 6px 18px}
footer{margin-top:30px;padding-top:20px;border-top:1px solid var(--hair);font-family:var(--mono);font-size:11.5px;color:var(--slate);line-height:1.6}
@media (max-width:560px){body{font-size:16px}table{font-size:12px}}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
