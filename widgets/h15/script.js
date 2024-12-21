var rough = (function () {
  "use strict";
  function t(t, e, s) {
    if (t && t.length) {
      let [a, n] = e,
        r = (Math.PI / 180) * s,
        i = Math.cos(r),
        l = Math.sin(r);
      t.forEach((t) => {
        let [e, s] = t;
        (t[0] = (e - a) * i - (s - n) * l + a),
          (t[1] = (e - a) * l + (s - n) * i + n);
      });
    }
  }
  function e(t) {
    let e = t[0],
      s = t[1];
    return Math.sqrt(Math.pow(e[0] - s[0], 2) + Math.pow(e[1] - s[1], 2));
  }
  function s(t, e, s, a) {
    let n = e[1] - t[1],
      r = t[0] - e[0],
      i = n * t[0] + r * t[1],
      l = a[1] - s[1],
      h = s[0] - a[0],
      o = l * s[0] + h * s[1],
      u = n * h - l * r;
    return u ? [(h * i - r * o) / u, (n * o - l * i) / u] : null;
  }
  function a(t, e, s) {
    let a = t.length;
    if (a < 3) return !1;
    let l = [Number.MAX_SAFE_INTEGER, s],
      h = [e, s],
      o = 0;
    for (let e = 0; e < a; e++) {
      let s = t[e],
        u = t[(e + 1) % a];
      if (i(s, u, h, l)) {
        if (0 === r(s, h, u)) return n(s, h, u);
        o++;
      }
    }
    return o % 2 == 1;
  }
  function n(t, e, s) {
    return (
      e[0] <= Math.max(t[0], s[0]) &&
      e[0] >= Math.min(t[0], s[0]) &&
      e[1] <= Math.max(t[1], s[1]) &&
      e[1] >= Math.min(t[1], s[1])
    );
  }
  function r(t, e, s) {
    let a = (e[1] - t[1]) * (s[0] - e[0]) - (e[0] - t[0]) * (s[1] - e[1]);
    return 0 === a ? 0 : a > 0 ? 1 : 2;
  }
  function i(t, e, s, a) {
    let i = r(t, e, s),
      l = r(t, e, a),
      h = r(s, a, t),
      o = r(s, a, e);
    return (
      (i !== l && h !== o) ||
      !(0 !== i || !n(t, s, e)) ||
      !(0 !== l || !n(t, a, e)) ||
      !(0 !== h || !n(s, t, a)) ||
      !(0 !== o || !n(s, e, a))
    );
  }
  function l(e, s) {
    var a, n;
    let r = [0, 0],
      i = Math.round(s.hachureAngle + 90);
    i && t(e, r, i);
    let l,
      h = (function (t, e) {
        let s = [...t];
        s[0].join(",") !== s[s.length - 1].join(",") &&
          s.push([s[0][0], s[0][1]]);
        let a = [];
        if (s && s.length > 2) {
          let t = e.hachureGap;
          t < 0 && (t = 4 * e.strokeWidth), (t = Math.max(t, 0.1));
          let n = [];
          for (let t = 0; t < s.length - 1; t++) {
            let e = s[t],
              a = s[t + 1];
            if (e[1] !== a[1]) {
              let t = Math.min(e[1], a[1]);
              n.push({
                ymin: t,
                ymax: Math.max(e[1], a[1]),
                x: t === e[1] ? e[0] : a[0],
                islope: (a[0] - e[0]) / (a[1] - e[1]),
              });
            }
          }
          if (
            (n.sort((t, e) =>
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
            !n.length)
          )
            return a;
          let r = [],
            i = n[0].ymin;
          for (; r.length || n.length; ) {
            if (n.length) {
              let t = -1;
              for (let e = 0; e < n.length && !(n[e].ymin > i); e++) t = e;
              n.splice(0, t + 1).forEach((t) => {
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
                  n = r[e].edge;
                a.push([
                  [Math.round(s.x), i],
                  [Math.round(n.x), i],
                ]);
              }
            (i += t),
              r.forEach((e) => {
                e.edge.x = e.edge.x + t * e.edge.islope;
              });
          }
        }
        return a;
      })(e, s);
    return (
      i &&
        (t(e, r, -i),
        (a = r),
        (n = -i),
        (l = []),
        h.forEach((t) => l.push(...t)),
        t(l, a, n)),
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
      let a = l(t, e);
      if (s) {
        let e = this.connectingLines(t, a);
        a = a.concat(e);
      }
      return { type: "fillSketch", ops: this.renderLines(a, e) };
    }
    renderLines(t, e) {
      let s = [];
      for (let a of t)
        s.push(
          ...this.helper.doubleLineOps(a[0][0], a[0][1], a[1][0], a[1][1], e)
        );
      return s;
    }
    connectingLines(t, s) {
      let a = [];
      if (s.length > 1)
        for (let n = 1; n < s.length; n++) {
          let r = s[n - 1];
          if (3 > e(r)) continue;
          let i = [s[n][0], r[1]];
          if (e(i) > 3) {
            let e = this.splitOnIntersections(t, i);
            a.push(...e);
          }
        }
      return a;
    }
    midPointInPolygon(t, e) {
      return a(t, (e[0][0] + e[1][0]) / 2, (e[0][1] + e[1][1]) / 2);
    }
    splitOnIntersections(t, n) {
      let r = Math.max(5, 0.1 * e(n)),
        l = [];
      for (let a = 0; a < t.length; a++) {
        let h = t[a],
          o = t[(a + 1) % t.length];
        if (i(h, o, ...n)) {
          let t = s(h, o, n[0], n[1]);
          if (t) {
            let s = e([t, n[0]]),
              a = e([t, n[1]]);
            s > r && a > r && l.push({ point: t, distance: s });
          }
        }
      }
      if (l.length > 1) {
        let e = l.sort((t, e) => t.distance - e.distance).map((t) => t.point);
        if (
          (a(t, ...n[0]) || e.shift(), a(t, ...n[1]) || e.pop(), e.length <= 1)
        )
          return this.midPointInPolygon(t, n) ? [n] : [];
        let s = [n[0], ...e, n[1]],
          r = [];
        for (let e = 0; e < s.length - 1; e += 2) {
          let a = [s[e], s[e + 1]];
          this.midPointInPolygon(t, a) && r.push(a);
        }
        return r;
      }
      return this.midPointInPolygon(t, n) ? [n] : [];
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
        a = Object.assign({}, e, { hachureAngle: e.hachureAngle + 90 }),
        n = this._fillPolygon(t, a);
      return (s.ops = s.ops.concat(n.ops)), s;
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
      let a = [],
        n = s.hachureGap;
      n < 0 && (n = 4 * s.strokeWidth), (n = Math.max(n, 0.1));
      let r = s.fillWeight;
      r < 0 && (r = s.strokeWidth / 2);
      let i = n / 4;
      for (let l of t) {
        let t = e(l),
          h = Math.ceil(t / n) - 1,
          o = t - h * n,
          u = (l[0][0] + l[1][0]) / 2 - n / 4,
          c = Math.min(l[0][1], l[1][1]);
        for (let t = 0; t < h; t++) {
          let e = c + o + t * n,
            l = this.helper.randOffsetWithRange(u - i, u + i, s),
            h = this.helper.randOffsetWithRange(e - i, e + i, s),
            p = this.helper.ellipse(l, h, r, r, s);
          a.push(...p.ops);
        }
      }
      return { type: "fillSketch", ops: a };
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
      let a =
          s.dashOffset < 0
            ? s.hachureGap < 0
              ? 4 * s.strokeWidth
              : s.hachureGap
            : s.dashOffset,
        n =
          s.dashGap < 0
            ? s.hachureGap < 0
              ? 4 * s.strokeWidth
              : s.hachureGap
            : s.dashGap,
        r = [];
      return (
        t.forEach((t) => {
          let i = e(t),
            l = Math.floor(i / (a + n)),
            h = (i + n - l * (a + n)) / 2,
            o = t[0],
            u = t[1];
          o[0] > u[0] && ((o = t[1]), (u = t[0]));
          let c = Math.atan((u[1] - o[1]) / (u[0] - o[0]));
          for (let t = 0; t < l; t++) {
            let e = t * (a + n),
              i = e + a,
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
        a = e.zigzagOffset < 0 ? s : e.zigzagOffset,
        n = l(t, (e = Object.assign({}, e, { hachureGap: s + a })));
      return { type: "fillSketch", ops: this.zigzagLines(n, a, e) };
    }
    zigzagLines(t, s, a) {
      let n = [];
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
            n.push(
              ...this.helper.doubleLineOps(o[0], o[1], c[0], c[1], a),
              ...this.helper.doubleLineOps(c[0], c[1], u[0], u[1], a)
            );
          }
        }),
        n
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
      a = "BOD",
      n = 0,
      r = s[n];
    for (; !k(r, 2); ) {
      let i = 0,
        l = [];
      if ("BOD" === a) {
        if ("M" !== r.text && "m" !== r.text) return m("M0,0" + t);
        n++, (i = M[r.text]), (a = r.text);
      } else k(r, 1) ? (i = M[a]) : (n++, (i = M[r.text]), (a = r.text));
      if (!(n + i < s.length)) throw Error("Path data ended short");
      for (let t = n; t < n + i; t++) {
        let e = s[t];
        if (!k(e, 1)) throw Error("Param not a number: " + a + "," + e.text);
        l[l.length] = +e.text;
      }
      if ("number" != typeof M[a]) throw Error("Bad segment: " + a);
      {
        let t = { key: a, data: l };
        e.push(t),
          (n += i),
          (r = s[n]),
          "M" === a && (a = "L"),
          "m" === a && (a = "l");
      }
    }
    return e;
  }
  function y(t) {
    let e = 0,
      s = 0,
      a = 0,
      n = 0,
      r = [];
    for (let { key: i, data: l } of t)
      switch (i) {
        case "M":
          r.push({ key: "M", data: [...l] }), ([e, s] = l), ([a, n] = l);
          break;
        case "m":
          (e += l[0]),
            (s += l[1]),
            r.push({ key: "M", data: [e, s] }),
            (a = e),
            (n = s);
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
          let t = l.map((t, a) => (a % 2 ? t + s : t + e));
          r.push({ key: "C", data: t }), (e = t[4]), (s = t[5]);
          break;
        }
        case "Q":
          r.push({ key: "Q", data: [...l] }), (e = l[2]), (s = l[3]);
          break;
        case "q": {
          let t = l.map((t, a) => (a % 2 ? t + s : t + e));
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
          let t = l.map((t, a) => (a % 2 ? t + s : t + e));
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
          r.push({ key: "Z", data: [] }), (e = a), (s = n);
      }
    return r;
  }
  function b(t) {
    let e = [],
      s = "",
      a = 0,
      n = 0,
      r = 0,
      i = 0,
      l = 0,
      h = 0;
    for (let { key: o, data: u } of t) {
      switch (o) {
        case "M":
          e.push({ key: "M", data: [...u] }), ([a, n] = u), ([r, i] = u);
          break;
        case "C":
          e.push({ key: "C", data: [...u] }),
            (a = u[4]),
            (n = u[5]),
            (l = u[2]),
            (h = u[3]);
          break;
        case "L":
          e.push({ key: "L", data: [...u] }), ([a, n] = u);
          break;
        case "H":
          (a = u[0]), e.push({ key: "L", data: [a, n] });
          break;
        case "V":
          (n = u[0]), e.push({ key: "L", data: [a, n] });
          break;
        case "S": {
          let t = 0,
            r = 0;
          "C" === s || "S" === s
            ? ((t = a + (a - l)), (r = n + (n - h)))
            : ((t = a), (r = n)),
            e.push({ key: "C", data: [t, r, ...u] }),
            (l = u[0]),
            (h = u[1]),
            (a = u[2]),
            (n = u[3]);
          break;
        }
        case "T": {
          let [t, r] = u,
            i = 0,
            o = 0;
          "Q" === s || "T" === s
            ? ((i = a + (a - l)), (o = n + (n - h)))
            : ((i = a), (o = n));
          let c = a + (2 * (i - a)) / 3,
            p = n + (2 * (o - n)) / 3,
            f = t + (2 * (i - t)) / 3,
            d = r + (2 * (o - r)) / 3;
          e.push({ key: "C", data: [c, p, f, d, t, r] }),
            (l = i),
            (h = o),
            (a = t),
            (n = r);
          break;
        }
        case "Q": {
          let [t, s, r, i] = u,
            o = a + (2 * (t - a)) / 3,
            c = n + (2 * (s - n)) / 3,
            p = r + (2 * (t - r)) / 3,
            f = i + (2 * (s - i)) / 3;
          e.push({ key: "C", data: [o, c, p, f, r, i] }),
            (l = t),
            (h = s),
            (a = r),
            (n = i);
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
            ? (e.push({ key: "C", data: [a, n, h, o, h, o] }), (a = h), (n = o))
            : (a !== h || n !== o) &&
              (v(a, n, h, o, t, s, r, i, l).forEach(function (t) {
                e.push({ key: "C", data: t });
              }),
              (a = h),
              (n = o));
          break;
        }
        case "Z":
          e.push({ key: "Z", data: [] }), (a = r), (n = i);
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
  function v(t, e, s, a, n, r, i, l, h, o) {
    let u = (Math.PI * i) / 180,
      c = [],
      p = 0,
      f = 0,
      d = 0,
      g = 0;
    if (o) [p, f, d, g] = o;
    else {
      ([t, e] = w(t, e, -u)), ([s, a] = w(s, a, -u));
      let i = (t - s) / 2,
        o = (e - a) / 2,
        c = (i * i) / (n * n) + (o * o) / (r * r);
      c > 1 && ((n *= c = Math.sqrt(c)), (r *= c));
      let M = n * n,
        k = r * r,
        m =
          (l === h ? -1 : 1) *
          Math.sqrt(
            Math.abs((M * k - M * o * o - k * i * i) / (M * o * o + k * i * i))
          );
      (d = (m * n * o) / r + (t + s) / 2),
        (g = (-m * r * i) / n + (e + a) / 2),
        (p = Math.asin(parseFloat(((e - g) / r).toFixed(9)))),
        (f = Math.asin(parseFloat(((a - g) / r).toFixed(9)))),
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
        l = a;
      c = v(
        (s =
          d +
          n *
            Math.cos(
              (f =
                h && f > p
                  ? p + ((120 * Math.PI) / 180) * 1
                  : p + ((-120 * Math.PI) / 180) * 1)
            )),
        (a = g + r * Math.sin(f)),
        e,
        l,
        n,
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
      L = Math.tan((M = f - p) / 4),
      P = (4 / 3) * n * L,
      x = (4 / 3) * r * L,
      C = [t, e],
      S = [t + P * m, e - x * k],
      O = [s + P * b, a - x * y],
      I = [s, a];
    if (((S[0] = 2 * C[0] - S[0]), (S[1] = 2 * C[1] - S[1]), o))
      return [S, O, I].concat(c);
    {
      c = [S, O, I].concat(c);
      let t = [];
      for (let e = 0; e < c.length; e += 3) {
        let s = w(c[e][0], c[e][1], u),
          a = w(c[e + 1][0], c[e + 1][1], u),
          n = w(c[e + 2][0], c[e + 2][1], u);
        t.push([s[0], s[1], a[0], a[1], n[0], n[1]]);
      }
      return t;
    }
  }
  let L = {
    randOffset: function (t, e) {
      return A(t, e);
    },
    randOffsetWithRange: function (t, e, s) {
      return W(t, e, s);
    },
    ellipse: function (t, e, s, a, n) {
      return S(t, e, n, C(s, a, n)).opset;
    },
    doubleLineOps: function (t, e, s, a, n) {
      return _(t, e, s, a, n, !0);
    },
  };
  function P(t, e, s, a, n) {
    return { type: "path", ops: _(t, e, s, a, n) };
  }
  function x(t, e, s) {
    let a = (t || []).length;
    if (a > 2) {
      let n = [];
      for (let e = 0; e < a - 1; e++)
        n.push(..._(t[e][0], t[e][1], t[e + 1][0], t[e + 1][1], s));
      return (
        e && n.push(..._(t[a - 1][0], t[a - 1][1], t[0][0], t[0][1], s)),
        { type: "path", ops: n }
      );
    }
    return 2 === a
      ? P(t[0][0], t[0][1], t[1][0], t[1][1], s)
      : { type: "path", ops: [] };
  }
  function C(t, e, s) {
    let a = Math.max(
        s.curveStepCount,
        (s.curveStepCount / Math.sqrt(200)) *
          Math.sqrt(
            2 *
              Math.PI *
              Math.sqrt((Math.pow(t / 2, 2) + Math.pow(e / 2, 2)) / 2)
          )
      ),
      n = Math.abs(t / 2),
      r = Math.abs(e / 2),
      i = 1 - s.curveFitting;
    return (
      (n += A(n * i, s)),
      (r += A(r * i, s)),
      { increment: (2 * Math.PI) / a, rx: n, ry: r }
    );
  }
  function S(t, e, s, a) {
    let [n, r] = $(
        a.increment,
        t,
        e,
        a.rx,
        a.ry,
        1,
        a.increment * W(0.1, W(0.4, 1, s), s),
        s
      ),
      i = R(n, null, s);
    if (!s.disableMultiStroke) {
      let [n] = $(a.increment, t, e, a.rx, a.ry, 1.5, 0, s),
        r = R(n, null, s);
      i = i.concat(r);
    }
    return { estimatedPoints: r, opset: { type: "path", ops: i } };
  }
  function O(t, e, s, a, n, r, i, l, h) {
    let o = t,
      u = e,
      c = Math.abs(s / 2),
      p = Math.abs(a / 2);
    (c += A(0.01 * c, h)), (p += A(0.01 * p, h));
    let f = n,
      d = r;
    for (; f < 0; ) (f += 2 * Math.PI), (d += 2 * Math.PI);
    d - f > 2 * Math.PI && ((f = 0), (d = 2 * Math.PI));
    let g = Math.min((2 * Math.PI) / h.curveStepCount / 2, (d - f) / 2),
      M = G(g, o, u, c, p, f, d, 1, h);
    if (!h.disableMultiStroke) {
      let t = G(g, o, u, c, p, f, d, 1.5, h);
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
      let a = e.maxRandomnessOffset || 0,
        n = t.length;
      if (n > 2) {
        s.push({ op: "move", data: [t[0][0] + A(a, e), t[0][1] + A(a, e)] });
        for (let r = 1; r < n; r++)
          s.push({
            op: "lineTo",
            data: [t[r][0] + A(a, e), t[r][1] + A(a, e)],
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
    })(e, L).fillPolygon(t, e);
  }
  function E(t) {
    return (
      t.randomizer || (t.randomizer = new g(t.seed || 0)), t.randomizer.next()
    );
  }
  function W(t, e, s, a = 1) {
    return s.roughness * a * (E(s) * (e - t) + t);
  }
  function A(t, e, s = 1) {
    return W(-t, t, e, s);
  }
  function _(t, e, s, a, n, r = !1) {
    let i = r ? n.disableMultiStrokeFill : n.disableMultiStroke,
      l = D(t, e, s, a, n, !0, !1);
    if (i) return l;
    let h = D(t, e, s, a, n, !0, !0);
    return l.concat(h);
  }
  function D(t, e, s, a, n, r, i) {
    let l = Math.pow(t - s, 2) + Math.pow(e - a, 2),
      h = Math.sqrt(l),
      o = 1;
    o = h < 200 ? 1 : h > 500 ? 0.4 : -0.0016668 * h + 1.233334;
    let u = n.maxRandomnessOffset || 0;
    u * u * 100 > l && (u = h / 10);
    let c = u / 2,
      p = 0.2 + 0.2 * E(n),
      f = (n.bowing * n.maxRandomnessOffset * (a - e)) / 200,
      d = (n.bowing * n.maxRandomnessOffset * (t - s)) / 200;
    (f = A(f, n, o)), (d = A(d, n, o));
    let g = [],
      M = () => A(c, n, o),
      k = () => A(u, n, o);
    return (
      r &&
        (i
          ? g.push({ op: "move", data: [t + M(), e + M()] })
          : g.push({ op: "move", data: [t + A(u, n, o), e + A(u, n, o)] })),
      i
        ? g.push({
            op: "bcurveTo",
            data: [
              f + t + (s - t) * p + M(),
              d + e + (a - e) * p + M(),
              f + t + 2 * (s - t) * p + M(),
              d + e + 2 * (a - e) * p + M(),
              s + M(),
              a + M(),
            ],
          })
        : g.push({
            op: "bcurveTo",
           data: [
              f + t + (s - t) * p + k(),
              d + e + (a - e) * p + k(),
              f + t + 2 * (s - t) * p + k(),
              d + e + 2 * (a - e) * p + k(),
              s + k(),
              a + k(),
            ],
          }),
      g
    );
  }
  function z(t, e, s) {
    let a = [];
    a.push([t[0][0] + A(e, s), t[0][1] + A(e, s)]),
      a.push([t[0][0] + A(e, s), t[0][1] + A(e, s)]);
    for (let n = 1; n < t.length; n++)
      a.push([t[n][0] + A(e, s), t[n][1] + A(e, s)]),
        n === t.length - 1 && a.push([t[n][0] + A(e, s), t[n][1] + A(e, s)]);
    return R(a, null, s);
  }
  function R(t, e, s) {
    let a = t.length,
      n = [];
    if (a > 3) {
      let r = [],
        i = 1 - s.curveTightness;
      n.push({ op: "move", data: [t[1][0], t[1][1]] });
      for (let e = 1; e + 2 < a; e++) {
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
          n.push({
            op: "bcurveTo",
            data: [r[1][0], r[1][1], r[2][0], r[2][1], r[3][0], r[3][1]],
          });
      }
      if (e && 2 === e.length) {
        let t = s.maxRandomnessOffset;
        n.push({ op: "lineTo", data: [e[0] + A(t, s), e[1] + A(t, s)] });
      }
    } else
      3 === a
        ? (n.push({ op: "move", data: [t[1][0], t[1][1]] }),
          n.push({
            op: "bcurveTo",
            data: [t[1][0], t[1][1], t[2][0], t[2][1], t[2][0], t[2][1]],
          }))
        : 2 === a && n.push(..._(t[0][0], t[0][1], t[1][0], t[1][1], s));
    return n;
  }
  function $(t, e, s, a, n, r, i, l) {
    let h = [],
      o = [],
      u = A(0.5, l) - Math.PI / 2;
    o.push([
      A(r, l) + e + 0.9 * a * Math.cos(u - t),
      A(r, l) + s + 0.9 * n * Math.sin(u - t),
    ]);
    for (let i = u; i < 2 * Math.PI + u - 0.01; i += t) {
      let t = [A(r, l) + e + a * Math.cos(i), A(r, l) + s + n * Math.sin(i)];
      h.push(t), o.push(t);
    }
    return (
      o.push([
        A(r, l) + e + a * Math.cos(u + 2 * Math.PI + 0.5 * i),
        A(r, l) + s + n * Math.sin(u + 2 * Math.PI + 0.5 * i),
      ]),
      o.push([
        A(r, l) + e + 0.98 * a * Math.cos(u + i),
        A(r, l) + s + 0.98 * n * Math.sin(u + i),
      ]),
      o.push([
        A(r, l) + e + 0.9 * a * Math.cos(u + 0.5 * i),
        A(r, l) + s + 0.9 * n * Math.sin(u + 0.5 * i),
      ]),
      [o, h]
    );
  }
  function G(t, e, s, a, n, r, i, l, h) {
    let o = r + A(0.1, h),
      u = [];
    u.push([
      A(l, h) + e + 0.9 * a * Math.cos(o - t),
      A(l, h) + s + 0.9 * n * Math.sin(o - t),
    ]);
    for (let r = o; r <= i; r += t)
      u.push([A(l, h) + e + a * Math.cos(r), A(l, h) + s + n * Math.sin(r)]);
    return (
      u.push([e + a * Math.cos(i), s + n * Math.sin(i)]),
      u.push([e + a * Math.cos(i), s + n * Math.sin(i)]),
      R(u, null, h)
    );
  }
  function B(t, e, s, a, n, r, i, l) {
    let h = [],
      o = [l.maxRandomnessOffset || 1, (l.maxRandomnessOffset || 1) + 0.3],
      u = [0, 0],
      c = l.disableMultiStroke ? 1 : 2;
    for (let p = 0; p < c; p++)
      0 === p
        ? h.push({ op: "move", data: [i[0], i[1]] })
        : h.push({ op: "move", data: [i[0] + A(o[0], l), i[1] + A(o[0], l)] }),
        (u = [n + A(o[p], l), r + A(o[p], l)]),
        h.push({
          op: "bcurveTo",
          data: [
            t + A(o[p], l),
            e + A(o[p], l),
            s + A(o[p], l),
            a + A(o[p], l),
            u[0],
            u[1],
          ],
        });
    return h;
  }
  function q(t) {
    return [...t];
  }
  function j(t, e) {
    return Math.pow(t[0] - e[0], 2) + Math.pow(t[1] - e[1], 2);
  }
  function H(t, e, s) {
    let a = j(e, s);
    if (0 === a) return j(t, e);
    let n = ((t[0] - e[0]) * (s[0] - e[0]) + (t[1] - e[1]) * (s[1] - e[1])) / a;
    return j(t, N(e, s, (n = Math.max(0, Math.min(1, n)))));
  }
  function N(t, e, s) {
    return [t[0] + (e[0] - t[0]) * s, t[1] + (e[1] - t[1]) * s];
  }
  function F(t, e, s, a) {
    var n, r;
    let i,
      l,
      h,
      o,
      u,
      c,
      p,
      f,
      d = a || [];
    if (
      ((i = (n = t)[(r = e) + 0]),
      (l = n[r + 1]),
      (h = n[r + 2]),
      (o = n[r + 3]),
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
      d.length ? Math.sqrt(j(d[d.length - 1], s)) > 1 && d.push(s) : d.push(s),
        d.push(t[e + 3]);
    } else {
      let a = t[e + 0],
        n = t[e + 1],
        r = t[e + 2],
        i = t[e + 3],
        l = N(a, n, 0.5),
        h = N(n, r, 0.5),
        o = N(r, i, 0.5),
        u = N(l, h, 0.5),
        c = N(h, o, 0.5),
        p = N(u, c, 0.5);
      F([a, l, u, p], 0, s, d), F([p, c, o, i], 0, s, d);
    }
    return d;
  }
  function Z(t, e) {
    return Q(t, 0, t.length, e);
  }
  function Q(t, e, s, a, n) {
    let r = n || [],
      i = t[e],
      l = t[s - 1],
      h = 0,
      o = 1;
    for (let a = e + 1; a < s - 1; ++a) {
      let e = H(t[a], i, l);
      e > h && ((h = e), (o = a));
    }
    return (
      Math.sqrt(h) > a
        ? (Q(t, e, o + 1, a, r), Q(t, o, s, a, r))
        : (r.length || r.push(i), r.push(l)),
      r
    );
  }
  function V(t, e = 0.15, s) {
    let a = [],
      n = (t.length - 1) / 3;
    for (let s = 0; s < n; s++) F(t, 3 * s, e, a);
    return s && s > 0 ? Q(a, 0, a.length, s) : a;
  }
  let U = "none";
  class X {
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
    line(t, e, s, a, n) {
      let r = this._o(n);
      return this._d("line", [P(t, e, s, a, r)], r);
    }
    rectangle(t, e, s, a, n) {
      var r, i, l, h;
      let o = this._o(n),
        u = [],
        c = x(
          [
            [(r = t), (i = e)],
            [r + (l = s), i],
            [r + l, i + (h = a)],
            [r, i + h],
          ],
          !0,
          o
        );
      if (o.fill) {
        let n = [
          [t, e],
          [t + s, e],
          [t + s, e + a],
          [t, e + a],
        ];
        "solid" === o.fillStyle ? u.push(I(n, o)) : u.push(T(n, o));
      }
      return o.stroke !== U && u.push(c), this._d("rectangle", u, o);
    }
    ellipse(t, e, s, a, n) {
      let r = this._o(n),
        i = [],
        l = C(s, a, r),
        h = S(t, e, r, l);
      if (r.fill)
        if ("solid" === r.fillStyle) {
          let s = S(t, e, r, l).opset;
          (s.type = "fillPath"), i.push(s);
        } else i.push(T(h.estimatedPoints, r));
      return r.stroke !== U && i.push(h.opset), this._d("ellipse", i, r);
    }
    circle(t, e, s, a) {
      let n = this.ellipse(t, e, s, s, a);
      return (n.shape = "circle"), n;
    }
    linearPath(t, e) {
      let s = this._o(e);
      return this._d("linearPath", [x(t, !1, s)], s);
    }
    arc(t, e, s, a, n, r, i = !1, l) {
      let h = this._o(l),
        o = [],
        u = O(t, e, s, a, n, r, i, !0, h);
      if (i && h.fill)
        if ("solid" === h.fillStyle) {
          let i = O(t, e, s, a, n, r, !0, !1, h);
          (i.type = "fillPath"), o.push(i);
        } else
          o.push(
            (function (t, e, s, a, n, r, i) {
              let l = t,
                h = e,
                o = Math.abs(s / 2),
                u = Math.abs(a / 2);
              (o += A(0.01 * o, i)), (u += A(0.01 * u, i));
              let c = n,
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
            })(t, e, s, a, n, r, h)
          );
      return h.stroke !== U && o.push(u), this._d("arc", o, h);
    }
    curve(t, e) {
      let s = this._o(e),
        a = [],
        n = (function (t, e) {
          let s = z(t, 1 * (1 + 0.2 * e.roughness), e);
          if (!e.disableMultiStroke) {
            var a;
            let n,
              r = z(
                t,
                1.5 * (1 + 0.22 * e.roughness),
                (((n = Object.assign({}, (a = e))).randomizer = void 0),
                a.seed && (n.seed = a.seed + 1),
                n)
              );
            s = s.concat(r);
          }
          return { type: "path", ops: s };
        })(t, s);
      if (s.fill && s.fill !== U && t.length >= 3) {
        let e = V(
          (function (t, e = 0) {
            let s = t.length;
            if (s < 3) throw Error("A curve must have at least three points.");
            let a = [];
            if (3 === s) a.push(q(t[0]), q(t[1]), q(t[2]), q(t[2]));
            else {
              let s = [];
              s.push(t[0], t[0]);
              for (let e = 1; e < t.length; e++)
                s.push(t[e]), e === t.length - 1 && s.push(t[e]);
              let n = [],
                r = 1 - e;
              a.push(q(s[0]));
              for (let t = 1; t + 2 < s.length; t++) {
                let e = s[t];
                (n[0] = [e[0], e[1]]),
                  (n[1] = [
                    e[0] + (r * s[t + 1][0] - r * s[t - 1][0]) / 6,
                    e[1] + (r * s[t + 1][1] - r * s[t - 1][1]) / 6,
                  ]),
                  (n[2] = [
                    s[t + 1][0] + (r * s[t][0] - r * s[t + 2][0]) / 6,
                    s[t + 1][1] + (r * s[t][1] - r * s[t + 2][1]) / 6,
                  ]),
                  (n[3] = [s[t + 1][0], s[t + 1][1]]),
                  a.push(n[1], n[2], n[3]);
              }
            }
            return a;
          })(t),
          10,
          (1 + s.roughness) / 2
        );
        "solid" === s.fillStyle ? a.push(I(e, s)) : a.push(T(e, s));
      }
      return s.stroke !== U && a.push(n), this._d("curve", a, s);
    }
    polygon(t, e) {
      let s = this._o(e),
        a = [],
        n = x(t, !0, s);
      return (
        s.fill && ("solid" === s.fillStyle ? a.push(I(t, s)) : a.push(T(t, s))),
        s.stroke !== U && a.push(n),
        this._d("polygon", a, s)
      );
    }
    path(t, e) {
      let s = this._o(e),
        a = [];
      if (!t) return this._d("path", a, s);
      t = (t || "")
        .replace(/\n/g, " ")
        .replace(/(-\s)/g, "-")
        .replace("/(ss)/g", " ");
      let n = s.fill && "transparent" !== s.fill && s.fill !== U,
        r = s.stroke !== U,
        i = !!(s.simplification && s.simplification < 1),
        l = (function (t, e, s) {
          let a = b(y(m(t))),
            n = [],
            r = [],
            i = [0, 0],
            l = [],
            h = () => {
              l.length >= 4 && r.push(...V(l, 1)), (l = []);
            },
            o = () => {
              h(), r.length && (n.push(r), (r = []));
            };
          for (let { key: t, data: e } of a)
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
          if ((o(), !s)) return n;
          let u = [];
          for (let t of n) {
            let e = Z(t, s);
            e.length && u.push(e);
          }
          return u;
        })(t, 0, i ? 4 - 4 * s.simplification : (1 + s.roughness) / 2);
      if (n)
        if (s.combineNestedSvgPaths) {
          let t = [];
          l.forEach((e) => t.push(...e)),
            "solid" === s.fillStyle ? a.push(I(t, s)) : a.push(T(t, s));
        } else
          l.forEach((t) => {
            "solid" === s.fillStyle ? a.push(I(t, s)) : a.push(T(t, s));
          });
      return (
        r &&
          (i
            ? l.forEach((t) => {
                a.push(x(t, !1, s));
              })
            : a.push(
                (function (t, e) {
                  let s = b(y(m(t))),
                    a = [],
                    n = [0, 0],
                    r = [0, 0];
                  for (let { key: t, data: i } of s)
                    switch (t) {
                      case "M": {
                        let t = 1 * (e.maxRandomnessOffset || 0);
                        a.push({ op: "move", data: i.map((s) => s + A(t, e)) }),
                          (r = [i[0], i[1]]),
                          (n = [i[0], i[1]]);
                        break;
                      }
                      case "L":
                        a.push(..._(r[0], r[1], i[0], i[1], e)),
                          (r = [i[0], i[1]]);
                        break;
                      case "C": {
                        let [t, s, n, l, h, o] = i;
                        a.push(...B(t, s, n, l, h, o, r, e)), (r = [h, o]);
                        break;
                      }
                      case "Z":
                        a.push(..._(r[0], r[1], n[0], n[1], e)),
                          (r = [n[0], n[1]]);
                    }
                  return { type: "path", ops: a };
                })(t, s)
              )),
        this._d("path", a, s)
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
        a = [];
      for (let t of e) {
        let e = null;
        switch (t.type) {
          case "path":
            e = {
              d: this.opsToPath(t),
              stroke: s.stroke,
              strokeWidth: s.strokeWidth,
              fill: U,
            };
            break;
          case "fillPath":
            e = {
              d: this.opsToPath(t),
              stroke: U,
              strokeWidth: 0,
              fill: s.fill || U,
            };
            break;
          case "fillSketch":
            e = this.fillSketch(t, s);
        }
        e && a.push(e);
      }
      return a;
    }
    fillSketch(t, e) {
      let s = e.fillWeight;
      return (
        s < 0 && (s = e.strokeWidth / 2),
        { d: this.opsToPath(t), stroke: e.fill || U, strokeWidth: s, fill: U }
      );
    }
  }
  class Y {
    constructor(t, e) {
      (this.canvas = t),
        (this.ctx = this.canvas.getContext("2d")),
        (this.gen = new X(e));
    }
    draw(t) {
      let e = t.sets || [],
        s = t.options || this.getDefaultOptions(),
        a = this.ctx;
      for (let n of e)
        switch (n.type) {
          case "path":
            a.save(),
              (a.strokeStyle = "none" === s.stroke ? "transparent" : s.stroke),
              (a.lineWidth = s.strokeWidth),
              s.strokeLineDash && a.setLineDash(s.strokeLineDash),
              s.strokeLineDashOffset &&
                (a.lineDashOffset = s.strokeLineDashOffset),
              this._drawToContext(a, n),
              a.restore();
            break;
          case "fillPath":
            a.save(), (a.fillStyle = s.fill || "");
            let e =
              "curve" === t.shape || "polygon" === t.shape
                ? "evenodd"
                : "nonzero";
            this._drawToContext(a, n, e), a.restore();
            break;
          case "fillSketch":
            this.fillSketch(a, n, s);
        }
    }
    fillSketch(t, e, s) {
      let a = s.fillWeight;
      a < 0 && (a = s.strokeWidth / 2),
        t.save(),
        s.fillLineDash && t.setLineDash(s.fillLineDash),
        s.fillLineDashOffset && (t.lineDashOffset = s.fillLineDashOffset),
        (t.strokeStyle = s.fill || ""),
        (t.lineWidth = a),
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
    line(t, e, s, a, n) {
      let r = this.gen.line(t, e, s, a, n);
      return this.draw(r), r;
    }
    rectangle(t, e, s, a, n) {
      let r = this.gen.rectangle(t, e, s, a, n);
      return this.draw(r), r;
    }
    ellipse(t, e, s, a, n) {
      let r = this.gen.ellipse(t, e, s, a, n);
      return this.draw(r), r;
    }
    circle(t, e, s, a) {
      let n = this.gen.circle(t, e, s, a);
      return this.draw(n), n;
    }
    linearPath(t, e) {
      let s = this.gen.linearPath(t, e);
      return this.draw(s), s;
    }
    polygon(t, e) {
      let s = this.gen.polygon(t, e);
      return this.draw(s), s;
    }
    arc(t, e, s, a, n, r, i = !1, l) {
      let h = this.gen.arc(t, e, s, a, n, r, i, l);
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
  let J = "http://www.w3.org/2000/svg";
  class K {
    constructor(t, e) {
      (this.svg = t), (this.gen = new X(e));
    }
    draw(t) {
      let e = t.sets || [],
        s = t.options || this.getDefaultOptions(),
        a = this.svg.ownerDocument || window.document,
        n = a.createElementNS(J, "g");
      for (let r of e) {
        let e = null;
        switch (r.type) {
          case "path":
            (e = a.createElementNS(J, "path")).setAttribute(
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
            (e = a.createElementNS(J, "path")).setAttribute(
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
            e = this.fillSketch(a, r, s);
        }
        e && n.appendChild(e);
      }
      return n;
    }
    fillSketch(t, e, s) {
      let a = s.fillWeight;
      a < 0 && (a = s.strokeWidth / 2);
      let n = t.createElementNS(J, "path");
      return (
        n.setAttribute("d", this.opsToPath(e)),
        n.setAttribute("stroke", s.fill || ""),
        n.setAttribute("stroke-width", a + ""),
        n.setAttribute("fill", "none"),
        s.fillLineDash &&
          n.setAttribute("stroke-dasharray", s.fillLineDash.join(" ").trim()),
        s.fillLineDashOffset &&
          n.setAttribute("stroke-dashoffset", "" + s.fillLineDashOffset),
        n
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
    line(t, e, s, a, n) {
      let r = this.gen.line(t, e, s, a, n);
      return this.draw(r);
    }
    rectangle(t, e, s, a, n) {
      let r = this.gen.rectangle(t, e, s, a, n);
      return this.draw(r);
    }
    ellipse(t, e, s, a, n) {
      let r = this.gen.ellipse(t, e, s, a, n);
      return this.draw(r);
    }
    circle(t, e, s, a) {
      let n = this.gen.circle(t, e, s, a);
      return this.draw(n);
    }
    linearPath(t, e) {
      let s = this.gen.linearPath(t, e);
      return this.draw(s);
    }
    polygon(t, e) {
      let s = this.gen.polygon(t, e);
      return this.draw(s);
    }
    arc(t, e, s, a, n, r, i = !1, l) {
      let h = this.gen.arc(t, e, s, a, n, r, i, l);
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
    canvas: (t, e) => new Y(t, e),
    svg: (t, e) => new K(t, e),
    generator: (t) => new X(t),
    newSeed: () => X.newSeed(),
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
  words =[
    { "title": "awareness" },
    { "title": "knowledge" },
    { "title": "liking" },
    { "title": "preference" },
    { "title": "conviction" },
    { "title": "purchase" },
    { "title": "cognitive" },
    { "title": "affective" },
    { "title": "behavioral" },
    { "title": "reminder" },
    { "title": "reinforce" }
];
let selectedWord = words[Math.floor(Math.random() * words.length)],
  correctLetters = [],
  wrongLetters = [];
function displayWord() {
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
