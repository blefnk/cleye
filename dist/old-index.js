var W = Object.create;
var h = Object.defineProperty,
  Z = Object.defineProperties,
  z = Object.getOwnPropertyDescriptor,
  G = Object.getOwnPropertyDescriptors,
  Q = Object.getOwnPropertyNames,
  D = Object.getOwnPropertySymbols,
  X = Object.getPrototypeOf,
  T = Object.prototype.hasOwnProperty,
  Y = Object.prototype.propertyIsEnumerable;
var E = (t, e, n) =>
    e in t
      ? h(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (t[e] = n),
  f = (t, e) => {
    for (var n in e || (e = {})) T.call(e, n) && E(t, n, e[n]);
    if (D) for (var n of D(e)) Y.call(e, n) && E(t, n, e[n]);
    return t;
  },
  b = (t, e) => Z(t, G(e)),
  S = (t) => h(t, "__esModule", { value: !0 });
var ee = (t, e) => {
    for (var n in e) h(t, n, { get: e[n], enumerable: !0 });
  },
  B = (t, e, n, a) => {
    if ((e && typeof e == "object") || typeof e == "function")
      for (let r of Q(e))
        !T.call(t, r) &&
          (n || r !== "default") &&
          h(t, r, {
            get: () => e[r],
            enumerable: !(a = z(e, r)) || a.enumerable,
          });
    return t;
  },
  v = (t, e) =>
    B(
      S(
        h(
          t != null ? W(X(t)) : {},
          "default",
          !e && t && t.__esModule
            ? { get: () => t.default, enumerable: !0 }
            : { value: t, enumerable: !0 }
        )
      ),
      t
    ),
  te = (
    (t) => (e, n) =>
      (t && t.get(e)) || ((n = B(S({}), e, 1)), t && t.set(e, n), n)
  )(typeof WeakMap != "undefined" ? new WeakMap() : 0);
var ue = {};
ee(ue, { cli: () => _, command: () => J });
var V = v(require("type-flag"));
var R = (t) => t.replace(/[-_ ](\w)/g, (e, n) => n.toUpperCase()),
  I = (t) => t.replace(/\B([A-Z])/g, "-$1").toLowerCase();
var ne = {
  "> 80": [
    { width: "content-width", paddingLeft: 2, paddingRight: 8 },
    { width: "auto" },
  ],
  "> 40": [
    {
      width: "auto",
      paddingLeft: 2,
      paddingRight: 8,
      preprocess: (t) => t.trim(),
    },
    { width: "100%", paddingLeft: 2, paddingBottom: 1 },
  ],
  "> 0": {
    stdoutColumns: 1e3,
    columns: [
      { width: "content-width", paddingLeft: 2, paddingRight: 8 },
      { width: "content-width" },
    ],
  },
};
function j(t) {
  let e = !1,
    a = Object.keys(t)
      .sort((r, s) => r.localeCompare(s))
      .map((r) => {
        let s = t[r],
          i = "alias" in s;
        return (
          i && (e = !0),
          {
            name: r,
            flag: s,
            flagFormatted: `--${I(r)}`,
            aliasesEnabled: e,
            aliasFormatted: i ? `-${s.alias}` : void 0,
          }
        );
      })
      .map(
        (r) => (
          (r.aliasesEnabled = e),
          [
            { type: "flagName", data: r },
            { type: "flagDescription", data: r },
          ]
        )
      );
  return { type: "table", data: { tableData: a, tableBreakpoints: ne } };
}
var K = (t) => {
    var e;
    return (
      !t || ((e = t.version) != null ? e : t.help ? t.help.version : void 0)
    );
  },
  q = (t) => {
    var n;
    let e = "parent" in t && ((n = t.parent) == null ? void 0 : n.name);
    return (e ? `${e} ` : "") + t.name;
  };
function re(t) {
  var a;
  let e = [];
  t.name && e.push(q(t));
  let n = (a = K(t)) != null ? a : "parent" in t && K(t.parent);
  if ((n && e.push(`v${n}`), e.length !== 0))
    return {
      id: "name",
      type: "text",
      data: `${e.join(" ")}
`,
    };
}
function ae(t) {
  let { help: e } = t;
  if (!(!e || !e.description))
    return {
      id: "description",
      type: "text",
      data: `${e.description}
`,
    };
}
function se(t) {
  var n;
  let e = t.help || {};
  if ("usage" in e)
    return e.usage
      ? {
          id: "usage",
          type: "section",
          data: {
            title: "Usage:",
            body: Array.isArray(e.usage)
              ? e.usage.join(`
`)
              : e.usage,
          },
        }
      : void 0;
  if (t.name) {
    let a = [],
      r = [q(t)];
    if (
      (t.flags && Object.keys(t.flags).length > 0 && r.push("[flags...]"),
      t.parameters && t.parameters.length > 0)
    ) {
      let { parameters: s } = t,
        i = s.indexOf("--"),
        m = i > -1 && s.slice(i + 1).some((o) => o.startsWith("<"));
      r.push(s.map((o) => (o !== "--" ? o : m ? "--" : "[--]")).join(" "));
    }
    if (
      (r.length > 1 && a.push(r.join(" ")),
      "commands" in t &&
        ((n = t.commands) == null ? void 0 : n.length) &&
        a.push(`${t.name} <command>`),
      a.length > 0)
    )
      return {
        id: "usage",
        type: "section",
        data: {
          title: "Usage:",
          body: a.join(`
`),
        },
      };
  }
}
function ie(t) {
  var a;
  if (!("commands" in t) || !((a = t.commands) == null ? void 0 : a.length))
    return;
  let e = t.commands.map((r) => [
    r.options.name,
    r.options.help ? r.options.help.description : "",
  ]);
  return {
    id: "commands",
    type: "section",
    data: {
      title: "Commands:",
      body: {
        type: "table",
        data: {
          tableData: e,
          tableOptions: [
            { width: "content-width", paddingLeft: 2, paddingRight: 8 },
          ],
        },
      },
      indentBody: 0,
    },
  };
}
function oe(t) {
  if (!(!t.flags || Object.keys(t.flags).length === 0))
    return {
      id: "flags",
      type: "section",
      data: { title: "Flags:", body: j(t.flags), indentBody: 0 },
    };
}
function me(t) {
  let { help: e } = t;
  if (!e || !e.examples || e.examples.length === 0) return;
  let { examples: n } = e;
  if (
    (Array.isArray(n) &&
      (n = n.join(`
`)),
    n)
  )
    return {
      id: "examples",
      type: "section",
      data: { title: "Examples:", body: n },
    };
}
function le(t) {
  if (!("alias" in t) || !t.alias) return;
  let { alias: e } = t,
    n = Array.isArray(e) ? e.join(", ") : e;
  return {
    id: "aliases",
    type: "section",
    data: { title: "Aliases:", body: n },
  };
}
var A = (t) =>
  [re, ae, se, ie, oe, me, le].map((e) => e(t)).filter((e) => Boolean(e));
var L = v(require("tty")),
  P = v(require("terminal-columns")),
  pe = L.default.WriteStream.prototype.hasColors(),
  x = class {
    text(e) {
      return e;
    }
    bold(e) {
      return pe ? `[1m${e}[22m` : e.toLocaleUpperCase();
    }
    indentText({ text: e, spaces: n }) {
      return e.replace(/^/gm, " ".repeat(n));
    }
    heading(e) {
      return this.bold(e);
    }
    section({ title: e, body: n, indentBody: a = 2 }) {
      return `${
        (e
          ? `${this.heading(e)}
`
          : "") +
        (n ? this.indentText({ text: this.render(n), spaces: a }) : "")
      }
`;
    }
    table({ tableData: e, tableOptions: n, tableBreakpoints: a }) {
      return (0, P.default)(
        e.map((r) => r.map((s) => this.render(s))),
        a ? (0, P.breakpoints)(a) : n
      );
    }
    flagParameter(e) {
      return e === Boolean
        ? ""
        : e === String
        ? "<string>"
        : e === Number
        ? "<number>"
        : Array.isArray(e)
        ? this.flagParameter(e[0])
        : "<value>";
    }
    flagOperator() {
      return " ";
    }
    flagName({
      flag: e,
      flagFormatted: n,
      aliasesEnabled: a,
      aliasFormatted: r,
    }) {
      let s = "";
      if (
        (r ? (s += `${r}, `) : a && (s += "    "),
        (s += n),
        "placeholder" in e && typeof e.placeholder == "string")
      )
        s += `${this.flagOperator()}${e.placeholder}`;
      else {
        let i = this.flagParameter("type" in e ? e.type : e);
        i && (s += `${this.flagOperator()}${i}`);
      }
      return s;
    }
    flagDefault(e) {
      return JSON.stringify(e);
    }
    flagDescription({ flag: e }) {
      var a;
      let n = "description" in e && (a = e.description) != null ? a : "";
      if ("default" in e) {
        let { default: r } = e;
        typeof r == "function" && (r = r()),
          r && (n += ` (default: ${this.flagDefault(r)})`);
      }
      return n;
    }
    render(e) {
      if (typeof e == "string") return e;
      if (Array.isArray(e))
        return e.map((n) => this.render(n)).join(`
`);
      if ("type" in e && this[e.type]) {
        let n = this[e.type];
        if (typeof n == "function") return n.call(this, e.data);
      }
      throw new Error(`Invalid node type: ${JSON.stringify(e)}`);
    }
  };
var O = /^[\w.-]+$/;
var { stringify: p } = JSON,
  de = /[|\\{}()[\]^$+*?.]/;
function $(t) {
  let e = [],
    n,
    a;
  for (let r of t) {
    if (a)
      throw new Error(
        `Invalid parameter: Spread parameter ${p(a)} must be last`
      );
    let s = r[0],
      i = r[r.length - 1],
      m;
    if (s === "<" && i === ">" && ((m = !0), n))
      throw new Error(
        `Invalid parameter: Required parameter ${p(
          r
        )} cannot come after optional parameter ${p(n)}`
      );
    if ((s === "[" && i === "]" && ((m = !1), (n = r)), m === void 0))
      throw new Error(
        `Invalid parameter: ${p(
          r
        )}. Must be wrapped in <> (required parameter) or [] (optional parameter)`
      );
    let o = r.slice(1, -1),
      d = o.slice(-3) === "...";
    d && ((a = r), (o = o.slice(0, -3)));
    let g = o.match(de);
    if (g)
      throw new Error(
        `Invalid parameter: ${p(r)}. Invalid character found ${p(g[0])}`
      );
    e.push({ name: o, required: m, spread: d });
  }
  return e;
}
function N(t, e, n, a) {
  for (let r = 0; r < e.length; r += 1) {
    let { name: s, required: i, spread: m } = e[r],
      o = R(s);
    if (o in t)
      throw new Error(`Invalid parameter: ${p(s)} is used more than once.`);
    let d = m ? n.slice(r) : n[r];
    if ((m && (r = e.length), i && (!d || (m && d.length === 0))))
      return (
        console.error(`Error: Missing required parameter ${p(s)}
`),
        a(),
        process.exit(1)
      );
    t[o] = d;
  }
}
function ce(t) {
  return t === void 0 || t !== !1;
}
function U(t, e, n, a) {
  let r = f({}, e.flags),
    s = e.version;
  s && (r.version = { type: Boolean, description: "Show version" });
  let { help: i } = e,
    m = ce(i);
  m &&
    !("help" in r) &&
    (r.help = { type: Boolean, alias: "h", description: "Show help" });
  let o = (0, V.default)(r, a),
    d = () => {
      console.log(e.version);
    };
  if (s && o.flags.version === !0) return d(), process.exit(0);
  let g = new x(),
    M = m && (i == null ? void 0 : i.render) ? i.render : (l) => g.render(l),
    y = (l) => {
      let u = A(b(f(f({}, e), l ? { help: l } : {}), { flags: r }));
      console.log(M(u, g));
    };
  if (m && o.flags.help === !0) return y(), process.exit(0);
  if (e.parameters) {
    let { parameters: l } = e,
      u = o._,
      w = l.indexOf("--"),
      F = l.slice(w + 1),
      C = Object.create(null);
    if (w > -1 && F.length > 0) {
      l = l.slice(0, w);
      let k = o._["--"];
      (u = u.slice(0, -k.length || void 0)), N(C, $(l), u, y), N(C, $(F), k, y);
    } else N(C, $(l), u, y);
    Object.assign(o._, C);
  }
  let H = b(f({}, o), { showVersion: d, showHelp: y });
  return typeof n == "function" && n(H), f({ command: t }, H);
}
function fe(t, e) {
  let n = new Map();
  for (let a of e) {
    let r = [a.options.name],
      { alias: s } = a.options;
    s && (Array.isArray(s) ? r.push(...s) : r.push(s));
    for (let i of r) {
      if (n.has(i)) throw new Error(`Duplicate command name found: ${p(i)}`);
      n.set(i, a);
    }
  }
  return n.get(t);
}
function _(t, e, n = process.argv.slice(2)) {
  if (!t) throw new Error("Options is required");
  if ("name" in t && (!t.name || !O.test(t.name)))
    throw new Error(`Invalid script name: ${p(t.name)}`);
  let a = n[0];
  if (t.commands && O.test(a)) {
    let r = fe(a, t.commands);
    if (r)
      return U(
        r.options.name,
        b(f({}, r.options), { parent: t }),
        r.callback,
        n.slice(1)
      );
  }
  return U(void 0, t, e, n);
}
function J(t, e) {
  if (!t) throw new Error("Command options are required");
  let { name: n } = t;
  if (t.name === void 0) throw new Error("Command name is required");
  if (!O.test(n))
    throw new Error(
      `Invalid command name ${JSON.stringify(
        n
      )}. Command names must be one word.`
    );
  return { options: t, callback: e };
}
module.exports = te(ue);
0 && (module.exports = { cli, command });