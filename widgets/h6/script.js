var rough = (function () {
  "use strict";
  function t(t, e, s) {
    if (t && t.length) {
      let [n, a] = e,
        r = (Math.PI / 180) * s,
        i = Math.cos(r),
        l = Math.sin(r);
      t.forEach((t) => {
        let [e, s] = t;
        (t[0] = (e - n) * i - (s - a) * l + n),
          (t[1] = (e - n) * l + (s - a) * i + a);
      });
    }
  }
  function e(t) {
    let e = t[0],
      s = t[1];
    return Math.sqrt(Math.pow(e[0] - s[0], 2) + Math.pow(e[1] - s[1], 2));
  }
  function s(t, e, s, n) {
    let a = e[1] - t[1],
      r = t[0] - e[0],
      i = a * t[0] + r * t[1],
      l = n[1] - s[1],
      h = s[0] - n[0],
      o = l * s[0] + h * s[1],
      u = a * h - l * r;
    return u ? [(h * i - r * o) / u, (a * o - l * i) / u] : null;
  }
  function n(t, e, s) {
    let n = t.length;
    if (n < 3) return !1;
    let l = [Number.MAX_SAFE_INTEGER, s],
      h = [e, s],
      o = 0;
    for (let e = 0; e < n; e++) {
      let s = t[e],
        u = t[(e + 1) % n];
      if (i(s, u, h, l)) {
        if (0 === r(s, h, u)) return a(s, h, u);
        o++;
      }
    }
    return o % 2 == 1;
  }
  function a(t, e, s) {
    return (
      e[0] <= Math.max(t[0], s[0]) &&
      e[0] >= Math.min(t[0], s[0]) &&
      e[1] <= Math.max(t[1], s[1]) &&
      e[1] >= Math.min(t[1], s[1])
    );
  }
  function r(t, e, s) {
    let n = (e[1] - t[1]) * (s[0] - e[0]) - (e[0] - t[0]) * (s[1] - e[1]);
    return 0 === n ? 0 : n > 0 ? 1 : 2;
  }
  function i(t, e, s, n) {
    let i = r(t, e, s),
      l = r(t, e, n),
      h = r(s, n, t),
      o = r(s, n, e);
    return (
      (i !== l && h !== o) ||
      !(0 !== i || !a(t, s, e)) ||
      !(0 !== l || !a(t, n, e)) ||
      !(0 !== h || !a(s, t, n)) ||
      !(0 !== o || !a(s, e, n))
    );
  }
  function l(e, s) {
    var n, a;
    let r = [0, 0],
      i = Math.round(s.hachureAngle + 90);
    i && t(e, r, i);
    let l,
      h = (function (t, e) {
        let s = [...t];
        s[0].join(",") !== s[s.length - 1].join(",") &&
          s.push([s[0][0], s[0][1]]);
        let n = [];
        if (s && s.length > 2) {
          let t = e.hachureGap;
          t < 0 && (t = 4 * e.strokeWidth), (t = Math.max(t, 0.1));
          let a = [];
          for (let t = 0; t < s.length - 1; t++) {
            let e = s[t],
              n = s[t + 1];
            if (e[1] !== n[1]) {
              let t = Math.min(e[1], n[1]);
              a.push({
                ymin: t,
                ymax: Math.max(e[1], n[1]),
                x: t === e[1] ? e[0] : n[0],
                islope: (n[0] - e[0]) / (n[1] - e[1]),
              });
            }
          }
          if (
            (a.sort((t, e) =>
              t.ymin < e.ymin
                ? -1
                : t.ymin > e.ymin
                ? 1
                : t.x < e.x
                ? -1
                : t.x > e.x
                ? 1
                : t.ymax === e.ymax
                ? 0
                : (t.ymax - e.ymax) / Math.abs(t.ymax - e.ymax)
            ),
            !a.length)
          )
            return n;
          let r = [],
            i = a[0].ymin;
          for (; r.length || a.length; ) {
            if (a.length) {
              let t = -1;
              for (let e = 0; e < a.length && !(a[e].ymin > i); e++) t = e;
              a.splice(0, t + 1).forEach((t) => {
                r.push({ s: i, edge: t });
              });
            }
            if (
              ((r = r.filter((t) => !(t.edge.ymax <= i))).sort((t, e) =>
                t.edge.x === e.edge.x
                  ? 0
                  : (t.edge.x - e.edge.x) / Math.abs(t.edge.x - e.edge.x)
              ),
              r.length > 1)
            )
              for (let t = 0; t < r.length; t += 2) {
                let e = t + 1;
                if (e >= r.length) break;
                let s = r[t].edge,
                  a = r[e].edge;
                n.push([
                  [Math.round(s.x), i],
                  [Math.round(a.x), i],
                ]);
              }
            (i += t),
              r.forEach((e) => {
                e.edge.x = e.edge.x + t * e.edge.islope;
              });
          }
        }
        return n;
      })(e, s);
    return (
      i &&
        (t(e, r, -i),
        (n = r),
        (a = -i),
        (l = []),
        h.forEach((t) => l.push(...t)),
        t(l, n, a)),
      h
    );
  }
  class h {
    constructor(t) {
      this.helper = t;
    }
    fillPolygon(t, e) {
      return this._fillPolygon(t, e);
    }
    _fillPolygon(t, e, s = !1) {
      let n = l(t, e);
      if (s) {
        let e = this.connectingLines(t, n);
        n = n.concat(e);
      }
      return { type: "fillSketch", ops: this.renderLines(n, e) };
    }
    renderLines(t, e) {
      let s = [];
      for (let n of t)
        s.push(
          ...this.helper.doubleLineOps(n[0][0], n[0][1], n[1][0], n[1][1], e)
        );
      return s;
    }
    connectingLines(t, s) {
      let n = [];
      if (s.length > 1)
        for (let a = 1; a < s.length; a++) {
          let r = s[a - 1];
          if (3 > e(r)) continue;
          let i = [s[a][0], r[1]];
          if (e(i) > 3) {
            let e = this.splitOnIntersections(t, i);
            n.push(...e);
          }
        }
      return n;
    }
    midPointInPolygon(t, e) {
      return n(t, (e[0][0] + e[1][0]) / 2, (e[0][1] + e[1][1]) / 2);
    }
    splitOnIntersections(t, a) {
      let r = Math.max(5, 0.1 * e(a)),
        l = [];
      for (let n = 0; n < t.length; n++) {
        let h = t[n],
          o = t[(n + 1) % t.length];
        if (i(h, o, ...a)) {
          let t = s(h, o, a[0], a[1]);
          if (t) {
            let s = e([t, a[0]]),
              n = e([t, a[1]]);
            s > r && n > r && l.push({ point: t, distance: s });
          }
        }
      }
      if (l.length > 1) {
        let e = l.sort((t, e) => t.distance - e.distance).map((t) => t.point);
        if (
          (n(t, ...a[0]) || e.shift(), n(t, ...a[1]) || e.pop(), e.length <= 1)
        )
          return this.midPointInPolygon(t, a) ? [a] : [];
        let s = [a[0], ...e, a[1]],
          r = [];
        for (let e = 0; e < s.length - 1; e += 2) {
          let n = [s[e], s[e + 1]];
          this.midPointInPolygon(t, n) && r.push(n);
        }
        return r;
      }
      return this.midPointInPolygon(t, a) ? [a] : [];
    }
  }
  class o extends h {
    fillPolygon(t, e) {
      return this._fillPolygon(t, e, !0);
    }
  }
  class u extends h {
    fillPolygon(t, e) {
      let s = this._fillPolygon(t, e),
        n = Object.assign({}, e, { hachureAngle: e.hachureAngle + 90 }),
        a = this._fillPolygon(t, n);
      return (s.ops = s.ops.concat(a.ops)), s;
    }
  }
  class c {
    constructor(t) {
      this.helper = t;
    }
    fillPolygon(t, e) {
      let s = l(
        t,
        (e = Object.assign({}, e, {
          curveStepCount: 4,
          hachureAngle: 0,
          roughness: 1,
        }))
      );
      return this.dotsOnLines(s, e);
    }
    dotsOnLines(t, s) {
      let n = [],
        a = s.hachureGap;
      a < 0 && (a = 4 * s.strokeWidth), (a = Math.max(a, 0.1));
      let r = s.fillWeight;
      r < 0 && (r = s.strokeWidth / 2);
      let i = a / 4;
      for (let l of t) {
        let t = e(l),
          h = Math.ceil(t / a) - 1,
          o = t - h * a,
          u = (l[0][0] + l[1][0]) / 2 - a / 4,
          c = Math.min(l[0][1], l[1][1]);
        for (let t = 0; t < h; t++) {
          let e = c + o + t * a,
            l = this.helper.randOffsetWithRange(u - i, u + i, s),
            h = this.helper.randOffsetWithRange(e - i, e + i, s),
            p = this.helper.ellipse(l, h, r, r, s);
          n.push(...p.ops);
        }
      }
      return { type: "fillSketch", ops: n };
    }
  }
  class p {
    constructor(t) {
      this.helper = t;
    }
    fillPolygon(t, e) {
      let s = l(t, e);
      return { type: "fillSketch", ops: this.dashedLine(s, e) };
    }
    dashedLine(t, s) {
      let n =
          s.dashOffset < 0
            ? s.hachureGap < 0
              ? 4 * s.strokeWidth
              : s.hachureGap
            : s.dashOffset,
        a =
          s.dashGap < 0
            ? s.hachureGap < 0
              ? 4 * s.strokeWidth
              : s.hachureGap
            : s.dashGap,
        r = [];
      return (
        t.forEach((t) => {
          let i = e(t),
            l = Math.floor(i / (n + a)),
            h = (i + a - l * (n + a)) / 2,
            o = t[0],
            u = t[1];
          o[0] > u[0] && ((o = t[1]), (u = t[0]));
          let c = Math.atan((u[1] - o[1]) / (u[0] - o[0]));
          for (let t = 0; t < l; t++) {
            let e = t * (n + a),
              i = e + n,
              l = [
                o[0] + e * Math.cos(c) + h * Math.cos(c),
                o[1] + e * Math.sin(c) + h * Math.sin(c),
              ],
              u = [
                o[0] + i * Math.cos(c) + h * Math.cos(c),
                o[1] + i * Math.sin(c) + h * Math.sin(c),
              ];
            r.push(...this.helper.doubleLineOps(l[0], l[1], u[0], u[1], s));
          }
        }),
        r
      );
    }
  }
  class f {
    constructor(t) {
      this.helper = t;
    }
    fillPolygon(t, e) {
      let s = e.hachureGap < 0 ? 4 * e.strokeWidth : e.hachureGap,
        n = e.zigzagOffset < 0 ? s : e.zigzagOffset,
        a = l(t, (e = Object.assign({}, e, { hachureGap: s + n })));
      return { type: "fillSketch", ops: this.zigzagLines(a, n, e) };
    }
    zigzagLines(t, s, n) {
      let a = [];
      return (
        t.forEach((t) => {
          let r = Math.round(e(t) / (2 * s)),
            i = t[0],
            l = t[1];
          i[0] > l[0] && ((i = t[1]), (l = t[0]));
          let h = Math.atan((l[1] - i[1]) / (l[0] - i[0]));
          for (let t = 0; t < r; t++) {
            let e = 2 * t * s,
              r = 2 * (t + 1) * s,
              l = Math.sqrt(2 * Math.pow(s, 2)),
              o = [i[0] + e * Math.cos(h), i[1] + e * Math.sin(h)],
              u = [i[0] + r * Math.cos(h), i[1] + r * Math.sin(h)],
              c = [
                o[0] + l * Math.cos(h + Math.PI / 4),
                o[1] + l * Math.sin(h + Math.PI / 4),
              ];
            a.push(
              ...this.helper.doubleLineOps(o[0], o[1], c[0], c[1], n),
              ...this.helper.doubleLineOps(c[0], c[1], u[0], u[1], n)
            );
          }
        }),
        a
      );
    }
  }
  let d = {};
  class g {
    constructor(t) {
      this.seed = t;
    }
    next() {
      return this.seed
        ? (2147483647 & (this.seed = Math.imul(48271, this.seed))) / 2147483648
        : Math.random();
    }
  }
  let M = {
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
  function k(t, e) {
    return t.type === e;
  }
  function m(t) {
    let e = [],
      s = (function (t) {
        let e = [];
        for (; "" !== t; )
          if (t.match(/^([ \t\r\n,]+)/)) t = t.substr(RegExp.$1.length);
          else if (t.match(/^([aAcChHlLmMqQsStTvVzZ])/))
            (e[e.length] = { type: 0, text: RegExp.$1 }),
              (t = t.substr(RegExp.$1.length));
          else {
            if (
              !t.match(
                /^(([-+]?[0-9]+(\.[0-9]*)?|[-+]?\.[0-9]+)([eE][-+]?[0-9]+)?)/
              )
            )
              return [];
            (e[e.length] = { type: 1, text: "" + parseFloat(RegExp.$1) }),
              (t = t.substr(RegExp.$1.length));
          }
        return (e[e.length] = { type: 2, text: "" }), e;
      })(t),
      n = "BOD",
      a = 0,
      r = s[a];
    for (; !k(r, 2); ) {
      let i = 0,
        l = [];
      if ("BOD" === n) {
        if ("M" !== r.text && "m" !== r.text) return m("M0,0" + t);
        a++, (i = M[r.text]), (n = r.text);
      } else k(r, 1) ? (i = M[n]) : (a++, (i = M[r.text]), (n = r.text));
      if (!(a + i < s.length)) throw Error("Path data ended short");
      for (let t = a; t < a + i; t++) {
        let e = s[t];
        if (!k(e, 1)) throw Error("Param not a number: " + n + "," + e.text);
        l[l.length] = +e.text;
      }
      if ("number" != typeof M[n]) throw Error("Bad segment: " + n);
      {
        let t = { key: n, data: l };
        e.push(t),
          (a += i),
          (r = s[a]),
          "M" === n && (n = "L"),
          "m" === n && (n = "l");
      }
    }
    return e;
  }
  function y(t) {
    let e = 0,
      s = 0,
      n = 0,
      a = 0,
      r = [];
    for (let { key: i, data: l } of t)
      switch (i) {
        case "M":
          r.push({ key: "M", data: [...l] }), ([e, s] = l), ([n, a] = l);
          break;
        case "m":
          (e += l[0]),
            (s += l[1]),
            r.push({ key: "M", data: [e, s] }),
            (n = e),
            (a = s);
          break;
        case "L":
          r.push({ key: "L", data: [...l] }), ([e, s] = l);
          break;
        case "l":
          (e += l[0]), (s += l[1]), r.push({ key: "L", data: [e, s] });
          break;
        case "C":
          r.push({ key: "C", data: [...l] }), (e = l[4]), (s = l[5]);
          break;
        case "c": {
          let t = l.map((t, n) => (n % 2 ? t + s : t + e));
          r.push({ key: "C", data: t }), (e = t[4]), (s = t[5]);
          break;
        }
        case "Q":
          r.push({ key: "Q", data: [...l] }), (e = l[2]), (s = l[3]);
          break;
        case "q": {
          let t = l.map((t, n) => (n % 2 ? t + s : t + e));
          r.push({ key: "Q", data: t }), (e = t[2]), (s = t[3]);
          break;
        }
        case "A":
          r.push({ key: "A", data: [...l] }), (e = l[5]), (s = l[6]);
          break;
        case "a":
          (e += l[5]),
            (s += l[6]),
            r.push({ key: "A", data: [l[0], l[1], l[2], l[3], l[4], e, s] });
          break;
        case "H":
          r.push({ key: "H", data: [...l] }), (e = l[0]);
          break;
        case "h":
          (e += l[0]), r.push({ key: "H", data: [e] });
          break;
        case "V":
          r.push({ key: "V", data: [...l] }), (s = l[0]);
          break;
        case "v":
          (s += l[0]), r.push({ key: "V", data: [s] });
          break;
        case "S":
          r.push({ key: "S", data: [...l] }), (e = l[2]), (s = l[3]);
          break;
        case "s": {
          let t = l.map((t, n) => (n % 2 ? t + s : t + e));
          r.push({ key: "S", data: t }), (e = t[2]), (s = t[3]);
          break;
        }
        case "T":
          r.push({ key: "T", data: [...l] }), (e = l[0]), (s = l[1]);
          break;
        case "t":
          (e += l[0]), (s += l[1]), r.push({ key: "T", data: [e, s] });
          break;
        case "Z":
        case "z":
          r.push({ key: "Z", data: [] }), (e = n), (s = a);
      }
    return r;
  }
  function b(t) {
    let e = [],
      s = "",
      n = 0,
      a = 0,
      r = 0,
      i = 0,
      l = 0,
      h = 0;
    for (let { key: o, data: u } of t) {
      switch (o) {
        case "M":
          e.push({ key: "M", data: [...u] }), ([n, a] = u), ([r, i] = u);
          break;
        case "C":
          e.push({ key: "C", data: [...u] }),
            (n = u[4]),
            (a = u[5]),
            (l = u[2]),
            (h = u[3]);
          break;
        case "L":
          e.push({ key: "L", data: [...u] }), ([n, a] = u);
          break;
        case "H":
          (n = u[0]), e.push({ key: "L", data: [n, a] });
          break;
        case "V":
          (a = u[0]), e.push({ key: "L", data: [n, a] });
          break;
        case "S": {
          let t = 0,
            r = 0;
          "C" === s || "S" === s
            ? ((t = n + (n - l)), (r = a + (a - h)))
            : ((t = n), (r = a)),
            e.push({ key: "C", data: [t, r, ...u] }),
            (l = u[0]),
            (h = u[1]),
            (n = u[2]),
            (a = u[3]);
          break;
        }
        case "T": {
          let [t, r] = u,
            i = 0,
            o = 0;
          "Q" === s || "T" === s
            ? ((i = n + (n - l)), (o = a + (a - h)))
            : ((i = n), (o = a));
          let c = n + (2 * (i - n)) / 3,
            p = a + (2 * (o - a)) / 3,
            f = t + (2 * (i - t)) / 3,
            d = r + (2 * (o - r)) / 3;
          e.push({ key: "C", data: [c, p, f, d, t, r] }),
            (l = i),
            (h = o),
            (n = t),
            (a = r);
          break;
        }
        case "Q": {
          let [t, s, r, i] = u,
            o = n + (2 * (t - n)) / 3,
            c = a + (2 * (s - a)) / 3,
            p = r + (2 * (t - r)) / 3,
            f = i + (2 * (s - i)) / 3;
          e.push({ key: "C", data: [o, c, p, f, r, i] }),
            (l = t),
            (h = s),
            (n = r),
            (a = i);
          break;
        }
        case "A": {
          let t = Math.abs(u[0]),
            s = Math.abs(u[1]),
            r = u[2],
            i = u[3],
            l = u[4],
            h = u[5],
            o = u[6];
          0 === t || 0 === s
            ? (e.push({ key: "C", data: [n, a, h, o, h, o] }), (n = h), (a = o))
            : (n !== h || a !== o) &&
              (L(n, a, h, o, t, s, r, i, l).forEach(function (t) {
                e.push({ key: "C", data: t });
              }),
              (n = h),
              (a = o));
          break;
        }
        case "Z":
          e.push({ key: "Z", data: [] }), (n = r), (a = i);
      }
      s = o;
    }
    return e;
  }
  function w(t, e, s) {
    return [
      t * Math.cos(s) - e * Math.sin(s),
      t * Math.sin(s) + e * Math.cos(s),
    ];
  }
  function L(t, e, s, n, a, r, i, l, h, o) {
    let u = (Math.PI * i) / 180,
      c = [],
      p = 0,
      f = 0,
      d = 0,
      g = 0;
    if (o) [p, f, d, g] = o;
    else {
      ([t, e] = w(t, e, -u)), ([s, n] = w(s, n, -u));
      let i = (t - s) / 2,
        o = (e - n) / 2,
        c = (i * i) / (a * a) + (o * o) / (r * r);
      c > 1 && ((a *= c = Math.sqrt(c)), (r *= c));
      let M = a * a,
        k = r * r,
        m =
          (l === h ? -1 : 1) *
          Math.sqrt(
            Math.abs((M * k - M * o * o - k * i * i) / (M * o * o + k * i * i))
          );
      (d = (m * a * o) / r + (t + s) / 2),
        (g = (-m * r * i) / a + (e + n) / 2),
        (p = Math.asin(parseFloat(((e - g) / r).toFixed(9)))),
        (f = Math.asin(parseFloat(((n - g) / r).toFixed(9)))),
        t < d && (p = Math.PI - p),
        s < d && (f = Math.PI - f),
        p < 0 && (p = 2 * Math.PI + p),
        f < 0 && (f = 2 * Math.PI + f),
        h && p > f && (p -= 2 * Math.PI),
        !h && f > p && (f -= 2 * Math.PI);
    }
    let M = f - p;
    if (Math.abs(M) > (120 * Math.PI) / 180) {
      let t = f,
        e = s,
        l = n;
      c = L(
        (s =
          d +
          a *
            Math.cos(
              (f =
                h && f > p
                  ? p + ((120 * Math.PI) / 180) * 1
                  : p + ((-120 * Math.PI) / 180) * 1)
            )),
        (n = g + r * Math.sin(f)),
        e,
        l,
        a,
        r,
        i,
        0,
        h,
        [f, t, d, g]
      );
    }
    let k = Math.cos(p),
      m = Math.sin(p),
      y = Math.cos(f),
      b = Math.sin(f),
      v = Math.tan((M = f - p) / 4),
      x = (4 / 3) * a * v,
      P = (4 / 3) * r * v,
      C = [t, e],
      O = [t + x * m, e - P * k],
      S = [s + x * b, n - P * y],
      I = [s, n];
    if (((O[0] = 2 * C[0] - O[0]), (O[1] = 2 * C[1] - O[1]), o))
      return [O, S, I].concat(c);
    {
      c = [O, S, I].concat(c);
      let t = [];
      for (let e = 0; e < c.length; e += 3) {
        let s = w(c[e][0], c[e][1], u),
          n = w(c[e + 1][0], c[e + 1][1], u),
          a = w(c[e + 2][0], c[e + 2][1], u);
        t.push([s[0], s[1], n[0], n[1], a[0], a[1]]);
      }
      return t;
    }
  }
  let v = {
    randOffset: function (t, e) {
      return A(t, e);
    },
    randOffsetWithRange: function (t, e, s) {
      return W(t, e, s);
    },
    ellipse: function (t, e, s, n, a) {
      return O(t, e, a, C(s, n, a)).opset;
    },
    doubleLineOps: function (t, e, s, n, a) {
      return _(t, e, s, n, a, !0);
    },
  };
  function x(t, e, s, n, a) {
    return { type: "path", ops: _(t, e, s, n, a) };
  }
  function P(t, e, s) {
    let n = (t || []).length;
    if (n > 2) {
      let a = [];
      for (let e = 0; e < n - 1; e++)
        a.push(..._(t[e][0], t[e][1], t[e + 1][0], t[e + 1][1], s));
      return (
        e && a.push(..._(t[n - 1][0], t[n - 1][1], t[0][0], t[0][1], s)),
        { type: "path", ops: a }
      );
    }
    return 2 === n
      ? x(t[0][0], t[0][1], t[1][0], t[1][1], s)
      : { type: "path", ops: [] };
  }
  function C(t, e, s) {
    let n = Math.max(
        s.curveStepCount,
        (s.curveStepCount / Math.sqrt(200)) *
          Math.sqrt(
            2 *
              Math.PI *
              Math.sqrt((Math.pow(t / 2, 2) + Math.pow(e / 2, 2)) / 2)
          )
      ),
      a = Math.abs(t / 2),
      r = Math.abs(e / 2),
      i = 1 - s.curveFitting;
    return (
      (a += A(a * i, s)),
      (r += A(r * i, s)),
      { increment: (2 * Math.PI) / n, rx: a, ry: r }
    );
  }
  function O(t, e, s, n) {
    let [a, r] = $(
        n.increment,
        t,
        e,
        n.rx,
        n.ry,
        1,
        n.increment * W(0.1, W(0.4, 1, s), s),
        s
      ),
      i = R(a, null, s);
    if (!s.disableMultiStroke) {
      let [a] = $(n.increment, t, e, n.rx, n.ry, 1.5, 0, s),
        r = R(a, null, s);
      i = i.concat(r);
    }
    return { estimatedPoints: r, opset: { type: "path", ops: i } };
  }
  function S(t, e, s, n, a, r, i, l, h) {
    let o = t,
      u = e,
      c = Math.abs(s / 2),
      p = Math.abs(n / 2);
    (c += A(0.01 * c, h)), (p += A(0.01 * p, h));
    let f = a,
      d = r;
    for (; f < 0; ) (f += 2 * Math.PI), (d += 2 * Math.PI);
    d - f > 2 * Math.PI && ((f = 0), (d = 2 * Math.PI));
    let g = Math.min((2 * Math.PI) / h.curveStepCount / 2, (d - f) / 2),
      M = B(g, o, u, c, p, f, d, 1, h);
    if (!h.disableMultiStroke) {
      let t = B(g, o, u, c, p, f, d, 1.5, h);
      M.push(...t);
    }
    return (
      i &&
        (l
          ? M.push(
              ..._(o, u, o + c * Math.cos(f), u + p * Math.sin(f), h),
              ..._(o, u, o + c * Math.cos(d), u + p * Math.sin(d), h)
            )
          : M.push(
              { op: "lineTo", data: [o, u] },
              { op: "lineTo", data: [o + c * Math.cos(f), u + p * Math.sin(f)] }
            )),
      { type: "path", ops: M }
    );
  }
  function I(t, e) {
    let s = [];
    if (t.length) {
      let n = e.maxRandomnessOffset || 0,
        a = t.length;
      if (a > 2) {
        s.push({ op: "move", data: [t[0][0] + A(n, e), t[0][1] + A(n, e)] });
        for (let r = 1; r < a; r++)
          s.push({
            op: "lineTo",
            data: [t[r][0] + A(n, e), t[r][1] + A(n, e)],
          });
      }
    }
    return { type: "fillPath", ops: s };
  }
  function T(t, e) {
    return (function (t, e) {
      let s = t.fillStyle || "hachure";
      if (!d[s])
        switch (s) {
          case "zigzag":
            d[s] || (d[s] = new o(e));
            break;
          case "cross-hatch":
            d[s] || (d[s] = new u(e));
            break;
          case "dots":
            d[s] || (d[s] = new c(e));
            break;
          case "dashed":
            d[s] || (d[s] = new p(e));
            break;
          case "zigzag-line":
            d[s] || (d[s] = new f(e));
            break;
          default:
            d[(s = "hachure")] || (d[s] = new h(e));
        }
      return d[s];
    })(e, v).fillPolygon(t, e);
  }
  function E(t) {
    return (
      t.randomizer || (t.randomizer = new g(t.seed || 0)), t.randomizer.next()
    );
  }
  function W(t, e, s, n = 1) {
    return s.roughness * n * (E(s) * (e - t) + t);
  }
  function A(t, e, s = 1) {
    return W(-t, t, e, s);
  }
  function _(t, e, s, n, a, r = !1) {
    let i = r ? a.disableMultiStrokeFill : a.disableMultiStroke,
      l = D(t, e, s, n, a, !0, !1);
    if (i) return l;
    let h = D(t, e, s, n, a, !0, !0);
    return l.concat(h);
  }
  function D(t, e, s, n, a, r, i) {
    let l = Math.pow(t - s, 2) + Math.pow(e - n, 2),
      h = Math.sqrt(l),
      o = 1;
    o = h < 200 ? 1 : h > 500 ? 0.4 : -0.0016668 * h + 1.233334;
    let u = a.maxRandomnessOffset || 0;
    u * u * 100 > l && (u = h / 10);
    let c = u / 2,
      p = 0.2 + 0.2 * E(a),
      f = (a.bowing * a.maxRandomnessOffset * (n - e)) / 200,
      d = (a.bowing * a.maxRandomnessOffset * (t - s)) / 200;
    (f = A(f, a, o)), (d = A(d, a, o));
    let g = [],
      M = () => A(c, a, o),
      k = () => A(u, a, o);
    return (
      r &&
        (i
          ? g.push({ op: "move", data: [t + M(), e + M()] })
          : g.push({ op: "move", data: [t + A(u, a, o), e + A(u, a, o)] })),
      i
        ? g.push({
            op: "bcurveTo",
            data: [
              f + t + (s - t) * p + M(),
              d + e + (n - e) * p + M(),
              f + t + 2 * (s - t) * p + M(),
              d + e + 2 * (n - e) * p + M(),
              s + M(),
              n + M(),
            ],
          })
        : g.push({
            op: "bcurveTo",
            data: [
              f + t + (s - t) * p + k(),
              d + e + (n - e) * p + k(),
              f + t + 2 * (s - t) * p + k(),
              d + e + 2 * (n - e) * p + k(),
              s + k(),
              n + k(),
            ],
          }),
      g
    );
  }
  function z(t, e, s) {
    let n = [];
    n.push([t[0][0] + A(e, s), t[0][1] + A(e, s)]),
      n.push([t[0][0] + A(e, s), t[0][1] + A(e, s)]);
    for (let a = 1; a < t.length; a++)
      n.push([t[a][0] + A(e, s), t[a][1] + A(e, s)]),
        a === t.length - 1 && n.push([t[a][0] + A(e, s), t[a][1] + A(e, s)]);
    return R(n, null, s);
  }
  function R(t, e, s) {
    let n = t.length,
      a = [];
    if (n > 3) {
      let r = [],
        i = 1 - s.curveTightness;
      a.push({ op: "move", data: [t[1][0], t[1][1]] });
      for (let e = 1; e + 2 < n; e++) {
        let s = t[e];
        (r[0] = [s[0], s[1]]),
          (r[1] = [
            s[0] + (i * t[e + 1][0] - i * t[e - 1][0]) / 6,
            s[1] + (i * t[e + 1][1] - i * t[e - 1][1]) / 6,
          ]),
          (r[2] = [
            t[e + 1][0] + (i * t[e][0] - i * t[e + 2][0]) / 6,
            t[e + 1][1] + (i * t[e][1] - i * t[e + 2][1]) / 6,
          ]),
          (r[3] = [t[e + 1][0], t[e + 1][1]]),
          a.push({
            op: "bcurveTo",
            data: [r[1][0], r[1][1], r[2][0], r[2][1], r[3][0], r[3][1]],
          });
      }
      if (e && 2 === e.length) {
        let t = s.maxRandomnessOffset;
        a.push({ op: "lineTo", data: [e[0] + A(t, s), e[1] + A(t, s)] });
      }
    } else
      3 === n
        ? (a.push({ op: "move", data: [t[1][0], t[1][1]] }),
          a.push({
            op: "bcurveTo",
            data: [t[1][0], t[1][1], t[2][0], t[2][1], t[2][0], t[2][1]],
          }))
        : 2 === n && a.push(..._(t[0][0], t[0][1], t[1][0], t[1][1], s));
    return a;
  }
  function $(t, e, s, n, a, r, i, l) {
    let h = [],
      o = [],
      u = A(0.5, l) - Math.PI / 2;
    o.push([
      A(r, l) + e + 0.9 * n * Math.cos(u - t),
      A(r, l) + s + 0.9 * a * Math.sin(u - t),
    ]);
    for (let i = u; i < 2 * Math.PI + u - 0.01; i += t) {
      let t = [A(r, l) + e + n * Math.cos(i), A(r, l) + s + a * Math.sin(i)];
      h.push(t), o.push(t);
    }
    return (
      o.push([
        A(r, l) + e + n * Math.cos(u + 2 * Math.PI + 0.5 * i),
        A(r, l) + s + a * Math.sin(u + 2 * Math.PI + 0.5 * i),
      ]),
      o.push([
        A(r, l) + e + 0.98 * n * Math.cos(u + i),
        A(r, l) + s + 0.98 * a * Math.sin(u + i),
      ]),
      o.push([
        A(r, l) + e + 0.9 * n * Math.cos(u + 0.5 * i),
        A(r, l) + s + 0.9 * a * Math.sin(u + 0.5 * i),
      ]),
      [o, h]
    );
  }
  function B(t, e, s, n, a, r, i, l, h) {
    let o = r + A(0.1, h),
      u = [];
    u.push([
      A(l, h) + e + 0.9 * n * Math.cos(o - t),
      A(l, h) + s + 0.9 * a * Math.sin(o - t),
    ]);
    for (let r = o; r <= i; r += t)
      u.push([A(l, h) + e + n * Math.cos(r), A(l, h) + s + a * Math.sin(r)]);
    return (
      u.push([e + n * Math.cos(i), s + a * Math.sin(i)]),
      u.push([e + n * Math.cos(i), s + a * Math.sin(i)]),
      R(u, null, h)
    );
  }
  function G(t, e, s, n, a, r, i, l) {
    let h = [],
      o = [l.maxRandomnessOffset || 1, (l.maxRandomnessOffset || 1) + 0.3],
      u = [0, 0],
      c = l.disableMultiStroke ? 1 : 2;
    for (let p = 0; p < c; p++)
      0 === p
        ? h.push({ op: "move", data: [i[0], i[1]] })
        : h.push({ op: "move", data: [i[0] + A(o[0], l), i[1] + A(o[0], l)] }),
        (u = [a + A(o[p], l), r + A(o[p], l)]),
        h.push({
          op: "bcurveTo",
          data: [
            t + A(o[p], l),
            e + A(o[p], l),
            s + A(o[p], l),
            n + A(o[p], l),
            u[0],
            u[1],
          ],
        });
    return h;
  }
  function q(t) {
    return [...t];
  }
  function H(t, e) {
    return Math.pow(t[0] - e[0], 2) + Math.pow(t[1] - e[1], 2);
  }
  function j(t, e, s) {
    let n = H(e, s);
    if (0 === n) return H(t, e);
    let a = ((t[0] - e[0]) * (s[0] - e[0]) + (t[1] - e[1]) * (s[1] - e[1])) / n;
    return H(t, N(e, s, (a = Math.max(0, Math.min(1, a)))));
  }
  function N(t, e, s) {
    return [t[0] + (e[0] - t[0]) * s, t[1] + (e[1] - t[1]) * s];
  }
  function F(t, e, s, n) {
    var a, r;
    let i,
      l,
      h,
      o,
      u,
      c,
      p,
      f,
      d = n || [];
    if (
      ((i = (a = t)[(r = e) + 0]),
      (l = a[r + 1]),
      (h = a[r + 2]),
      (o = a[r + 3]),
      (u = 3 * l[0] - 2 * i[0] - o[0]),
      (u *= u),
      (c = 3 * l[1] - 2 * i[1] - o[1]),
      (c *= c),
      (p = 3 * h[0] - 2 * o[0] - i[0]),
      (p *= p),
      (f = 3 * h[1] - 2 * o[1] - i[1]),
      (f *= f),
      u < p && (u = p),
      c < f && (c = f),
      u + c < s)
    ) {
      let s = t[e + 0];
      d.length ? Math.sqrt(H(d[d.length - 1], s)) > 1 && d.push(s) : d.push(s),
        d.push(t[e + 3]);
    } else {
      let n = t[e + 0],
        a = t[e + 1],
        r = t[e + 2],
        i = t[e + 3],
        l = N(n, a, 0.5),
        h = N(a, r, 0.5),
        o = N(r, i, 0.5),
        u = N(l, h, 0.5),
        c = N(h, o, 0.5),
        p = N(u, c, 0.5);
      F([n, l, u, p], 0, s, d), F([p, c, o, i], 0, s, d);
    }
    return d;
  }
  function Z(t, e) {
    return Q(t, 0, t.length, e);
  }
  function Q(t, e, s, n, a) {
    let r = a || [],
      i = t[e],
      l = t[s - 1],
      h = 0,
      o = 1;
    for (let n = e + 1; n < s - 1; ++n) {
      let e = j(t[n], i, l);
      e > h && ((h = e), (o = n));
    }
    return (
      Math.sqrt(h) > n
        ? (Q(t, e, o + 1, n, r), Q(t, o, s, n, r))
        : (r.length || r.push(i), r.push(l)),
      r
    );
  }
  function V(t, e = 0.15, s) {
    let n = [],
      a = (t.length - 1) / 3;
    for (let s = 0; s < a; s++) F(t, 3 * s, e, n);
    return s && s > 0 ? Q(n, 0, n.length, s) : n;
  }
  let X = "none";
  class Y {
    constructor(t) {
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
        (this.config = t || {}),
        this.config.options &&
          (this.defaultOptions = this._o(this.config.options));
    }
    static newSeed() {
      return Math.floor(2147483648 * Math.random());
    }
    _o(t) {
      return t
        ? Object.assign({}, this.defaultOptions, t)
        : this.defaultOptions;
    }
    _d(t, e, s) {
      return { shape: t, sets: e || [], options: s || this.defaultOptions };
    }
    line(t, e, s, n, a) {
      let r = this._o(a);
      return this._d("line", [x(t, e, s, n, r)], r);
    }
    rectangle(t, e, s, n, a) {
      var r, i, l, h;
      let o = this._o(a),
        u = [],
        c = P(
          [
            [(r = t), (i = e)],
            [r + (l = s), i],
            [r + l, i + (h = n)],
            [r, i + h],
          ],
          !0,
          o
        );
      if (o.fill) {
        let a = [
          [t, e],
          [t + s, e],
          [t + s, e + n],
          [t, e + n],
        ];
        "solid" === o.fillStyle ? u.push(I(a, o)) : u.push(T(a, o));
      }
      return o.stroke !== X && u.push(c), this._d("rectangle", u, o);
    }
    ellipse(t, e, s, n, a) {
      let r = this._o(a),
        i = [],
        l = C(s, n, r),
        h = O(t, e, r, l);
      if (r.fill)
        if ("solid" === r.fillStyle) {
          let s = O(t, e, r, l).opset;
          (s.type = "fillPath"), i.push(s);
        } else i.push(T(h.estimatedPoints, r));
      return r.stroke !== X && i.push(h.opset), this._d("ellipse", i, r);
    }
    circle(t, e, s, n) {
      let a = this.ellipse(t, e, s, s, n);
      return (a.shape = "circle"), a;
    }
    linearPath(t, e) {
      let s = this._o(e);
      return this._d("linearPath", [P(t, !1, s)], s);
    }
    arc(t, e, s, n, a, r, i = !1, l) {
      let h = this._o(l),
        o = [],
        u = S(t, e, s, n, a, r, i, !0, h);
      if (i && h.fill)
        if ("solid" === h.fillStyle) {
          let i = S(t, e, s, n, a, r, !0, !1, h);
          (i.type = "fillPath"), o.push(i);
        } else
          o.push(
            (function (t, e, s, n, a, r, i) {
              let l = t,
                h = e,
                o = Math.abs(s / 2),
                u = Math.abs(n / 2);
              (o += A(0.01 * o, i)), (u += A(0.01 * u, i));
              let c = a,
                p = r;
              for (; c < 0; ) (c += 2 * Math.PI), (p += 2 * Math.PI);
              p - c > 2 * Math.PI && ((c = 0), (p = 2 * Math.PI));
              let f = (p - c) / i.curveStepCount,
                d = [];
              for (let t = c; t <= p; t += f)
                d.push([l + o * Math.cos(t), h + u * Math.sin(t)]);
              return (
                d.push([l + o * Math.cos(p), h + u * Math.sin(p)]),
                d.push([l, h]),
                T(d, i)
              );
            })(t, e, s, n, a, r, h)
          );
      return h.stroke !== X && o.push(u), this._d("arc", o, h);
    }
    curve(t, e) {
      let s = this._o(e),
        n = [],
        a = (function (t, e) {
          let s = z(t, 1 * (1 + 0.2 * e.roughness), e);
          if (!e.disableMultiStroke) {
            var n;
            let a,
              r = z(
                t,
                1.5 * (1 + 0.22 * e.roughness),
                (((a = Object.assign({}, (n = e))).randomizer = void 0),
                n.seed && (a.seed = n.seed + 1),
                a)
              );
            s = s.concat(r);
          }
          return { type: "path", ops: s };
        })(t, s);
      if (s.fill && s.fill !== X && t.length >= 3) {
        let e = V(
          (function (t, e = 0) {
            let s = t.length;
            if (s < 3) throw Error("A curve must have at least three points.");
            let n = [];
            if (3 === s) n.push(q(t[0]), q(t[1]), q(t[2]), q(t[2]));
            else {
              let s = [];
              s.push(t[0], t[0]);
              for (let e = 1; e < t.length; e++)
                s.push(t[e]), e === t.length - 1 && s.push(t[e]);
              let a = [],
                r = 1 - e;
              n.push(q(s[0]));
              for (let t = 1; t + 2 < s.length; t++) {
                let e = s[t];
                (a[0] = [e[0], e[1]]),
                  (a[1] = [
                    e[0] + (r * s[t + 1][0] - r * s[t - 1][0]) / 6,
                    e[1] + (r * s[t + 1][1] - r * s[t - 1][1]) / 6,
                  ]),
                  (a[2] = [
                    s[t + 1][0] + (r * s[t][0] - r * s[t + 2][0]) / 6,
                    s[t + 1][1] + (r * s[t][1] - r * s[t + 2][1]) / 6,
                  ]),
                  (a[3] = [s[t + 1][0], s[t + 1][1]]),
                  n.push(a[1], a[2], a[3]);
              }
            }
            return n;
          })(t),
          10,
          (1 + s.roughness) / 2
        );
        "solid" === s.fillStyle ? n.push(I(e, s)) : n.push(T(e, s));
      }
      return s.stroke !== X && n.push(a), this._d("curve", n, s);
    }
    polygon(t, e) {
      let s = this._o(e),
        n = [],
        a = P(t, !0, s);
      return (
        s.fill && ("solid" === s.fillStyle ? n.push(I(t, s)) : n.push(T(t, s))),
        s.stroke !== X && n.push(a),
        this._d("polygon", n, s)
      );
    }
    path(t, e) {
      let s = this._o(e),
        n = [];
      if (!t) return this._d("path", n, s);
      t = (t || "")
        .replace(/\n/g, " ")
        .replace(/(-\s)/g, "-")
        .replace("/(ss)/g", " ");
      let a = s.fill && "transparent" !== s.fill && s.fill !== X,
        r = s.stroke !== X,
        i = !!(s.simplification && s.simplification < 1),
        l = (function (t, e, s) {
          let n = b(y(m(t))),
            a = [],
            r = [],
            i = [0, 0],
            l = [],
            h = () => {
              l.length >= 4 && r.push(...V(l, 1)), (l = []);
            },
            o = () => {
              h(), r.length && (a.push(r), (r = []));
            };
          for (let { key: t, data: e } of n)
            switch (t) {
              case "M":
                o(), (i = [e[0], e[1]]), r.push(i);
                break;
              case "L":
                h(), r.push([e[0], e[1]]);
                break;
              case "C":
                if (!l.length) {
                  let t = r.length ? r[r.length - 1] : i;
                  l.push([t[0], t[1]]);
                }
                l.push([e[0], e[1]]),
                  l.push([e[2], e[3]]),
                  l.push([e[4], e[5]]);
                break;
              case "Z":
                h(), r.push([i[0], i[1]]);
            }
          if ((o(), !s)) return a;
          let u = [];
          for (let t of a) {
            let e = Z(t, s);
            e.length && u.push(e);
          }
          return u;
        })(t, 0, i ? 4 - 4 * s.simplification : (1 + s.roughness) / 2);
      if (a)
        if (s.combineNestedSvgPaths) {
          let t = [];
          l.forEach((e) => t.push(...e)),
            "solid" === s.fillStyle ? n.push(I(t, s)) : n.push(T(t, s));
        } else
          l.forEach((t) => {
            "solid" === s.fillStyle ? n.push(I(t, s)) : n.push(T(t, s));
          });
      return (
        r &&
          (i
            ? l.forEach((t) => {
                n.push(P(t, !1, s));
              })
            : n.push(
                (function (t, e) {
                  let s = b(y(m(t))),
                    n = [],
                    a = [0, 0],
                    r = [0, 0];
                  for (let { key: t, data: i } of s)
                    switch (t) {
                      case "M": {
                        let t = 1 * (e.maxRandomnessOffset || 0);
                        n.push({ op: "move", data: i.map((s) => s + A(t, e)) }),
                          (r = [i[0], i[1]]),
                          (a = [i[0], i[1]]);
                        break;
                      }
                      case "L":
                        n.push(..._(r[0], r[1], i[0], i[1], e)),
                          (r = [i[0], i[1]]);
                        break;
                      case "C": {
                        let [t, s, a, l, h, o] = i;
                        n.push(...G(t, s, a, l, h, o, r, e)), (r = [h, o]);
                        break;
                      }
                      case "Z":
                        n.push(..._(r[0], r[1], a[0], a[1], e)),
                          (r = [a[0], a[1]]);
                    }
                  return { type: "path", ops: n };
                })(t, s)
              )),
        this._d("path", n, s)
      );
    }
    opsToPath(t) {
      let e = "";
      for (let s of t.ops) {
        let t = s.data;
        switch (s.op) {
          case "move":
            e += `M${t[0]} ${t[1]} `;
            break;
          case "bcurveTo":
            e += `C${t[0]} ${t[1]}, ${t[2]} ${t[3]}, ${t[4]} ${t[5]} `;
            break;
          case "lineTo":
            e += `L${t[0]} ${t[1]} `;
        }
      }
      return e.trim();
    }
    toPaths(t) {
      let e = t.sets || [],
        s = t.options || this.defaultOptions,
        n = [];
      for (let t of e) {
        let e = null;
        switch (t.type) {
          case "path":
            e = {
              d: this.opsToPath(t),
              stroke: s.stroke,
              strokeWidth: s.strokeWidth,
              fill: X,
            };
            break;
          case "fillPath":
            e = {
              d: this.opsToPath(t),
              stroke: X,
              strokeWidth: 0,
              fill: s.fill || X,
            };
            break;
          case "fillSketch":
            e = this.fillSketch(t, s);
        }
        e && n.push(e);
      }
      return n;
    }
    fillSketch(t, e) {
      let s = e.fillWeight;
      return (
        s < 0 && (s = e.strokeWidth / 2),
        { d: this.opsToPath(t), stroke: e.fill || X, strokeWidth: s, fill: X }
      );
    }
  }
  class J {
    constructor(t, e) {
      (this.canvas = t),
        (this.ctx = this.canvas.getContext("2d")),
        (this.gen = new Y(e));
    }
    draw(t) {
      let e = t.sets || [],
        s = t.options || this.getDefaultOptions(),
        n = this.ctx;
      for (let a of e)
        switch (a.type) {
          case "path":
            n.save(),
              (n.strokeStyle = "none" === s.stroke ? "transparent" : s.stroke),
              (n.lineWidth = s.strokeWidth),
              s.strokeLineDash && n.setLineDash(s.strokeLineDash),
              s.strokeLineDashOffset &&
                (n.lineDashOffset = s.strokeLineDashOffset),
              this._drawToContext(n, a),
              n.restore();
            break;
          case "fillPath":
            n.save(), (n.fillStyle = s.fill || "");
            let e =
              "curve" === t.shape || "polygon" === t.shape
                ? "evenodd"
                : "nonzero";
            this._drawToContext(n, a, e), n.restore();
            break;
          case "fillSketch":
            this.fillSketch(n, a, s);
        }
    }
    fillSketch(t, e, s) {
      let n = s.fillWeight;
      n < 0 && (n = s.strokeWidth / 2),
        t.save(),
        s.fillLineDash && t.setLineDash(s.fillLineDash),
        s.fillLineDashOffset && (t.lineDashOffset = s.fillLineDashOffset),
        (t.strokeStyle = s.fill || ""),
        (t.lineWidth = n),
        this._drawToContext(t, e),
        t.restore();
    }
    _drawToContext(t, e, s = "nonzero") {
      for (let s of (t.beginPath(), e.ops)) {
        let e = s.data;
        switch (s.op) {
          case "move":
            t.moveTo(e[0], e[1]);
            break;
          case "bcurveTo":
            t.bezierCurveTo(e[0], e[1], e[2], e[3], e[4], e[5]);
            break;
          case "lineTo":
            t.lineTo(e[0], e[1]);
        }
      }
      "fillPath" === e.type ? t.fill(s) : t.stroke();
    }
    get generator() {
      return this.gen;
    }
    getDefaultOptions() {
      return this.gen.defaultOptions;
    }
    line(t, e, s, n, a) {
      let r = this.gen.line(t, e, s, n, a);
      return this.draw(r), r;
    }
    rectangle(t, e, s, n, a) {
      let r = this.gen.rectangle(t, e, s, n, a);
      return this.draw(r), r;
    }
    ellipse(t, e, s, n, a) {
      let r = this.gen.ellipse(t, e, s, n, a);
      return this.draw(r), r;
    }
    circle(t, e, s, n) {
      let a = this.gen.circle(t, e, s, n);
      return this.draw(a), a;
    }
    linearPath(t, e) {
      let s = this.gen.linearPath(t, e);
      return this.draw(s), s;
    }
    polygon(t, e) {
      let s = this.gen.polygon(t, e);
      return this.draw(s), s;
    }
    arc(t, e, s, n, a, r, i = !1, l) {
      let h = this.gen.arc(t, e, s, n, a, r, i, l);
      return this.draw(h), h;
    }
    curve(t, e) {
      let s = this.gen.curve(t, e);
      return this.draw(s), s;
    }
    path(t, e) {
      let s = this.gen.path(t, e);
      return this.draw(s), s;
    }
  }
  let K = "http://www.w3.org/2000/svg";
  class U {
    constructor(t, e) {
      (this.svg = t), (this.gen = new Y(e));
    }
    draw(t) {
      let e = t.sets || [],
        s = t.options || this.getDefaultOptions(),
        n = this.svg.ownerDocument || window.document,
        a = n.createElementNS(K, "g");
      for (let r of e) {
        let e = null;
        switch (r.type) {
          case "path":
            (e = n.createElementNS(K, "path")).setAttribute(
              "d",
              this.opsToPath(r)
            ),
              e.setAttribute("stroke", s.stroke),
              e.setAttribute("stroke-width", s.strokeWidth + ""),
              e.setAttribute("fill", "none"),
              s.strokeLineDash &&
                e.setAttribute(
                  "stroke-dasharray",
                  s.strokeLineDash.join(" ").trim()
                ),
              s.strokeLineDashOffset &&
                e.setAttribute(
                  "stroke-dashoffset",
                  "" + s.strokeLineDashOffset
                );
            break;
          case "fillPath":
            (e = n.createElementNS(K, "path")).setAttribute(
              "d",
              this.opsToPath(r)
            ),
              e.setAttribute("stroke", "none"),
              e.setAttribute("stroke-width", "0"),
              e.setAttribute("fill", s.fill || ""),
              ("curve" !== t.shape && "polygon" !== t.shape) ||
                e.setAttribute("fill-rule", "evenodd");
            break;
          case "fillSketch":
            e = this.fillSketch(n, r, s);
        }
        e && a.appendChild(e);
      }
      return a;
    }
    fillSketch(t, e, s) {
      let n = s.fillWeight;
      n < 0 && (n = s.strokeWidth / 2);
      let a = t.createElementNS(K, "path");
      return (
        a.setAttribute("d", this.opsToPath(e)),
        a.setAttribute("stroke", s.fill || ""),
        a.setAttribute("stroke-width", n + ""),
        a.setAttribute("fill", "none"),
        s.fillLineDash &&
          a.setAttribute("stroke-dasharray", s.fillLineDash.join(" ").trim()),
        s.fillLineDashOffset &&
          a.setAttribute("stroke-dashoffset", "" + s.fillLineDashOffset),
        a
      );
    }
    get generator() {
      return this.gen;
    }
    getDefaultOptions() {
      return this.gen.defaultOptions;
    }
    opsToPath(t) {
      return this.gen.opsToPath(t);
    }
    line(t, e, s, n, a) {
      let r = this.gen.line(t, e, s, n, a);
      return this.draw(r);
    }
    rectangle(t, e, s, n, a) {
      let r = this.gen.rectangle(t, e, s, n, a);
      return this.draw(r);
    }
    ellipse(t, e, s, n, a) {
      let r = this.gen.ellipse(t, e, s, n, a);
      return this.draw(r);
    }
    circle(t, e, s, n) {
      let a = this.gen.circle(t, e, s, n);
      return this.draw(a);
    }
    linearPath(t, e) {
      let s = this.gen.linearPath(t, e);
      return this.draw(s);
    }
    polygon(t, e) {
      let s = this.gen.polygon(t, e);
      return this.draw(s);
    }
    arc(t, e, s, n, a, r, i = !1, l) {
      let h = this.gen.arc(t, e, s, n, a, r, i, l);
      return this.draw(h);
    }
    curve(t, e) {
      let s = this.gen.curve(t, e);
      return this.draw(s);
    }
    path(t, e) {
      let s = this.gen.path(t, e);
      return this.draw(s);
    }
  }
  return {
    canvas: (t, e) => new J(t, e),
    svg: (t, e) => new U(t, e),
    generator: (t) => new Y(t),
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
    { title: "Strengths", hint: "Internal capabilities" },
    { title: "Weaknesses", hint: "Internal limitations" },
    { title: "Opportunities", hint: "External factors that can be profitable" },
    {
      title: "Threats",
      hint: "External factors that might challenge the company",
    },{
        title: "Intermediary",
        hint: "Wholesalers and retailers",
      },{
        title: "Environment",
        hint: "Micro and macro",
      },
  ];
let selectedWord = words[Math.floor(Math.random() * words.length)],
  correctLetters = [],
  wrongLetters = [];
function displayWord() {
  (document.getElementById("hint").innerHTML = selectedWord.hint),
    (wordContainer.innerHTML = `\n      ${selectedWord.title
      .toLocaleLowerCase()
      .split("")
      .map(
        (t) =>
          `\n          <span class="letter" ${
            correctLetters.includes(t) && "_" == t && "id='blank'"
          }>${correctLetters.includes(t) ? t : ""}</span>\n        `
      )
      .join("")}\n    `),
    selectedWord.title
      .toLocaleLowerCase()
      .split("")
      .every((t) => correctLetters.includes(t)) &&
      (new Audio("./clapping-6474.mp3").play(),
      (finalMessage.innerText = "Congratulations! You won! 🎉"),
      messageContainer.classList.remove("hidden"),
      document.getElementById("hint-container").classList.add("hidden"));
}
function updateWrongLetters() {
  (wrongLettersContainer.innerHTML = wrongLetters.join(", ")),
    10 === wrongLetters.length &&
      (new Audio("./videogame-death-sound-43894.mp3").play(),
      (finalMessage.innerHTML = `Game Over! <br> Answer: <br> ${selectedWord.title
        .toLocaleLowerCase()
        .replace("_", " ")}`),
      messageContainer.classList.remove("hidden")),
    drawHangman(wrongLetters.length);
}
function showNotification() {
  notificationContainer.classList.remove("hidden"),
    setTimeout(() => notificationContainer.classList.add("hidden"), 2e3);
}
selectedWord.title.toLocaleLowerCase().includes("_") &&
  correctLetters.push("_");
const sound = new Audio("./drawing_1-2-7113.mp3"),
  roughCanvas = rough.canvas(canvas);
function drawHangman(t) {
  sound.play(),
    ctx.clearRect(0, 0, canvas.width, canvas.height),
    t > 0 && roughCanvas.line(100, 360, 300, 360),
    t > 1 && roughCanvas.line(200, 360, 200, 40),
    t > 2 && roughCanvas.line(200, 40, 100, 40),
    t > 3 && roughCanvas.line(100, 40, 100, 80),
    t > 4 && roughCanvas.circle(100, 120, 80),
    t > 5 && roughCanvas.line(100, 160, 100, 280),
    t > 6 && roughCanvas.line(100, 200, 40, 240),
    t > 7 && roughCanvas.line(100, 200, 160, 240),
    t > 8 && roughCanvas.line(100, 280, 60, 360),
    t > 9 && roughCanvas.line(100, 280, 140, 360);
}
window.addEventListener("keydown", (t) => {
  if (
    selectedWord.title
      .toLocaleLowerCase()
      .split("")
      .every((t) => correctLetters.includes(t)) ||
    10 === wrongLetters.length
  )
    return;
  let e = t.key.toLowerCase();
  t.key >= "a" &&
    t.key <= "z" &&
    (selectedWord.title.toLocaleLowerCase().includes(e)
      ? correctLetters.includes(e)
        ? showNotification()
        : (correctLetters.push(e), displayWord())
      : wrongLetters.includes(e)
      ? showNotification()
      : (wrongLetters.push(e), updateWrongLetters()));
}),
  playAgainButton.addEventListener("click", () => {
    window.location.reload();
  }),
  displayWord(),
  document
    .getElementById("shuffle-btn")
    .addEventListener("click", () => window.location.reload());
