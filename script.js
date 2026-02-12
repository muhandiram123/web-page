// Data Source (Transcribed and Interpolated from Image)
const macroData = [
    { year: 2000, gdp: 6.2, inflation: -1.2, unemp: 4.33, debt: 21.74, capita: 39443, exp: 12.06 },
    { year: 2001, gdp: 4.6, inflation: -0.8, unemp: 4.28, debt: 22.45, capita: 41679, exp: 11.99 },
    { year: 2002, gdp: -0.8, inflation: -0.3, unemp: 4.33, debt: 15.88, capita: 41511, exp: 12.02 },
    { year: 2003, gdp: -2.2, inflation: 0.2, unemp: 4.62, debt: 13.03, capita: 40935, exp: 12.64 },
    { year: 2004, gdp: 2.0, inflation: 0.6, unemp: 4.73, debt: 14.53, capita: 42142, exp: 14.88 },
    { year: 2005, gdp: 2.8, inflation: 1.9, unemp: 4.63, debt: 8.39, capita: 43673, exp: 20.40 },
    { year: 2006, gdp: 4.7, inflation: 3.5, unemp: 4.38, debt: 7.56, capita: 46091, exp: 24.64 },
    { year: 2007, gdp: 5.0, inflation: 5.8, unemp: 4.30, debt: 4.44, capita: 48627, exp: 28.54 },
    { year: 2008, gdp: 9.0, inflation: 12.4, unemp: 4.14, debt: 3.20, capita: 52841, exp: 40.64 },
    { year: 2009, gdp: 6.0, inflation: 3.5, unemp: 3.99, debt: 5.81, capita: 55127, exp: 30.02 },
    { year: 2010, gdp: 2.5, inflation: 3.3, unemp: 3.94, debt: 5.46, capita: 55667, exp: 39.18 },
    { year: 2011, gdp: 2.9, inflation: 4.0, unemp: 3.96, debt: 4.44, capita: 52393, exp: 50.15 },
    { year: 2012, gdp: 8.9, inflation: 2.9, unemp: 3.77, debt: 4.59, capita: 49989, exp: 55.54 },
    { year: 2013, gdp: 5.2, inflation: 1.1, unemp: 3.55, debt: 4.66, capita: 47013, exp: 61.34 },
    { year: 2014, gdp: 1.3, inflation: 1.0, unemp: 3.45, debt: 4.04, capita: 44236, exp: 57.92 },
    { year: 2015, gdp: 5.0, inflation: 0.1, unemp: 3.40, debt: 13.86, capita: 36058, exp: 39.77 },
    { year: 2016, gdp: 5.0, inflation: 1.1, unemp: 3.27, debt: 29.34, capita: 33334, exp: 32.01 },
    { year: 2017, gdp: 0.3, inflation: 1.6, unemp: 2.52, debt: 40.11, capita: 33619, exp: 37.85 },
    { year: 2018, gdp: 1.3, inflation: 0.9, unemp: 1.80, debt: 44.69, capita: 37780, exp: 47.46 },
    { year: 2019, gdp: -1.1, inflation: 0.5, unemp: 2.04, debt: 52.46, capita: 37251, exp: 44.80 },
    { year: 2020, gdp: -3.4, inflation: -0.4, unemp: 2.94, debt: 67.90, capita: 35163, exp: 36.45 },
    { year: 2021, gdp: 2.6, inflation: 1.7, unemp: 1.90, debt: 61.87, capita: 38719, exp: 48.39 },
    { year: 2022, gdp: 8.0, inflation: 2.5, unemp: 3.30, debt: 41.67, capita: 42616, exp: 70.13 },
    { year: 2023, gdp: 1.4, inflation: 1.0, unemp: 3.18, debt: 37.49, capita: 41851, exp: 66.52 },
    { year: 2024, gdp: 1.6, inflation: 0.6, unemp: 3.16, debt: 35.52, capita: 41664, exp: 71.88 }
];

let charts = {}; // Store chart instances

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    initCharts(macroData);
    populateTable(macroData);
    setupInteractions();
    animateEntry();
});

function setupInteractions() {
    // Buttons for time ranges
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class
            buttons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            const range = e.target.getAttribute('onclick').match(/'(.*)'/)[1];
            // The onclick in HTML is handled inline, but we can override or just let this listener work
        });
    });
}

function switchTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.content-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));

    // Show selected
    if (tabId === 'dashboard') {
        document.getElementById('dashboard-tab').classList.add('active');
        document.querySelector('.nav-links li:first-child').classList.add('active');
    } else {
        document.getElementById('data-tab').classList.add('active');
        document.querySelector('.nav-links li:last-child').classList.add('active');
    }
}

function filterData(range) {
    let filteredData;
    const currentYear = 2024;

    if (range === '5y') {
        filteredData = macroData.filter(d => d.year >= currentYear - 5);
    } else if (range === '10y') {
        filteredData = macroData.filter(d => d.year >= currentYear - 10);
    } else {
        filteredData = macroData;
    }

    updateCharts(filteredData);
    populateTable(filteredData);

    // Update active button state
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    const btnText = range === '5y' ? 'Last 5 Years' : range === '10y' ? 'Last 10 Years' : 'All Years';

    // Find button by text content (simple way)
    Array.from(document.querySelectorAll('.filter-btn')).forEach(btn => {
        if (btn.textContent.includes(btnText)) btn.classList.add('active');
    });
}

function initCharts(data) {
    const years = data.map(d => d.year);

    // 1. GDP & Inflation (Line)
    const ctx1 = document.getElementById('gdpInflationChart').getContext('2d');
    charts.gdpInflation = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'GDP Growth',
                data: data.map(d => d.gdp),
                borderColor: '#58a6ff',
                tension: 0.4
            }, {
                label: 'Inflation',
                data: data.map(d => d.inflation),
                borderColor: '#e74c3c',
                tension: 0.4
            }]
        },
        options: getChartOptions('Percentage (%)')
    });

    // 2. Export Composition (Pie) - Mock Data for 2024
    const ctx2 = document.getElementById('exportPieChart').getContext('2d');
    charts.exportPie = new Chart(ctx2, {
        type: 'pie',
        data: {
            labels: ['Oil & Gas', 'Manufacturing', 'Services'],
            datasets: [{
                data: [65, 25, 10],
                backgroundColor: ['#1f6feb', '#238636', '#d29922']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#c9d1d9' } }
            }
        }
    });

    // 3. Unemployment (Line)
    const ctx3 = document.getElementById('unemploymentChart').getContext('2d');
    charts.unemployment = new Chart(ctx3, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'Unemployment Rate',
                data: data.map(d => d.unemp),
                borderColor: '#d29922',
                fill: true,
                backgroundColor: 'rgba(210, 153, 34, 0.1)',
                tension: 0.4
            }]
        },
        options: getChartOptions('Percentage (%)')
    });

    // 4. Public Debt (Bar)
    const ctx4 = document.getElementById('debtChart').getContext('2d');
    charts.debt = new Chart(ctx4, {
        type: 'bar',
        data: {
            labels: years,
            datasets: [{
                label: 'Public Debt (% of GDP)',
                data: data.map(d => d.debt),
                backgroundColor: data.map(d => d.debt > 60 ? '#da3633' : '#238636')
            }]
        },
        options: getChartOptions('Percentage (%)')
    });

    // 5. Exports (Line)
    const ctx5 = document.getElementById('exportsChart').getContext('2d');
    charts.exports = new Chart(ctx5, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'Exports (USD bn)',
                data: data.map(d => d.exp),
                borderColor: '#238636',
                tension: 0.4,
                pointRadius: 2
            }]
        },
        options: getChartOptions('USD Billion')
    });

    // 6. GDP per Capita (Line)
    const ctx6 = document.getElementById('gdpCapitaChart').getContext('2d');
    charts.gdpCapita = new Chart(ctx6, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'GDP per Capita (USD)',
                data: data.map(d => d.capita),
                borderColor: '#a371f7',
                tension: 0.4,
                pointRadius: 2
            }]
        },
        options: getChartOptions('USD')
    });
}

function updateCharts(data) {
    const years = data.map(d => d.year);

    // Helper to update chart safely
    const updateChart = (chart, datasets) => {
        chart.data.labels = years;
        datasets.forEach((newData, i) => {
            if (chart.data.datasets[i]) {
                chart.data.datasets[i].data = newData;
            }
        });
        chart.update();
    };

    updateChart(charts.gdpInflation, [data.map(d => d.gdp), data.map(d => d.inflation)]);
    updateChart(charts.unemployment, [data.map(d => d.unemp)]);
    updateChart(charts.debt, [data.map(d => d.debt)]);
    // Update debt colors
    charts.debt.data.datasets[0].backgroundColor = data.map(d => d.debt > 60 ? '#da3633' : '#238636');
    charts.debt.update();

    updateChart(charts.exports, [data.map(d => d.exp)]);
    updateChart(charts.gdpCapita, [data.map(d => d.capita)]);
}

function populateTable(data) {
    const tbody = document.querySelector('#dataTable tbody');
    tbody.innerHTML = '';

    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.year}</td>
            <td style="color: ${row.gdp >= 0 ? '#238636' : '#da3633'}">${row.gdp}%</td>
            <td>${row.inflation}%</td>
            <td>${row.unemp}%</td>
            <td>${row.debt}%</td>
            <td>$${row.capita.toLocaleString()}</td>
            <td>$${row.exp} bn</td>
        `;
        tbody.appendChild(tr);
    });
}

function searchTable() {
    const input = document.getElementById('tableSearch');
    const filter = input.value.toUpperCase();
    const table = document.getElementById("dataTable");
    const tr = table.getElementsByTagName("tr");

    for (let i = 1; i < tr.length; i++) {
        let visible = false;
        const tds = tr[i].getElementsByTagName("td");
        for (let j = 0; j < tds.length; j++) {
            if (tds[j] && tds[j].innerText.toUpperCase().indexOf(filter) > -1) {
                visible = true;
            }
        }
        tr[i].style.display = visible ? "" : "none";
    }
}

function getChartOptions(yAxisTitle) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: { color: '#c9d1d9' }
            }
        },
        scales: {
            y: {
                grid: { color: '#30363d' },
                ticks: { color: '#8b949e' },
                title: { display: true, text: yAxisTitle, color: '#8b949e' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#8b949e' }
            }
        }
    };
}

function animateEntry() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.animation = `fadeIn 0.5s ease-out forwards ${index * 0.1}s`;
    });
}

function exportData() {
    alert("Downloading functionality would go here (e.g. CSV export).");
}
