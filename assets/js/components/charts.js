/**
 * Himalayan Prefab Solutions ERP
 * Enterprise Charting System (Chart.js + Native SVG Fallbacks)
 */

var Charts = {
  instances: {},

  destroy(canvasId) {
    if (this.instances[canvasId]) {
      this.instances[canvasId].destroy();
      delete this.instances[canvasId];
    }
  },

  /**
   * Render Bar Chart for Monthly Revenue / Financials
   */
  renderBarChart(canvasId, labels, data, datasetLabel = "Revenue (NPR)") {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    this.destroy(canvasId);

    if (window.Chart) {
      const ctx = canvas.getContext("2d");
      this.instances[canvasId] = new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: datasetLabel,
              data,
              backgroundColor: "#2563EB",
              borderRadius: 4,
              maxBarThickness: 36
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => Utils.formatCurrency(context.raw)
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (val) => "Rs. " + (val >= 1000000 ? (val / 1000000).toFixed(1) + "M" : (val / 100000).toFixed(0) + "L"),
                font: { family: "DM Sans", size: 11 }
              },
              grid: { color: "#F1F5F9" }
            },
            x: {
              grid: { display: false },
              ticks: { font: { family: "DM Sans", size: 11 } }
            }
          }
        }
      });
    } else {
      // Fallback SVG rendering
      const target = canvas.parentElement || canvas;
      if (target) {
        this.renderSvgBarFallback(target, labels, data);
      }
    }
  },

  /**
   * Render Donut Chart for Status Distribution
   */
  renderDonutChart(canvasId, labels, data, colors = ["#2563EB", "#15803D", "#D97706", "#64748B", "#DC2626"]) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    this.destroy(canvasId);

    if (window.Chart) {
      const ctx = canvas.getContext("2d");
      this.instances[canvasId] = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels,
          datasets: [
            {
              data,
              backgroundColor: colors,
              borderWidth: 2,
              borderColor: "#FFFFFF"
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "70%",
          plugins: {
            legend: {
              position: "bottom",
              labels: { font: { family: "DM Sans", size: 11 }, boxWidth: 12, padding: 14 }
            }
          }
        }
      });
    } else {
      const target = canvas.parentElement || canvas;
      if (target) {
        this.renderSvgDonutFallback(target, labels, data, colors);
      }
    }
  },

  /**
   * SVG Fallback for Bar Chart if Chart.js is not loaded
   */
  renderSvgBarFallback(container, labels, data) {
    if (!container) return;
    const max = Math.max(...data, 1);
    const bars = labels
      .map((lbl, idx) => {
        const val = data[idx] || 0;
        const heightPct = Math.round((val / max) * 100);
        return `
        <div style="flex:1; display:flex; flex-direction:column; align-items:center; height:100%; justify-content:flex-end;">
          <div title="${lbl}: ${Utils.formatCurrency(val)}" style="width:70%; height:${heightPct}%; background:#2563EB; border-radius:3px 3px 0 0; min-height:4px;"></div>
          <span style="font-size:10px; color:var(--color-text-secondary); margin-top:6px;">${lbl}</span>
        </div>
      `;
      })
      .join("");

    container.innerHTML = `
      <div style="height:220px; display:flex; align-items:flex-end; gap:8px; padding-top:20px; border-bottom:1px solid var(--color-border);">
        ${bars}
      </div>
    `;
  },

  /**
   * SVG Fallback for Donut Chart
   */
  renderSvgDonutFallback(container, labels, data, colors) {
    if (!container) return;
    const total = data.reduce((a, b) => a + b, 0) || 1;
    let accumulated = 0;
    const slices = data.map((val, idx) => {
      const pct = (val / total) * 100;
      accumulated += pct;
      return `<div style="display:flex; align-items:center; justify-content:space-between; font-size:12px; margin-bottom:4px;">
        <span style="display:flex; align-items:center; gap:6px;">
          <span style="width:10px; height:10px; border-radius:2px; background:${colors[idx % colors.length]};"></span>
          ${labels[idx]}
        </span>
        <strong>${val} (${pct.toFixed(0)}%)</strong>
      </div>`;
    }).join("");

    container.innerHTML = `
      <div style="padding:16px;">
        <div style="font-size:12px; font-weight:600; margin-bottom:12px; color:var(--color-text-secondary);">Distribution</div>
        ${slices}
      </div>
    `;
  }
};

window.Charts = Charts;

