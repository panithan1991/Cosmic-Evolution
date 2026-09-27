/* Reusable, resolution-independent sky-object illustrations. */
(function (root) {
  "use strict";
  const cache = new Map();
  const TAU = Math.PI * 2;

  function random(seed) {
    let value = seed >>> 0;
    return () => {
      value = (Math.imul(value, 1664525) + 1013904223) >>> 0;
      return value / 4294967296;
    };
  }

  function disk(c, radius, stops) {
    const gradient = c.createRadialGradient(-radius * .35, -radius * .4, radius * .04, 0, 0, radius);
    for (const [at, color] of stops) gradient.addColorStop(at, color);
    c.fillStyle = gradient;
    c.beginPath();
    c.arc(0, 0, radius, 0, TAU);
    c.fill();
  }

  function build(kind, radius, painter) {
    const key = `${kind}-${radius}`;
    if (cache.has(key)) return cache.get(key);
    const extent = radius * 2.65;
    const ratio = 2;
    const surface = document.createElement("canvas");
    surface.width = surface.height = Math.ceil(extent * 2 * ratio);
    const c = surface.getContext("2d");
    c.scale(ratio, ratio);
    c.translate(extent, extent);
    painter(c, radius);
    const result = { surface, extent };
    cache.set(key, result);
    return result;
  }

  function paintPlanet(c, r, gas) {
    const rand = random(gas ? 11982 : 87210);
    c.save();
    if (gas) {
      c.strokeStyle = "rgba(183,226,255,.32)";
      c.lineWidth = r * .18;
      c.beginPath();
      c.ellipse(0, 2, r * 1.57, r * .43, -.28, Math.PI, TAU);
      c.stroke();
    }
    c.shadowColor = gas ? "#ffbc89" : "#4ac4ff";
    c.shadowBlur = r * .7;
    disk(c, r, gas
      ? [[0, "#fff1cb"], [.35, "#eab78a"], [.7, "#aa6271"], [1, "#362849"]]
      : [[0, "#d4fcff"], [.35, "#6ec5e5"], [.72, "#227399"], [1, "#091e42"]]);
    c.shadowBlur = 0;
    c.save();
    c.beginPath();
    c.arc(0, 0, r, 0, TAU);
    c.clip();
    if (gas) {
      for (let i = 0; i < 17; i++) {
        const y = -r + i * r * .13;
        c.strokeStyle = i % 3 === 0 ? "rgba(97,55,86,.48)" : "rgba(255,239,200,.31)";
        c.lineWidth = r * (.05 + rand() * .07);
        c.beginPath();
        c.moveTo(-r, y);
        c.bezierCurveTo(-r * .3, y + r * .12, r * .3, y - r * .12, r, y + r * .03);
        c.stroke();
      }
      c.fillStyle = "rgba(168,71,88,.75)";
      c.beginPath();
      c.ellipse(r * .42, r * .16, r * .25, r * .1, -.2, 0, TAU);
      c.fill();
    } else {
      c.fillStyle = "rgba(37,157,124,.75)";
      for (let i = 0; i < 6; i++) {
        const x = (rand() - .5) * r * 1.5;
        const y = (rand() - .5) * r * 1.5;
        c.beginPath();
        c.ellipse(x, y, r * (.14 + rand() * .22), r * (.08 + rand() * .12), rand() * 3, 0, TAU);
        c.fill();
      }
      c.strokeStyle = "rgba(222,245,255,.32)";
      c.lineWidth = 2;
      for (let i = 0; i < 5; i++) {
        const y = (rand() - .5) * r * 1.5;
        c.beginPath();
        c.arc((rand() - .5) * r, y, r * (.35 + rand() * .45), .2, 1.8);
        c.stroke();
      }
    }
    c.restore();
    if (gas) {
      c.strokeStyle = "rgba(223,239,255,.72)";
      c.lineWidth = r * .12;
      c.beginPath();
      c.ellipse(0, 2, r * 1.57, r * .43, -.28, 0, Math.PI);
      c.stroke();
    } else {
      c.strokeStyle = "rgba(140,238,255,.72)";
      c.lineWidth = r * .055;
      c.beginPath();
      c.arc(0, 0, r * 1.03, -.5, 2.35);
      c.stroke();
    }
    c.restore();
  }

  function paintStar(c, r, type) {
    const palette = type === "blue" ? ["#fff", "#c9eaff", "#578fff"]
      : type === "white" ? ["#fff", "#f1f6ff", "#93baff"]
      : ["#fffdf4", "#ffe79b", "#ff8c47"];
    const halo = c.createRadialGradient(0, 0, r * .25, 0, 0, r * 2.4);
    halo.addColorStop(0, palette[0]);
    halo.addColorStop(.23, palette[1] + "aa");
    halo.addColorStop(.5, palette[2] + "44");
    halo.addColorStop(1, palette[2] + "00");
    c.fillStyle = halo;
    c.beginPath();
    c.arc(0, 0, r * 2.4, 0, TAU);
    c.fill();
    c.save();
    c.shadowColor = palette[2];
    c.shadowBlur = r * .7;
    c.strokeStyle = palette[2] + "88";
    c.lineWidth = r * .085;
    for (let i = 0; i < 12; i++) {
      const a = i * TAU / 12;
      const length = r * (1.3 + (i % 3) * .12);
      c.beginPath();
      c.moveTo(Math.cos(a) * r * 1.02, Math.sin(a) * r * 1.02);
      c.quadraticCurveTo(Math.cos(a + .12) * length, Math.sin(a + .12) * length,
        Math.cos(a + .1) * length, Math.sin(a + .1) * length);
      c.stroke();
    }
    disk(c, r, [[0, palette[0]], [.5, palette[1]], [.83, palette[2]], [1, palette[2] + "bb"]]);
    c.restore();
  }

  function paintGalaxy(c, r, barred) {
    const rand = random(barred ? 44881 : 18823);
    const haze = c.createRadialGradient(0, 0, 2, 0, 0, r * 2.15);
    haze.addColorStop(0, "rgba(255,235,187,.7)");
    haze.addColorStop(.24, "rgba(158,129,222,.23)");
    haze.addColorStop(.65, "rgba(62,119,206,.13)");
    haze.addColorStop(1, "rgba(35,86,189,0)");
    c.fillStyle = haze;
    c.beginPath();
    c.ellipse(0, 0, r * 2.15, r * 1.48, 0, 0, TAU);
    c.fill();
    c.save();
    c.scale(1, .68);
    const arms = barred ? 2 : 3;
    for (let arm = 0; arm < arms; arm++) {
      for (let lane = 0; lane < 3; lane++) {
        c.beginPath();
        for (let i = 0; i < 90; i++) {
          const t = i / 89;
          const a = arm * TAU / arms + t * 4.3 + (barred ? .3 : 0);
          const d = r * (.18 + t * 1.67 + lane * .06);
          const x = Math.cos(a) * d;
          const y = Math.sin(a) * d;
          if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
        }
        c.strokeStyle = lane === 0 ? "rgba(105,176,255,.09)" :
          lane === 1 ? "rgba(189,172,246,.14)" : "rgba(28,36,82,.46)";
        c.lineWidth = r * (lane === 2 ? .13 : .26);
        c.stroke();
      }
    }
    if (barred) {
      c.strokeStyle = "rgba(255,229,180,.7)";
      c.lineWidth = r * .22;
      c.beginPath();
      c.moveTo(-r * .58, 0);
      c.lineTo(r * .58, 0);
      c.stroke();
    }
    for (let i = 0; i < 650; i++) {
      const arm = i % arms;
      const t = Math.pow(rand(), .75);
      const angle = arm * TAU / arms + t * 4.3 + (rand() - .5) * .35;
      const distance = r * (.2 + t * 1.65) + (rand() - .5) * r * .18;
      c.fillStyle = rand() > .87 ? "#ffd4a6" : rand() > .45 ? "#d6e9ff" : "#8fbcff";
      c.globalAlpha = .25 + rand() * .7;
      c.beginPath();
      c.arc(Math.cos(angle) * distance, Math.sin(angle) * distance,
        .35 + rand() * 1.2, 0, TAU);
      c.fill();
    }
    c.globalAlpha = 1;
    c.restore();
    const bulge = c.createRadialGradient(0, 0, 1, 0, 0, r * .7);
    bulge.addColorStop(0, "#fffdf5");
    bulge.addColorStop(.28, "#ffe6b0");
    bulge.addColorStop(.58, "rgba(251,169,128,.65)");
    bulge.addColorStop(1, "rgba(235,142,136,0)");
    c.fillStyle = bulge;
    c.beginPath();
    c.ellipse(0, 0, r * .7, r * .46, 0, 0, TAU);
    c.fill();
  }

  function paintNebula(c, r) {
    const rand = random(7621);
    for (let i = 0; i < 11; i++) {
      const angle = i * TAU / 11;
      const distance = r * (.38 + rand() * .8);
      const size = r * (.5 + rand() * .48);
      const x = Math.cos(angle) * distance, y = Math.sin(angle) * distance;
      const cloud = c.createRadialGradient(x, y, 0, x, y, size);
      cloud.addColorStop(0, i % 2 ? "rgba(106,153,255,.27)" : "rgba(239,112,181,.27)");
      cloud.addColorStop(1, "rgba(33,75,145,0)");
      c.fillStyle = cloud;
      c.beginPath();
      c.arc(x, y, size, 0, TAU);
      c.fill();
    }
    c.strokeStyle = "rgba(147,206,255,.48)";
    c.lineWidth = r * .08;
    c.beginPath();
    c.arc(0, 0, r * 1.45, .3, 5.4);
    c.stroke();
    disk(c, r * .23, [[0, "#fff"], [.4, "#d5eaff"], [1, "#648fdb"]]);
  }

  function drawCached(ctx, kind, x, y, radius, painter, rotation = 0) {
    const { surface, extent } = build(kind, radius, painter);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.drawImage(surface, -extent, -extent, extent * 2, extent * 2);
    ctx.restore();
  }

  const api = {
    planet(ctx, x, y, r, gas = false) {
      drawCached(ctx, gas ? "gas" : "rock", x, y, r, (c, radius) => paintPlanet(c, radius, gas));
    },
    star(ctx, x, y, r, type) {
      drawCached(ctx, `star-${type}`, x, y, r, (c, radius) => paintStar(c, radius, type));
    },
    galaxy(ctx, x, y, r, barred, time) {
      drawCached(ctx, barred ? "barred" : "spiral", x, y, r,
        (c, radius) => paintGalaxy(c, radius, barred), time * .035);
    },
    nebula(ctx, x, y, r) {
      drawCached(ctx, "nebula", x, y, r, paintNebula);
    },
    group(ctx, x, y, r, count, time) {
      const positions = [[-.42, -.1, .7], [.45, .24, .58], [.1, -.57, .4]];
      positions.slice(0, count).forEach(([dx, dy, scale], index) =>
        api.galaxy(ctx, x + dx * r, y + dy * r, r * scale, index % 2 === 1, time + index * 11));
    }
  };

  root.CosmicArt = api;
})(window);
