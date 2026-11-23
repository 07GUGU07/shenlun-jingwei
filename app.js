/* =========================================================
   申论经纬 · 交互层
   原生 JS，无外部依赖，可直接双击 index.html 使用
   ========================================================= */

(function () {
  "use strict";

  const D = window.SHENLUN_DATA;
  const TERM_DEFS = window.TERM_DEFS || {};
  const app = document.getElementById("app");
  const topbar = document.getElementById("topbar");
  const LS_KEY = "shenlun-jingwei-progress-v1";

  const TAG_CLASS = {
    "国考高频": "gk",
    "京考高频": "jk",
    "京考独有": "unique",
    "执法卷": "law",
    "交叉": "cross"
  };

  const FILTERS = [
    { id: "all", label: "全部" },
    { id: "国考高频", label: "国考高频" },
    { id: "京考高频", label: "京考高频" },
    { id: "京考独有", label: "京考独有" },
    { id: "执法卷", label: "行政执法卷" },
    { id: "交叉", label: "交叉考点" }
  ];

  // 需要在小标题、正文、案例中自动加粗的专有名词 / 制度品牌 / 政策概念
  const PROPER_NOUNS = [
    "《北京市接诉即办工作条例》", "《北京中轴线文化遗产保护条例》", "《未成年人网络保护条例》",
    "《北京市生活垃圾管理条例》", "《北京市物业管理条例》", "《北京市城市更新条例》", "《北京市养老服务条例》",
    "新时代枫桥经验", "枫桥经验", "千万工程", "浦江经验", "三明医改",
    "接诉即办", "未诉先办", "每月一题", "吹哨报到", "双报到", "回天行动", "回天有我", "回天地区",
    "两区建设", "两区", "四个中心", "四个服务", "五子联动", "一核一主一副", "两轴多点一区", "三城一区",
    "北京中轴线", "中轴线", "三条文化带", "大运河文化带", "长城文化带", "西山永定河文化带",
    "博物馆之城", "演艺之都", "书香京城", "国际消费中心城市", "京津冀协同发展", "城市副中心",
    "雄安新区", "疏解整治促提升", "一核两翼", "花园城市", "生态涵养区", "密云水库", "温榆河公园",
    "小院议事厅", "下交群评", "红色物业", "责任规划师", "平急两用", "城市生命线",
    "一刻钟便民生活圈", "一刻钟养老服务圈", "完整社区", "保障性租赁住房", "家庭养老床位",
    "普惠托育", "长期护理保险", "三医联动", "紧密型城市医疗集团", "双减", "集团化办学",
    "职普融通", "产教融合", "全过程人民民主", "基层立法联系点", "法治政府", "三项制度",
    "首违不罚", "轻微免罚", "包容审慎监管", "双随机一公开", "一支队伍管执法",
    "综合行政执法改革", "大综合一体化", "信用监管", "无事不扰", "非现场监管",
    "高效办成一件事", "一网通办", "一网统管", "最多跑一次", "京通", "网格化",
    "三管三必须", "四个最严", "河长制", "湖长制", "林长制", "GEP核算", "生态银行",
    "碳汇", "双碳", "碳达峰", "碳中和", "新质生产力", "专精特新", "独角兽", "耐心资本",
    "中试平台", "创新联合体", "科技自立自强", "全国统一大市场", "两新", "两重",
    "首发经济", "首店经济", "银发经济", "冰雪经济", "县域商业", "和美乡村", "乡村CEO",
    "科技特派员", "新型农村集体经济", "基层立法联系点", "人大代表联络站", "村（居）民自治",
    "新时代首都发展", "四个服务", "北京服务", "京策", "城市大脑", "一网通办",
    "人工智能+", "数据要素", "数实融合", "公共数据授权运营", "数字鸿沟",
    "两园一河", "南中轴", "大红门博物馆群", "奥林匹克中心区", "京西地区转型",
    "平原新城", "核心区控规", "平房申请式退租", "背街小巷", "老楼加装电梯",
    "物业覆盖率", "接诉即办条例", "北京12345", "12345市民服务热线",
    "每月一题机制", "网格+热线", "热线+网格", "主动治理", "未诉先办",
    "三会一课", "四不两直", "深实细准效", "三个区分开来", "能上能下",
    "不敢腐不能腐不想腐", "八项规定", "四风", "基层减负", "政治生态",
    "放管服", "证照分离", "一业一证", "告知承诺制", "容缺受理",
    "双随机、一公开", "互联网+监管", "信用修复", "公平竞争审查",
    "行政执法公示", "执法全过程记录", "重大执法决定法制审核",
    "过罚相当", "比例原则", "说理式执法", "柔性执法", "执法为民",
    "诉源治理", "非诉挺前", "人民调解", "行政调解", "司法调解",
    "信访工作条例", "平安中国", "扫黑除恶", "反诈", "未成年人保护",
    "食品安全", "四个最严", "明厨亮灶", "阳光餐饮", "城市体检",
    "城市更新行动", "完整居住社区", "绿色社区", "未来社区", "数字乡村",
    "厕所革命", "四好农村路", "县域商业体系", "一刻钟便民生活圈",
    "银发经济", "冰雪经济", "赛事经济", "演艺经济", "夜经济",
    "文商旅体展", "文化探访路", "中轴线遗产保护", "正阳门", "先农坛",
    "钟鼓楼", "天坛", "颐和园", "故宫", "长城", "大运河",
    "西山永定河", "三山五园", "卢沟桥", "宛平城", "首钢园", "园博园",
    "永定河", "亮马河", "清河", "北运河", "潮白河", "温榆河",
    "一微克行动", " PM2.5", "PM2.5", "优良天数", "五大河流",
    "百万亩造林", "国家森林城市", "生物多样性", "口袋公园", "金角银边",
    "绿道", "花园城市", "公园城市", "无废城市", "垃圾分类",
    "光盘行动", "绿色出行", "慢行系统", "自行车专用路", "通勤圈"
  ];

  const state = {
    filter: "all",
    open: new Set(),
    recall: null,
    searchTimer: null,
    currentView: "home"
  };

  let progress = loadProgress();

  /* ------------------------- 基础工具 ------------------------- */

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function plain(value) {
    return String(value == null ? "" : value)
      .replace(/\*\*/g, "")
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function termDef(term) {
    return TERM_DEFS[term] || "结合材料语境理解";
  }

  function rich(value, extraTerms) {
    let text = esc(value);
    const phrases = Array.from(new Set([].concat(PROPER_NOUNS, extraTerms || [])))
      .filter(Boolean)
      .sort(function (a, b) { return b.length - a.length; });
    const stored = [];

    phrases.forEach(function (phrase) {
      if (!text || text.indexOf(phrase) === -1) return;
      const token = "\u0002" + stored.length + "\u0002";
      text = text.split(phrase).join(token);
      stored.push(phrase);
    });

    text = text.replace(/\*\*(.+?)\*\*/g, '<strong class="term">$1</strong>');
    text = text.replace(/\u0002(\d+)\u0002/g, function (_, index) {
      return '<strong class="term">' + esc(stored[Number(index)]) + "</strong>";
    });
    text = text.replace(/→/g, '<span class="arrow">→</span>');
    return text;
  }

  function tagHtml(tag) {
    return '<span class="tag ' + (TAG_CLASS[tag] || "cross") + '">' + esc(tag) + "</span>";
  }

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function subKey(themeId, subId) {
    return themeId + "/" + subId;
  }

  function getTheme(themeId) {
    return D.themes.find(function (theme) { return theme.id === themeId; });
  }

  function getSub(themeId, subId) {
    const theme = getTheme(themeId);
    if (!theme) return null;
    const sub = theme.subtopics.find(function (item) { return item.id === subId; });
    return sub ? { theme: theme, sub: sub } : null;
  }

  function allSubs() {
    const list = [];
    D.themes.forEach(function (theme, themeIndex) {
      theme.subtopics.forEach(function (sub, subIndex) {
        list.push({ theme: theme, sub: sub, themeIndex: themeIndex, subIndex: subIndex });
      });
    });
    return list;
  }

  function totalSubs() {
    return allSubs().length;
  }

  function countByTag(tag) {
    return allSubs().filter(function (item) { return item.sub.tags.indexOf(tag) !== -1; }).length;
  }

  function themeTagCount(theme, tag) {
    return theme.subtopics.filter(function (sub) { return sub.tags.indexOf(tag) !== -1; }).length;
  }

  function themeDone(theme) {
    return theme.subtopics.filter(function (sub) {
      return progress.has(subKey(theme.id, sub.id));
    }).length;
  }

  function isDone(themeId, subId) {
    return progress.has(subKey(themeId, subId));
  }

  function scrollToSubtopic(subId, smooth) {
    const el = document.getElementById("sub-" + subId);
    if (!el) return;
    const barHeight = topbar ? topbar.offsetHeight : 72;
    const top = el.getBoundingClientRect().top + window.scrollY - barHeight - 18;
    window.scrollTo({ top: top, behavior: smooth ? "smooth" : "auto" });
  }

  /* ------------------------- 进度存储 ------------------------- */

  function loadProgress() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const list = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(list) ? list : []);
    } catch (e) {
      return new Set();
    }
  }

  function saveProgress() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(Array.from(progress)));
    } catch (e) {
      /* 本地存储不可用时静默降级 */
    }
  }

  function refreshProgress() {
    const total = totalSubs();
    const done = allSubs().filter(function (item) {
      return isDone(item.theme.id, item.sub.id);
    }).length;
    const pct = total ? Math.round((done / total) * 100) : 0;

    const miniText = document.getElementById("miniProgressText");
    const miniBar = document.getElementById("miniProgressBar");
    if (miniText) miniText.textContent = done + " / " + total;
    if (miniBar) miniBar.style.width = pct + "%";

    document.querySelectorAll("[data-progress-for]").forEach(function (el) {
      const theme = getTheme(el.getAttribute("data-progress-for"));
      if (!theme) return;
      const n = themeDone(theme);
      const p = theme.subtopics.length ? Math.round((n / theme.subtopics.length) * 100) : 0;
      const bar = el.querySelector("i");
      const label = el.querySelector(".pct-text");
      if (bar) bar.style.width = p + "%";
      if (label) label.textContent = n + "/" + theme.subtopics.length;
    });

    document.querySelectorAll("[data-big-progress]").forEach(function (el) {
      const theme = getTheme(el.getAttribute("data-big-progress"));
      if (!theme) return;
      const n = themeDone(theme);
      const p = theme.subtopics.length ? Math.round((n / theme.subtopics.length) * 100) : 0;
      const count = el.querySelector("[data-big-count]");
      const bar = el.querySelector("i");
      if (count) count.textContent = n;
      if (bar) bar.style.width = p + "%";
    });

    document.querySelectorAll("input[data-done]").forEach(function (input) {
      const themeId = input.getAttribute("data-theme");
      const subId = input.getAttribute("data-sub");
      const doneNow = isDone(themeId, subId);
      input.checked = doneNow;
      const label = input.closest(".done-toggle");
      if (label) {
        label.classList.toggle("is-done", doneNow);
        const span = label.querySelector("span");
        if (span) span.textContent = doneNow ? "已掌握" : "掌握";
      }
    });

    document.querySelectorAll(".index-item[data-index-sub]").forEach(function (link) {
      const themeId = link.getAttribute("data-theme");
      const subId = link.getAttribute("data-index-sub");
      const name = link.querySelector(".name");
      if (!name) return;
      const dot = name.querySelector(".done");
      if (isDone(themeId, subId) && !dot) {
        const span = document.createElement("span");
        span.className = "done";
        name.appendChild(span);
      } else if (!isDone(themeId, subId) && dot) {
        dot.remove();
      }
    });
  }

  /* ------------------------- 路由 ------------------------- */

  function parseHash() {
    const raw = location.hash.replace(/^#\/?/, "");
    const parts = raw.split("/").filter(Boolean);
    if (!parts.length) return { view: "home" };
    if (parts[0] === "theme" && parts[1]) return { view: "theme", themeId: parts[1], subId: parts[2] || "" };
    if (parts[0] === "sub" && parts[1] && parts[2]) return { view: "theme", themeId: parts[1], subId: parts[2] };
    if (parts[0] === "exam") return { view: "exam" };
    if (parts[0] === "highlights") return { view: "highlights" };
    return { view: "home" };
  }

  function go(hash) {
    if (location.hash === hash) {
      route();
    } else {
      location.hash = hash;
    }
  }

  function route() {
    const r = parseHash();
    state.currentView = r.view;
    closeSearch();
    closeRecall();
    closeMenu();

    if (r.view === "theme") {
      renderTheme(r.themeId, r.subId);
    } else if (r.view === "exam") {
      renderExam();
    } else if (r.view === "highlights") {
      renderHighlights();
    } else {
      renderHome();
    }
    updateNav(r.view);
  }

  function updateNav(view) {
    document.querySelectorAll("[data-nav]").forEach(function (link) {
      const key = link.getAttribute("data-nav");
      const active = view === "theme" ? key === "home" : key === view;
      link.classList.toggle("is-active", active);
    });
  }

  /* ------------------------- 首页 ------------------------- */

  function renderHome() {
    document.title = "申论经纬 · 五位一体备考图谱";
    const total = totalSubs();
    const cases = allSubs().reduce(function (sum, item) { return sum + item.sub.cases.length; }, 0);
    const quotes = allSubs().reduce(function (sum, item) { return sum + item.sub.quotes.length; }, 0);
    const compass = [
      { id: "economy", name: "经济", no: "一" },
      { id: "politics", name: "政治", no: "二" },
      { id: "culture", name: "文化", no: "三" },
      { id: "society", name: "社会", no: "四" },
      { id: "ecology", name: "生态", no: "五" }
    ];

    app.innerHTML = `
      <section class="hero">
        <div class="wrap">
          <div class="hero-copy">
            <div class="hero-kicker"><span class="line"></span><span>2027 国考 · 京考 · 申论备考</span></div>
            <h1>五位一体<span class="red">。</span><span class="sub">一张能带进考场的<em>申论地图</em></span></h1>
            <p class="hero-lead">不按“热点”堆素材，而按“考点”建结构。五个板块、八个专题、${total} 个子主题，每个主题拆成观点逻辑、规范词、金句、案例四件套，并标清国考高频、京考高频、京考独有与行政执法卷。</p>
            <div class="hero-actions">
              <a class="btn cinnabar" href="#map">进入主题地图 <span aria-hidden="true">↘</span></a>
              <button class="btn ghost" type="button" id="randomRecallBtn">随机抽背 <span aria-hidden="true">↻</span></button>
            </div>
            <div class="hero-stats">
              <div class="hero-stat"><strong>${total}</strong><span>子主题</span></div>
              <div class="hero-stat"><strong>${cases}</strong><span>精炼案例</span></div>
              <div class="hero-stat"><strong>${quotes}</strong><span>点睛金句</span></div>
              <div class="hero-stat"><strong>8</strong><span>主题板块</span></div>
            </div>
          </div>

          <div class="hero-compass" aria-label="五位一体主题罗盘">
            <div class="compass-ring"></div>
            <div class="compass-axis x"></div>
            <div class="compass-axis y"></div>
            <div class="compass-center"><div><strong>五位一体</strong><span>备考罗盘</span></div></div>
            ${compass.map(function (item, index) {
              return `<a class="compass-node n${index + 1}" href="#/theme/${item.id}"><i style="background:${getTheme(item.id).accent}">${item.no}</i><b>${item.name}建设</b></a>`;
            }).join("")}
            <span class="compass-note">国考 · 京考 · 执法卷</span>
          </div>
        </div>
      </section>

      <section class="exam-strip">
        <div class="wrap exam-strip-inner">
          <a class="exam-card" href="#/exam">
            <span class="num">01 / 国考</span>
            <h3>三类卷，三种能力</h3>
            <p>副省级重综合分析与宏观思辨；地市级重贯彻执行与解决问题；行政执法卷重依法办事与公共服务。</p>
            <span class="arrow">→</span>
          </a>
          <a class="exam-card" href="#/exam">
            <span class="num">02 / 京考</span>
            <h3>一张卷，首都味</h3>
            <p>2027 年京考申论仍为一张卷、150 分钟；偏爱公共服务、城市治理、经济创新与统一大市场。</p>
            <span class="arrow">→</span>
          </a>
          <a class="exam-card" href="#/theme/enforcement">
            <span class="num">03 / 执法卷</span>
            <h3>场景里考法治</h3>
            <p>不背法条，考执法方式、群众工作、公文写作与“法理情”统一；与京考执法岗面试素材相通。</p>
            <span class="arrow">→</span>
          </a>
        </div>
      </section>

      <section class="map-section" id="map">
        <div class="wrap">
          <div class="section-head">
            <div>
              <span class="eyebrow">THE MAP</span>
              <h2>八张主题地图<small>由面到点，逐层拆解</small></h2>
            </div>
            <p>先建立“五位一体”的骨架，再进入子主题背逻辑、换词句。标注不是装饰：它决定你上考场先写哪一段。</p>
          </div>
          ${renderFilterBar()}
          ${state.filter === "all" ? renderThemeGrid() : renderFilterResults()}
          ${renderRoutes()}
        </div>
      </section>
    `;
    refreshProgress();
  }

  function renderFilterBar() {
    return `
      <div class="filter-bar" id="filterBar">
        <span class="filter-label">筛选</span>
        ${FILTERS.map(function (filter) {
          const count = filter.id === "all" ? totalSubs() : countByTag(filter.id);
          return `<button class="filter-chip ${state.filter === filter.id ? "is-active" : ""}" type="button" data-filter="${filter.id}">${filter.label}<span class="count">${count}</span></button>`;
        }).join("")}
        <span class="filter-spacer"></span>
        <span class="filter-tip">“京考独有”是北京特色设问，不是国考完全不考</span>
      </div>
    `;
  }

  function renderThemeGrid() {
    return `
      <div class="theme-grid">
        ${D.themes.map(function (theme, index) {
          const done = themeDone(theme);
          const pct = theme.subtopics.length ? Math.round((done / theme.subtopics.length) * 100) : 0;
          return `
            <a class="theme-card" href="#/theme/${theme.id}" style="--accent:${theme.accent}">
              <span class="watermark" aria-hidden="true">${theme.no}</span>
              <div class="theme-top">
                <span class="theme-no">${pad2(index + 1)} · ${theme.no}</span>
                <span class="theme-icon">${theme.icon}</span>
              </div>
              <h3>${theme.name}</h3>
              <span class="theme-kicker">${theme.kicker}</span>
              <p class="theme-desc">${theme.intro}</p>
              <div class="theme-bottom">
                <span class="theme-count"><b>${theme.subtopics.length}</b> 个子主题</span>
                <span class="theme-progress" data-progress-for="${theme.id}">
                  <span class="bar"><i style="width:${pct}%"></i></span>
                  <span class="pct-text">${done}/${theme.subtopics.length}</span>
                </span>
              </div>
              <span class="theme-open" aria-hidden="true">↗</span>
            </a>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderFilterResults() {
    const filter = FILTERS.find(function (item) { return item.id === state.filter; }) || FILTERS[0];
    const matched = allSubs().filter(function (item) {
      return item.sub.tags.indexOf(state.filter) !== -1;
    });
    const grouped = D.themes.map(function (theme) {
      return {
        theme: theme,
        subs: matched.filter(function (item) { return item.theme.id === theme.id; })
      };
    }).filter(function (group) { return group.subs.length; });

    return `
      <div class="results-view">
        <div class="results-head">
          <div>
            <h3>“${filter.label}” <span>${matched.length}</span> 个子主题</h3>
            <p>按主题板块归类；点击任意一行进入并自动展开。</p>
          </div>
          <button class="btn ghost small" type="button" data-filter="all">清除筛选</button>
        </div>
        ${grouped.map(function (group) {
          return `
            <div class="results-group" style="--accent:${group.theme.accent}">
              <h4 class="results-group-title"><i></i>${group.theme.name}<small>${group.subs.length} 个匹配</small></h4>
              ${group.subs.map(function (item) {
                return `
                  <a class="result-row" href="#/sub/${item.theme.id}/${item.sub.id}">
                    <span class="idx">${pad2(item.subIndex + 1)}</span>
                    <span><span class="name">${item.sub.title}</span><span class="tags">${item.sub.tags.map(tagHtml).join("")}</span></span>
                    <span class="line">${plain(item.sub.oneLine)}</span>
                    <span class="go" aria-hidden="true">→</span>
                  </a>
                `;
              }).join("")}
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderRoutes() {
    return `
      <section class="routes">
        <div class="routes-head">
          <h3>三条背诵线</h3>
          <a class="text-btn" href="#/highlights">查看高频速查</a>
        </div>
        <div class="route-grid">
          <div class="route-card">
            <span class="route-type">国考线 · 综合管理</span>
            <h4>从“宏观”到“落地”</h4>
            <p>先背经济、文化、生态的宏观判断，再用基层治理、民生、执法补“落地段”。</p>
            <div class="route-steps"><span>经济</span><span>政治</span><span>文化</span><span>社会</span><span>生态</span></div>
          </div>
          <div class="route-card">
            <span class="route-type">京考线 · 首都特色</span>
            <h4>从“首都”到“民生”</h4>
            <p>京考偏爱公共服务与城市治理。先把接诉即办、城市更新、中轴线背熟，再回填五位一体。</p>
            <div class="route-steps"><span>首都特色</span><span>接诉即办</span><span>城市更新</span><span>文化</span><span>生态</span></div>
          </div>
          <div class="route-card">
            <span class="route-type">执法线 · 行政执法卷</span>
            <h4>从“规范”到“为民”</h4>
            <p>执法卷的核心不是法条，而是“依法办事 + 公共服务”。按办案流程背，答题自然有层次。</p>
            <div class="route-steps"><span>规范执法</span><span>三项制度</span><span>柔性执法</span><span>枫桥经验</span><span>信用监管</span></div>
          </div>
        </div>
      </section>
    `;
  }

  /* ------------------------- 主题详情 ------------------------- */

  function renderTheme(themeId, subId) {
    const theme = getTheme(themeId);
    if (!theme) {
      renderNotFound();
      return;
    }
    if (subId) state.open.add(subId);

    document.title = theme.name + " · 申论经纬";
    const done = themeDone(theme);
    const pct = theme.subtopics.length ? Math.round((done / theme.subtopics.length) * 100) : 0;
    const metaTags = ["国考高频", "京考高频", "京考独有", "执法卷"].map(function (tag) {
      const n = themeTagCount(theme, tag);
      return n ? `<span class="meta">${tag} ${n}</span>` : "";
    }).join("");

    app.innerHTML = `
      <div class="theme-page" style="--accent:${theme.accent}">
        <div class="wrap">
          <nav class="breadcrumb" aria-label="面包屑">
            <a href="#/">主题地图</a><span class="sep">/</span><span>${theme.name}</span>
          </nav>

          <header class="theme-hero" data-mark="${theme.no}">
            <div>
              <span class="eyebrow">${theme.kicker}</span>
              <h1>${theme.name}</h1>
              <p class="theme-sub">${rich(theme.intro)}</p>
              <div class="theme-meta-row">${metaTags}<span class="meta">共 ${theme.subtopics.length} 个子主题</span></div>
            </div>
            <div class="theme-hero-side">
              <div class="theme-big-progress" data-big-progress="${theme.id}">
                <strong><span data-big-count>${done}</span><small style="font-size:14px;color:var(--ink-4)"> / ${theme.subtopics.length}</small></strong>
                <span>已掌握子主题</span>
                <div class="bar"><i style="width:${pct}%"></i></div>
              </div>
              <button class="btn ghost small" type="button" id="randomRecallBtn">随机抽背</button>
            </div>
          </header>

          <div class="theme-body">
            <aside class="theme-index">
              <div class="theme-index-title">
                <b>本专题索引</b>
                <button class="index-toggle" type="button" data-index-toggle aria-expanded="false">展开</button>
                <span>${theme.subtopics.length} 讲</span>
              </div>
              <ol class="index-list">
                ${theme.subtopics.map(function (sub, index) {
                  const isOpen = state.open.has(sub.id);
                  return `<li><a class="index-item ${isOpen ? "is-active" : ""}" href="#/sub/${theme.id}/${sub.id}" data-index-link="${sub.id}" data-theme="${theme.id}" data-index-sub="${sub.id}"><span class="idx">${pad2(index + 1)}</span><span class="name">${sub.title}${isDone(theme.id, sub.id) ? '<span class="done"></span>' : ""}</span></a></li>`;
                }).join("")}
              </ol>
              <div class="index-tip"><b>用法：</b>先看“观点逻辑”搭骨架，再用“规范词”换表达，最后用金句、案例填充血肉。</div>
            </aside>

            <div class="theme-content">
              <div class="content-toolbar">
                <button class="btn ghost small" type="button" data-action="expand-all">全部展开</button>
                <button class="btn ghost small" type="button" data-action="collapse-all">全部收起</button>
                <button class="btn ghost small" type="button" data-action="print-theme">打印本页</button>
                <span class="toolbar-note">点击标题展开；勾选“已掌握”记录进度</span>
              </div>
              ${theme.subtopics.map(function (sub, index) {
                return renderSubtopic(theme, sub, index);
              }).join("")}
            </div>
          </div>

          ${renderPager(theme)}
        </div>
      </div>
    `;

    refreshProgress();

    if (subId) {
      window.setTimeout(function () {
        const el = document.getElementById("sub-" + subId);
        if (el) {
          el.classList.add("is-open");
          const button = el.querySelector("[data-toggle-sub]");
          if (button) button.setAttribute("aria-expanded", "true");
          scrollToSubtopic(subId, false);
        }
      }, 80);
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }

  function renderSubtopic(theme, sub, index) {
    const open = state.open.has(sub.id);
    const done = isDone(theme.id, sub.id);
    const number = pad2(index + 1);

    return `
      <section class="subtopic ${open ? "is-open" : ""}" id="sub-${sub.id}" data-sub-section="${sub.id}" data-theme="${theme.id}" style="--accent:${theme.accent}">
        <div class="subtopic-head">
          <button class="subtopic-toggle" type="button" data-toggle-sub aria-expanded="${open}" aria-controls="panel-${sub.id}">
            <span class="subtopic-no">${number}</span>
            <span class="subtopic-main">
              <span class="subtopic-title-row">
                <span class="subtopic-title">${sub.title}</span>
                <span class="subtopic-tags">${sub.tags.map(tagHtml).join("")}</span>
              </span>
              <span class="subtopic-one">${rich(sub.oneLine, sub.terms)}</span>
            </span>
          </button>
          <div class="subtopic-side">
            <label class="done-toggle ${done ? "is-done" : ""}" title="标记为已掌握">
              <input type="checkbox" data-done data-theme="${theme.id}" data-sub="${sub.id}" ${done ? "checked" : ""} />
              <span>${done ? "已掌握" : "掌握"}</span>
            </label>
            <span class="subtopic-chevron" aria-hidden="true">
              <svg viewBox="0 0 16 16"><path d="M3 6l5 5 5-5"></path></svg>
            </span>
          </div>
        </div>

        <div class="subtopic-panel" id="panel-${sub.id}">
          <div class="subtopic-panel-inner">
            <div class="subtopic-panel-pad">
              <p class="exam-note"><b>考法定位：</b>${rich(sub.exam, sub.terms)}</p>

              <div class="detail-grid">
                <div class="detail-col">
                  <div class="block">
                    <div class="block-head"><span class="dot"></span><h4>观点逻辑</h4><span class="en">ARGUMENT</span></div>
                    <ol class="logic-list">
                      ${sub.logic.map(function (item) {
                        return `<li class="logic-item"><span class="logic-label">${item.label}</span><span class="logic-text">${rich(item.text, sub.terms)}</span></li>`;
                      }).join("")}
                    </ol>
                  </div>

                  <div class="block">
                    <div class="block-head"><span class="dot"></span><h4>常考规范词</h4><span class="en">TERMS</span><button class="term-toggle" type="button" data-term-toggle aria-expanded="true">收起释义</button></div>
                    <div class="term-list">
                      ${sub.terms.map(function (term) {
                        return `<button class="term-item copyable" type="button" data-copy="${esc(term)}" title="点击复制">
                          <span class="term-name">${rich(term)}</span>
                          <span class="term-def">${rich(termDef(term))}</span>
                        </button>`;
                      }).join("")}
                    </div>
                  </div>
                </div>

                <div class="detail-col">
                  <div class="block">
                    <div class="block-head"><span class="dot"></span><h4>点睛金句</h4><span class="en">QUOTES</span></div>
                    <ul class="quote-list">
                      ${sub.quotes.map(function (quote) {
                        return `<li class="quote-item"><p class="quote-text">${rich(quote.t, sub.terms)}</p><span class="quote-from">—— ${quote.f}</span></li>`;
                      }).join("")}
                    </ul>
                  </div>

                  <div class="block">
                    <div class="block-head"><span class="dot"></span><h4>精炼案例</h4><span class="en">CASES</span></div>
                    <div class="case-list">
                      ${sub.cases.map(function (item, caseIndex) {
                        return `
                          <article class="case-card">
                            <div class="case-top">
                              <span class="case-label">案例 ${pad2(caseIndex + 1)} · 可直接入文</span>
                              <button class="copy-case" type="button" data-copy="${esc(item.t)}">复制</button>
                            </div>
                            <p class="case-text">${rich(item.t, sub.terms)}</p>
                            <span class="case-source">来源：${item.s}</span>
                          </article>
                        `;
                      }).join("")}
                    </div>
                    <div class="case-tip">写法提示：主体 + 做了什么 + 取得什么效果，控制在 20—40 字；不要把“背景”写进案例。</div>
                  </div>
                </div>
              </div>

              <div class="cross-note"><b>交叉提示</b><span>${rich(sub.note, sub.terms)}</span></div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderPager(theme) {
    const index = D.themes.findIndex(function (item) { return item.id === theme.id; });
    const prev = index > 0 ? D.themes[index - 1] : D.themes[D.themes.length - 1];
    const next = index < D.themes.length - 1 ? D.themes[index + 1] : D.themes[0];
    return `
      <nav class="theme-pager" aria-label="专题翻页">
        <a class="pager-link prev" href="#/theme/${prev.id}"><span>← 上一个专题</span><strong>${prev.name}</strong></a>
        <a class="pager-link next" href="#/theme/${next.id}"><span>下一个专题 →</span><strong>${next.name}</strong></a>
      </nav>
    `;
  }

  /* ------------------------- 三卷坐标 ------------------------- */

  function renderExam() {
    document.title = "三卷坐标 · 申论经纬";
    app.innerHTML = `
      <div class="doc-page">
        <div class="wrap">
          <header class="doc-head">
            <span class="eyebrow">EXAM COORDINATES</span>
            <h1>先弄清卷子，<br />再背素材。</h1>
            <p>同样是申论，国考三类卷的能力要求、题型重心、语言风格并不一样；京考又是一张卷。把“卷子坐标”搞清，才知道同一个主题该往哪个方向写。</p>
          </header>

          <div class="callout">
            <h3>一个容易混淆的点</h3>
            <p><strong>国考</strong>自 2022 年起将行政执法类职位单独命题，形成“副省级综合管理、地市级综合管理、行政执法”三类卷。<strong>京考</strong>公共科目申论不单独分执法卷，2027 年大纲仍只设一张申论卷；执法类岗位的面试、专业能力测试可能涉及执法场景，因此本图谱的“执法卷”内容以国考为主，京考执法岗可作面试素材。</p>
          </div>

          <table class="exam-table">
            <thead>
              <tr><th>试卷</th><th>能力测查</th><th>命题偏好</th><th>备考重点</th></tr>
            </thead>
            <tbody>
              <tr>
                <td class="paper-name"><strong>国考 · 副省级综合管理</strong></td>
                <td>阅读理解、综合分析、提出和解决问题、文字表达</td>
                <td>宏观政策、发展理念、关系型思辨；材料跨度大，重“分析深度”</td>
                <td>五位一体框架、政策语言、辩证分析；大作文要有“高度 + 层次”</td>
              </tr>
              <tr>
                <td class="paper-name"><strong>国考 · 地市级综合管理</strong></td>
                <td>阅读理解、贯彻执行、解决问题、文字表达</td>
                <td>基层治理、民生服务、乡村振兴；应用文与对策题比重高</td>
                <td>把“对策”写具体：主体、对象、方式、保障；多练讲话稿、短评、汇报</td>
              </tr>
              <tr>
                <td class="paper-name"><strong>国考 · 行政执法</strong></td>
                <td>阅读理解、依法办事、公共服务、文字表达</td>
                <td>执法场景、群众工作、执法方式转变、政务运行；重“依法 + 为民”</td>
                <td>执法流程、三项制度、柔性执法、枫桥经验；作文落点写“执法为民”</td>
              </tr>
              <tr>
                <td class="paper-name"><strong>京考 · 申论（一张卷）</strong></td>
                <td>阅读理解、综合分析、提出和解决问题、文字表达</td>
                <td>首都治理、公共服务、民生、经济创新、统一大市场；材料贴近北京</td>
                <td>接诉即办、城市更新、中轴线、两区、花园城市；会用北京数据</td>
              </tr>
            </tbody>
          </table>

          <h2 style="font-family:var(--serif);font-size:25px;letter-spacing:.05em;margin:0 0 4px;">五个标注，五种用法</h2>
          <p style="margin:0 0 14px;font-size:11px;color:var(--ink-4);">标签可以叠加：一个主题可能同时是国考高频、京考高频和交叉考点。</p>
          <div class="legend-grid">
            <div class="legend-card"><span class="tag gk">国考高频</span><p>国考近年的高频主题或高频设问，优先背“观点逻辑 + 规范词”。</p></div>
            <div class="legend-card"><span class="tag jk">京考高频</span><p>京考材料、题目反复出现的方向，优先背“北京数据 + 北京案例”。</p></div>
            <div class="legend-card"><span class="tag unique">京考独有</span><p>北京特有的制度品牌、地名、政策，国考一般不会直接考，但可迁移。</p></div>
            <div class="legend-card"><span class="tag law">执法卷</span><p>国考行政执法卷的专属素材；京考不单独分卷，可用于执法岗面试。</p></div>
            <div class="legend-card"><span class="tag cross">交叉</span><p>可同时服务两个以上母主题，考场上用来“搭桥”，避免一段只写一个维度。</p></div>
          </div>

          ${renderRoutes()}

          <div class="callout" style="margin-top:34px;">
            <h3>建议的使用顺序</h3>
            <p><strong>第一步：</strong>用“三卷坐标”确定主攻卷种。<strong>第二步：</strong>按“三条背诵线”过一遍母主题，先背观点逻辑，不急着背案例。<strong>第三步：</strong>用“高频速查”筛出 15—20 个必背子主题，每个主题做到“能讲 3 层逻辑、能写 8 个规范词、能默 2 个案例”。<strong>第四步：</strong>考前两周只用“随机抽背”做输出训练。</p>
          </div>

          <h2 style="font-family:var(--serif);font-size:25px;letter-spacing:.05em;margin:36px 0 4px;">资料来源</h2>
          <p style="margin:0 0 12px;font-size:11px;color:var(--ink-4);">优先采用官方大纲、政府工作报告、人大常委会调研报告与权威媒体；机构回忆版仅用于观察命题趋势。</p>
          ${renderSources()}
        </div>
      </div>
    `;
    refreshProgress();
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  /* ------------------------- 高频速查 ------------------------- */

  function renderHighlights() {
    document.title = "高频速查 · 申论经纬";
    const groups = [
      { tag: "国考高频", title: "国考高频", note: "按热度排序，建议先背前 12 个", limit: 12 },
      { tag: "京考高频", title: "京考高频", note: "首都治理与公共服务是主战场", limit: 12 },
      { tag: "京考独有", title: "京考独有", note: "北京特色制度与地名，考场上的“辨识度”", limit: 12 },
      { tag: "执法卷", title: "行政执法卷", note: "国考执法卷的八个核心场景", limit: 12 },
      { tag: "交叉", title: "交叉考点", note: "能同时服务多个母主题，作文里的“万能桥”", limit: 12 }
    ];

    app.innerHTML = `
      <div class="doc-page">
        <div class="wrap">
          <header class="doc-head">
            <span class="eyebrow">QUICK REVIEW</span>
            <h1>高频速查</h1>
            <p>不是“押题”，而是把最常被反复调用的主题挑出来，按热度排一个背诵优先级。每个主题只保留一句核心判断，点进去看完整四件套。</p>
          </header>

          <div class="callout">
            <h3>怎么用这张表</h3>
            <p>先横向扫一遍“核心判断”，能用自己的话复述的，说明骨架有了；复述不出来的，点进去只看“观点逻辑”。第二遍再回来，用“规范词”替换口语，用“案例”替换空话。</p>
          </div>

          ${groups.map(function (group) {
            const items = allSubs()
              .filter(function (item) { return item.sub.tags.indexOf(group.tag) !== -1; })
              .sort(function (a, b) {
                return (b.sub.heat || 0) - (a.sub.heat || 0) || a.themeIndex - b.themeIndex;
              })
              .slice(0, group.limit);
            if (!items.length) return "";
            return `
              <section class="highlight-section" style="--accent:${group.tag === "执法卷" ? "#34535f" : "#a8452f"}">
                <h2>${group.title}<small>${group.note}</small></h2>
                <div class="highlight-list">
                  ${items.map(function (item, index) {
                    return `
                      <a class="highlight-row" href="#/sub/${item.theme.id}/${item.sub.id}" style="--accent:${item.theme.accent}">
                        <span class="rank">${pad2(index + 1)}</span>
                        <span class="h-name">${item.sub.title}<small>${item.theme.name}</small></span>
                        <span class="h-line">${plain(item.sub.oneLine)}</span>
                        <span class="h-heat" aria-label="热度 ${item.sub.heat}">${[1,2,3,4,5].map(function (n) { return `<i class="${n <= item.sub.heat ? "on" : ""}"></i>`; }).join("")}</span>
                      </a>
                    `;
                  }).join("")}
                </div>
              </section>
            `;
          }).join("")}

          <h2 style="font-family:var(--serif);font-size:25px;letter-spacing:.05em;margin:36px 0 4px;">资料来源</h2>
          <p style="margin:0 0 12px;font-size:11px;color:var(--ink-4);">所有案例均可在文末所列官方或权威公开来源中检索；机构回忆版仅用于命题趋势判断。</p>
          ${renderSources()}
        </div>
      </div>
    `;
    refreshProgress();
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function renderSources() {
    return `
      <ul class="source-list">
        ${D.meta.sources.map(function (source) {
          return `<li class="source-item"><a href="${esc(source.url)}" target="_blank" rel="noopener">${esc(source.label)}</a><em>${esc(source.note)}</em><span>公开来源</span></li>`;
        }).join("")}
      </ul>
      <p style="margin:14px 0 0;font-size:10px;line-height:1.8;color:var(--ink-4);">说明：政策数据以官方发布为准；部分案例为公开报道的概括转述，考场引用时不必逐字复述，但人物、地点、做法、效果不能编造。</p>
    `;
  }

  function renderNotFound() {
    document.title = "未找到 · 申论经纬";
    app.innerHTML = `
      <div class="doc-page"><div class="wrap">
        <header class="doc-head"><span class="eyebrow">404</span><h1>这一页走丢了</h1><p>你访问的主题不存在，回到主题地图重新选择。</p></header>
        <a class="btn cinnabar" href="#/">回到主题地图</a>
      </div></div>
    `;
  }

  /* ------------------------- 搜索 ------------------------- */

  function openSearch() {
    const overlay = document.getElementById("searchOverlay");
    const input = document.getElementById("searchInput");
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    renderSearch("");
    window.setTimeout(function () { input.focus(); input.select(); }, 30);
  }

  function closeSearch() {
    const overlay = document.getElementById("searchOverlay");
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    if (!document.getElementById("recallOverlay") || document.getElementById("recallOverlay").hidden) {
      document.body.style.overflow = "";
    }
  }

  function searchHaystack(item) {
    const sub = item.sub;
    return [
      sub.title,
      sub.oneLine,
      sub.exam,
      sub.terms.join(" "),
      sub.terms.map(function (term) { return term + " " + termDef(term); }).join(" "),
      sub.quotes.map(function (q) { return q.t + " " + q.f; }).join(" "),
      sub.cases.map(function (c) { return c.t + " " + c.s; }).join(" "),
      sub.cross,
      sub.note,
      sub.tags.join(" "),
      item.theme.name
    ].join(" ");
  }

  function searchSnippet(item, query) {
    const sub = item.sub;
    const fields = [sub.oneLine, sub.exam].concat(
      sub.cases.map(function (c) { return c.t; }),
      sub.quotes.map(function (q) { return q.t; }),
      sub.terms.map(function (term) { return term + "：" + termDef(term); }),
      [sub.note]
    );
    if (!query) return plain(sub.oneLine);
    const q = query.toLowerCase();
    const found = fields.find(function (field) { return String(field).toLowerCase().indexOf(q) !== -1; });
    return plain(found || sub.oneLine);
  }

  function highlightQuery(text, query) {
    const safe = esc(text);
    if (!query) return safe;
    try {
      return safe.replace(new RegExp("(" + escapeRegExp(query) + ")", "gi"), "<mark>$1</mark>");
    } catch (e) {
      return safe;
    }
  }

  function renderSearch(query) {
    const results = document.getElementById("searchResults");
    if (!results) return;
    const q = String(query || "").trim();
    let items;

    if (!q) {
      items = allSubs()
        .sort(function (a, b) { return (b.sub.heat || 0) - (a.sub.heat || 0); })
        .slice(0, 8);
    } else {
      const lower = q.toLowerCase();
      items = allSubs()
        .map(function (item) {
          const haystack = searchHaystack(item).toLowerCase();
          if (haystack.indexOf(lower) === -1) return null;
          let score = 0;
          if (item.sub.title.toLowerCase().indexOf(lower) !== -1) score += 20;
          if (item.sub.terms.some(function (term) {
            return term.toLowerCase().indexOf(lower) !== -1 || termDef(term).toLowerCase().indexOf(lower) !== -1;
          })) score += 10;
          if (item.sub.oneLine.toLowerCase().indexOf(lower) !== -1) score += 6;
          if (item.sub.cases.some(function (c) { return c.t.toLowerCase().indexOf(lower) !== -1; })) score += 4;
          if (item.sub.quotes.some(function (quote) { return quote.t.toLowerCase().indexOf(lower) !== -1; })) score += 3;
          score += (item.sub.heat || 0);
          return { item: item, score: score };
        })
        .filter(Boolean)
        .sort(function (a, b) { return b.score - a.score; })
        .slice(0, 30)
        .map(function (entry) { return entry.item; });
    }

    if (!items.length) {
      results.innerHTML = `<div class="search-empty">没有找到“${esc(q)}”。试试“接诉即办”“枫桥经验”“一老一小”，或换一个更短的关键词。</div>`;
      return;
    }

    if (!q) {
      results.innerHTML = `<div class="search-group-label">高频主题 · 不知道搜什么就先看这些</div>` + items.map(function (item) {
        return searchResultHtml(item, q);
      }).join("");
      return;
    }

    const groups = D.themes.map(function (theme) {
      return {
        theme: theme,
        items: items.filter(function (item) { return item.theme.id === theme.id; })
      };
    }).filter(function (group) { return group.items.length; });
    groups.sort(function (a, b) {
      return items.indexOf(a.items[0]) - items.indexOf(b.items[0]);
    });

    results.innerHTML = groups.map(function (group) {
      return `<div class="search-group-label">${group.theme.name} · ${group.items.length}</div>` +
        group.items.map(function (item) { return searchResultHtml(item, q); }).join("");
    }).join("");
  }

  function searchResultHtml(item, query) {
    return `
      <button class="search-result" type="button" data-search-href="#/sub/${item.theme.id}/${item.sub.id}">
        <b>${highlightQuery(item.sub.title, query)}</b>
        <span>${highlightQuery(searchSnippet(item, query), query)}</span>
      </button>
    `;
  }

  /* ------------------------- 随机抽背 ------------------------- */

  function openRecall() {
    const list = allSubs();
    if (!list.length) return;
    state.recall = list[Math.floor(Math.random() * list.length)];
    const overlay = document.getElementById("recallOverlay");
    const themeEl = document.getElementById("recallTheme");
    const titleEl = document.getElementById("recallTitle");
    const questionEl = document.getElementById("recallQuestion");
    themeEl.textContent = state.recall.theme.name + " · " + state.recall.sub.tags.join(" / ");
    titleEl.textContent = state.recall.sub.title;
    questionEl.textContent = state.recall.sub.exam;
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeRecall() {
    const overlay = document.getElementById("recallOverlay");
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    if (!document.getElementById("searchOverlay") || document.getElementById("searchOverlay").hidden) {
      document.body.style.overflow = "";
    }
  }

  function recallAgain() {
    closeRecall();
    window.setTimeout(openRecall, 40);
  }

  /* ------------------------- 复制 / 提示 ------------------------- */

  let toastTimer = null;
  function toast(message) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("is-show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      el.classList.remove("is-show");
    }, 1800);
  }

  function copyText(text) {
    const value = String(text || "");
    if (!value) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value).then(function () {
        toast("已复制：" + (value.length > 22 ? value.slice(0, 22) + "…" : value));
      }).catch(function () {
        fallbackCopy(value);
      });
    } else {
      fallbackCopy(value);
    }
  }

  function fallbackCopy(value) {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      toast("已复制");
    } catch (e) {
      toast("复制失败，请手动选择");
    }
    textarea.remove();
  }

  /* ------------------------- 菜单 / 顶栏 ------------------------- */

  function closeMenu() {
    const nav = document.querySelector(".topnav");
    const button = document.querySelector(".menu-btn");
    if (nav) nav.classList.remove("is-open");
    if (button) button.setAttribute("aria-expanded", "false");
  }

  function toggleMenu() {
    const nav = document.querySelector(".topnav");
    const button = document.querySelector(".menu-btn");
    if (!nav || !button) return;
    const open = nav.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(open));
  }

  /* ------------------------- 事件绑定 ------------------------- */

  function bindEvents() {
    document.addEventListener("click", function (event) {
      const target = event.target;

      const filterButton = target.closest("[data-filter]");
      if (filterButton) {
        state.filter = filterButton.getAttribute("data-filter");
        if (parseHash().view === "home") {
          renderHome();
          document.getElementById("map").scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          go("#/");
        }
        return;
      }

      const indexToggle = target.closest("[data-index-toggle]");
      if (indexToggle) {
        const aside = indexToggle.closest(".theme-index");
        if (!aside) return;
        const open = aside.classList.toggle("is-open");
        indexToggle.setAttribute("aria-expanded", String(open));
        indexToggle.textContent = open ? "收起" : "展开";
        return;
      }

      const toggle = target.closest("[data-toggle-sub]");
      if (toggle) {
        const section = toggle.closest(".subtopic");
        if (!section) return;
        const subId = section.getAttribute("data-sub-section");
        const themeId = section.getAttribute("data-theme");
        const opening = !section.classList.contains("is-open");
        section.classList.toggle("is-open", opening);
        toggle.setAttribute("aria-expanded", String(opening));
        if (opening) {
          state.open.add(subId);
          const indexLink = document.querySelector('.index-item[data-theme="' + themeId + '"][data-index-sub="' + subId + '"]');
          if (indexLink) indexLink.classList.add("is-active");
        } else {
          state.open.delete(subId);
          const indexLink = document.querySelector('.index-item[data-theme="' + themeId + '"][data-index-sub="' + subId + '"]');
          if (indexLink) indexLink.classList.remove("is-active");
        }
        return;
      }

      const indexLink = target.closest("[data-index-link]");
      if (indexLink) {
        event.preventDefault();
        const subId = indexLink.getAttribute("data-index-link");
        state.open.add(subId);
        const section = document.getElementById("sub-" + subId);
        if (section) {
          section.classList.add("is-open");
          const button = section.querySelector("[data-toggle-sub]");
          if (button) button.setAttribute("aria-expanded", "true");
          document.querySelectorAll(".index-item").forEach(function (link) {
            link.classList.toggle("is-active", link === indexLink);
          });
          scrollToSubtopic(subId, true);
        }
        return;
      }

      const termToggle = target.closest("[data-term-toggle]");
      if (termToggle) {
        const block = termToggle.closest(".block");
        const list = block ? block.querySelector(".term-list") : null;
        if (!list) return;
        const compact = list.classList.toggle("is-compact");
        termToggle.textContent = compact ? "展开释义" : "收起释义";
        termToggle.setAttribute("aria-expanded", String(!compact));
        return;
      }

      const copyButton = target.closest("[data-copy]");
      if (copyButton) {
        event.preventDefault();
        event.stopPropagation();
        copyText(copyButton.getAttribute("data-copy"));
        return;
      }

      const action = target.closest("[data-action]");
      if (action) {
        const type = action.getAttribute("data-action");
        if (type === "expand-all") {
          document.querySelectorAll(".subtopic").forEach(function (section) {
            section.classList.add("is-open");
            state.open.add(section.getAttribute("data-sub-section"));
            const button = section.querySelector("[data-toggle-sub]");
            if (button) button.setAttribute("aria-expanded", "true");
          });
          document.querySelectorAll(".index-item").forEach(function (link) { link.classList.add("is-active"); });
          toast("已展开本专题");
        } else if (type === "collapse-all") {
          document.querySelectorAll(".subtopic").forEach(function (section) {
            section.classList.remove("is-open");
            state.open.delete(section.getAttribute("data-sub-section"));
            const button = section.querySelector("[data-toggle-sub]");
            if (button) button.setAttribute("aria-expanded", "false");
          });
          document.querySelectorAll(".index-item").forEach(function (link) { link.classList.remove("is-active"); });
          toast("已收起本专题");
        } else if (type === "print-theme") {
          window.print();
        }
        return;
      }

      const searchResult = target.closest("[data-search-href]");
      if (searchResult) {
        const href = searchResult.getAttribute("data-search-href");
        closeSearch();
        go(href);
        return;
      }

      const jump = target.closest("[data-search-jump]");
      if (jump) {
        const input = document.getElementById("searchInput");
        input.value = jump.getAttribute("data-search-jump");
        renderSearch(input.value);
        input.focus();
        return;
      }

      if (target.closest("#randomRecallBtn") || target.closest("[data-random]")) {
        openRecall();
        return;
      }

      if (target.id === "searchOverlay") closeSearch();
      if (target.id === "recallOverlay") closeRecall();
    });

    document.addEventListener("change", function (event) {
      const input = event.target;
      if (!input.matches("input[data-done]")) return;
      const themeId = input.getAttribute("data-theme");
      const subId = input.getAttribute("data-sub");
      const key = subKey(themeId, subId);
      if (input.checked) {
        progress.add(key);
        toast("已标记掌握");
      } else {
        progress.delete(key);
        toast("已取消掌握");
      }
      saveProgress();
      refreshProgress();
    });

    document.addEventListener("keydown", function (event) {
      const tag = (event.target.tagName || "").toLowerCase();
      const typing = tag === "input" || tag === "textarea" || event.target.isContentEditable;
      if ((event.key === "/" && !typing) || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k")) {
        event.preventDefault();
        openSearch();
        return;
      }
      if (event.key === "Escape") {
        closeSearch();
        closeRecall();
        closeMenu();
      }
    });

    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", function (event) {
      window.clearTimeout(state.searchTimer);
      const value = event.target.value;
      state.searchTimer = window.setTimeout(function () { renderSearch(value); }, 60);
    });

    document.getElementById("searchClose").addEventListener("click", closeSearch);
    document.getElementById("recallClose").addEventListener("click", closeRecall);
    document.getElementById("recallAgain").addEventListener("click", recallAgain);
    document.getElementById("recallReveal").addEventListener("click", function () {
      if (!state.recall) return;
      const item = state.recall;
      closeRecall();
      go("#/sub/" + item.theme.id + "/" + item.sub.id);
    });

    const menuBtn = document.querySelector(".menu-btn");
    if (menuBtn) menuBtn.addEventListener("click", toggleMenu);

    document.querySelector(".search-trigger").addEventListener("click", openSearch);

    const printBtn = document.getElementById("printBtn");
    if (printBtn) printBtn.addEventListener("click", function () { window.print(); });

    const resetBtn = document.getElementById("resetBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        const ok = window.confirm("确定要清空所有“已掌握”记录吗？此操作只影响本机浏览器。");
        if (!ok) return;
        progress = new Set();
        saveProgress();
        refreshProgress();
        toast("学习进度已重置");
      });
    }

    window.addEventListener("scroll", function () {
      if (!topbar) return;
      const y = window.scrollY || 0;
      topbar.classList.toggle("is-scrolled", y > 8);
      const backTop = document.getElementById("backTop");
      if (backTop) backTop.classList.toggle("is-show", y > 700);
    }, { passive: true });

    const backTop = document.getElementById("backTop");
    if (backTop) {
      backTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    window.addEventListener("hashchange", route);
  }

  /* ------------------------- 启动 ------------------------- */

  bindEvents();
  route();
  refreshProgress();
})();
