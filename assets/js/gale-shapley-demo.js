/* Gale-Shapley stepper for the "I Like You More!" post.
   Mounts into #gs-demo. Up to five guys and five girls, preferences as ranks or points,
   one proposal per step, and a pair-by-pair stability check at the end. */
(function () {
  var ALL_GUYS = ['Darren', 'Rohan', 'Hafiz', 'Wei Jie', 'Marcus'];
  var ALL_GIRLS = ['Jia Hui', 'Nadia', 'Priya', 'Mei Ling', 'Siti'];
  var MAX = 5;

  // ---------- engine: pure functions, pref[person] = the other side, best first ----------
  function copy(o) { var c = {}; for (var k in o) c[k] = o[k]; return c; }

  function rankOf(pref, a, b) { return pref[a].indexOf(b) + 1; }

  // Does a prefer x to y? y === null means staying single, which anyone beats.
  function prefers(pref, a, x, y) {
    if (!y) return true;
    return pref[a].indexOf(x) < pref[a].indexOf(y);
  }

  // Sequential Gale-Shapley: one free proposer makes one proposal per step.
  // rej['p|r'] records the step at which r turned p down, and for whom.
  function galeShapley(P, pref) {
    var next = {}, held = {}, free = P.slice(), steps = [], rej = {};
    P.forEach(function (p) { next[p] = 0; });
    while (free.length) {
      var p = free[0];
      if (next[p] >= pref[p].length) {
        free.shift();
        steps.push({ type: 'single', p: p, held: copy(held) });
        continue;
      }
      var r = pref[p][next[p]];
      next[p] += 1;
      var cur = held[r] || null;
      var s = { p: p, r: r, rank: next[p], cur: cur };
      if (!cur) {
        s.type = 'free';
        held[r] = p;
        free.shift();
      } else if (prefers(pref, r, p, cur)) {
        s.type = 'swap';
        held[r] = p;
        free.shift();
        free.unshift(cur);
        rej[cur + '|' + r] = { step: steps.length + 1, by: p };
      } else {
        s.type = 'reject';
        rej[p + '|' + r] = { step: steps.length + 1, by: cur };
      }
      s.held = copy(held);
      steps.push(s);
    }
    return { steps: steps, held: held, rej: rej };
  }

  // held maps receiver -> proposer; return [[guy, girl], ...] in roster order.
  function toPairs(held, guys) {
    var out = [];
    Object.keys(held).forEach(function (r) {
      var p = held[r];
      out.push(guys.indexOf(p) >= 0 ? [p, r] : [r, p]);
    });
    return out.sort(function (a, b) { return guys.indexOf(a[0]) - guys.indexOf(b[0]); });
  }

  function partnerIn(pairs, who) {
    for (var i = 0; i < pairs.length; i++) {
      if (pairs[i][0] === who) return pairs[i][1];
      if (pairs[i][1] === who) return pairs[i][0];
    }
    return null;
  }

  function blockingPairs(pairs, guys, girls, pref) {
    var out = [];
    guys.forEach(function (g) {
      girls.forEach(function (w) {
        var pg = partnerIn(pairs, g), pw = partnerIn(pairs, w);
        if (pg === w) return;
        if (prefers(pref, g, w, pg) && prefers(pref, w, g, pw)) out.push([g, w]);
      });
    });
    return out;
  }

  // Every matching that pairs off the whole short side (at most 5! = 120).
  function allMatchings(guys, girls) {
    var guysShort = guys.length <= girls.length;
    var small = guysShort ? guys : girls, big = guysShort ? girls : guys, out = [];
    (function rec(i, used, acc) {
      if (i === small.length) { out.push(acc.slice()); return; }
      big.forEach(function (b) {
        if (used[b]) return;
        used[b] = true;
        acc.push(guysShort ? [small[i], b] : [b, small[i]]);
        rec(i + 1, used, acc);
        acc.pop();
        used[b] = false;
      });
    })(0, {}, []);
    return out;
  }

  if (typeof module === 'object' && module.exports) {
    module.exports = { galeShapley: galeShapley, toPairs: toPairs, blockingPairs: blockingPairs,
      allMatchings: allMatchings, rankOf: rankOf, prefers: prefers, ALL_GUYS: ALL_GUYS, ALL_GIRLS: ALL_GIRLS };
  }
  if (typeof document === 'undefined') return;
  var root = document.getElementById('gs-demo');
  if (!root) return;

  // ---------- presets: points[a][b] = how much a likes b ----------
  var PRESETS = [
    { name: 'Both want Jia Hui', g: 2, w: 2, s: {
      Darren: { 'Jia Hui': 10, Nadia: 9 }, Rohan: { 'Jia Hui': 10, Nadia: 9 },
      'Jia Hui': { Darren: 9, Rohan: 10 }, Nadia: { Darren: 10, Rohan: 9 } } },
    { name: '22 vs 218', g: 2, w: 2, s: {
      Darren: { 'Jia Hui': 10, Nadia: 9 }, Rohan: { 'Jia Hui': 9, Nadia: 10 },
      'Jia Hui': { Darren: 1, Rohan: 100 }, Nadia: { Darren: 100, Rohan: 1 } } },
    { name: 'Symmetric', g: 2, w: 2, s: {
      Darren: { 'Jia Hui': 10, Nadia: 9 }, Rohan: { 'Jia Hui': 9, Nadia: 1 },
      'Jia Hui': { Darren: 10, Rohan: 9 }, Nadia: { Darren: 9, Rohan: 1 } } },
    { name: 'Symmetric, +0.01', g: 2, w: 2, s: {
      Darren: { 'Jia Hui': 10, Nadia: 10.01 }, Rohan: { 'Jia Hui': 9, Nadia: 1 },
      'Jia Hui': { Darren: 10, Rohan: 9 }, Nadia: { Darren: 10.01, Rohan: 1 } } },
    { name: 'Short side (2 guys, 4 girls)', g: 2, w: 4, s: {
      Darren: { 'Jia Hui': 10, Nadia: 9, Priya: 5, 'Mei Ling': 4 },
      Rohan: { 'Jia Hui': 9, Nadia: 10, Priya: 4, 'Mei Ling': 5 },
      'Jia Hui': { Darren: 1, Rohan: 100 }, Nadia: { Darren: 100, Rohan: 1 },
      Priya: { Darren: 50, Rohan: 60 }, 'Mei Ling': { Darren: 60, Rohan: 50 } } },
    { name: 'Full house (5 × 5, random)', g: 5, w: 5, random: true }
  ];

  var nG = 2, nW = 2, mode = 'points', guysPropose = true;
  var points = {}, order = {};
  var pref, run, idx = 0;

  function isGuy(p) { return ALL_GUYS.indexOf(p) >= 0; }
  function guys() { return ALL_GUYS.slice(0, nG); }
  function girls() { return ALL_GIRLS.slice(0, nW); }
  function others(p) { return isGuy(p) ? ALL_GIRLS : ALL_GUYS; }
  function activeOthers(p) { return isGuy(p) ? girls() : guys(); }
  function inList(list) { return function (x) { return list.indexOf(x) >= 0; }; }
  function rnd() { return 1 + Math.floor(Math.random() * 100); }
  function fmt(x) { return String(Math.round(x * 100) / 100); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function pron(p) { return isGuy(p) ? { he: 'he', him: 'him', his: 'his' } : { he: 'she', him: 'her', his: 'her' }; }

  function shuffled(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i];
      a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // Highest points first; ties broken by name order.
  function byPoints(p, list) {
    return list.slice().sort(function (a, b) {
      return (points[p][b] - points[p][a]) || (a < b ? -1 : 1);
    });
  }

  function buildPref() {
    var out = {};
    guys().concat(girls()).forEach(function (p) {
      var act = activeOthers(p);
      out[p] = mode === 'points' ? byPoints(p, act) : order[p].filter(inList(act));
    });
    return out;
  }

  function deriveOrders() {
    ALL_GUYS.concat(ALL_GIRLS).forEach(function (p) { order[p] = byPoints(p, others(p)); });
  }

  function randomiseAll() {
    ALL_GUYS.forEach(function (g) {
      ALL_GIRLS.forEach(function (w) { points[g][w] = rnd(); points[w][g] = rnd(); });
    });
    deriveOrders();
  }

  // A newcomer gets random points both ways; in rank mode they join the bottom of every list.
  function addPerson(x) {
    others(x).forEach(function (o) { points[x][o] = rnd(); points[o][x] = rnd(); });
    if (mode === 'ranks') {
      others(x).forEach(function (o) {
        order[o] = order[o].filter(function (y) { return y !== x; }).concat([x]);
      });
      order[x] = shuffled(others(x));
    }
  }

  function setMode(m) {
    if (m === mode) return;
    if (m === 'ranks') {
      deriveOrders();
    } else {
      // Keep the points if they already agree with the ranks; otherwise write 100, 80, 60...
      guys().concat(girls()).forEach(function (p) {
        var list = order[p].filter(inList(activeOthers(p)));
        var agrees = list.every(function (x, i) { return i === 0 || points[p][list[i - 1]] > points[p][x]; });
        if (!agrees) list.forEach(function (x, i) { points[p][x] = 100 - 20 * i; });
      });
    }
    mode = m;
  }

  function applyPreset(ps) {
    nG = ps.g; nW = ps.w;
    if (ps.random) {
      randomiseAll();
    } else {
      for (var a in ps.s) for (var b in ps.s[a]) points[a][b] = ps.s[a][b];
      deriveOrders();
    }
    mode = 'points';
  }

  // ---------- DOM helpers ----------
  var SVG_NS = 'http://www.w3.org/2000/svg';

  function el(tag, attrs, text) {
    var node = document.createElement(tag);
    for (var k in attrs) node.setAttribute(k, attrs[k]);
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function svgNode(tag, attrs, text) {
    var n = document.createElementNS(SVG_NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (text !== undefined) n.textContent = text;
    return n;
  }

  function button(label, cls, onClick) {
    var b = el('button', { type: 'button', class: 'gs-demo__btn' + (cls ? ' ' + cls : '') }, label);
    b.addEventListener('click', onClick);
    return b;
  }

  function row(label) {
    var r = el('div', { class: 'gs-demo__row' });
    if (label) r.appendChild(el('span', { class: 'gs-demo__label' }, label));
    return r;
  }

  // ---------- build ----------
  var ui = {};

  function build() {
    root.innerHTML = '';
    root.appendChild(el('p', { class: 'gs-demo__title' }, 'Gale-Shapley, one proposal at a time'));

    var presetRow = row('Preset');
    PRESETS.forEach(function (ps) {
      presetRow.appendChild(button(ps.name, '', function () { applyPreset(ps); changed(true); }));
    });
    root.appendChild(presetRow);

    var peopleRow = row('People');
    ui.counts = {};
    [['Guys', true], ['Girls', false]].forEach(function (side) {
      var box = el('span', { class: 'gs-demo__counter' });
      box.appendChild(el('span', { class: side[1] ? 'is-guy' : 'is-girl' }, side[0]));
      var minus = button('−', 'gs-demo__btn--icon', function () {
        if (side[1]) nG -= 1; else nW -= 1;
        changed(true);
      });
      minus.setAttribute('aria-label', 'Remove one ' + (side[1] ? 'guy' : 'girl'));
      var num = el('span', { class: 'gs-demo__count' });
      var plus = button('+', 'gs-demo__btn--icon', function () {
        if (side[1]) { addPerson(ALL_GUYS[nG]); nG += 1; } else { addPerson(ALL_GIRLS[nW]); nW += 1; }
        changed(true);
      });
      plus.setAttribute('aria-label', 'Add one ' + (side[1] ? 'guy' : 'girl'));
      box.appendChild(minus); box.appendChild(num); box.appendChild(plus);
      ui.counts[side[0]] = { minus: minus, num: num, plus: plus };
      peopleRow.appendChild(box);
    });
    peopleRow.appendChild(button('Shuffle preferences', '', function () { randomiseAll(); changed(true); }));
    root.appendChild(peopleRow);

    var modeRow = row('Preferences');
    ui.modeBtns = [['points', 'Points'], ['ranks', 'Ranks']].map(function (m) {
      var b = button(m[1], 'gs-demo__seg', function () { setMode(m[0]); changed(true); });
      b.setAttribute('data-value', m[0]);
      modeRow.appendChild(b);
      return b;
    });
    root.appendChild(modeRow);

    ui.tables = el('div', { class: 'gs-demo__tables' });
    root.appendChild(ui.tables);

    var whoRow = row('Who proposes');
    ui.whoBtns = [[true, 'Guys'], [false, 'Girls']].map(function (w) {
      var b = button(w[1], 'gs-demo__seg', function () { guysPropose = w[0]; changed(false); });
      b.setAttribute('data-value', w[1]);
      whoRow.appendChild(b);
      return b;
    });
    root.appendChild(whoRow);

    var runRow = row();
    ui.back = button('◀ Back', '', function () { if (idx > 0) { idx -= 1; render(); } });
    ui.next = button('Next step ▶', 'gs-demo__btn--primary', function () { if (idx < run.steps.length) { idx += 1; render(); } });
    ui.end = button('Run to end', '', function () { idx = run.steps.length; render(); });
    ui.reset = button('Reset', '', function () { idx = 0; render(); });
    ui.counter = el('span', { class: 'gs-demo__stepper', 'aria-live': 'off' });
    [ui.back, ui.next, ui.end, ui.reset, ui.counter].forEach(function (n) { runRow.appendChild(n); });
    root.appendChild(runRow);

    ui.narration = el('p', { class: 'gs-demo__narration', 'aria-live': 'polite' });
    root.appendChild(ui.narration);

    var grid = el('div', { class: 'gs-demo__grid' });
    var figure = el('div', { class: 'gs-demo__figure' });
    ui.drawing = svgNode('svg', { class: 'gs-demo__drawing', role: 'img' });
    figure.appendChild(ui.drawing);
    figure.appendChild(el('p', { class: 'gs-demo__legend' },
      'Purple: holding for now. Arrow: this step\'s proposal. Grey dashes: turned down. Black: final.'));
    grid.appendChild(figure);
    ui.prefs = el('div', { class: 'gs-demo__prefs' });
    grid.appendChild(ui.prefs);
    root.appendChild(grid);

    ui.result = el('div', { class: 'gs-demo__result' });
    root.appendChild(ui.result);
  }

  // ---------- preference tables ----------
  function fillTables() {
    ui.tables.innerHTML = '';
    [[guys(), girls(), 'Guys'], [girls(), guys(), 'Girls']].forEach(function (t) {
      var raters = t[0], rated = t[1];
      var wrap = el('div', { class: 'gs-demo__tablewrap' });
      var table = el('table', { class: 'gs-demo__scores' });
      table.appendChild(el('caption', {}, mode === 'points'
        ? t[2] + ' score the ' + (t[2] === 'Guys' ? 'girls' : 'guys') + ' (higher = keener)'
        : t[2] + ' rank the ' + (t[2] === 'Guys' ? 'girls' : 'guys') + ' (1 = first choice)'));
      var head = el('tr');
      head.appendChild(el('th', { scope: 'col' }, ''));
      rated.forEach(function (o) { head.appendChild(el('th', { scope: 'col', class: isGuy(o) ? 'is-guy' : 'is-girl' }, o)); });
      var thead = el('thead');
      thead.appendChild(head);
      table.appendChild(thead);
      var tbody = el('tbody');
      raters.forEach(function (p) {
        var tr = el('tr');
        tr.appendChild(el('th', { scope: 'row', class: isGuy(p) ? 'is-guy' : 'is-girl' }, p));
        rated.forEach(function (o) {
          var td = el('td');
          td.appendChild(mode === 'points' ? pointsInput(p, o) : rankSelect(p, o, rated.length));
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      wrap.appendChild(table);
      ui.tables.appendChild(wrap);
    });
    if (mode === 'points') ui.tables.appendChild(el('p', { class: 'gs-demo__note' }, 'Equal scores are broken by name order.'));
  }

  function pointsInput(p, o) {
    var input = el('input', { type: 'number', step: 'any', value: points[p][o], 'aria-label': p + ' scores ' + o });
    input.addEventListener('change', function () {
      var v = parseFloat(input.value);
      if (isNaN(v)) { input.value = points[p][o]; return; }
      points[p][o] = v;
      changed(false);
    });
    return input;
  }

  // Picking a rank that is already taken swaps the two names, so every row stays a valid order.
  function rankSelect(p, o, n) {
    var sel = el('select', { 'aria-label': p + ' ranks ' + o });
    var current = pref[p].indexOf(o) + 1;
    for (var i = 1; i <= n; i++) {
      var opt = el('option', { value: i }, '#' + i);
      if (i === current) opt.selected = true;
      sel.appendChild(opt);
    }
    sel.addEventListener('change', function () {
      var list = pref[p].slice();
      var from = list.indexOf(o), to = parseInt(sel.value, 10) - 1;
      list[from] = list[to];
      list[to] = o;
      order[p] = list.concat(order[p].filter(function (x) { return list.indexOf(x) < 0; }));
      changed(true);
    });
    return sel;
  }

  // ---------- run ----------
  function changed(rebuildTables) {
    pref = buildPref();
    run = galeShapley(guysPropose ? guys() : girls(), pref);
    idx = 0;
    if (rebuildTables) fillTables();
    render();
  }

  function heldAt(k) { return k > 0 ? run.steps[k - 1].held : {}; }

  function rejectedAt(k) {
    var out = {};
    for (var key in run.rej) if (run.rej[key].step <= k) out[key] = true;
    return out;
  }

  function pts(a, b) { return mode === 'points' ? ', ' + fmt(points[a][b]) + ' pts' : ''; }

  function narrate(s) {
    var p = s.p, pp = pron(p);
    if (s.type === 'single') {
      return p + ' has been turned down by everyone on ' + pp.his + ' list, so ' + pp.he + ' stays single.';
    }
    var r = s.r, rp = pron(r);
    var open = p + ' proposes to ' + r + ' (' + pp.his + ' #' + s.rank + pts(p, r) + '). ';
    if (s.type === 'free') {
      return open + r + ' has no one yet, so ' + rp.he + ' holds on to ' + pp.him + ' for now.';
    }
    if (s.type === 'swap') {
      return open + r + ' is holding ' + s.cur + ', but ' + rp.he + ' ranks ' + p + ' #' + rankOf(pref, r, p) +
        ' and ' + s.cur + ' #' + rankOf(pref, r, s.cur) + ', so ' + rp.he + ' trades up. ' + s.cur + ' is free again.';
    }
    return open + r + ' is holding ' + s.cur + ', whom ' + rp.he + ' ranks #' + rankOf(pref, r, s.cur) +
      ', above ' + p + ' at #' + rankOf(pref, r, p) + ', so ' + rp.he + ' says no. ' + p +
      ' will try ' + pp.his + ' next choice.';
  }

  function render() {
    var N = run.steps.length, done = idx === N;
    var s = idx > 0 ? run.steps[idx - 1] : null;

    ui.counts.Guys.num.textContent = nG;
    ui.counts.Girls.num.textContent = nW;
    ui.counts.Guys.minus.disabled = nG <= 1;
    ui.counts.Girls.minus.disabled = nW <= 1;
    ui.counts.Guys.plus.disabled = nG >= MAX;
    ui.counts.Girls.plus.disabled = nW >= MAX;
    ui.modeBtns.forEach(function (b) { setActive(b, b.getAttribute('data-value') === mode); });
    ui.whoBtns.forEach(function (b) { setActive(b, (b.getAttribute('data-value') === 'Guys') === guysPropose); });
    ui.back.disabled = idx === 0;
    ui.next.disabled = done;
    ui.end.disabled = done;
    ui.counter.textContent = 'Step ' + idx + ' of ' + N;

    var side = guysPropose ? 'guys' : 'girls';
    if (!s) {
      ui.narration.textContent = 'The ' + side + ' propose. Each free ' + side.slice(0, -1) +
        ' asks the next name on ' + (guysPropose ? 'his' : 'her') + ' list. Whoever is asked holds the best offer so far' +
        ' and can trade up later. Press "Next step".';
    } else {
      ui.narration.textContent = narrate(s) + (done ? ' That was the last proposal: the matching is final.' : '');
    }

    var held = heldAt(idx), rejected = rejectedAt(idx);
    draw(held, s, done);
    drawPrefs(held, rejected, s, done);
    ui.result.innerHTML = '';
    if (done) showResult();
  }

  function setActive(b, on) {
    b.classList.toggle('is-active', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  }

  // ---------- drawing ----------
  var GX = 125, WX = 245, GAP = 52, R = 16;

  function draw(held, s, done) {
    var svg = ui.drawing, n = Math.max(nG, nW), H = 60 + (n - 1) * GAP;
    svg.innerHTML = '';
    svg.setAttribute('viewBox', '0 0 370 ' + H);
    var defs = svgNode('defs');
    var marker = svgNode('marker', { id: 'gs-arrow', viewBox: '0 0 10 10', refX: 9, refY: 5,
      markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' });
    marker.appendChild(svgNode('path', { d: 'M0,0 L10,5 L0,10 z', class: 'gs-arrow' }));
    defs.appendChild(marker);
    svg.appendChild(defs);

    var pos = {};
    [[guys(), GX], [girls(), WX]].forEach(function (col) {
      col[0].forEach(function (name, i) {
        pos[name] = [col[1], H / 2 + (i - (col[0].length - 1) / 2) * GAP];
      });
    });

    function line(a, b, cls, arrow) {
      var x1 = pos[a][0], y1 = pos[a][1], x2 = pos[b][0], y2 = pos[b][1];
      var len = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
      var ux = (x2 - x1) / len, uy = (y2 - y1) / len, pad = R + 2;
      var attrs = { x1: x1 + ux * pad, y1: y1 + uy * pad, x2: x2 - ux * pad, y2: y2 - uy * pad, class: 'gs-line ' + cls };
      if (arrow) attrs['marker-end'] = 'url(#gs-arrow)';
      svg.appendChild(svgNode('line', attrs));
    }

    var live = s && !done && s.type !== 'single';
    if (live && s.type === 'swap') line(s.cur, s.r, 'gs-line--rejected');
    if (live && s.type === 'reject') line(s.p, s.r, 'gs-line--rejected', true);
    Object.keys(held).forEach(function (r) {
      var p = held[r];
      if (live && p === s.p && r === s.r) line(p, r, 'gs-line--proposal', true);
      else line(p, r, done ? 'gs-line--matched' : 'gs-line--held');
    });

    var matched = {};
    Object.keys(held).forEach(function (r) { matched[r] = true; matched[held[r]] = true; });
    Object.keys(pos).forEach(function (name) {
      var guy = isGuy(name), faded = done && !matched[name];
      var g = svgNode('g', { class: faded ? 'gs-node--faded' : '' });
      g.appendChild(svgNode('circle', { cx: pos[name][0], cy: pos[name][1], r: R, class: guy ? 'gs-node--guy' : 'gs-node--girl' }));
      g.appendChild(svgNode('text', { x: pos[name][0] + (guy ? -(R + 8) : R + 8), y: pos[name][1] + 4,
        'text-anchor': guy ? 'end' : 'start', class: 'gs-node__name' }, name));
      svg.appendChild(g);
    });

    var pairs = toPairs(held, guys());
    svg.setAttribute('aria-label', pairs.length
      ? (done ? 'Final matching: ' : 'Holding for now: ') + pairs.map(function (p) { return p[0] + ' with ' + p[1]; }).join(', ')
      : 'No proposals yet');
  }

  // ---------- preference lists ----------
  function drawPrefs(held, rejected, s, done) {
    ui.prefs.innerHTML = '';
    ui.prefs.appendChild(el('p', { class: 'gs-demo__sub' }, 'Preference lists, best first'));
    var P = guysPropose ? guys() : girls(), Rv = guysPropose ? girls() : guys();
    var partner = {};
    Object.keys(held).forEach(function (r) { partner[r] = held[r]; partner[held[r]] = r; });

    P.concat(Rv).forEach(function (person) {
      var proposer = P.indexOf(person) >= 0;
      var line = el('div', { class: 'gs-prefrow' });
      line.appendChild(el('span', { class: 'gs-prefrow__name ' + (isGuy(person) ? 'is-guy' : 'is-girl') }, person));
      pref[person].forEach(function (x, i) {
        var key = proposer ? person + '|' + x : x + '|' + person;
        var cls = 'gs-chip';
        if (partner[person] === x) cls += ' gs-chip--held';
        if (rejected[key]) cls += ' gs-chip--rejected';
        if (s && !done && s.type !== 'single' &&
            ((person === s.p && x === s.r) || (person === s.r && x === s.p))) cls += ' gs-chip--current';
        var chip = el('span', { class: cls }, (i + 1) + '. ' + x);
        if (mode === 'points') chip.appendChild(el('small', {}, ' ' + fmt(points[person][x])));
        line.appendChild(chip);
      });
      ui.prefs.appendChild(line);
    });
    ui.prefs.appendChild(el('p', { class: 'gs-demo__note' },
      'Highlighted: current partner. Struck through: turned down. ' +
      (guysPropose ? 'Guys' : 'Girls') + ' only move down their lists; ' +
      (guysPropose ? 'girls' : 'guys') + ' only trade up.'));
  }

  // ---------- result: why it is stable, and what it costs ----------
  function totals(pairs) {
    var g = 0, w = 0;
    pairs.forEach(function (pr) { g += points[pr[0]][pr[1]]; w += points[pr[1]][pr[0]]; });
    return { guys: g, girls: w, total: g + w };
  }

  function avgRank(pairs, side) {
    if (!pairs.length) return '–';
    var sum = 0;
    pairs.forEach(function (pr) {
      sum += side === 'guys' ? rankOf(pref, pr[0], pr[1]) : rankOf(pref, pr[1], pr[0]);
    });
    return fmt(sum / pairs.length);
  }

  function listPairs(pairs) { return pairs.map(function (p) { return p[0] + ' & ' + p[1]; }).join(', '); }

  function explain(p, r, partner) {
    var a = partner[p] || null, b = partner[r] || null, pp = pron(p), rp = pron(r);
    if (a && prefers(pref, p, a, r)) {
      return p + ' prefers ' + pp.his + ' partner ' + a + ' (#' + rankOf(pref, p, a) + ') to ' + r +
        ' (#' + rankOf(pref, p, r) + ').';
    }
    var x = run.rej[p + '|' + r];
    if (!x || !b) return null;
    var head = a
      ? p + ' would rather have ' + r + ' (#' + rankOf(pref, p, r) + ') than ' + a + ' (#' + rankOf(pref, p, a) + ')'
      : p + ' would rather have ' + r + ' than stay single';
    var tail = x.by === b
      ? ', but ' + r + ' turned ' + pp.him + ' down at step ' + x.step + ' for ' + b + ', whom ' + rp.he +
        ' ranks #' + rankOf(pref, r, b) + ', above ' + p + ' (#' + rankOf(pref, r, p) + ').'
      : ', but ' + r + ' turned ' + pp.him + ' down at step ' + x.step + ' for ' + x.by + ', then traded up again to ' +
        b + ' (#' + rankOf(pref, r, b) + '; ' + p + ' is #' + rankOf(pref, r, p) + ').';
    return head + tail;
  }

  function showResult() {
    var box = ui.result, G = guys(), W = girls();
    var pairs = toPairs(run.held, G);
    var partner = {};
    pairs.forEach(function (pr) { partner[pr[0]] = pr[1]; partner[pr[1]] = pr[0]; });
    var single = G.concat(W).filter(function (x) { return !partner[x]; });

    box.appendChild(el('p', { class: 'gs-demo__final' }, 'Final: ' + listPairs(pairs) + '.'));
    if (single.length) {
      box.appendChild(el('p', {}, 'Single: ' + single.join(', ') + '. The same people are left out whichever side proposes; ' +
        'only the couples change.'));
    }

    // The same pool with the other side proposing, for comparison.
    var flipPairs = toPairs(galeShapley(guysPropose ? W : G, pref).held, G);
    var thisSide = guysPropose ? 'Guys propose' : 'Girls propose', otherSide = guysPropose ? 'Girls propose' : 'Guys propose';
    if (mode === 'points') {
      var t = totals(pairs), ft = totals(flipPairs);
      box.appendChild(el('p', {}, thisSide + ': guys ' + fmt(t.guys) + ' + girls ' + fmt(t.girls) + ' = ' + fmt(t.total) +
        ' points. ' + otherSide + ' instead: guys ' + fmt(ft.guys) + ' + girls ' + fmt(ft.girls) + ' = ' + fmt(ft.total) + '.'));
    } else {
      box.appendChild(el('p', {}, 'Average rank of the partner each side got (1 = everyone got their first choice). ' +
        thisSide + ': guys ' + avgRank(pairs, 'guys') + ', girls ' + avgRank(pairs, 'girls') + '. ' +
        otherSide + ' instead: guys ' + avgRank(flipPairs, 'guys') + ', girls ' + avgRank(flipPairs, 'girls') + '.'));
    }

    box.appendChild(el('p', { class: 'gs-demo__sub' }, 'Why is this stable?'));
    var Pside = guysPropose ? 'guys' : 'girls', Rside = guysPropose ? 'girls' : 'guys';
    var rp = guysPropose ? 'she' : 'he';
    box.appendChild(el('p', {}, 'The ' + Pside + ' only moved down their lists, and only when someone they preferred turned them down ' +
      'for someone ' + rp + ' liked more. The ' + Rside + ' only ever traded up. So every pair that is not together fails ' +
      'on at least one side. Here is each one:'));

    var rows = [];
    G.forEach(function (g) {
      W.forEach(function (w) {
        if (partner[g] === w) return;
        var p = guysPropose ? g : w, r = guysPropose ? w : g;
        rows.push([g + ' & ' + w, explain(p, r, partner)]);
      });
    });
    var details = el('details', { class: 'gs-demo__check', open: '' });
    details.appendChild(el('summary', {}, 'Every pair that did not end up together (' + rows.length + ')'));
    if (rows.length) {
      var wrap = el('div', { class: 'gs-demo__tablewrap' });
      var table = el('table', { class: 'gs-demo__checktable' });
      var thead = el('thead'), hr = el('tr');
      hr.appendChild(el('th', { scope: 'col' }, 'Pair'));
      hr.appendChild(el('th', { scope: 'col' }, 'Would they leave their partners for each other?'));
      thead.appendChild(hr);
      table.appendChild(thead);
      var tbody = el('tbody');
      rows.forEach(function (rw) {
        var tr = el('tr');
        tr.appendChild(el('th', { scope: 'row' }, rw[0]));
        tr.appendChild(el('td', {}, rw[1] ? 'No. ' + rw[1] : 'Yes: this pair blocks the matching.'));
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      wrap.appendChild(table);
      details.appendChild(wrap);
    }
    box.appendChild(details);

    if (mode === 'points') {
      var all = allMatchings(G, W), gsTotal = totals(pairs).total;
      var bestStable = null, bestAll = null;
      all.forEach(function (m) {
        var tot = totals(m).total, stable = !blockingPairs(m, G, W, pref).length;
        if (!bestAll || tot > bestAll.total) bestAll = { pairs: m, total: tot };
        if (stable && (!bestStable || tot > bestStable.total)) bestStable = { pairs: m, total: tot };
      });
      box.appendChild(el('p', { class: 'gs-demo__sub' }, 'Stable is not the same as best'));
      box.appendChild(el('p', {}, bestStable.total > gsTotal
        ? 'The best stable matching is ' + listPairs(bestStable.pairs) + ', worth ' + fmt(bestStable.total) +
          ' points against Gale-Shapley\'s ' + fmt(gsTotal) + '. Gale-Shapley never looks for it: it only checks that nobody would break up.'
        : 'No stable matching scores more than Gale-Shapley\'s ' + fmt(gsTotal) + ' points.'));
      if (bestAll.total > bestStable.total) {
        var bp = blockingPairs(bestAll.pairs, G, W, pref)[0];
        box.appendChild(el('p', {}, 'The highest total of any matching is ' + fmt(bestAll.total) + ' (' + listPairs(bestAll.pairs) +
          '), but it is unstable: ' + bp[0] + ' & ' + bp[1] + ' would rather be together.'));
      }
    }
  }

  // ---------- init ----------
  ALL_GUYS.concat(ALL_GIRLS).forEach(function (p) { points[p] = {}; });
  randomiseAll();
  applyPreset(PRESETS[1]);
  build();
  changed(true);
})();
