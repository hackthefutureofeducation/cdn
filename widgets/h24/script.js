var rough = (function () {
  "use strict";
  function e(e, t, s) {
    if (e && e.length) {
      let [n, r] = t,
        i = (Math.PI / 180) * s,
        l = Math.cos(i),
        a = Math.sin(i);
      e.forEach((e) => {
        let [t, s] = e;
        (e[0] = (t - n) * l - (s - r) * a + n),
          (e[1] = (t - n) * a + (s - r) * l + r);
      });
    }
  }
  function t(e) {
    let t = e[0],
      s = e[1];
    return Math.sqrt(Math.pow(t[0] - s[0], 2) + Math.pow(t[1] - s[1], 2));
  }
  function s(e, t, s, n) {
    let r = t[1] - e[1],
      i = e[0] - t[0],
      l = r * e[0] + i * e[1],
      a = n[1] - s[1],
      o = s[0] - n[0],
      h = a * s[0] + o * s[1],
      u = r * o - a * i;
    return u ? [(o * l - i * h) / u, (r * h - a * l) / u] : null;
  }
  function n(e, t, s) {
    let n = e.length;
    if (n < 3) return !1;
    let a = [Number.MAX_SAFE_INTEGER, s],
      o = [t, s],
      h = 0;
    for (let u = 0; u < n; u++) {
      let c = e[u],
        $ = e[(u + 1) % n];
      if (l(c, $, o, a)) {
        if (0 === i(c, o, $)) return r(c, o, $);
        h++;
      }
    }
    return h % 2 == 1;
  }
  function r(e, t, s) {
    return (
      t[0] <= Math.max(e[0], s[0]) &&
      t[0] >= Math.min(e[0], s[0]) &&
      t[1] <= Math.max(e[1], s[1]) &&
      t[1] >= Math.min(e[1], s[1])
    );
  }
  function i(e, t, s) {
    let n = (t[1] - e[1]) * (s[0] - t[0]) - (t[0] - e[0]) * (s[1] - t[1]);
    return 0 === n ? 0 : n > 0 ? 1 : 2;
  }
  function l(e, t, s, n) {
    let l = i(e, t, s),
      a = i(e, t, n),
      o = i(s, n, e),
      h = i(s, n, t);
    return (
      (l !== a && o !== h) ||
      !(0 !== l || !r(e, s, t)) ||
      !(0 !== a || !r(e, n, t)) ||
      !(0 !== o || !r(s, e, n)) ||
      !(0 !== h || !r(s, t, n))
    );
  }
  function a(t, s) {
    var n, r, i;
    let l = [0, 0],
      a = Math.round(s.hachureAngle + 90);
    a && e(t, l, a);
    let o = (function (e, t) {
        let s = [...e];
        s[0].join(",") !== s[s.length - 1].join(",") &&
          s.push([s[0][0], s[0][1]]);
        let n = [];
        if (s && s.length > 2) {
          let r = t.hachureGap;
          r < 0 && (r = 4 * t.strokeWidth), (r = Math.max(r, 0.1));
          let i = [];
          for (let l = 0; l < s.length - 1; l++) {
            let a = s[l],
              o = s[l + 1];
            if (a[1] !== o[1]) {
              let h = Math.min(a[1], o[1]);
              i.push({
                ymin: h,
                ymax: Math.max(a[1], o[1]),
                x: h === a[1] ? a[0] : o[0],
                islope: (o[0] - a[0]) / (o[1] - a[1]),
              });
            }
          }
          if (
            (i.sort((e, t) =>
              e.ymin < t.ymin
                ? -1
                : e.ymin > t.ymin
                ? 1
                : e.x < t.x
                ? -1
                : e.x > t.x
                ? 1
                : e.ymax === t.ymax
                ? 0
                : (e.ymax - t.ymax) / Math.abs(e.ymax - t.ymax)
            ),
            !i.length)
          )
            return n;
          let u = [],
            c = i[0].ymin;
          for (; u.length || i.length; ) {
            if (i.length) {
              let $ = -1;
              for (let p = 0; p < i.length && !(i[p].ymin > c); p++) $ = p;
              i.splice(0, $ + 1).forEach((e) => {
                u.push({ s: c, edge: e });
              });
            }
            if (
              ((u = u.filter((e) => !(e.edge.ymax <= c))).sort((e, t) =>
                e.edge.x === t.edge.x
                  ? 0
                  : (e.edge.x - t.edge.x) / Math.abs(e.edge.x - t.edge.x)
              ),
              u.length > 1)
            )
              for (let _ = 0; _ < u.length; _ += 2) {
                let f = _ + 1;
                if (f >= u.length) break;
                let d = u[_].edge,
                  g = u[f].edge;
                n.push([
                  [Math.round(d.x), c],
                  [Math.round(g.x), c],
                ]);
              }
            (c += r),
              u.forEach((e) => {
                e.edge.x = e.edge.x + r * e.edge.islope;
              });
          }
        }
        return n;
      })(t, s),
      h;
    return (
      a &&
        (e(t, l, -a),
        (n = o),
        (r = l),
        (i = -a),
        (h = []),
        n.forEach((e) => h.push(...e)),
        e(h, r, i)),
      o
    );
  }
  class o {
    constructor(e) {
      this.helper = e;
    }
    fillPolygon(e, t) {
      return this._fillPolygon(e, t);
    }
    _fillPolygon(e, t, s = !1) {
      let n = a(e, t);
      if (s) {
        let r = this.connectingLines(e, n);
        n = n.concat(r);
      }
      return { type: "fillSketch", ops: this.renderLines(n, t) };
    }
    renderLines(e, t) {
      let s = [];
      for (let n of e)
        s.push(
          ...this.helper.doubleLineOps(n[0][0], n[0][1], n[1][0], n[1][1], t)
        );
      return s;
    }
    connectingLines(e, s) {
      let n = [];
      if (s.length > 1)
        for (let r = 1; r < s.length; r++) {
          let i = s[r - 1];
          if (3 > t(i)) continue;
          let l = [s[r][0], i[1]];
          if (t(l) > 3) {
            let a = this.splitOnIntersections(e, l);
            n.push(...a);
          }
        }
      return n;
    }
    midPointInPolygon(e, t) {
      return n(e, (t[0][0] + t[1][0]) / 2, (t[0][1] + t[1][1]) / 2);
    }
    splitOnIntersections(e, r) {
      let i = Math.max(5, 0.1 * t(r)),
        a = [];
      for (let o = 0; o < e.length; o++) {
        let h = e[o],
          u = e[(o + 1) % e.length];
        if (l(h, u, ...r)) {
          let c = s(h, u, r[0], r[1]);
          if (c) {
            let $ = t([c, r[0]]),
              p = t([c, r[1]]);
            $ > i && p > i && a.push({ point: c, distance: $ });
          }
        }
      }
      if (a.length > 1) {
        let _ = a.sort((e, t) => e.distance - t.distance).map((e) => e.point);
        if (
          (n(e, ...r[0]) || _.shift(), n(e, ...r[1]) || _.pop(), _.length <= 1)
        )
          return this.midPointInPolygon(e, r) ? [r] : [];
        let f = [r[0], ..._, r[1]],
          d = [];
        for (let g = 0; g < f.length - 1; g += 2) {
          let k = [f[g], f[g + 1]];
          this.midPointInPolygon(e, k) && d.push(k);
        }
        return d;
      }
      return this.midPointInPolygon(e, r) ? [r] : [];
    }
  }
  class h extends o {
    fillPolygon(e, t) {
      return this._fillPolygon(e, t, !0);
    }
  }
  class u extends o {
    fillPolygon(e, t) {
      let s = this._fillPolygon(e, t),
        n = Object.assign({}, t, { hachureAngle: t.hachureAngle + 90 }),
        r = this._fillPolygon(e, n);
      return (s.ops = s.ops.concat(r.ops)), s;
    }
  }
  class c {
    constructor(e) {
      this.helper = e;
    }
    fillPolygon(e, t) {
      let s = a(
        e,
        (t = Object.assign({}, t, {
          curveStepCount: 4,
          hachureAngle: 0,
          roughness: 1,
        }))
      );
      return this.dotsOnLines(s, t);
    }
    dotsOnLines(e, s) {
      let n = [],
        r = s.hachureGap;
      r < 0 && (r = 4 * s.strokeWidth), (r = Math.max(r, 0.1));
      let i = s.fillWeight;
      i < 0 && (i = s.strokeWidth / 2);
      let l = r / 4;
      for (let a of e) {
        let o = t(a),
          h = Math.ceil(o / r) - 1,
          u = o - h * r,
          c = (a[0][0] + a[1][0]) / 2 - r / 4,
          $ = Math.min(a[0][1], a[1][1]);
        for (let p = 0; p < h; p++) {
          let _ = $ + u + p * r,
            f = this.helper.randOffsetWithRange(c - l, c + l, s),
            d = this.helper.randOffsetWithRange(_ - l, _ + l, s),
            g = this.helper.ellipse(f, d, i, i, s);
          n.push(...g.ops);
        }
      }
      return { type: "fillSketch", ops: n };
    }
  }
  class $ {
    constructor(e) {
      this.helper = e;
    }
    fillPolygon(e, t) {
      let s = a(e, t);
      return { type: "fillSketch", ops: this.dashedLine(s, t) };
    }
    dashedLine(e, s) {
      let n =
          s.dashOffset < 0
            ? s.hachureGap < 0
              ? 4 * s.strokeWidth
              : s.hachureGap
            : s.dashOffset,
        r =
          s.dashGap < 0
            ? s.hachureGap < 0
              ? 4 * s.strokeWidth
              : s.hachureGap
            : s.dashGap,
        i = [];
      return (
        e.forEach((e) => {
          let l = t(e),
            a = Math.floor(l / (n + r)),
            o = (l + r - a * (n + r)) / 2,
            h = e[0],
            u = e[1];
          h[0] > u[0] && ((h = e[1]), (u = e[0]));
          let c = Math.atan((u[1] - h[1]) / (u[0] - h[0]));
          for (let $ = 0; $ < a; $++) {
            let p = $ * (n + r),
              _ = p + n,
              f = [
                h[0] + p * Math.cos(c) + o * Math.cos(c),
                h[1] + p * Math.sin(c) + o * Math.sin(c),
              ],
              d = [
                h[0] + _ * Math.cos(c) + o * Math.cos(c),
                h[1] + _ * Math.sin(c) + o * Math.sin(c),
              ];
            i.push(...this.helper.doubleLineOps(f[0], f[1], d[0], d[1], s));
          }
        }),
        i
      );
    }
  }
  class p {
    constructor(e) {
      this.helper = e;
    }
    fillPolygon(e, t) {
      let s = t.hachureGap < 0 ? 4 * t.strokeWidth : t.hachureGap,
        n = t.zigzagOffset < 0 ? s : t.zigzagOffset,
        r = a(e, (t = Object.assign({}, t, { hachureGap: s + n })));
      return { type: "fillSketch", ops: this.zigzagLines(r, n, t) };
    }
    zigzagLines(e, s, n) {
      let r = [];
      return (
        e.forEach((e) => {
          let i = Math.round(t(e) / (2 * s)),
            l = e[0],
            a = e[1];
          l[0] > a[0] && ((l = e[1]), (a = e[0]));
          let o = Math.atan((a[1] - l[1]) / (a[0] - l[0]));
          for (let h = 0; h < i; h++) {
            let u = 2 * h * s,
              c = 2 * (h + 1) * s,
              $ = Math.sqrt(2 * Math.pow(s, 2)),
              p = [l[0] + u * Math.cos(o), l[1] + u * Math.sin(o)],
              _ = [l[0] + c * Math.cos(o), l[1] + c * Math.sin(o)],
              f = [
                p[0] + $ * Math.cos(o + Math.PI / 4),
                p[1] + $ * Math.sin(o + Math.PI / 4),
              ];
            r.push(
              ...this.helper.doubleLineOps(p[0], p[1], f[0], f[1], n),
              ...this.helper.doubleLineOps(f[0], f[1], _[0], _[1], n)
            );
          }
        }),
        r
      );
    }
  }
  let _ = {};
  class f {
    constructor(e) {
      this.seed = e;
    }
    next() {
      return this.seed
        ? (2147483647 & (this.seed = Math.imul(48271, this.seed))) / 2147483648
        : Math.random();
    }
  }
  let d = {
    A: 7,
    a: 7,
    C: 6,
    c: 6,
    H: 1,
    h: 1,
    L: 2,
    l: 2,
    M: 2,
    m: 2,
    Q: 4,
    q: 4,
    S: 4,
    s: 4,
    T: 2,
    t: 2,
    V: 1,
    v: 1,
    Z: 0,
    z: 0,
  };
  function g(e, t) {
    return e.type === t;
  }
  function k(e) {
    let t = [],
      s = (function (e) {
        let t = [];
        for (; "" !== e; )
          if (e.match(/^([ \t\r\n,]+)/)) e = e.substr(RegExp.$1.length);
          else if (e.match(/^([aAcChHlLmMqQsStTvVzZ])/))
            (t[t.length] = { type: 0, text: RegExp.$1 }),
              (e = e.substr(RegExp.$1.length));
          else {
            if (
              !e.match(
                /^(([-+]?[0-9]+(\.[0-9]*)?|[-+]?\.[0-9]+)([eE][-+]?[0-9]+)?)/
              )
            )
              return [];
            (t[t.length] = { type: 1, text: "" + parseFloat(RegExp.$1) }),
              (e = e.substr(RegExp.$1.length));
          }
        return (t[t.length] = { type: 2, text: "" }), t;
      })(e),
      n = "BOD",
      r = 0,
      i = s[r];
    for (; !g(i, 2); ) {
      let l = 0,
        a = [];
      if ("BOD" === n) {
        if ("M" !== i.text && "m" !== i.text) return k("M0,0" + e);
        r++, (l = d[i.text]), (n = i.text);
      } else g(i, 1) ? (l = d[n]) : (r++, (l = d[i.text]), (n = i.text));
      if (!(r + l < s.length)) throw Error("Path data ended short");
      for (let o = r; o < r + l; o++) {
        let h = s[o];
        if (!g(h, 1)) throw Error("Param not a number: " + n + "," + h.text);
        a[a.length] = +h.text;
      }
      if ("number" != typeof d[n]) throw Error("Bad segment: " + n);
      {
        let u = { key: n, data: a };
        t.push(u),
          (r += l),
          (i = s[r]),
          "M" === n && (n = "L"),
          "m" === n && (n = "l");
      }
    }
    return t;
  }
  function m(e) {
    let t = 0,
      s = 0,
      n = 0,
      r = 0,
      i = [];
    for (let { key: l, data: a } of e)
      switch (l) {
        case "M":
          i.push({ key: "M", data: [...a] }), ([t, s] = a), ([n, r] = a);
          break;
        case "m":
          (t += a[0]),
            (s += a[1]),
            i.push({ key: "M", data: [t, s] }),
            (n = t),
            (r = s);
          break;
        case "L":
          i.push({ key: "L", data: [...a] }), ([t, s] = a);
          break;
        case "l":
          (t += a[0]), (s += a[1]), i.push({ key: "L", data: [t, s] });
          break;
        case "C":
          i.push({ key: "C", data: [...a] }), (t = a[4]), (s = a[5]);
          break;
        case "c": {
          let o = a.map((e, n) => (n % 2 ? e + s : e + t));
          i.push({ key: "C", data: o }), (t = o[4]), (s = o[5]);
          break;
        }
        case "Q":
          i.push({ key: "Q", data: [...a] }), (t = a[2]), (s = a[3]);
          break;
        case "q": {
          let h = a.map((e, n) => (n % 2 ? e + s : e + t));
          i.push({ key: "Q", data: h }), (t = h[2]), (s = h[3]);
          break;
        }
        case "A":
          i.push({ key: "A", data: [...a] }), (t = a[5]), (s = a[6]);
          break;
        case "a":
          (t += a[5]),
            (s += a[6]),
            i.push({ key: "A", data: [a[0], a[1], a[2], a[3], a[4], t, s] });
          break;
        case "H":
          i.push({ key: "H", data: [...a] }), (t = a[0]);
          break;
        case "h":
          (t += a[0]), i.push({ key: "H", data: [t] });
          break;
        case "V":
          i.push({ key: "V", data: [...a] }), (s = a[0]);
          break;
        case "v":
          (s += a[0]), i.push({ key: "V", data: [s] });
          break;
        case "S":
          i.push({ key: "S", data: [...a] }), (t = a[2]), (s = a[3]);
          break;
        case "s": {
          let u = a.map((e, n) => (n % 2 ? e + s : e + t));
          i.push({ key: "S", data: u }), (t = u[2]), (s = u[3]);
          break;
        }
        case "T":
          i.push({ key: "T", data: [...a] }), (t = a[0]), (s = a[1]);
          break;
        case "t":
          (t += a[0]), (s += a[1]), i.push({ key: "T", data: [t, s] });
          break;
        case "Z":
        case "z":
          i.push({ key: "Z", data: [] }), (t = n), (s = r);
      }
    return i;
  }
  function y(e) {
    let t = [],
      s = "",
      n = 0,
      r = 0,
      i = 0,
      l = 0,
      a = 0,
      o = 0;
    for (let { key: h, data: u } of e) {
      switch (h) {
        case "M":
          t.push({ key: "M", data: [...u] }), ([n, r] = u), ([i, l] = u);
          break;
        case "C":
          t.push({ key: "C", data: [...u] }),
            (n = u[4]),
            (r = u[5]),
            (a = u[2]),
            (o = u[3]);
          break;
        case "L":
          t.push({ key: "L", data: [...u] }), ([n, r] = u);
          break;
        case "H":
          (n = u[0]), t.push({ key: "L", data: [n, r] });
          break;
        case "V":
          (r = u[0]), t.push({ key: "L", data: [n, r] });
          break;
        case "S": {
          let c = 0,
            $ = 0;
          "C" === s || "S" === s
            ? ((c = n + (n - a)), ($ = r + (r - o)))
            : ((c = n), ($ = r)),
            t.push({ key: "C", data: [c, $, ...u] }),
            (a = u[0]),
            (o = u[1]),
            (n = u[2]),
            (r = u[3]);
          break;
        }
        case "T": {
          let [p, _] = u,
            f = 0,
            d = 0;
          "Q" === s || "T" === s
            ? ((f = n + (n - a)), (d = r + (r - o)))
            : ((f = n), (d = r));
          let g = n + (2 * (f - n)) / 3,
            k = r + (2 * (d - r)) / 3,
            m = p + (2 * (f - p)) / 3,
            y = _ + (2 * (d - _)) / 3;
          t.push({ key: "C", data: [g, k, m, y, p, _] }),
            (a = f),
            (o = d),
            (n = p),
            (r = _);
          break;
        }
        case "Q": {
          let [b, v, L, P] = u,
            x = n + (2 * (b - n)) / 3,
            S = r + (2 * (v - r)) / 3,
            C = L + (2 * (b - L)) / 3,
            O = P + (2 * (v - P)) / 3;
          t.push({ key: "C", data: [x, S, C, O, L, P] }),
            (a = b),
            (o = v),
            (n = L),
            (r = P);
          break;
        }
        case "A": {
          let I = Math.abs(u[0]),
            T = Math.abs(u[1]),
            W = u[2],
            A = u[3],
            D = u[4],
            E = u[5],
            M = u[6];
          0 === I || 0 === T
            ? (t.push({ key: "C", data: [n, r, E, M, E, M] }), (n = E), (r = M))
            : (n !== E || r !== M) &&
              (w(n, r, E, M, I, T, W, A, D).forEach(function (e) {
                t.push({ key: "C", data: e });
              }),
              (n = E),
              (r = M));
          break;
        }
        case "Z":
          t.push({ key: "Z", data: [] }), (n = i), (r = l);
      }
      s = h;
    }
    return t;
  }
  function b(e, t, s) {
    return [
      e * Math.cos(s) - t * Math.sin(s),
      e * Math.sin(s) + t * Math.cos(s),
    ];
  }
  function w(e, t, s, n, r, i, l, a, o, h) {
    var u;
    let c = (Math.PI * (u = l)) / 180,
      $ = [],
      p = 0,
      _ = 0,
      f = 0,
      d = 0;
    if (h) [p, _, f, d] = h;
    else {
      ([e, t] = b(e, t, -c)), ([s, n] = b(s, n, -c));
      let g = (e - s) / 2,
        k = (t - n) / 2,
        m = (g * g) / (r * r) + (k * k) / (i * i);
      m > 1 && ((r *= m = Math.sqrt(m)), (i *= m));
      let y = r * r,
        v = i * i,
        L =
          (a === o ? -1 : 1) *
          Math.sqrt(
            Math.abs((y * v - y * k * k - v * g * g) / (y * k * k + v * g * g))
          );
      (f = (L * r * k) / i + (e + s) / 2),
        (d = (-(L * i) * g) / r + (t + n) / 2),
        (p = Math.asin(parseFloat(((t - d) / i).toFixed(9)))),
        (_ = Math.asin(parseFloat(((n - d) / i).toFixed(9)))),
        e < f && (p = Math.PI - p),
        s < f && (_ = Math.PI - _),
        p < 0 && (p = 2 * Math.PI + p),
        _ < 0 && (_ = 2 * Math.PI + _),
        o && p > _ && (p -= 2 * Math.PI),
        !o && _ > p && (_ -= 2 * Math.PI);
    }
    let P = _ - p;
    if (Math.abs(P) > (120 * Math.PI) / 180) {
      let x = _,
        S = s,
        C = n;
      $ = w(
        (s =
          f +
          r *
            Math.cos(
              (_ =
                o && _ > p
                  ? p + ((120 * Math.PI) / 180) * 1
                  : p + -(((120 * Math.PI) / 180) * 1))
            )),
        (n = d + i * Math.sin(_)),
        S,
        C,
        r,
        i,
        l,
        0,
        o,
        [_, x, f, d]
      );
    }
    let O = Math.cos(p),
      I = Math.sin(p),
      T = Math.cos(_),
      W = Math.sin(_),
      A = Math.tan((P = _ - p) / 4),
      D = (4 / 3) * r * A,
      E = (4 / 3) * i * A,
      M = [e, t],
      z = [e + D * I, t - E * O],
      R = [s + D * W, n - E * T],
      G = [s, n];
    if (((z[0] = 2 * M[0] - z[0]), (z[1] = 2 * M[1] - z[1]), h))
      return [z, R, G].concat($);
    {
      $ = [z, R, G].concat($);
      let B = [];
      for (let q = 0; q < $.length; q += 3) {
        let H = b($[q][0], $[q][1], c),
          N = b($[q + 1][0], $[q + 1][1], c),
          F = b($[q + 2][0], $[q + 2][1], c);
        B.push([H[0], H[1], N[0], N[1], F[0], F[1]]);
      }
      return B;
    }
  }
  let v = {
    randOffset: function (e, t) {
      return A(e, t);
    },
    randOffsetWithRange: function (e, t, s) {
      return W(e, t, s);
    },
    ellipse: function (e, t, s, n, r) {
      let i = x(s, n, r);
      return S(e, t, r, i).opset;
    },
    doubleLineOps: function (e, t, s, n, r) {
      return D(e, t, s, n, r, !0);
    },
  };
  function L(e, t, s, n, r) {
    return { type: "path", ops: D(e, t, s, n, r) };
  }
  function P(e, t, s) {
    let n = (e || []).length;
    if (n > 2) {
      let r = [];
      for (let i = 0; i < n - 1; i++)
        r.push(...D(e[i][0], e[i][1], e[i + 1][0], e[i + 1][1], s));
      return (
        t && r.push(...D(e[n - 1][0], e[n - 1][1], e[0][0], e[0][1], s)),
        { type: "path", ops: r }
      );
    }
    return 2 === n
      ? L(e[0][0], e[0][1], e[1][0], e[1][1], s)
      : { type: "path", ops: [] };
  }
  function x(e, t, s) {
    let n = Math.max(
        s.curveStepCount,
        (s.curveStepCount / Math.sqrt(200)) *
          Math.sqrt(
            2 *
              Math.PI *
              Math.sqrt((Math.pow(e / 2, 2) + Math.pow(t / 2, 2)) / 2)
          )
      ),
      r = Math.abs(e / 2),
      i = Math.abs(t / 2),
      l = 1 - s.curveFitting;
    return (
      (r += A(r * l, s)),
      (i += A(i * l, s)),
      { increment: (2 * Math.PI) / n, rx: r, ry: i }
    );
  }
  function S(e, t, s, n) {
    let [r, i] = R(
        n.increment,
        e,
        t,
        n.rx,
        n.ry,
        1,
        n.increment * W(0.1, W(0.4, 1, s), s),
        s
      ),
      l = z(r, null, s);
    if (!s.disableMultiStroke) {
      let [a] = R(n.increment, e, t, n.rx, n.ry, 1.5, 0, s),
        o = z(a, null, s);
      l = l.concat(o);
    }
    return { estimatedPoints: i, opset: { type: "path", ops: l } };
  }
  function C(e, t, s, n, r, i, l, a, o) {
    let h = e,
      u = t,
      c = Math.abs(s / 2),
      $ = Math.abs(n / 2);
    (c += A(0.01 * c, o)), ($ += A(0.01 * $, o));
    let p = r,
      _ = i;
    for (; p < 0; ) (p += 2 * Math.PI), (_ += 2 * Math.PI);
    _ - p > 2 * Math.PI && ((p = 0), (_ = 2 * Math.PI));
    let f = Math.min((2 * Math.PI) / o.curveStepCount / 2, (_ - p) / 2),
      d = G(f, h, u, c, $, p, _, 1, o);
    if (!o.disableMultiStroke) {
      let g = G(f, h, u, c, $, p, _, 1.5, o);
      d.push(...g);
    }
    return (
      l &&
        (a
          ? d.push(
              ...D(h, u, h + c * Math.cos(p), u + $ * Math.sin(p), o),
              ...D(h, u, h + c * Math.cos(_), u + $ * Math.sin(_), o)
            )
          : d.push(
              { op: "lineTo", data: [h, u] },
              { op: "lineTo", data: [h + c * Math.cos(p), u + $ * Math.sin(p)] }
            )),
      { type: "path", ops: d }
    );
  }
  function O(e, t) {
    let s = [];
    if (e.length) {
      let n = t.maxRandomnessOffset || 0,
        r = e.length;
      if (r > 2) {
        s.push({ op: "move", data: [e[0][0] + A(n, t), e[0][1] + A(n, t)] });
        for (let i = 1; i < r; i++)
          s.push({
            op: "lineTo",
            data: [e[i][0] + A(n, t), e[i][1] + A(n, t)],
          });
      }
    }
    return { type: "fillPath", ops: s };
  }
  function I(e, t) {
    return (function (e, t) {
      let s = e.fillStyle || "hachure";
      if (!_[s])
        switch (s) {
          case "zigzag":
            _[s] || (_[s] = new h(t));
            break;
          case "cross-hatch":
            _[s] || (_[s] = new u(t));
            break;
          case "dots":
            _[s] || (_[s] = new c(t));
            break;
          case "dashed":
            _[s] || (_[s] = new $(t));
            break;
          case "zigzag-line":
            _[s] || (_[s] = new p(t));
            break;
          default:
            _[(s = "hachure")] || (_[s] = new o(t));
        }
      return _[s];
    })(t, v).fillPolygon(e, t);
  }
  function T(e) {
    return (
      e.randomizer || (e.randomizer = new f(e.seed || 0)), e.randomizer.next()
    );
  }
  function W(e, t, s, n = 1) {
    return s.roughness * n * (T(s) * (t - e) + e);
  }
  function A(e, t, s = 1) {
    return W(-e, e, t, s);
  }
  function D(e, t, s, n, r, i = !1) {
    let l = i ? r.disableMultiStrokeFill : r.disableMultiStroke,
      a = E(e, t, s, n, r, !0, !1);
    if (l) return a;
    let o = E(e, t, s, n, r, !0, !0);
    return a.concat(o);
  }
  function E(e, t, s, n, r, i, l) {
    let a = Math.pow(e - s, 2) + Math.pow(t - n, 2),
      o = Math.sqrt(a),
      h = 1;
    h = o < 200 ? 1 : o > 500 ? 0.4 : -0.0016668 * o + 1.233334;
    let u = r.maxRandomnessOffset || 0;
    u * u * 100 > a && (u = o / 10);
    let c = u / 2,
      $ = 0.2 + 0.2 * T(r),
      p = (r.bowing * r.maxRandomnessOffset * (n - t)) / 200,
      _ = (r.bowing * r.maxRandomnessOffset * (e - s)) / 200;
    (p = A(p, r, h)), (_ = A(_, r, h));
    let f = [],
      d = () => A(c, r, h),
      g = () => A(u, r, h);
    return (
      i &&
        (l
          ? f.push({ op: "move", data: [e + d(), t + d()] })
          : f.push({ op: "move", data: [e + A(u, r, h), t + A(u, r, h)] })),
      l
        ? f.push({
            op: "bcurveTo",
            data: [
              p + e + (s - e) * $ + d(),
              _ + t + (n - t) * $ + d(),
              p + e + 2 * (s - e) * $ + d(),
              _ + t + 2 * (n - t) * $ + d(),
              s + d(),
              n + d(),
            ],
          })
        : f.push({
            op: "bcurveTo",
            data: [
              p + e + (s - e) * $ + g(),
              _ + t + (n - t) * $ + g(),
              p + e + 2 * (s - e) * $ + g(),
              _ + t + 2 * (n - t) * $ + g(),
              s + g(),
              n + g(),
            ],
          }),
      f
    );
  }
  function M(e, t, s) {
    let n = [];
    n.push([e[0][0] + A(t, s), e[0][1] + A(t, s)]),
      n.push([e[0][0] + A(t, s), e[0][1] + A(t, s)]);
    for (let r = 1; r < e.length; r++)
      n.push([e[r][0] + A(t, s), e[r][1] + A(t, s)]),
        r === e.length - 1 && n.push([e[r][0] + A(t, s), e[r][1] + A(t, s)]);
    return z(n, null, s);
  }
  function z(e, t, s) {
    let n = e.length,
      r = [];
    if (n > 3) {
      let i = [],
        l = 1 - s.curveTightness;
      r.push({ op: "move", data: [e[1][0], e[1][1]] });
      for (let a = 1; a + 2 < n; a++) {
        let o = e[a];
        (i[0] = [o[0], o[1]]),
          (i[1] = [
            o[0] + (l * e[a + 1][0] - l * e[a - 1][0]) / 6,
            o[1] + (l * e[a + 1][1] - l * e[a - 1][1]) / 6,
          ]),
          (i[2] = [
            e[a + 1][0] + (l * e[a][0] - l * e[a + 2][0]) / 6,
            e[a + 1][1] + (l * e[a][1] - l * e[a + 2][1]) / 6,
          ]),
          (i[3] = [e[a + 1][0], e[a + 1][1]]),
          r.push({
            op: "bcurveTo",
            data: [i[1][0], i[1][1], i[2][0], i[2][1], i[3][0], i[3][1]],
          });
      }
      if (t && 2 === t.length) {
        let h = s.maxRandomnessOffset;
        r.push({ op: "lineTo", data: [t[0] + A(h, s), t[1] + A(h, s)] });
      }
    } else
      3 === n
        ? (r.push({ op: "move", data: [e[1][0], e[1][1]] }),
          r.push({
            op: "bcurveTo",
            data: [e[1][0], e[1][1], e[2][0], e[2][1], e[2][0], e[2][1]],
          }))
        : 2 === n && r.push(...D(e[0][0], e[0][1], e[1][0], e[1][1], s));
    return r;
  }
  function R(e, t, s, n, r, i, l, a) {
    let o = [],
      h = [],
      u = A(0.5, a) - Math.PI / 2;
    h.push([
      A(i, a) + t + 0.9 * n * Math.cos(u - e),
      A(i, a) + s + 0.9 * r * Math.sin(u - e),
    ]);
    for (let c = u; c < 2 * Math.PI + u - 0.01; c += e) {
      let $ = [A(i, a) + t + n * Math.cos(c), A(i, a) + s + r * Math.sin(c)];
      o.push($), h.push($);
    }
    return (
      h.push([
        A(i, a) + t + n * Math.cos(u + 2 * Math.PI + 0.5 * l),
        A(i, a) + s + r * Math.sin(u + 2 * Math.PI + 0.5 * l),
      ]),
      h.push([
        A(i, a) + t + 0.98 * n * Math.cos(u + l),
        A(i, a) + s + 0.98 * r * Math.sin(u + l),
      ]),
      h.push([
        A(i, a) + t + 0.9 * n * Math.cos(u + 0.5 * l),
        A(i, a) + s + 0.9 * r * Math.sin(u + 0.5 * l),
      ]),
      [h, o]
    );
  }
  function G(e, t, s, n, r, i, l, a, o) {
    let h = i + A(0.1, o),
      u = [];
    u.push([
      A(a, o) + t + 0.9 * n * Math.cos(h - e),
      A(a, o) + s + 0.9 * r * Math.sin(h - e),
    ]);
    for (let c = h; c <= l; c += e)
      u.push([A(a, o) + t + n * Math.cos(c), A(a, o) + s + r * Math.sin(c)]);
    return (
      u.push([t + n * Math.cos(l), s + r * Math.sin(l)]),
      u.push([t + n * Math.cos(l), s + r * Math.sin(l)]),
      z(u, null, o)
    );
  }
  function B(e, t, s, n, r, i, l, a) {
    let o = [],
      h = [a.maxRandomnessOffset || 1, (a.maxRandomnessOffset || 1) + 0.3],
      u = [0, 0],
      c = a.disableMultiStroke ? 1 : 2;
    for (let $ = 0; $ < c; $++)
      0 === $
        ? o.push({ op: "move", data: [l[0], l[1]] })
        : o.push({ op: "move", data: [l[0] + A(h[0], a), l[1] + A(h[0], a)] }),
        (u = [r + A(h[$], a), i + A(h[$], a)]),
        o.push({
          op: "bcurveTo",
          data: [
            e + A(h[$], a),
            t + A(h[$], a),
            s + A(h[$], a),
            n + A(h[$], a),
            u[0],
            u[1],
          ],
        });
    return o;
  }
  function q(e) {
    return [...e];
  }
  function H(e, t) {
    return Math.pow(e[0] - t[0], 2) + Math.pow(e[1] - t[1], 2);
  }
  function N(e, t, s) {
    let n = H(t, s);
    if (0 === n) return H(e, t);
    let r = ((e[0] - t[0]) * (s[0] - t[0]) + (e[1] - t[1]) * (s[1] - t[1])) / n;
    return H(e, F(t, s, (r = Math.max(0, Math.min(1, r)))));
  }
  function F(e, t, s) {
    return [e[0] + (t[0] - e[0]) * s, e[1] + (t[1] - e[1]) * s];
  }
  function Z(e, t, s, n) {
    var r, i, l, a;
    let o = n || [],
      h,
      u,
      c,
      $,
      p,
      _,
      f,
      d;
    if (
      ((l = e),
      (h = l[(a = t) + 0]),
      (u = l[a + 1]),
      (c = l[a + 2]),
      ($ = l[a + 3]),
      (p = 3 * u[0] - 2 * h[0] - $[0]),
      (p *= p),
      (_ = 3 * u[1] - 2 * h[1] - $[1]),
      (_ *= _),
      (f = 3 * c[0] - 2 * $[0] - h[0]),
      (f *= f),
      (d = 3 * c[1] - 2 * $[1] - h[1]),
      (d *= d),
      p < f && (p = f),
      _ < d && (_ = d),
      p + _ < s)
    ) {
      let g = e[t + 0];
      o.length
        ? Math.sqrt(H((r = o[o.length - 1]), (i = g))) > 1 && o.push(g)
        : o.push(g),
        o.push(e[t + 3]);
    } else {
      let k = e[t + 0],
        m = e[t + 1],
        y = e[t + 2],
        b = e[t + 3],
        w = F(k, m, 0.5),
        v = F(m, y, 0.5),
        L = F(y, b, 0.5),
        P = F(w, v, 0.5),
        x = F(v, L, 0.5),
        S = F(P, x, 0.5);
      Z([k, w, P, S], 0, s, o), Z([S, x, L, b], 0, s, o);
    }
    return o;
  }
  function Q(e, t) {
    return j(e, 0, e.length, t);
  }
  function j(e, t, s, n, r) {
    let i = r || [],
      l = e[t],
      a = e[s - 1],
      o = 0,
      h = 1;
    for (let u = t + 1; u < s - 1; ++u) {
      let c = N(e[u], l, a);
      c > o && ((o = c), (h = u));
    }
    return (
      Math.sqrt(o) > n
        ? (j(e, t, h + 1, n, i), j(e, h, s, n, i))
        : (i.length || i.push(l), i.push(a)),
      i
    );
  }
  function V(e, t = 0.15, s) {
    let n = [],
      r = (e.length - 1) / 3;
    for (let i = 0; i < r; i++) Z(e, 3 * i, t, n);
    return s && s > 0 ? j(n, 0, n.length, s) : n;
  }
  let X = "none";
  class Y {
    constructor(e) {
      (this.defaultOptions = {
        maxRandomnessOffset: 2,
        roughness: 1,
        bowing: 1,
        stroke: "#000",
        strokeWidth: 1,
        curveTightness: 0,
        curveFitting: 0.95,
        curveStepCount: 9,
        fillStyle: "hachure",
        fillWeight: -1,
        hachureAngle: -41,
        hachureGap: -1,
        dashOffset: -1,
        dashGap: -1,
        zigzagOffset: -1,
        seed: 0,
        combineNestedSvgPaths: !1,
        disableMultiStroke: !1,
        disableMultiStrokeFill: !1,
      }),
        (this.config = e || {}),
        this.config.options &&
          (this.defaultOptions = this._o(this.config.options));
    }
    static newSeed() {
      return Math.floor(2147483648 * Math.random());
    }
    _o(e) {
      return e
        ? Object.assign({}, this.defaultOptions, e)
        : this.defaultOptions;
    }
    _d(e, t, s) {
      return { shape: e, sets: t || [], options: s || this.defaultOptions };
    }
    line(e, t, s, n, r) {
      let i = this._o(r);
      return this._d("line", [L(e, t, s, n, i)], i);
    }
    rectangle(e, t, s, n, r) {
      var i, l, a, o, h, u, c;
      let $ = this._o(r),
        p = [],
        _ =
          ((i = e),
          (l = t),
          (a = s),
          (o = n),
          (h = $),
          (u = [
            [i, l],
            [i + a, l],
            [i + a, l + o],
            [i, l + o],
          ]),
          (c = h),
          P(u, !0, c));
      if ($.fill) {
        let f = [
          [e, t],
          [e + s, t],
          [e + s, t + n],
          [e, t + n],
        ];
        "solid" === $.fillStyle ? p.push(O(f, $)) : p.push(I(f, $));
      }
      return $.stroke !== X && p.push(_), this._d("rectangle", p, $);
    }
    ellipse(e, t, s, n, r) {
      let i = this._o(r),
        l = [],
        a = x(s, n, i),
        o = S(e, t, i, a);
      if (i.fill) {
        if ("solid" === i.fillStyle) {
          let h = S(e, t, i, a).opset;
          (h.type = "fillPath"), l.push(h);
        } else l.push(I(o.estimatedPoints, i));
      }
      return i.stroke !== X && l.push(o.opset), this._d("ellipse", l, i);
    }
    circle(e, t, s, n) {
      let r = this.ellipse(e, t, s, s, n);
      return (r.shape = "circle"), r;
    }
    linearPath(e, t) {
      let s = this._o(t);
      return this._d("linearPath", [P(e, !1, s)], s);
    }
    arc(e, t, s, n, r, i, l = !1, a) {
      let o = this._o(a),
        h = [],
        u = C(e, t, s, n, r, i, l, !0, o);
      if (l && o.fill) {
        if ("solid" === o.fillStyle) {
          let c = C(e, t, s, n, r, i, !0, !1, o);
          (c.type = "fillPath"), h.push(c);
        } else
          h.push(
            (function (e, t, s, n, r, i, l) {
              let a = e,
                o = t,
                h = Math.abs(s / 2),
                u = Math.abs(n / 2);
              (h += A(0.01 * h, l)), (u += A(0.01 * u, l));
              let c = r,
                $ = i;
              for (; c < 0; ) (c += 2 * Math.PI), ($ += 2 * Math.PI);
              $ - c > 2 * Math.PI && ((c = 0), ($ = 2 * Math.PI));
              let p = ($ - c) / l.curveStepCount,
                _ = [];
              for (let f = c; f <= $; f += p)
                _.push([a + h * Math.cos(f), o + u * Math.sin(f)]);
              return (
                _.push([a + h * Math.cos($), o + u * Math.sin($)]),
                _.push([a, o]),
                I(_, l)
              );
            })(e, t, s, n, r, i, o)
          );
      }
      return o.stroke !== X && h.push(u), this._d("arc", h, o);
    }
    curve(e, t) {
      let s = this._o(t),
        n = [],
        r = (function e(t, s) {
          let n = M(t, 1 * (1 + 0.2 * s.roughness), s);
          if (!s.disableMultiStroke) {
            var r;
            let i,
              l = M(
                t,
                1.5 * (1 + 0.22 * s.roughness),
                (((i = Object.assign({}, (r = s))).randomizer = void 0),
                r.seed && (i.seed = r.seed + 1),
                i)
              );
            n = n.concat(l);
          }
          return { type: "path", ops: n };
        })(e, s);
      if (s.fill && s.fill !== X && e.length >= 3) {
        let i = V(
          (function (e, t = 0) {
            let s = e.length;
            if (s < 3) throw Error("A curve must have at least three points.");
            let n = [];
            if (3 === s) n.push(q(e[0]), q(e[1]), q(e[2]), q(e[2]));
            else {
              let r = [];
              r.push(e[0], e[0]);
              for (let i = 1; i < e.length; i++)
                r.push(e[i]), i === e.length - 1 && r.push(e[i]);
              let l = [],
                a = 1 - t;
              n.push(q(r[0]));
              for (let o = 1; o + 2 < r.length; o++) {
                let h = r[o];
                (l[0] = [h[0], h[1]]),
                  (l[1] = [
                    h[0] + (a * r[o + 1][0] - a * r[o - 1][0]) / 6,
                    h[1] + (a * r[o + 1][1] - a * r[o - 1][1]) / 6,
                  ]),
                  (l[2] = [
                    r[o + 1][0] + (a * r[o][0] - a * r[o + 2][0]) / 6,
                    r[o + 1][1] + (a * r[o][1] - a * r[o + 2][1]) / 6,
                  ]),
                  (l[3] = [r[o + 1][0], r[o + 1][1]]),
                  n.push(l[1], l[2], l[3]);
              }
            }
            return n;
          })(e),
          10,
          (1 + s.roughness) / 2
        );
        "solid" === s.fillStyle ? n.push(O(i, s)) : n.push(I(i, s));
      }
      return s.stroke !== X && n.push(r), this._d("curve", n, s);
    }
    polygon(e, t) {
      let s = this._o(t),
        n = [],
        r = P(e, !0, s);
      return (
        s.fill && ("solid" === s.fillStyle ? n.push(O(e, s)) : n.push(I(e, s))),
        s.stroke !== X && n.push(r),
        this._d("polygon", n, s)
      );
    }
    path(e, t) {
      let s = this._o(t),
        n = [];
      if (!e) return this._d("path", n, s);
      e = (e || "")
        .replace(/\n/g, " ")
        .replace(/(-\s)/g, "-")
        .replace("/(ss)/g", " ");
      let r = s.fill && "transparent" !== s.fill && s.fill !== X,
        i = s.stroke !== X,
        l = !!(s.simplification && s.simplification < 1),
        a = (function (e, t, s) {
          let n = y(m(k(e))),
            r = [],
            i = [],
            l = [0, 0],
            a = [],
            o = () => {
              a.length >= 4 && i.push(...V(a, 1)), (a = []);
            },
            h = () => {
              o(), i.length && (r.push(i), (i = []));
            };
          for (let { key: u, data: c } of n)
            switch (u) {
              case "M":
                h(), (l = [c[0], c[1]]), i.push(l);
                break;
              case "L":
                o(), i.push([c[0], c[1]]);
                break;
              case "C":
                if (!a.length) {
                  let $ = i.length ? i[i.length - 1] : l;
                  a.push([$[0], $[1]]);
                }
                a.push([c[0], c[1]]),
                  a.push([c[2], c[3]]),
                  a.push([c[4], c[5]]);
                break;
              case "Z":
                o(), i.push([l[0], l[1]]);
            }
          if ((h(), !s)) return r;
          let p = [];
          for (let _ of r) {
            let f = Q(_, s);
            f.length && p.push(f);
          }
          return p;
        })(e, 1, l ? 4 - 4 * s.simplification : (1 + s.roughness) / 2);
      if (r) {
        if (s.combineNestedSvgPaths) {
          let o = [];
          a.forEach((e) => o.push(...e)),
            "solid" === s.fillStyle ? n.push(O(o, s)) : n.push(I(o, s));
        } else
          a.forEach((e) => {
            "solid" === s.fillStyle ? n.push(O(e, s)) : n.push(I(e, s));
          });
      }
      return (
        i &&
          (l
            ? a.forEach((e) => {
                n.push(P(e, !1, s));
              })
            : n.push(
                (function (e, t) {
                  let s = y(m(k(e))),
                    n = [],
                    r = [0, 0],
                    i = [0, 0];
                  for (let { key: l, data: a } of s)
                    switch (l) {
                      case "M": {
                        let o = 1 * (t.maxRandomnessOffset || 0);
                        n.push({ op: "move", data: a.map((e) => e + A(o, t)) }),
                          (i = [a[0], a[1]]),
                          (r = [a[0], a[1]]);
                        break;
                      }
                      case "L":
                        n.push(...D(i[0], i[1], a[0], a[1], t)),
                          (i = [a[0], a[1]]);
                        break;
                      case "C": {
                        let [h, u, c, $, p, _] = a;
                        n.push(...B(h, u, c, $, p, _, i, t)), (i = [p, _]);
                        break;
                      }
                      case "Z":
                        n.push(...D(i[0], i[1], r[0], r[1], t)),
                          (i = [r[0], r[1]]);
                    }
                  return { type: "path", ops: n };
                })(e, s)
              )),
        this._d("path", n, s)
      );
    }
    opsToPath(e) {
      let t = "";
      for (let s of e.ops) {
        let n = s.data;
        switch (s.op) {
          case "move":
            t += `M${n[0]} ${n[1]} `;
            break;
          case "bcurveTo":
            t += `C${n[0]} ${n[1]}, ${n[2]} ${n[3]}, ${n[4]} ${n[5]} `;
            break;
          case "lineTo":
            t += `L${n[0]} ${n[1]} `;
        }
      }
      return t.trim();
    }
    toPaths(e) {
      let t = e.sets || [],
        s = e.options || this.defaultOptions,
        n = [];
      for (let r of t) {
        let i = null;
        switch (r.type) {
          case "path":
            i = {
              d: this.opsToPath(r),
              stroke: s.stroke,
              strokeWidth: s.strokeWidth,
              fill: X,
            };
            break;
          case "fillPath":
            i = {
              d: this.opsToPath(r),
              stroke: X,
              strokeWidth: 0,
              fill: s.fill || X,
            };
            break;
          case "fillSketch":
            i = this.fillSketch(r, s);
        }
        i && n.push(i);
      }
      return n;
    }
    fillSketch(e, t) {
      let s = t.fillWeight;
      return (
        s < 0 && (s = t.strokeWidth / 2),
        { d: this.opsToPath(e), stroke: t.fill || X, strokeWidth: s, fill: X }
      );
    }
  }
  class J {
    constructor(e, t) {
      (this.canvas = e),
        (this.ctx = this.canvas.getContext("2d")),
        (this.gen = new Y(t));
    }
    draw(e) {
      let t = e.sets || [],
        s = e.options || this.getDefaultOptions(),
        n = this.ctx;
      for (let r of t)
        switch (r.type) {
          case "path":
            n.save(),
              (n.strokeStyle = "none" === s.stroke ? "transparent" : s.stroke),
              (n.lineWidth = s.strokeWidth),
              s.strokeLineDash && n.setLineDash(s.strokeLineDash),
              s.strokeLineDashOffset &&
                (n.lineDashOffset = s.strokeLineDashOffset),
              this._drawToContext(n, r),
              n.restore();
            break;
          case "fillPath":
            n.save(), (n.fillStyle = s.fill || "");
            let i =
              "curve" === e.shape || "polygon" === e.shape
                ? "evenodd"
                : "nonzero";
            this._drawToContext(n, r, i), n.restore();
            break;
          case "fillSketch":
            this.fillSketch(n, r, s);
        }
    }
    fillSketch(e, t, s) {
      let n = s.fillWeight;
      n < 0 && (n = s.strokeWidth / 2),
        e.save(),
        s.fillLineDash && e.setLineDash(s.fillLineDash),
        s.fillLineDashOffset && (e.lineDashOffset = s.fillLineDashOffset),
        (e.strokeStyle = s.fill || ""),
        (e.lineWidth = n),
        this._drawToContext(e, t),
        e.restore();
    }
    _drawToContext(e, t, s = "nonzero") {
      for (let n of (e.beginPath(), t.ops)) {
        let r = n.data;
        switch (n.op) {
          case "move":
            e.moveTo(r[0], r[1]);
            break;
          case "bcurveTo":
            e.bezierCurveTo(r[0], r[1], r[2], r[3], r[4], r[5]);
            break;
          case "lineTo":
            e.lineTo(r[0], r[1]);
        }
      }
      "fillPath" === t.type ? e.fill(s) : e.stroke();
    }
    get generator() {
      return this.gen;
    }
    getDefaultOptions() {
      return this.gen.defaultOptions;
    }
    line(e, t, s, n, r) {
      let i = this.gen.line(e, t, s, n, r);
      return this.draw(i), i;
    }
    rectangle(e, t, s, n, r) {
      let i = this.gen.rectangle(e, t, s, n, r);
      return this.draw(i), i;
    }
    ellipse(e, t, s, n, r) {
      let i = this.gen.ellipse(e, t, s, n, r);
      return this.draw(i), i;
    }
    circle(e, t, s, n) {
      let r = this.gen.circle(e, t, s, n);
      return this.draw(r), r;
    }
    linearPath(e, t) {
      let s = this.gen.linearPath(e, t);
      return this.draw(s), s;
    }
    polygon(e, t) {
      let s = this.gen.polygon(e, t);
      return this.draw(s), s;
    }
    arc(e, t, s, n, r, i, l = !1, a) {
      let o = this.gen.arc(e, t, s, n, r, i, l, a);
      return this.draw(o), o;
    }
    curve(e, t) {
      let s = this.gen.curve(e, t);
      return this.draw(s), s;
    }
    path(e, t) {
      let s = this.gen.path(e, t);
      return this.draw(s), s;
    }
  }
  let K = "http://www.w3.org/2000/svg";
  class U {
    constructor(e, t) {
      (this.svg = e), (this.gen = new Y(t));
    }
    draw(e) {
      let t = e.sets || [],
        s = e.options || this.getDefaultOptions(),
        n = this.svg.ownerDocument || window.document,
        r = n.createElementNS(K, "g");
      for (let i of t) {
        let l = null;
        switch (i.type) {
          case "path":
            (l = n.createElementNS(K, "path")).setAttribute(
              "d",
              this.opsToPath(i)
            ),
              l.setAttribute("stroke", s.stroke),
              l.setAttribute("stroke-width", s.strokeWidth + ""),
              l.setAttribute("fill", "none"),
              s.strokeLineDash &&
                l.setAttribute(
                  "stroke-dasharray",
                  s.strokeLineDash.join(" ").trim()
                ),
              s.strokeLineDashOffset &&
                l.setAttribute(
                  "stroke-dashoffset",
                  "" + s.strokeLineDashOffset
                );
            break;
          case "fillPath":
            (l = n.createElementNS(K, "path")).setAttribute(
              "d",
              this.opsToPath(i)
            ),
              l.setAttribute("stroke", "none"),
              l.setAttribute("stroke-width", "0"),
              l.setAttribute("fill", s.fill || ""),
              ("curve" !== e.shape && "polygon" !== e.shape) ||
                l.setAttribute("fill-rule", "evenodd");
            break;
          case "fillSketch":
            l = this.fillSketch(n, i, s);
        }
        l && r.appendChild(l);
      }
      return r;
    }
    fillSketch(e, t, s) {
      let n = s.fillWeight;
      n < 0 && (n = s.strokeWidth / 2);
      let r = e.createElementNS(K, "path");
      return (
        r.setAttribute("d", this.opsToPath(t)),
        r.setAttribute("stroke", s.fill || ""),
        r.setAttribute("stroke-width", n + ""),
        r.setAttribute("fill", "none"),
        s.fillLineDash &&
          r.setAttribute("stroke-dasharray", s.fillLineDash.join(" ").trim()),
        s.fillLineDashOffset &&
          r.setAttribute("stroke-dashoffset", "" + s.fillLineDashOffset),
        r
      );
    }
    get generator() {
      return this.gen;
    }
    getDefaultOptions() {
      return this.gen.defaultOptions;
    }
    opsToPath(e) {
      return this.gen.opsToPath(e);
    }
    line(e, t, s, n, r) {
      let i = this.gen.line(e, t, s, n, r);
      return this.draw(i);
    }
    rectangle(e, t, s, n, r) {
      let i = this.gen.rectangle(e, t, s, n, r);
      return this.draw(i);
    }
    ellipse(e, t, s, n, r) {
      let i = this.gen.ellipse(e, t, s, n, r);
      return this.draw(i);
    }
    circle(e, t, s, n) {
      let r = this.gen.circle(e, t, s, n);
      return this.draw(r);
    }
    linearPath(e, t) {
      let s = this.gen.linearPath(e, t);
      return this.draw(s);
    }
    polygon(e, t) {
      let s = this.gen.polygon(e, t);
      return this.draw(s);
    }
    arc(e, t, s, n, r, i, l = !1, a) {
      let o = this.gen.arc(e, t, s, n, r, i, l, a);
      return this.draw(o);
    }
    curve(e, t) {
      let s = this.gen.curve(e, t);
      return this.draw(s);
    }
    path(e, t) {
      let s = this.gen.path(e, t);
      return this.draw(s);
    }
  }
  return {
    canvas: (e, t) => new J(e, t),
    svg: (e, t) => new U(e, t),
    generator: (e) => new Y(e),
    newSeed: () => Y.newSeed(),
  };
})();
const wordContainer = document.getElementById("word-container"),
  wrongLettersContainer = document.getElementById("wrong-letters"),
  playAgainButton = document.getElementById("play-again-button"),
  finalMessage = document.getElementById("final-message"),
  notificationContainer = document.getElementById("notification-container"),
  messageContainer = document.getElementById("message-container"),
  canvas = document.getElementById("hangman"),
  ctx = canvas.getContext("2d"),
  words = [
    {
        "title": "innovators",
        "hint": "Technology enthusiasts."
    },
    {
        "title": "early_adopters",
        "hint": "Opinion leaders."
    },
    {
        "title": "early_majority",
        "hint": "Deliberate pragmatists."
    },
    {
        "title": "late_majority",
        "hint": "Skeptical conservatives."
    },
    {
        "title": "laggards",
        "hint": "Traditional people."
    },
    {
        "title": "innovativeness",
        "hint": "The degree to which an individual adopts new ideas."
    }
];
let selectedWord = words[Math.floor(Math.random() * words.length)],
  correctLetters = [],
  wrongLetters = [];
function displayWord() {
  (document.getElementById("hint").innerHTML = selectedWord.hint),
    (wordContainer.innerHTML = `
      ${selectedWord.title
        .split("")
        .map(
          (e) => `
          <span class="letter" ${
            correctLetters.includes(e) && "_" == e && "id='blank'"
          }>${correctLetters.includes(e) ? e : ""}</span>
        `
        )
        .join("")}
    `);
  selectedWord.title.split("").every((e) => correctLetters.includes(e)) &&
    (new Audio("./clapping-6474.mp3").play(),
    (finalMessage.innerText = "Congratulations! You won! \uD83C\uDF89"),
    messageContainer.classList.remove("hidden"),
    document.getElementById("hint-container").classList.add("hidden"));
}
function updateWrongLetters() {
  (wrongLettersContainer.innerHTML = wrongLetters.join(", ")),
    10 === wrongLetters.length &&
      (new Audio("./videogame-death-sound-43894.mp3").play(),
      (finalMessage.innerHTML = `Game Over! <br> Answer: <br> ${selectedWord.title.replace(
        "_",
        " "
      )}`),
      messageContainer.classList.remove("hidden")),
    drawHangman(wrongLetters.length);
}
function showNotification() {
  notificationContainer.classList.remove("hidden"),
    setTimeout(() => notificationContainer.classList.add("hidden"), 2e3);
}
selectedWord.title.includes("_") && correctLetters.push("_");
const sound = new Audio("./drawing_1-2-7113.mp3"),
  roughCanvas = rough.canvas(canvas);
function drawHangman(e) {
  sound.play(),
    ctx.clearRect(0, 0, canvas.width, canvas.height),
    e > 0 && roughCanvas.line(100, 360, 300, 360),
    e > 1 && roughCanvas.line(200, 360, 200, 40),
    e > 2 && roughCanvas.line(200, 40, 100, 40),
    e > 3 && roughCanvas.line(100, 40, 100, 80),
    e > 4 && roughCanvas.circle(100, 120, 80),
    e > 5 && roughCanvas.line(100, 160, 100, 280),
    e > 6 && roughCanvas.line(100, 200, 40, 240),
    e > 7 && roughCanvas.line(100, 200, 160, 240),
    e > 8 && roughCanvas.line(100, 280, 60, 360),
    e > 9 && roughCanvas.line(100, 280, 140, 360);
}
window.addEventListener("keydown", (e) => {
  if (
    selectedWord.title.split("").every((e) => correctLetters.includes(e)) ||
    10 === wrongLetters.length
  )
    return;
  let t = e.key.toLowerCase();
  e.key >= "a" &&
    e.key <= "z" &&
    (selectedWord.title.includes(t)
      ? correctLetters.includes(t)
        ? showNotification()
        : (correctLetters.push(t), displayWord())
      : wrongLetters.includes(t)
      ? showNotification()
      : (wrongLetters.push(t), updateWrongLetters()));
}),
  playAgainButton.addEventListener("click", () => {
    (correctLetters = []),
      selectedWord.title.includes("_") && correctLetters.push("_"),
      (wrongLetters = []),
      (selectedWord = words[Math.floor(Math.random() * words.length)]),
      displayWord(),
      ctx.clearRect(0, 0, canvas.width, canvas.height),
      messageContainer.classList.add("hidden"),
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  }),
  displayWord();
