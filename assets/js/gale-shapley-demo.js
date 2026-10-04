/* Gale-Shapley stepper for the "Whoever Proposes Wins" post.
   Mounts into #gs-demo. Two guys, two girls, editable compatibility scores. */
(function () {
  var root = document.getElementById('gs-demo');
  if (!root) return;

  var GUYS = ['Darren', 'Rohan'];
  var GIRLS = ['Jia Hui', 'Nadia'];
  var SVG_NS = 'http://www.w3.org/2000/svg';

  // scores[a][b] = how much a likes b
  var PRESETS = {
    'Both want Jia Hui': {
      Darren: { 'Jia Hui': 10, Nadia: 9 }, Rohan: { 'Jia Hui': 10, Nadia: 9 },
      'Jia Hui': { Darren: 9, Rohan: 10 }, Nadia: { Darren: 10, Rohan: 9 }
    },
    '22 vs 218': {
      Darren: { 'Jia Hui': 10, Nadia: 9 }, Rohan: { 'Jia Hui': 9, Nadia: 10 },
      'Jia Hui': { Darren: 1, Rohan: 100 }, Nadia: { Darren: 100, Rohan: 1 }
    },
    'Symmetric': {
      Darren: { 'Jia Hui': 10, Nadia: 9 }, Rohan: { 'Jia Hui': 9, Nadia: 1 },
      'Jia Hui': { Darren: 10, Rohan: 9 }, Nadia: { Darren: 9, Rohan: 1 }
    },
    'Symmetric, +0.01': {
      Darren: { 'Jia Hui': 10, Nadia: 10.01 }, Rohan: { 'Jia Hui': 9, Nadia: 1 },
      'Jia Hui': { Darren: 10, Rohan: 9 }, Nadia: { Darren: 10.01, Rohan: 1 }
    }
  };

  var scores = clone(PRESETS['22 vs 218']);
  var guysPropose = true;
  var state = null;

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function el(tag, attrs, text) {
    var node = document.createElement(tag);
    for (var k in attrs) node.setAttribute(k, attrs[k]);
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function sides() {
    return guysPropose ? { P: GUYS, R: GIRLS } : { P: GIRLS, R: GUYS };
  }

  // Preference list, highest score first; ties broken alphabetically.
  function prefs(person, others) {
    return others.slice().sort(function (a, b) {
      return (scores[person][b] - scores[person][a]) || (a < b ? -1 : 1);
    });
  }

  function prefers(person, a, b, others) {
    var list = prefs(person, others);
    return list.indexOf(a) < list.indexOf(b);
  }

  function reset() {
    var s = sides();
    state = { round: 0, next: {}, held: {}, free: s.P.slice(), lastProps: [], log: [], done: false };
    s.P.forEach(function (p) { state.next[p] = 0; });
    render();
  }

  function step() {
    if (state.done) return;
    var s = sides();
    state.round += 1;
    var props = {};
    state.lastProps = [];
    state.free.forEach(function (p) {
      var target = prefs(p, s.R)[state.next[p]];
      state.next[p] += 1;
      (props[target] = props[target] || []).push(p);
    });
    var freeNext = [];
    var lines = [];
    Object.keys(props).forEach(function (r) {
      var cands = props[r].slice();
      if (state.held[r]) cands.push(state.held[r]);
      var best = cands.slice().sort(function (a, b) { return prefers(r, a, b, s.P) ? -1 : 1; })[0];
      props[r].forEach(function (p) {
        state.lastProps.push({ from: p, to: r, held: p === best });
        lines.push(p + ' → ' + r + (p === best ? ': held' : ': rejected'));
      });
      if (state.held[r] && state.held[r] !== best) {
        lines.push(r + ' drops ' + state.held[r]);
        freeNext.push(state.held[r]);
      }
      props[r].forEach(function (p) { if (p !== best) freeNext.push(p); });
      state.held[r] = best;
    });
    state.log.push('Round ' + state.round + ': ' + lines.join('; '));
    state.free = freeNext;
    if (!state.free.length) state.done = true;
    render();
  }

  function runAll() {
    while (!state.done) step();
  }

  function pairsOf(held) {
    // returns [[guy, girl], ...]
    var out = [];
    Object.keys(held).forEach(function (r) {
      var p = held[r];
      out.push(GUYS.indexOf(p) >= 0 ? [p, r] : [r, p]);
    });
    return out.sort(function (a, b) { return GUYS.indexOf(a[0]) - GUYS.indexOf(b[0]); });
  }

  function totals(pairs) {
    var g = 0, w = 0;
    pairs.forEach(function (pr) { g += scores[pr[0]][pr[1]]; w += scores[pr[1]][pr[0]]; });
    return { guys: round2(g), girls: round2(w), total: round2(g + w) };
  }

  function round2(x) { return Math.round(x * 100) / 100; }

  function partner(pairs, who) {
    for (var i = 0; i < pairs.length; i++) {
      if (pairs[i][0] === who) return pairs[i][1];
      if (pairs[i][1] === who) return pairs[i][0];
    }
    return null;
  }

  function blockingPairs(pairs) {
    var out = [];
    GUYS.forEach(function (g) {
      GIRLS.forEach(function (w) {
        var pg = partner(pairs, g), pw = partner(pairs, w);
        if (pg === w) return;
        if (scores[g][w] > scores[g][pg] && scores[w][g] > scores[w][pw]) out.push(g + ' & ' + w);
      });
    });
    return out;
  }

  // ---------- rendering ----------
  var controls, table, drawing, logBox, result;

  function build() {
    root.innerHTML = '';
    root.appendChild(el('p', { class: 'gs-demo__title' }, 'Gale-Shapley stepper'));

    controls = el('div', { class: 'gs-demo__controls' });
    var presetRow = el('div', { class: 'gs-demo__row' });
    presetRow.appendChild(el('span', { class: 'gs-demo__label' }, 'Preset'));
    Object.keys(PRESETS).forEach(function (name) {
      var b = el('button', { type: 'button', class: 'gs-demo__btn' }, name);
      b.addEventListener('click', function () { scores = clone(PRESETS[name]); fillTable(); reset(); });
      presetRow.appendChild(b);
    });
    controls.appendChild(presetRow);

    var whoRow = el('div', { class: 'gs-demo__row' });
    whoRow.appendChild(el('span', { class: 'gs-demo__label' }, 'Who proposes'));
    ['Guys', 'Girls'].forEach(function (side) {
      var b = el('button', { type: 'button', class: 'gs-demo__btn gs-demo__who', 'data-side': side }, side);
      b.addEventListener('click', function () { guysPropose = side === 'Guys'; reset(); });
      whoRow.appendChild(b);
    });
    controls.appendChild(whoRow);

    var runRow = el('div', { class: 'gs-demo__row' });
    var stepBtn = el('button', { type: 'button', class: 'gs-demo__btn gs-demo__btn--primary' }, 'Next round');
    stepBtn.addEventListener('click', step);
    var allBtn = el('button', { type: 'button', class: 'gs-demo__btn' }, 'Run to end');
    allBtn.addEventListener('click', runAll);
    var resetBtn = el('button', { type: 'button', class: 'gs-demo__btn' }, 'Reset');
    resetBtn.addEventListener('click', reset);
    runRow.appendChild(stepBtn); runRow.appendChild(allBtn); runRow.appendChild(resetBtn);
    controls.appendChild(runRow);
    root.appendChild(controls);

    var grid = el('div', { class: 'gs-demo__grid' });
    table = el('table', { class: 'gs-demo__scores' });
    grid.appendChild(table);
    drawing = document.createElementNS(SVG_NS, 'svg');
    drawing.setAttribute('viewBox', '0 0 300 200');
    drawing.setAttribute('class', 'gs-demo__drawing');
    drawing.setAttribute('role', 'img');
    grid.appendChild(drawing);
    root.appendChild(grid);

    logBox = el('ol', { class: 'gs-demo__log' });
    root.appendChild(logBox);
    result = el('div', { class: 'gs-demo__result', 'aria-live': 'polite' });
    root.appendChild(result);
    fillTable();
  }

  function fillTable() {
    table.innerHTML = '';
    var cap = el('caption', {}, 'Scores each person gives (higher = keener)');
    table.appendChild(cap);
    var people = GUYS.concat(GIRLS);
    people.forEach(function (person) {
      var others = GUYS.indexOf(person) >= 0 ? GIRLS : GUYS;
      var tr = el('tr');
      tr.appendChild(el('th', { scope: 'row', class: GUYS.indexOf(person) >= 0 ? 'is-guy' : 'is-girl' }, person));
      others.forEach(function (o) {
        var td = el('td');
        var lab = el('label', {}, o + ' ');
        var input = el('input', { type: 'number', step: 'any', value: scores[person][o], 'aria-label': person + ' scores ' + o });
        input.addEventListener('change', function () {
          var v = parseFloat(input.value);
          if (!isNaN(v)) { scores[person][o] = v; reset(); }
        });
        lab.appendChild(input);
        td.appendChild(lab);
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });
  }

  function svgNode(tag, attrs, text) {
    var n = document.createElementNS(SVG_NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (text !== undefined) n.textContent = text;
    return n;
  }

  var POS = { Darren: [60, 55], Rohan: [60, 145], 'Jia Hui': [240, 55], Nadia: [240, 145] };

  function drawLine(a, b, cls) {
    drawing.appendChild(svgNode('line', {
      x1: POS[a][0], y1: POS[a][1], x2: POS[b][0], y2: POS[b][1], class: cls
    }));
  }

  function draw() {
    drawing.innerHTML = '';
    var heldPairs = pairsOf(state.held);
    state.lastProps.forEach(function (p) { if (!p.held) drawLine(p.from, p.to, 'gs-line gs-line--rejected'); });
    heldPairs.forEach(function (pr) { drawLine(pr[0], pr[1], state.done ? 'gs-line gs-line--matched' : 'gs-line gs-line--held'); });
    Object.keys(POS).forEach(function (name) {
      var guy = GUYS.indexOf(name) >= 0;
      drawing.appendChild(svgNode('circle', { cx: POS[name][0], cy: POS[name][1], r: 22, class: guy ? 'gs-node--guy' : 'gs-node--girl' }));
      drawing.appendChild(svgNode('text', { x: POS[name][0], y: POS[name][1] + 42, 'text-anchor': 'middle', class: 'gs-node__name' }, name));
    });
    drawing.setAttribute('aria-label', heldPairs.length
      ? 'Current holds: ' + heldPairs.map(function (p) { return p[0] + ' with ' + p[1]; }).join(', ')
      : 'No proposals yet');
  }

  function render() {
    var who = root.querySelectorAll('.gs-demo__who');
    for (var i = 0; i < who.length; i++) {
      var on = (who[i].getAttribute('data-side') === 'Guys') === guysPropose;
      who[i].classList.toggle('is-active', on);
      who[i].setAttribute('aria-pressed', on);
    }
    draw();
    logBox.innerHTML = '';
    state.log.forEach(function (line) { logBox.appendChild(el('li', {}, line)); });

    result.innerHTML = '';
    if (!state.done) {
      result.appendChild(el('p', {}, state.round === 0
        ? (guysPropose ? 'The guys' : 'The girls') + ' propose. Press "Next round".'
        : 'Unmatched proposers try their next choice.'));
      return;
    }
    var pairs = pairsOf(state.held);
    var t = totals(pairs);
    result.appendChild(el('p', { class: 'gs-demo__final' },
      'Final: ' + pairs.map(function (p) { return p[0] + ' & ' + p[1]; }).join(', ') +
      '. Guys ' + t.guys + ' + girls ' + t.girls + ' = ' + t.total + ' points. Stable.'));

    var other = pairs.map(function (p, idx) { return [p[0], pairs[1 - idx][1]]; });
    var ot = totals(other);
    var blocks = blockingPairs(other);
    result.appendChild(el('p', {}, 'The other possible matching, ' +
      other.map(function (p) { return p[0] + ' & ' + p[1]; }).join(', ') + ', scores ' + ot.total + ' points and is ' +
      (blocks.length ? 'unstable (' + blocks.join(', ') + ' would rather be together).' : 'also stable.')));
  }

  build();
  reset();
})();
