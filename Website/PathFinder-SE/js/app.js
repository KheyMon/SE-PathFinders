// js/app.js - small helpers
async function api(path, method='GET', body=null) {
  const url = `/PathFinder/backend/${path}`;
  let opts = { method, headers: {} };
  if (body) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(url, opts);
  return res.json();
}

async function loadJobs(containerId) {
  const data = await api('fetch_jobs.php');
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '';
  data.forEach(j=>{
    const div = document.createElement('div');
    div.className = 'job-item';
    div.innerHTML = `<div>
      <strong>${j.title}</strong>
      <div class="small">${j.employer_name} • ${j.location} • ${j.category}</div>
    </div>
    <div><a class="btn btn-primary" href="job-details.html?id=${j.id}">View</a></div>`;
    el.appendChild(div);
  });
}

function getQueryParam(name) {
  const u = new URL(window.location.href);
  return u.searchParams.get(name);
}
